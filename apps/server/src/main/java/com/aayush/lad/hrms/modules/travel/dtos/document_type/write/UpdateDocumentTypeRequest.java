package com.aayush.lad.hrms.modules.travel.dtos.document_type.write;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateDocumentTypeRequest {

    @NotNull(message = "Document type ID cannot be blank")
    private UUID id;

    @NotBlank(message = "Document type name cannot be blank")
    private String name;
}
