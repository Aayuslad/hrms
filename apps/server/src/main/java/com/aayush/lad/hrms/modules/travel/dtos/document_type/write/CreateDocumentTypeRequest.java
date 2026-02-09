package com.aayush.lad.hrms.modules.travel.dtos.document_type.write;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateDocumentTypeRequest {

    @NotBlank(message = "Document type name cannot be blank")
    private String name;
}
