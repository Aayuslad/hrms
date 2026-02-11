package com.aayush.lad.hrms.modules.jobs.mappers;

import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read.JobOpeningResponse;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.read.JobOpeningSummaryResponse;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.write.CreateJobOpeningRequest;
import com.aayush.lad.hrms.modules.jobs.dtos.job_opening.write.UpdateJobOpeningRequest;
import com.aayush.lad.hrms.modules.jobs.dtos.referral.write.CreateJobOpeningReferralRequest;
import com.aayush.lad.hrms.modules.jobs.models.JobOpening;
import com.aayush.lad.hrms.modules.jobs.models.Referral;
import com.aayush.lad.hrms.modules.user.models.Designation;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.repositories.DesignationRepository;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class JobOpeningMapper {

    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final DesignationRepository designationRepository;

    // create
    public JobOpening toEntity(CreateJobOpeningRequest request) {
        JobOpening jobOpening = modelMapper.map(request, JobOpening.class);

        Designation designation = designationRepository.findById(request.getDesignationId()).orElse(null);
        if (designation == null)
            throw new NotFoundException("Designation not found");
        jobOpening.setDesignation(designation);

        User defaultHr = userRepository.findById(request.getDefaultHrId()).orElse(null);
        if (defaultHr == null)
            throw new NotFoundException("Default HR not found");
        jobOpening.setDefaultHr(defaultHr);

        jobOpening.getHrs().clear();
        jobOpening.getReviewers().clear();

        if (request.getHrs() != null && !request.getHrs().isEmpty()) {
            List<User> hrs = userRepository.findAllById(request.getHrs());
            jobOpening.getHrs().addAll(hrs);
        }

        if (request.getReviewers() != null && !request.getReviewers().isEmpty()) {
            List<User> reviewers = userRepository.findAllById(request.getReviewers());
            jobOpening.getReviewers().addAll(reviewers);
        }

        return jobOpening;
    }

    // update
    public JobOpening toEntity(UpdateJobOpeningRequest request) {
        JobOpening jobOpening = modelMapper.map(request, JobOpening.class);

        Designation designation = designationRepository.findById(request.getDesignationId()).orElse(null);
        if (designation == null)
            throw new NotFoundException("Designation not found");
        jobOpening.setDesignation(designation);

        User defaultHr = userRepository.findById(request.getDefaultHrId()).orElse(null);
        if (defaultHr == null)
            throw new NotFoundException("Default HR not found");
        jobOpening.setDefaultHr(defaultHr);

        jobOpening.getHrs().clear();
        jobOpening.getReviewers().clear();

        if (request.getHrs() != null && !request.getHrs().isEmpty()) {
            List<User> hrs = userRepository.findAllById(request.getHrs());
            jobOpening.getHrs().addAll(hrs);
        }

        if (request.getReviewers() != null && !request.getReviewers().isEmpty()) {
            List<User> reviewers = userRepository.findAllById(request.getReviewers());
            jobOpening.getReviewers().addAll(reviewers);
        }

        return jobOpening;
    }

    // get one
    public JobOpeningResponse toResponse(JobOpening jobOpening) {
        return modelMapper.map(jobOpening, JobOpeningResponse.class);
    }

    // get many
    public List<JobOpeningSummaryResponse> toResponseList(List<JobOpening> jobOpenings) {
        return jobOpenings.stream().map(
                x -> modelMapper.map(x, JobOpeningSummaryResponse.class)
        ).toList();
    }

    // referral create
    public Referral toEntity(CreateJobOpeningReferralRequest request) {
        return modelMapper.map(request, Referral.class);
    }

    // referral update
}
