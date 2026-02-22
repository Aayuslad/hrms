package com.aayush.lad.hrms.modules.games.services;

import com.aayush.lad.hrms.core.exeptions.ConflictException;
import com.aayush.lad.hrms.core.exeptions.DomainException;
import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.exeptions.UnauthorisedException;
import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.core.services.DateService;
import com.aayush.lad.hrms.modules.games.dtos.read.GameResponse;
import com.aayush.lad.hrms.modules.games.dtos.read.GameSummaryResponse;
import com.aayush.lad.hrms.modules.games.dtos.read.internal.GameSlotResponse;
import com.aayush.lad.hrms.modules.games.dtos.read.QueuedSlotOfferResponse;
import com.aayush.lad.hrms.modules.games.dtos.write.*;
import com.aayush.lad.hrms.modules.games.enums.GameSlotStatus;
import com.aayush.lad.hrms.modules.games.mappers.GameMapper;
import com.aayush.lad.hrms.modules.games.models.Game;
import com.aayush.lad.hrms.modules.games.models.GameSlot;
import com.aayush.lad.hrms.modules.games.models.QueuedSlotOffer;
import com.aayush.lad.hrms.modules.games.repositories.GameRepository;
import com.aayush.lad.hrms.modules.games.repositories.GameSlotRepository;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import com.aayush.lad.hrms.modules.user.services.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
@AllArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final GameSlotRepository gameSlotRepository;
    private final UserRepository userRepository;

    private final GameMapper gameMapper;

    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;
    private final DateService dateService;

    private final QueueAllocationService queueAllocationService;
    private final com.aayush.lad.hrms.modules.games.repositories.QueuedSlotOfferRepository queuedSlotOfferRepository;

    public void create(CreateGameRequest request) {
        if (gameRepository.existsByName(request.getName()))
            throw new ConflictException("Game with name '" + request.getName() + "' already exists");

        Game game = gameMapper.create(request);
        gameRepository.save(game);
    }

    public void update(UpdateGameRequest request) {
        Game game = getGameEntityById(request.getId());
        gameMapper.update(request, game);
        gameRepository.save(game);
    }

    public void delete(UUID gameId) {
        Game game = getGameEntityById(gameId);
        // TODO: soft delete
        gameRepository.delete(game);
    }

    // get summary of all
    public List<GameSummaryResponse> getAll() {
        List<Game> games = gameRepository.findAll();
        return gameMapper.toResponseList(games);
    }

    // get one but detailed (includes all the slots)
    public GameResponse getOne(UUID id) {
        Game game = gameRepository.findGameWithStatsById(id).orElse(null);
        if (game == null)
            throw new NotFoundException("Game not found");

        // step 1: calculate start and end dates of current week based on games, custom
        // week
        Map<String, LocalDate> currentWeekDateRange = dateService
                .getCurrentWeekDateRange(game.getOpeningDayOfWeek(), game.getClosingDayOfWeek());
        LocalDate weekStartDate = currentWeekDateRange.get(DateService.getSTART_DATE_KEY());
        LocalDate weekEndDate = currentWeekDateRange.get(DateService.getEND_DATE_KEY());

        // step 2: fetch the confirmed or booked slots of whole week (booked slot =
        // confirmed + completed)
        List<GameSlot> currentWeekBookedSlots = gameSlotRepository.findGameSlotsByGameIdSlotStatusAndDateRange(
                id,
                List.of(GameSlotStatus.CONFIRMED, GameSlotStatus.COMPLETED),
                weekStartDate,
                weekEndDate);

        List<GameSlotResponse> slots = new ArrayList<>();

        // step 3: map over all the possible slots of each day in whole week (outer loop
        // for week days) (inner loop for each slot in day)
        for (LocalDate date = weekStartDate; !date.isAfter(weekEndDate); date = date.plusDays(1)) {
            for (LocalTime time = game.getOpenTime(); time.isBefore(game.getCloseTime()); time = time.plusMinutes(30)) {

                LocalDate finalDate = date;
                LocalTime finalTime = time;

                // step 3.1: check if a booked slot record is there for this slot. (booked slot
                // = confirmed + completed)
                GameSlot bookedSlot = currentWeekBookedSlots.stream()
                        .filter(slot -> slot.getDay().equals(finalDate)
                                && slot.getStartTime().equals(finalTime)
                                && slot.getStatus().equals(GameSlotStatus.CONFIRMED))
                        .findFirst().orElse(null);

                // step 3.2: add booked slot if exist
                if (bookedSlot != null) {
                    GameSlotResponse slotResponse = gameMapper.toResponse(bookedSlot);
                    slotResponse.setBooked(true);
                    slots.add(slotResponse);
                } else {
                    // step 3.3: else add an empty slot
                    slots.add(GameSlotResponse.builder()
                            .id(UUID.randomUUID())
                            .startTime(time)
                            .endTime(time.plusMinutes(30))
                            .day(date)
                            .isBooked(false)
                            .build());
                }
            }
        }

        GameResponse response = gameMapper.toResponse(game);
        response.setGameSlots(slots);

        return response;
    }

    public void bookSlot(BookSlotRequest request) {
        Game game = getGameEntityById(request.getGameId());

        User currentUser = currentUserService.getCurrentUserEntity();

        // step 1: validate start time based on game config
        boolean isAnyMatched = false;
        for (LocalTime i = game.getOpenTime(); i
                .isBefore(game.getCloseTime()); i = i.plusMinutes(game.getSlotDuration())) {
            if (request.getStartTime().equals(i)) {
                isAnyMatched = true;
                break;
            }
        }
        if (!isAnyMatched)
            throw new DomainException("Invalid start time");

        // step 2: ensure user is not booking an already passed slot (check end time)
        LocalDateTime requestedEnd = LocalDateTime.of(request.getDay(),
                request.getStartTime().plusMinutes(game.getSlotDuration()));
        if (requestedEnd.isBefore(LocalDateTime.now())) {
            throw new DomainException("Cannot book a slot that has already ended");
        }

        // step 3: calculate start and end dates of current week based on games, custom week
        Map<String, LocalDate> currentWeekDateRange = dateService
                .getCurrentWeekDateRange(game.getOpeningDayOfWeek(), game.getClosingDayOfWeek());
        LocalDate weekStartDate = currentWeekDateRange.get(DateService.getSTART_DATE_KEY());
        LocalDate weekEndDate = currentWeekDateRange.get(DateService.getEND_DATE_KEY());

        // step 4: throw if user tries to book out of current week
        if (request.getDay().isBefore(weekStartDate) || request.getDay().isAfter(weekEndDate))
            throw new ConflictException("Can only book slots within current week");

        // step 5: check if selected players are exceeding the limit and build set
        if (request.getPlayerIds().size() > game.getMaxSlotPlayers() - 1)
            throw new DomainException("Maximum " + game.getMaxSlotPlayers() + " are allowed");

        Set<User> players = new HashSet<>(userRepository.findAllById(request.getPlayerIds()));

        // step 6: check if user already has an active booking (confirmed or pending) on the same day
        boolean hasActive = !gameSlotRepository.findActiveSlotsForUserOnDayByGameId(
                request.getGameId(),
                request.getDay(),
                currentUser.getId()).isEmpty();
        if (hasActive)
            throw new ConflictException("You already has an active booking for the day");

        // step 7: check for all players if they have any active booking
        for (User player : players) {
            boolean hasPlayerActive = !gameSlotRepository.findActiveSlotsForUserOnDayByGameId(
                    request.getGameId(),
                    request.getDay(),
                    player.getId()).isEmpty();
            if (hasPlayerActive)
                throw new ConflictException(player.getUserName() + "already has an active booking for the day");
        }

        // step 8: find any booked slot in same time as user wants.
        Optional<GameSlot> existingOpt = gameSlotRepository.findByGameIdDayStartTimeAndStatus(
                request.getGameId(),
                request.getDay(),
                request.getStartTime(),
                GameSlotStatus.CONFIRMED);

        // step 9: if any slot exists, decide whether to keep that slot or cancel and giv to current user as
        // per their completed slots.
        if (existingOpt.isPresent()) {
            GameSlot existing = existingOpt.get();

            // step 9.1: only allowed if request comes at least one hour before slot start
            LocalDateTime slotStart = LocalDateTime.of(request.getDay(), request.getStartTime());
            if (slotStart.isBefore(LocalDateTime.now().plusHours(1))) {
                throw new ConflictException("Slot already booked");
            }

            // step 9.2: compute averages for both teams
            Set<UUID> existingTeam = new HashSet<>();
            existingTeam.add(existing.getOrganiser().getId());
            existing.getPlayers().forEach(u -> existingTeam.add(u.getId()));

            Set<UUID> newTeam = new HashSet<>();
            newTeam.add(currentUser.getId());
            players.forEach(u -> newTeam.add(u.getId()));

            double existingTeamAvg = computeAverageCompletedSlots(game.getId(), game.getCurrentCycleId(), existingTeam);
            double newTeamAvg = computeAverageCompletedSlots(game.getId(), game.getCurrentCycleId(), newTeam);

            // step 9.3: cancel existing slot if the new team has less slot played
            if (newTeamAvg < existingTeamAvg) {
                existing.setStatus(GameSlotStatus.CANCELLED);
                gameSlotRepository.save(existing);

                // notify cancelled participants
                List<UUID> cancelIds = new ArrayList<>();
                cancelIds.add(existing.getOrganiser().getId());
                existing.getPlayers().forEach(u -> cancelIds.add(u.getId()));
                notificationService.createNotificationForAll(
                        cancelIds,
                        "Your " + game.getName() + " slot on " + existing.getDay() + " "
                                + existing.getStartTime() + " has been cancelled due to priority rules");
                // continue to book new slot for new team.
            } else {
                throw new ConflictException("Slot already booked");
            }
        }

        // step 10: create and book the slot
        GameSlot slot = GameSlot.builder()
                .game(game)
                .day(request.getDay())
                .startTime(request.getStartTime())
                .endTime(request.getStartTime().plusMinutes(game.getSlotDuration()))
                .organiser(currentUser)
                .status(GameSlotStatus.CONFIRMED)
                .players(players)
                .cycleId(game.getCurrentCycleId())
                .build();

        gameSlotRepository.save(slot);

        // step 11: notify organizer and players
        notificationService.createNotification(
                currentUser.getId(),
                "Your " + game.getName() + " slot has been booked for " + request.getDay() + " "
                        + request.getStartTime());

        notificationService.createNotificationForAll(
                request.getPlayerIds(),
                "You were added to a " + game.getName() + " slot on " + request.getDay() + " "
                        + request.getStartTime());
    }

    public void waitForSpecificSlot(WaitSpecificSlotRequest request) {
        Game game = getGameEntityById(request.getGameId());

        GameSlot target = gameSlotRepository.findByGameIdAndSlotId(request.getGameId(), request.getSlotId())
                .orElse(null);
        if (target == null)
            throw new NotFoundException("Target slot not found");

        User currentUser = currentUserService.getCurrentUserEntity();

        // step 1: Only allow waitlist for slots that are currently confirmed
        if (!target.getStatus().equals(GameSlotStatus.CONFIRMED))
            throw new ConflictException("Target slot is not currently booked");

        // step 2: check if selected players are exiting the limit
        if (request.getPlayerIds().size() > game.getMaxSlotPlayers() - 1)
            throw new DomainException("Maximum " + game.getMaxSlotPlayers() + " are allowed");

        Set<User> players = new HashSet<>(userRepository.findAllById(request.getPlayerIds()));

        // step 4: check if user already has an active booking (confirmed or pending) on
        // the same day
        boolean hasActive = !gameSlotRepository.findActiveSlotsForUserOnDayByGameId(
                request.getGameId(),
                target.getDay(),
                currentUser.getId()).isEmpty();
        if (hasActive)
            throw new ConflictException("You already has an active booking for the day");

        // step 5: check for all players if they have any active booking or involved in
        // any slot
        for (User player : players) {
            boolean hasPlayerActive = !gameSlotRepository.findActiveSlotsForUserOnDayByGameId(
                    request.getGameId(),
                    target.getDay(),
                    player.getId()).isEmpty();
            if (hasPlayerActive)
                throw new ConflictException(player.getUserName() + "already has an active booking for the day");
        }

        // step 6: add entry in queue
        GameSlot queueSlot = GameSlot.builder()
                .game(game)
                .day(target.getDay())
                .startTime(target.getStartTime())
                .endTime(target.getEndTime())
                .organiser(currentUser)
                .players(players)
                .status(GameSlotStatus.PENDING)
                .cycleId(game.getCurrentCycleId())
                .build();

        gameSlotRepository.save(queueSlot);
    }

    public void waitForAnySlot(WaitAnySlotRequest request) {
        Game game = getGameEntityById(request.getGameId());

        User currentUser = currentUserService.getCurrentUserEntity();

        // step 1: check if selected players are exiting the limit
        if (request.getPlayerIds().size() > game.getMaxSlotPlayers() - 1)
            throw new DomainException("Maximum " + game.getMaxSlotPlayers() + " are allowed");

        Set<User> players = new HashSet<>(userRepository.findAllById(request.getPlayerIds()));

        // step 2: enforce one active booking per day for the given day
        boolean hasActive = !gameSlotRepository.findActiveSlotsForUserOnDayByGameId(
                request.getGameId(),
                request.getDay(),
                currentUser.getId()).isEmpty();
        if (hasActive)
            throw new ConflictException("User already has an active booking for the day");

        // step 3: check for all players if they have any active booking or involved in
        // any slot
        for (User player : players) {
            boolean hasPlayerActive = !gameSlotRepository.findActiveSlotsForUserOnDayByGameId(
                    request.getGameId(),
                    request.getDay(),
                    player.getId()).isEmpty();
            if (hasPlayerActive)
                throw new ConflictException(player.getUserName() + "already has an active booking for the day");
        }

        // step 4: check if any slot empty today (only allow when all slots of that day is booked)
        List<GameSlot> dayBooked = gameSlotRepository.findGameSlotsByGameIdSlotStatusAndDateRange(
                game.getId(),
                List.of(GameSlotStatus.CONFIRMED, GameSlotStatus.COMPLETED),
                request.getDay(),
                request.getDay());
        int possible = calculateDailySlotCount(game);
        if (dayBooked.size() < possible) {
            throw new ConflictException("Slots still available for today; cannot join queue");
        }

        // step 5: create an entry in queue
        GameSlot queueSlot = GameSlot.builder()
                .game(game)
                .day(request.getDay())
                .organiser(currentUser)
                .players(players)
                .status(GameSlotStatus.PENDING)
                .cycleId(game.getCurrentCycleId())
                .build();

        gameSlotRepository.save(queueSlot);
    }

    public List<QueuedSlotOfferResponse> getOffersForOrganiser() {
        User currentUser = currentUserService.getCurrentUserEntity();

        List<QueuedSlotOffer> offers = queuedSlotOfferRepository.
                findByQueueSlotOrganiserId(currentUser.getId());

        return offers.stream().map(o -> QueuedSlotOfferResponse.builder()
                .id(o.getId())
                .queueSlotId(o.getQueueSlot().getId())
                .cancelledSlotId(o.getCancelledSlot().getId())
                .status(o.getStatus())
                .expiresAt(o.getExpiresAt())
                .build()).toList();
    }

    public void cancelSlot(UUID gameId, UUID slotId) {
        Game game = getGameEntityById(gameId);

        GameSlot slot = gameSlotRepository.findByGameIdAndSlotId(gameId, slotId).orElse(null);
        if (slot == null)
            throw new NotFoundException("Slot not found");

        User currentUser = currentUserService.getCurrentUserEntity();

        // step 1: enforce that only organiser can cancel the slot
        if (!slot.getOrganiser().getId().equals(currentUser.getId())) {
            throw new UnauthorisedException("Only organiser can cancel the slot");
        }

        // step 2: cancel the slot
        slot.setStatus(GameSlotStatus.CANCELLED);

        // step 3 : notify organiser and players about the cancellation
        notificationService.createNotification(
                currentUser.getId(),
                "Your " + game.getName() + " slot has been canceled for " + slot.getDay() + " " + slot.getStartTime()
        );

        notificationService.createNotificationForAll(
                slot.getPlayers().stream().map(x -> x.getId()).toList(),
                "You were added to a " + game.getName() + " slot on " + slot.getDay() + " " + slot.getStartTime()
        );

        gameSlotRepository.save(slot);

        // step 4: check queue and allocate pending slots if any
        queueAllocationService.handleSlotCancellation(slot);
    }

    // for option 2, if user has opted for "i would like to wait for any slot if it
    // gets canceled, at xyz day"
    public void slotAction(QueuedSlotActionRequest request) {
        User currentUser = currentUserService.getCurrentUserEntity();

        // step 1: get the users entry from queue (the pending slot)
        GameSlot pendingSlot = gameSlotRepository.findById(request.getQueuedSlotId()).orElse(null);
        if (pendingSlot == null)
            throw new NotFoundException("Queue entry not found");

        // step 2: get the slot that was cancelled, (the canceled slot)
        GameSlot cancelledSlot = gameSlotRepository.findById(request.getCanceledSlotId()).orElse(null);
        if (cancelledSlot == null)
            throw new NotFoundException("cancelledSlot slot not found");

        getGameEntityById(pendingSlot.getGame().getId());

        // step 3: check in case if the users queue entry is not more an entry in queue.
        if (!pendingSlot.getStatus().equals(GameSlotStatus.PENDING)) {
            throw new ConflictException("Your queue entry not present in queue.");
        }

        // step 4: check in case if the other slot is not cancelled (can be if confirmed
        // for someone else)
        if (!cancelledSlot.getStatus().equals(GameSlotStatus.CANCELLED)) {
            throw new ConflictException("The other slot is not cancelled");
        }

        // step 5: only the organiser can make action
        if (!pendingSlot.getOrganiser().getId().equals(currentUser.getId())) {
            throw new UnauthorisedException("Only the organiser can perform this action");
        }

        // locate the offer record associated with this pending entry & canceled slot
        QueuedSlotOffer offer = queueAllocationService
                .findOffer(pendingSlot.getId(), cancelledSlot.getId())
                .orElseThrow(() -> new ConflictException("No active offer found for this queue entry"));

        queueAllocationService.handleOfferResponse(offer, request.getAction());
    }


    /**
     * compute average number of completed slots in the given cycle for the given team players.
     *
     * @param gameId
     * @param cycleId
     * @param userIds
     * @return average completed slots of that team
     */
    private double computeAverageCompletedSlots(UUID gameId, int cycleId, Set<UUID> userIds) {
        if (userIds == null || userIds.isEmpty()) return 0;
        long total = 0;
        for (UUID uid : userIds) {
            total += gameSlotRepository.countCompletedSlotsForUser(gameId, cycleId, uid);
        }
        return (double) total / userIds.size();
    }

    /**
     * calculate how many slots are there in a day for the game based on its open and close time and slot duration.
     *
     * @param game
     * @return number of slots in a day
     */
    private int calculateDailySlotCount(Game game) {
        long minutes = Duration.between(game.getOpenTime(), game.getCloseTime()).toMinutes();
        return (int) (minutes / game.getSlotDuration());
    }

    private Game getGameEntityById(UUID id) {
        Game game = gameRepository.findById(id).orElse(null);
        if (game == null)
            throw new NotFoundException("Game not found");
        return game;
    }
}
