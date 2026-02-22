package com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read.internal;

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
public class JobOpeningShareAuditResponse {

    private UUID id;

    private GlobalUserResponseSummary sharedBy;

    private LocalDateTime sharedAt;

    private String sharedToEmail;
}
