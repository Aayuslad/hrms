package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTravelPlanDocumentRequest {

    @NotBlank(message = "document url can not be empty")
    private String docUrl;

    @NotNull(message = "owner can not be empty")
    private UUID ownerId;

    @NotNull(message = "travel plan can not be empty")
    private UUID travelPlanId;

    @NotNull(message = "document type can not be empty")
    private UUID documentTypeId;
}
