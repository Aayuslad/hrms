package com.aayush.lad.hrms.modules.user.dtos.user.read.internal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManagerSummaryResponse {

    private UUID id;

    private String userName;

    private String firstName;

    private String lastName;

    private String email;

    private String avatarUrl;
}
