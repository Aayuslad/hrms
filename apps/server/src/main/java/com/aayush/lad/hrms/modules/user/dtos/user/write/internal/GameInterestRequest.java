package com.aayush.lad.hrms.modules.user.dtos.user.write.internal;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameInterestRequest {
    @NotNull(message = "Game ID is required")
    private UUID gameId;
}
