package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTravelPlanRequest {

    @NotBlank(message = "Title can not be blank")
    private String title;

    @NotBlank(message = "Destination can not be blank")
    private String destination;

    private String description;

    private LocalDateTime startAt;

    private LocalDateTime endAt;
}
