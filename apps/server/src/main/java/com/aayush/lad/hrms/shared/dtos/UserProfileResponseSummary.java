package com.aayush.lad.hrms.shared.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponseSummary {

    private UUID id;

    private String firstName;

    private String middleName;

    private String lastName;

    private String avatarUrl;
}
