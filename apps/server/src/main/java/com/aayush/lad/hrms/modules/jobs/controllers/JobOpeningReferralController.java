package com.aayush.lad.hrms.modules.jobs.controllers;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.modules.jobs.dtos.referral.write.CreateJobOpeningReferralRequest;
import com.aayush.lad.hrms.modules.jobs.dtos.referral.write.UpdateJobOpeningReferralRequest;
import com.aayush.lad.hrms.modules.jobs.services.JobOpeningReferralService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("api/job-openings")
public class JobOpeningReferralController {

    private final JobOpeningReferralService jobOpeningReferralService;

    @PostMapping("/referrals")
    public ResponseEntity<Result<Void>> createReferral(@Valid @RequestBody CreateJobOpeningReferralRequest request) {
        jobOpeningReferralService.create(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

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
