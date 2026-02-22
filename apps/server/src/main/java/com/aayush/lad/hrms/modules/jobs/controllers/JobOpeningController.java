package com.aayush.lad.hrms.modules.jobs.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read.JobOpeningResponse;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read.JobOpeningSummaryResponse;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.write.CreateJobOpeningRequest;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.write.ShareJobOpeningRequest;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.write.UpdateJobOpeningRequest;
import com.aayush.lad.hrms.modules.jobs.services.JobOpeningService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("api/job-openings")
public class JobOpeningController {

    private final JobOpeningService jobOpeningService;

    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    @GetMapping("/{id}")
    public ResponseEntity<Result<JobOpeningResponse>> get(@PathVariable UUID id) {
        JobOpeningResponse response = jobOpeningService.getOne(id);
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PreAuthorize("hasRole('Employee')")
    @GetMapping
    public ResponseEntity<Result<List<JobOpeningSummaryResponse>>> getAll() {
        List<JobOpeningSummaryResponse> response = jobOpeningService.getAll();
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Result<Void>> create(@Valid @ModelAttribute CreateJobOpeningRequest request) {
        jobOpeningService.create(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Result<Void>> update(@PathVariable("id") UUID id,
                                               @Valid @ModelAttribute UpdateJobOpeningRequest request) {
        request.setId(id);
        jobOpeningService.update(request);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('Employee')")
    @PostMapping("/{id}/share")
    public ResponseEntity<Result<Void>> share(@PathVariable("id") UUID id,
                                              @Valid @RequestBody ShareJobOpeningRequest request) {
        request.setJobOpeningId(id);
        jobOpeningService.share(request);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    @PatchMapping("/{id}/close")
    public ResponseEntity<Result<Void>> close(@PathVariable("id") UUID id) {
        jobOpeningService.close(id);
        return ResultMapper.handle(HttpStatus.OK);
    }
}
