package com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read;

import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read.internal.DesignationSummaryResponse;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read.internal.UserSummaryResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

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

    private UserSummaryResponse defaultHr;

    private boolean isClosed;
}
