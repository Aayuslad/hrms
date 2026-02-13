package com.aayush.lad.hrms.modules.games.dtos.write;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaitAnySlotRequest {

    @NotNull(message = "Day can not be empty")
    private LocalDate day;

    @NotNull(message = "Game can not be empty")
    private UUID gameId;

    private List<UUID> playerIds;
}
