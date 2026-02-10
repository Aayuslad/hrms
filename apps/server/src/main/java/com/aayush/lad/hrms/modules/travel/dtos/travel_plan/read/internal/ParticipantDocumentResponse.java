package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantDocumentResponse {

    private UUID id;

    private UUID owner;
    
    private String docUrl;

    private String documentType;

    private LocalDateTime uploadedAt;

    private UUID uploadedBy;
}
