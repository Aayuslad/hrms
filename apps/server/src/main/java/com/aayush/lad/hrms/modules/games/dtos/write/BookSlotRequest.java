package com.aayush.lad.hrms.modules.games.dtos.write;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookSlotRequest {

    @NotNull(message = "Game can not be empty")
    private UUID gameId;

    @NotNull(message = "The Day of game can not be empty")
    private LocalDate day;

    @NotNull(message = "The game slot timing can not be empty")
    private LocalTime startTime;

    private List<UUID> playerIds;
}
