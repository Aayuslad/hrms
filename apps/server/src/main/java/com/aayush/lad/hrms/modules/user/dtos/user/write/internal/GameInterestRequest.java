package com.aayush.lad.hrms.modules.user.dtos.user.write.internal;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameInterestRequest {
    @NotNull(message = "Game ID is required")
    private UUID gameId;
}
