package com.aayush.lad.hrms.modules.games.dtos.read.internal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameSlotResponse {

    private UUID id;

    private LocalTime startTime;

    private LocalTime endTime;

    private LocalDate day;

    private UserSummaryResponse organiser;

    private boolean isBooked = true;

    private List<UserSummaryResponse> players = new ArrayList<>();
}
