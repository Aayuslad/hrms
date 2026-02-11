package com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read;

import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read.internal.DesignationSummaryResponse;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read.internal.JobOpeningReferralResponse;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read.internal.UserSummaryResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobOpeningResponse {

    private UUID id;

    private String description;

    private DesignationSummaryResponse designation;

    private float requiredExperience;

    private String jdUrl;

    private UserSummaryResponse defaultHr;

    private boolean isClosed;

    private List<UserSummaryResponse> hrs = new ArrayList<>();

    private List<UserSummaryResponse> reviewers = new ArrayList<>();

    private List<JobOpeningReferralResponse> referrals = new ArrayList<>();

    // TODO: add share audit later on
}
