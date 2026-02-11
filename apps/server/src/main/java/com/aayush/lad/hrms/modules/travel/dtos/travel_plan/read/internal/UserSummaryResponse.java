package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSummaryResponse {

    private UUID id;

    private String userName;
}
