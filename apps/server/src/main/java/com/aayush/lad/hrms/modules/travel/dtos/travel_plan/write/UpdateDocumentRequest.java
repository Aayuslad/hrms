package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateDocumentRequest {

    @NotNull(message = "document id can not be empty")
    private UUID id;

    @NotNull(message = "Document can not be empty")
    private MultipartFile doc;

    @NotNull(message = "travel plan id can not be empty")
    private UUID travelPlanId;

    @NotNull(message = "owner can not be empty")
    private UUID ownerId;

    @NotNull(message = "document type can not be empty")
    private UUID documentTypeId;
}
