package com.aayush.lad.hrms.modules.user.dtos.designation.read;

import com.aayush.lad.hrms.shared.dtos.GlobalUserResponseSummary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DesignationResponse {

    private UUID id;

    private String name;

    private GlobalUserResponseSummary createdBy;

    private GlobalUserResponseSummary updatedBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
