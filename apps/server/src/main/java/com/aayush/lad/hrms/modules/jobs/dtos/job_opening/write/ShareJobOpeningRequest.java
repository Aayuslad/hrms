package com.aayush.lad.hrms.modules.jobs.dtos.job_opening.write;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShareJobOpeningRequest {
    private UUID jobOpeningId;

    @NotBlank(message = "share to can not be blank")
    @Email(message = "wrong email format")
    private String shareToEmail;
}
