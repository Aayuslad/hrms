package com.aayush.lad.hrms.modules.games.dtos.read.internal;

import com.aayush.lad.hrms.shared.dtos.GlobalUserResponseSummary;
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
    private GlobalUserResponseSummary user;

    private int completedSlots = 0;

    private LocalDateTime lastPlayedAt;
}
