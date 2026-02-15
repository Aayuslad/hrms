package com.aayush.lad.hrms.modules.user.dtos.user.write;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarkNotificationsReadRequest {

    @NotEmpty(message = "Notification IDs cannot be empty")
    private Set<Long> notificationIds;
}
