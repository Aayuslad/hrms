package com.aayush.lad.hrms.modules.jobs.services;

import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.exeptions.UnauthorisedException;
import com.aayush.lad.hrms.core.security.CurrentUserUtil;
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
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class JobOpeningService {

    private final JobOpeningRepository jobOpeningRepository;
    private final UserRepository userRepository;
    private final CurrentUserUtil currentUserUtil;


    private final JobOpeningMapper mapper;

    // create
    public void create(CreateJobOpeningRequest request) {
        JobOpening jobOpening = mapper.toEntity(request);
        jobOpeningRepository.save(jobOpening);
    }

    // update
    public void update(UpdateJobOpeningRequest request) {
        JobOpening jobOpening = mapper.toEntity(request);
        jobOpeningRepository.save(jobOpening);
    }

    // get one
    public JobOpeningResponse getOne(UUID jobOpeningId) {
        JobOpening jobOpening = jobOpeningRepository.findByIdWithAll(jobOpeningId).orElse(null);

        if (jobOpening == null)
            throw new NotFoundException("Job opening not found");

        return mapper.toResponse(jobOpening);
    }

    // get all
    public List<JobOpeningSummaryResponse> getAll() {
        List<JobOpening> jobOpenings = jobOpeningRepository.findAll();
        return mapper.toResponseList(jobOpenings);
    }

    // close
    public void close(UUID id) {
        JobOpening jobOpening = jobOpeningRepository.findById(id).orElse(null);

        if (jobOpening == null)
            throw new NotFoundException("Job opening not found");

        jobOpening.setClosed(true);

        jobOpeningRepository.save(jobOpening);
    }

    // share
    public void share(ShareJobOpeningRequest request) {
        JobOpening jobOpening = jobOpeningRepository.findById(request.getJobOpeningId()).orElse(null);

        if (jobOpening == null)
            throw new NotFoundException("Job opening not found");

        //TODO: send an email here, complete when the mail service is there

        User sharedBy = userRepository.findByUserName(currentUserUtil.getUsername()).orElse(null);
        if (sharedBy == null)
            throw new UnauthorisedException();

        JobOpeningShareAudit audit = JobOpeningShareAudit.builder()
                .sharedTo(request.getShareTo())
                .jobOpening(jobOpening)
                .sharedBy(sharedBy)
                .build();

        jobOpening.getShareAudits().add(audit);

        jobOpeningRepository.save(jobOpening);
    }
}
