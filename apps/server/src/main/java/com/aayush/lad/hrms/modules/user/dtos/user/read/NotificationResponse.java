package com.aayush.lad.hrms.modules.user.dtos.user.read;

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
public class NotificationResponse {

    private UUID id;

    private String content;

    private Boolean isRead;

    private LocalDateTime createdAt;
}
