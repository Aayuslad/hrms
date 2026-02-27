package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read;

import com.aayush.lad.hrms.shared.dtos.GlobalUserResponseSummary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TravelPlanResponse {

    private UUID id;

    private String title;

    private String destination;

    private String description;

    private LocalDateTime startAt;

    private LocalDateTime endAt;

    private float maxExpenseAmountPerDay;

    private List<ParticipantResponse> participants;

    private GlobalUserResponseSummary createdBy;

    private GlobalUserResponseSummary updatedBy;
}
