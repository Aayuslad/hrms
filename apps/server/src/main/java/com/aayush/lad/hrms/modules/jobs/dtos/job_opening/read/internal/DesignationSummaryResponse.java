package com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read.internal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DesignationSummaryResponse {

    private UUID id;

    private String name;
}
