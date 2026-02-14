package com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read;

import java.util.UUID;

import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read.internal.DesignationSummaryResponse;
import com.aayush.lad.hrms.shared.dtos.GlobalUserResponseSummary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobOpeningSummaryResponse {

    private UUID id;

    private String description;

    private DesignationSummaryResponse designation;

    private float requiredExperience;

    private String jdUrl;

    private GlobalUserResponseSummary defaultHr;

    private boolean isClosed;

    private GlobalUserResponseSummary createdBy;
    private GlobalUserResponseSummary updatedBy;
}
