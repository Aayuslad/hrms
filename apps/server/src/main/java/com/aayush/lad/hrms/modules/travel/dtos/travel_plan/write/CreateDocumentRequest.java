package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateDocumentRequest {

    @NotNull(message = "Document can not be empty")
    private MultipartFile doc;

    @NotNull(message = "owner can not be empty")
    private UUID ownerId;

    @NotNull(message = "travel plan can not be empty")
    private UUID travelPlanId;

    @NotNull(message = "document type can not be empty")
    private UUID documentTypeId;
}
