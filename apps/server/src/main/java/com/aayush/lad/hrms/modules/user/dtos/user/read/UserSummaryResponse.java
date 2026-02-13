package com.aayush.lad.hrms.modules.user.dtos.user.read;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryResponse {

    private UUID id;

    private String email;

    private String userName;

    private String firstName;

    private String lastName;

    private String avatarUrl;
}
