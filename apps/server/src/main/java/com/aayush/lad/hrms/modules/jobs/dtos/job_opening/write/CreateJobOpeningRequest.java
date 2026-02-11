package com.aayush.lad.hrms.modules.jobs.dtos.job_opening.write;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateJobOpeningRequest {

    private String description;

    @NotNull(message = "Designation can not be empty")
    private UUID designationId;

    @Min(0)
    private float requiredExperience;

    private String jdUrl;

    @NotNull(message = "Default HR can not be empty")
    private UUID defaultHrId;

    private Set<UUID> hrs = new HashSet<>();

    private Set<UUID> reviewers = new HashSet<>();
}
