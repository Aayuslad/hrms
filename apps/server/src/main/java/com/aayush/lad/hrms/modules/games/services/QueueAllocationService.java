package com.aayush.lad.hrms.modules.games.services;

import com.aayush.lad.hrms.core.exeptions.DomainException;
import com.aayush.lad.hrms.modules.games.enums.QueuedSlotOfferStatus;
import com.aayush.lad.hrms.modules.games.enums.GameSlotStatus;
import com.aayush.lad.hrms.modules.games.models.Game;
import com.aayush.lad.hrms.modules.games.models.GameSlot;
import com.aayush.lad.hrms.modules.games.models.QueuedSlotOffer;
import com.aayush.lad.hrms.modules.games.repositories.GameRepository;
import com.aayush.lad.hrms.modules.games.repositories.GameSlotRepository;
import com.aayush.lad.hrms.modules.games.repositories.QueuedSlotOfferRepository;
import com.aayush.lad.hrms.modules.user.services.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class QueueAllocationService {

    private final GameSlotRepository gameSlotRepository;
    private final QueuedSlotOfferRepository offerRepository;
    private final GameRepository gameRepository;
    private final NotificationService notificationService;

    /**
     * Allocate a cancelled slot to the waiting queue based on priority.
     *
     * This method implements the main queue-allocation algorithm:
     * - Fetches both option-1 (specific slot) and option-2 (any slot) queue records
     * - Filters out already-offered and conflicted entries
     * - Sorts by average completed slots of the team then application time
     * - Either confirms immediately (option-1) or creates a 10-minute offer (option-2)
     * 
     * @param cancelledSlot the slot that was cancelled and needs allocation
     */
    public void handleSlotCancellation(GameSlot cancelledSlot) {
        UUID gameId = cancelledSlot.getGame().getId();
        LocalDate day = cancelledSlot.getDay();
        LocalTime startTime = cancelledSlot.getStartTime();
        LocalTime endTime = cancelledSlot.getEndTime();

        // step 1: fetch option-1 queue records (specific slot waiters for this exact time)
        List<GameSlot> specific = gameSlotRepository.findPendingSpecificSlots(gameId, day, startTime, endTime);
        
        // step 2: fetch option-2 queue records (any slot waiters for this day)
        List<GameSlot> any = gameSlotRepository.findPendingAnySlots(gameId, day);

        // step 3: merge all records
        List<GameSlot> queueRecords = new ArrayList<>();
        queueRecords.addAll(specific);
        queueRecords.addAll(any);

        // step 4: exclude those already offered this cancellation (avoid duplicate offers) (option 2)
        Set<UUID> excluded = offerRepository.findByCancelledSlotId(cancelledSlot.getId())
                .stream()
                .map(o -> o.getQueueSlot().getId())
                .collect(Collectors.toSet());
        queueRecords.removeIf(s -> excluded.contains(s.getId()));

        // step 5: drop entries whose team members now have active bookings (acquired after queuing)
        queueRecords.removeIf(entry -> {
            Set<UUID> team = new HashSet<>();
            team.add(entry.getOrganiser().getId());
            entry.getPlayers().forEach(u -> team.add(u.getId()));
            for (UUID uid : team) {
                if (!gameSlotRepository.findActiveSlotsForUserOnDayByGameId(gameId, day, uid).isEmpty()) {
                    return true;
                }
            }
            return false;
        });

        if (queueRecords.isEmpty()) {
            return;
        }

        // step 6: sort by priority: average completed slots in current cycle (lower = more priority)
        // then by application time (earlier = more priority)
        queueRecords.sort(Comparator
                .comparing((GameSlot s) -> computeAverageForEntry(s, gameId, cancelledSlot.getGame().getCurrentCycleId()))
                .thenComparing(GameSlot::getAppliedAt));

        // step 7: select winner (first in sorted list)
        GameSlot winner = queueRecords.get(0);

        // TODO: solve confusion
//        // step 8: validate slot start is at least one hour away (per preemption rules)
//        LocalDateTime slotStart = LocalDateTime.of(cancelledSlot.getDay(), cancelledSlot.getStartTime());
//        if (slotStart.isBefore(LocalDateTime.now().plusHours(1))) {
//            // too late to allocate; abort
//            return;
//        }

        // step 9: confirm option-1 immediately or create offer for option-2
        if (winner.getStartTime() != null) {
            // option-1: specific slot requester; confirm immediately
            winner.setStatus(GameSlotStatus.CONFIRMED);
            winner.setStartTime(cancelledSlot.getStartTime());
            winner.setEndTime(cancelledSlot.getEndTime());
            gameSlotRepository.save(winner);

            notifyTeam(winner,
                    "Your " + cancelledSlot.getGame().getName() + " slot has been booked for "
                            + cancelledSlot.getDay() + " " + cancelledSlot.getStartTime());
        } else {
            // option-2: any slot requester; create offer and notify organiser for confirmation
            QueuedSlotOffer offer = QueuedSlotOffer.builder()
                    .queueSlot(winner)
                    .cancelledSlot(cancelledSlot)
                    .expiresAt(LocalDateTime.now().plusMinutes(10))
                    .status(QueuedSlotOfferStatus.PENDING)
                    .build();
            offerRepository.save(offer);

            notificationService.createNotification(
                    winner.getOrganiser().getId(),
                    "A slot has opened on " + cancelledSlot.getDay() + " at " + cancelledSlot.getStartTime()
                            + ". Accept within 10 minutes or you will miss");
        }
    }

    /**
     * Handle user response to an offered slot (accept or reject).
     * 
     * For acceptance:
     * - confirms the slot and notifies the team
     * 
     * For rejection:
     * - Marks offer as rejected and proceeds to allocate to next candidate
     * 
     * @param offer the queued slot offer being responded to
     * @param action "accept" or "reject"
     */
    public void handleOfferResponse(QueuedSlotOffer offer, String action) {
        GameSlot pending = offer.getQueueSlot();
        GameSlot cancelled = offer.getCancelledSlot();

        if ("accept".equalsIgnoreCase(action)) {
            // step 1: confirm the slot
            pending.setStatus(GameSlotStatus.CONFIRMED);
            pending.setStartTime(cancelled.getStartTime());
            pending.setEndTime(cancelled.getEndTime());
            gameSlotRepository.save(pending);

            // step 4: mark offer as accepted
            offer.setStatus(QueuedSlotOfferStatus.ACCEPTED);
            offerRepository.save(offer);

            // step 5: notify team of confirmation
            notifyTeam(pending,
                    "Your " + cancelled.getGame().getName() + " slot has been booked for "
                            + cancelled.getDay() + " " + cancelled.getStartTime());
        } else if ("reject".equalsIgnoreCase(action)) {
            // step 1: mark offer as rejected
            offer.setStatus(QueuedSlotOfferStatus.REJECTED);
            offerRepository.save(offer);
            
            // step 2: try next candidate for the same cancelled slot
            handleSlotCancellation(cancelled);
        } else {
            throw new DomainException("Invalid action");
        }
    }

    /**
     * Scheduled maintenance task (runs every 60 seconds).
     * 
     * Performs three critical operations in sequence:
     * 1. Expire pending offers that exceed 10-minute window and retry allocation
     * 2. remove stale queue entries (past dates and passed specific slot times)
     * 3. update cycle ID for games with no active/pending slots (per cycle rules)
     * 
     * This ensures queue hygiene and automatic cycle progression.
     */
    @Scheduled(fixedDelay = 60_000)
    public void expireOffersAndPurgeQueuesAndAdvanceCycles() {
        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        // step 1: find and expire offers that have passed their 10-minute deadline
        List<QueuedSlotOffer> expired = offerRepository
                .findByStatusAndExpiresAtBefore(QueuedSlotOfferStatus.PENDING, now);
        for (QueuedSlotOffer offer : expired) {
            // step 1.1: mark offer as expired
            offer.setStatus(QueuedSlotOfferStatus.EXPIRED);
            offerRepository.save(offer);
            
            // step 1.2: try next candidate in queue for this cancellation
            handleSlotCancellation(offer.getCancelledSlot());
        }

        // step 2: remove stale pending queue entries (option-1 and option-2)
        List<GameSlot> pending = gameSlotRepository.findAll()
                .stream()
                .filter(s -> s.getStatus() == GameSlotStatus.PENDING)
                .collect(Collectors.toList());
        for (GameSlot s : pending) {
            // step 2.1: delete entries from past days
            if (s.getDay().isBefore(today)) {
                gameSlotRepository.delete(s);
                continue;
            }
            
            // step 2.2: for today's entries, delete option-1 (specific) if start time has passed
            if (s.getDay().equals(today) && s.getStartTime() != null) {
                LocalDateTime slotStart = LocalDateTime.of(s.getDay(), s.getStartTime());
                if (slotStart.isBefore(now)) {
                    gameSlotRepository.delete(s);
                }
            }
        }

        // step 3: update cycle for games meeting cycle-end criteria
        List<Game> games = gameRepository.findAll();
        for (Game game : games) {
            // step 3.1: count active (CONFIRMED or PENDING) slots for this game
            long activeCount = gameRepository.countActiveOrPendingSlots(game.getId());
            
            // step 3.2: if queue is empty and no unplayed slots, update cycle
            if (activeCount == 0) {
                game.setCurrentCycleId(game.getCurrentCycleId() + 1);
                gameRepository.save(game);
            }
        }
    }

    /**
     * Locate an active (PENDING) offer between a queue entry and a cancelled slot.
     * 
     * Used by GameService.slotAction to retrieve the offer when a user responds.
     * 
     * @param queueSlotId the pending queue entry ID
     * @param cancelledSlotId the slot that was cancelled
     * @return Optional containing the offer if found and still pending
     */
    public Optional<QueuedSlotOffer> findOffer(UUID queueSlotId, UUID cancelledSlotId) {
        return offerRepository.findByQueueSlotIdAndCancelledSlotIdAndStatus(
                queueSlotId, cancelledSlotId, QueuedSlotOfferStatus.PENDING);
    }

    /**
     * Compute average completed slots for a queue entry's team in the current cycle.
     * 
     * Used for priority sorting: lower average = higher priority (less experience).
     * Includes both organiser and all players as one team.
     * 
     * @param entry the queue entry
     * @param gameId the game ID for counting slots
     * @param cycleId the current cycle ID to count completed slots in
     * @return average number of completed slots per team member in this cycle
     */
    private double computeAverageForEntry(GameSlot entry, UUID gameId, int cycleId) {
        Set<UUID> team = new HashSet<>();
        team.add(entry.getOrganiser().getId());
        entry.getPlayers().forEach(u -> team.add(u.getId()));
        if (team.isEmpty()) return 0;
        long total = 0;
        for (UUID uid : team) {
            total += gameSlotRepository.countCompletedSlotsForUser(gameId, cycleId, uid);
        }
        return (double) total / team.size();
    }

    /**
     * Send notification to all team members (organiser + players) of a slot.
     *
     * @param slot the game slot whose team should be notified
     * @param message the notification message content
     */
    private void notifyTeam(GameSlot slot, String message) {
        List<UUID> ids = new ArrayList<>();
        ids.add(slot.getOrganiser().getId());
        slot.getPlayers().forEach(u -> ids.add(u.getId()));
        notificationService.createNotificationForAll(ids, message);
    }
}