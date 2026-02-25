package com.aayush.lad.hrms.shared.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GlobalUserResponseSummary {

    private UUID id;

    private String userName;

    private String email;

    private UserProfileResponseSummary profile;
}
