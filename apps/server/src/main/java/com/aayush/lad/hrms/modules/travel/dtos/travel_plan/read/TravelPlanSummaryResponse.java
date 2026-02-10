package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TravelPlanSummaryResponse {

    private UUID id;

    private String title;

    private String destination;

    private String description;

    private LocalDateTime startAt;

    private LocalDateTime endAt;
}
