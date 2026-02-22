package com.aayush.lad.hrms.modules.jobs.controllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.modules.jobs.dtos.referral.write.CreateJobOpeningReferralRequest;
import com.aayush.lad.hrms.modules.jobs.dtos.referral.write.UpdateJobOpeningReferralRequest;
import com.aayush.lad.hrms.modules.jobs.services.JobOpeningReferralService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("api/job-openings")
public class JobOpeningReferralController {

    private final JobOpeningReferralService jobOpeningReferralService;

    @PreAuthorize("hasRole('Employee')")
    @PostMapping("/referrals")
    public ResponseEntity<Result<Void>> createReferral(@Valid @RequestBody CreateJobOpeningReferralRequest request) {
        jobOpeningReferralService.create(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('Employee')")
    @PutMapping("/{jobOpeningId}/refferals/{referralId}")
    public ResponseEntity<Result<Void>> updateReferral(
            @PathVariable("jobOpeningId") UUID jobOpeningId,
            @PathVariable("referralId") UUID referralId,
            @Valid @RequestBody UpdateJobOpeningReferralRequest request) {

        request.setId(referralId);
        request.setJobOpeningId(jobOpeningId);

        jobOpeningReferralService.update(request);

        return ResultMapper.handle(HttpStatus.OK);
    }
}
