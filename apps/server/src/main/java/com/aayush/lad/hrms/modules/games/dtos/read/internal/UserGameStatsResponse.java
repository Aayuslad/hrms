package com.aayush.lad.hrms.modules.games.dtos.read.internal;

import com.aayush.lad.hrms.modules.games.dtos.read.internal.UserSummaryResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserGameStatsResponse {

    private UUID id;

    // Use a lightweight user summary here to avoid embedding full User entity
    private UserSummaryResponse user;

    private int completedSlots = 0;

    private LocalDateTime lastPlayedAt;
}
