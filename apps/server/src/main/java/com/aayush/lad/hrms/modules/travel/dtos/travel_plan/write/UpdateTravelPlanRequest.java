package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write;


import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.internal.ParticipantRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateTravelPlanRequest {

    @NotNull(message = "Travel plan id can not be null")
    private UUID id;

    @NotBlank(message = "Title can not be blank")
    private String title;

    @NotBlank(message = "Destination can not be black")
    private String destination;

    private String description;

    private LocalDateTime startAt;

    private LocalDateTime endAt;

    private float maxExpenseAmountPerDay;

    private Set<ParticipantRequest> participants = new HashSet<>();
}
