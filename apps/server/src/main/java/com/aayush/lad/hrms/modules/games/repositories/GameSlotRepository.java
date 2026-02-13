package com.aayush.lad.hrms.modules.games.repositories;

import com.aayush.lad.hrms.modules.games.enums.GameSlotStatus;
import com.aayush.lad.hrms.modules.games.models.GameSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GameSlotRepository extends JpaRepository<GameSlot, UUID> {

    @Query(value = "SELECT * FROM GameSlot as s " +
            "WHERE s.day BETWEEN :startDate AND :endDate" +
            "AND s.game_id = :id " +
            "AND s.status IN :#{#gameSlotStatus.![name()]}", nativeQuery = true)
    List<GameSlot> findGameSlotsByGameIdSlotStatusAndDateRange(
            @Param("id") UUID id,
            @Param("slotStatus") List<GameSlotStatus> gameSlotStatus,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("select s from GameSlot s where " +
            "s.game.id = :gameId " +
            "and s.day = :day " +
            "and s.startTime = :startTime " +
            "and s.status = :status")
    Optional<GameSlot> findByGameIdDayStartTimeAndStatus(
            @Param("gameId") UUID gameId,
            @Param("day") LocalDate day,
            @Param("startTime") LocalTime startTime,
            @Param("status") GameSlotStatus status
    );

    // find slot with user as a player or as an organizer
    @Query("select s from GameSlot s " +
            "join s.players p " +
            "where s.game.id = :gameId " +
            "and s.day = :day " +
            "and (p.id = :userId OR s.organiser.id = :userId)" +
            "and (s.status = com.aayush.lad.hrms.modules.games.enums.GameSlotStatus.CONFIRMED or s.status = com.aayush.lad.hrms.modules.games.enums.GameSlotStatus.PENDING)")
    List<GameSlot> findActiveSlotsForUserOnDayByGameId(
            @Param("gameId") UUID gameId,
            @Param("day") LocalDate day,
            @Param("userId") UUID userId
    );

    @Query("select s from GameSlot s " +
            "where s.game.id = :gameId " +
            "and s.id = :slotId")
    Optional<GameSlot> findByGameIdAndSlotId(@Param("gameId") UUID gameId, @Param("slotId") UUID slotId);
}
