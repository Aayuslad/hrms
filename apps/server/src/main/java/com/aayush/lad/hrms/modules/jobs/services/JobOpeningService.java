package com.aayush.lad.hrms.modules.jobs.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.core.services.EmailService;
import com.aayush.lad.hrms.core.services.FileUploadService;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read.JobOpeningResponse;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read.JobOpeningSummaryResponse;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.write.CreateJobOpeningRequest;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.write.ShareJobOpeningRequest;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.write.UpdateJobOpeningRequest;
import com.aayush.lad.hrms.modules.jobs.mappers.JobOpeningMapper;
import com.aayush.lad.hrms.modules.jobs.models.JobOpening;
import com.aayush.lad.hrms.modules.jobs.models.JobOpeningShareAudit;
import com.aayush.lad.hrms.modules.jobs.repositories.JobOpeningRepository;
import com.aayush.lad.hrms.modules.user.models.User;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class JobOpeningService {

    private final JobOpeningRepository jobOpeningRepository;
    private final CurrentUserService currentUserService;
    private final FileUploadService fileUploadService;
    private final EmailService emailService;

    private final JobOpeningMapper mapper;

    public void create(CreateJobOpeningRequest request) {
        JobOpening jobOpening = mapper.create(request);

        if (request.getJd() != null)
            jobOpening.setJdUrl(fileUploadService.uploadFile(request.getJd()));

        jobOpeningRepository.save(jobOpening);
    }

    public void update(UpdateJobOpeningRequest request) {
        JobOpening jobOpening = requireJobOpening(request.getId());

        mapper.update(request, jobOpening);

        if (request.getJd() != null) {
            fileUploadService.deleteFileByURL(jobOpening.getJdUrl());
            jobOpening.setJdUrl(fileUploadService.uploadFile(request.getJd()));
        }

        jobOpeningRepository.save(jobOpening);
    }

    public JobOpeningResponse getOne(UUID jobOpeningId) {
        JobOpening jobOpening = requireJobOpening(jobOpeningId);
        return mapper.toResponse(jobOpening);
    }

    public List<JobOpeningSummaryResponse> getAll() {
        List<JobOpening> jobOpenings = jobOpeningRepository.findAll();
        return mapper.toResponseList(jobOpenings);
    }

    public void close(UUID id) {
        JobOpening jobOpening = requireJobOpening(id);
        jobOpening.setClosed(true);
        jobOpeningRepository.save(jobOpening);
    }

    public void share(ShareJobOpeningRequest request) {
        JobOpening jobOpening = requireJobOpening(request.getJobOpeningId());

        User sharedBy = currentUserService.getCurrentUserEntity();

        String content = "A Job opening is shared to you by " + sharedBy.getUserName() + " from xyz company"
                + "Designation: " + jobOpening.getDesignation().getName()
                + "Description: " + jobOpening.getDescription()
                + "Job Description: " + jobOpening.getJdUrl();

        emailService.sendSimpleEmail(request.getShareToEmail(), "Job Opportunity", content);

        JobOpeningShareAudit audit = JobOpeningShareAudit.builder()
                .sharedToEmail(request.getShareToEmail())
                .jobOpening(jobOpening)
                .sharedBy(sharedBy)
                .build();

        jobOpening.getShareAudits().add(audit);

        jobOpeningRepository.save(jobOpening);
    }

    private JobOpening requireJobOpening(UUID id) {
        JobOpening jobOpening = jobOpeningRepository.findByIdWithAll(id).orElse(null);
        if (jobOpening == null)
            throw new NotFoundException("Job opening not found");
        return jobOpening;
    }
}
