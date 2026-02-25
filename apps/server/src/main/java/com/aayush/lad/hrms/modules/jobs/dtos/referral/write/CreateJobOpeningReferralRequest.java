package com.aayush.lad.hrms.modules.jobs.dtos.referral.write;

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
public class CreateJobOpeningReferralRequest {

    @NotNull(message = "Job opening can not be empty")
    private UUID jobOpeningId;

    @NotBlank(message = "Name can not be empty")
    private String name;

    @NotBlank(message = "Email can not be empty")
    private String email;

    @NotBlank(message = "CV can not me empty")
    private String cvUrl;
}
