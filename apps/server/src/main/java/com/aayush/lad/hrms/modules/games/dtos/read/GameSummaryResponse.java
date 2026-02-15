package com.aayush.lad.hrms.modules.games.dtos.read;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameSummaryResponse {

    private UUID id;

    private String name;

    private int slotDuration;

    private int maxSlotPlayers;

    private LocalTime openTime;

    private LocalTime closeTime;

    private DayOfWeek openingDayOfWeek;

    private DayOfWeek closingDayOfWeek;
}
