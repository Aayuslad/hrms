package com.aayush.lad.hrms.modules.games.dtos.read;

import com.aayush.lad.hrms.modules.games.dtos.read.internal.GameSlotResponse;
import com.aayush.lad.hrms.modules.games.dtos.read.internal.UserGameStatsResponse;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameResponse {

    private UUID id;

    private String name;

    private int slotDuration;

    private int maxSlotPlayers;

    private LocalTime openTime;

    private LocalTime closeTime;

    private DayOfWeek openingDayOfWeek;

    private DayOfWeek closingDayOfWeek;

    private List<GameSlotResponse> gameSlots;

    private List<UserGameStatsResponse> userGameStats;
 }
