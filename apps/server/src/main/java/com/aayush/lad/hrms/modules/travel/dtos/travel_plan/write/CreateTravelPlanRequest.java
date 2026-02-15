package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write;


import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
