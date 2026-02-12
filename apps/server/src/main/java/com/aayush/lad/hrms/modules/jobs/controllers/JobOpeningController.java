package com.aayush.lad.hrms.modules.jobs.controllers;

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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("api/job-openings")
public class JobOpeningController {

    private final JobOpeningService jobOpeningService;

    @GetMapping("/{id}")
    public ResponseEntity<Result<JobOpeningResponse>> get(@PathVariable UUID id) {
        JobOpeningResponse response = jobOpeningService.getOne(id);
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @GetMapping
    public ResponseEntity<Result<List<JobOpeningSummaryResponse>>> getAll() {
        List<JobOpeningSummaryResponse> response = jobOpeningService.getAll();
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Result<Void>> create(@Valid @ModelAttribute CreateJobOpeningRequest request) {
        jobOpeningService.create(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Result<Void>> update(@PathVariable("id") UUID id, @Valid @ModelAttribute UpdateJobOpeningRequest request) {
        request.setId(id);
        jobOpeningService.update(request);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<Result<Void>> share(@PathVariable("id") UUID id, @Valid @RequestBody ShareJobOpeningRequest request) {
        request.setJobOpeningId(id);
        jobOpeningService.share(request);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<Result<Void>> close(@PathVariable("id") UUID id) {
        jobOpeningService.close(id);
        return ResultMapper.handle(HttpStatus.OK);
    }
}
