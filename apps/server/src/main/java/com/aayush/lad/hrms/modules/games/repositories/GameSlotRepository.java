package com.aayush.lad.hrms.modules.games.repositories;

import com.aayush.lad.hrms.modules.games.enums.GameSlotStatus;
import com.aayush.lad.hrms.modules.games.models.GameSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface GameSlotRepository extends JpaRepository<GameSlot, UUID> {

    /**
     * Find booked slots (CONFIRMED or COMPLETED) within a date range for a game.
     * 
     * @param id game ID
     * @param slotStatus list of statuses to filter (typically CONFIRMED, COMPLETED)
     * @param startDate inclusive start date
     * @param endDate inclusive end date
     * @return list of slots matching criteria
     */
    @Query(value = "SELECT * FROM game_slots s " +
            "WHERE s.day BETWEEN :startDate AND :endDate " +
            "AND s.game_id = :id " +
            "AND s.status IN (:#{#slotStatus.![name()]})",
            nativeQuery = true)
    List<GameSlot> findGameSlotsByGameIdSlotStatusAndDateRange(
            @Param("id") UUID id,
            @Param("slotStatus") List<GameSlotStatus> slotStatus,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    /**
     * Find a specific confirmed slot by game, day, start time, and status.
     * 
     * @param gameId the game ID
     * @param day the date of the slot
     * @param startTime the start time of the slot
     * @param status the status to match (typically CONFIRMED)
     * @return Optional containing the slot if found
     */
    @Query("select s from GameSlot s where " +
            "s.game.id = :gameId " +
            "and s.day = :day " +
            "and s.startTime = CAST(:startTime as time) " +
            "and s.status = :status")
    Optional<GameSlot> findByGameIdDayStartTimeAndStatus(
            @Param("gameId") UUID gameId,
            @Param("day") LocalDate day,
            @Param("startTime") LocalTime startTime,
            @Param("status") GameSlotStatus status
    );

    /**
     * Find active slots for a user (as organiser or player) on a specific day for a game.
     * Active slots are CONFIRMED or PENDING.
     * 
     * @param gameId the game ID
     * @param day the date to check for
     * @param userId the user ID (can be organiser or player)
     * @return list of active slots the user is involved in
     */
    @Query("select s from GameSlot s " +
            "join s.players p " +
            "where s.game.id = :gameId " +
            "and s.day = :day " +
            "and (p.id = :userId OR s.organiser.id = :userId)" +
            "and (s.status = GameSlotStatus.CONFIRMED or s.status = GameSlotStatus.PENDING)")
    List<GameSlot> findActiveSlotsForUserOnDayByGameId(
            @Param("gameId") UUID gameId,
            @Param("day") LocalDate day,
            @Param("userId") UUID userId
    );

    @Query("select s from GameSlot s " +
            "where s.game.id = :gameId " +
            "and s.id = :slotId")
    Optional<GameSlot> findByGameIdAndSlotId(
            @Param("gameId") UUID gameId, 
            @Param("slotId") UUID slotId
    );

    /**
     * Find pending queue entries waiting for a specific slot (option-1: wait for this slot).
     * 
     * @param gameId the game ID
     * @param day the date
     * @param startTime the slot start time
     * @param endTime the slot end time
     * @return list of pending entries waiting for this exact slot
     */
    @Query("select s from GameSlot s where " +
            "s.game.id = :gameId " +
            "and s.day = :day " +
            "and s.startTime = CAST(:startTime as time) " +
            "and s.endTime = CAST(:endTime as time) " +
            "and s.status = GameSlotStatus.PENDING")
    List<GameSlot> findPendingSpecificSlots(
            @Param("gameId") UUID gameId,
            @Param("day") LocalDate day,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    /**
     * Find pending queue entries waiting for any slot on a day (option-2: wait for any slot).
     * 
     * @param gameId the game ID
     * @param day the date
     * @return list of pending entries waiting for any slot on this day
     */
    @Query("select s from GameSlot s where " +
            "s.game.id = :gameId " +
            "and s.day = :day " +
            "and s.startTime is null " +
            "and s.status = GameSlotStatus.PENDING")
    List<GameSlot> findPendingAnySlots(
            @Param("gameId") UUID gameId,
            @Param("day") LocalDate day
    );

    /**
     * Count completed slots for a user (as organiser or player) in a specific cycle.
     * 
     * @param gameId the game ID
     * @param cycleId the cycle ID to count within
     * @param userId the user ID
     * @return count of completed slots this user participated in
     */
    @Query("select count(s) from GameSlot s left join s.players p where " +
            "s.game.id = :gameId " +
            "and s.cycleId = :cycleId " +
            "and s.status = GameSlotStatus.COMPLETED " +
            "and (s.organiser.id = :userId or p.id = :userId)")
    long countCompletedSlotsForUser(
            @Param("gameId") UUID gameId,
            @Param("cycleId") int cycleId,
            @Param("userId") UUID userId
    );
}
