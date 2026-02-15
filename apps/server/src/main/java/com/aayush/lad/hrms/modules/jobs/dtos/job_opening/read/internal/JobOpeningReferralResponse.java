package com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read.internal;

import com.aayush.lad.hrms.modules.jobs.enums.ReferralStatus;
import com.aayush.lad.hrms.shared.dtos.GlobalUserResponseSummary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobOpeningReferralResponse {

    private UUID id;

    private GlobalUserResponseSummary referredBy;

    private String name;

    private String email;

    private String cvUrl;

    private String note;

    private ReferralStatus status;

    // TODO: add status audits later

}
