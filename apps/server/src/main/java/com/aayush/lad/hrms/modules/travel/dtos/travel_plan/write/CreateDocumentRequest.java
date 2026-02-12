package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

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
