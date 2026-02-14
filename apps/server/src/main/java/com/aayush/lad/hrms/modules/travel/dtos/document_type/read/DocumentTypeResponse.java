package com.aayush.lad.hrms.modules.travel.dtos.document_type.read;

import java.time.LocalDateTime;
import java.util.UUID;

import com.aayush.lad.hrms.shared.dtos.GlobalUserResponseSummary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentTypeResponse {
    private UUID id;

    private String name;

    private GlobalUserResponseSummary createdBy;

    private GlobalUserResponseSummary updatedBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
