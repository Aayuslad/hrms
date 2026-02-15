package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write;


import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
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

    private List<UUID> participants;
}
