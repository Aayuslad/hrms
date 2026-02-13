package com.aayush.lad.hrms.modules.jobs.services;

import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.exeptions.UnauthorisedException;
import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.modules.jobs.dtos.referral.write.CreateJobOpeningReferralRequest;
import com.aayush.lad.hrms.modules.jobs.dtos.referral.write.UpdateJobOpeningReferralRequest;
import com.aayush.lad.hrms.modules.jobs.mappers.JobOpeningMapper;
import com.aayush.lad.hrms.modules.jobs.models.JobOpening;
import com.aayush.lad.hrms.modules.jobs.models.Referral;
import com.aayush.lad.hrms.modules.jobs.repositories.JobOpeningRepository;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class JobOpeningReferralService {

    private final JobOpeningRepository jobOpeningRepository;
    private final JobOpeningMapper jobOpeningMapper;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public void create(CreateJobOpeningReferralRequest request) {
        JobOpening jobOpening = jobOpeningRepository.findById(request.getJobOpeningId()).orElse(null);
        if (jobOpening == null)
            throw new NotFoundException("Job opening not found");

        User referredBy = userRepository.findByUserName(currentUserService.getUsername()).orElse(null);
        if (referredBy == null)
            throw new UnauthorisedException();

        Referral referral = jobOpeningMapper.toEntity(request);
        referral.setJobOpening(jobOpening);
        referral.setReferredBy(referredBy);

        jobOpening.getReferrals().add(referral);

        jobOpeningRepository.save(jobOpening);
        //TODO: Go through any of the example how @oneToMany and @ManyToMany relation containing methods to write and how it works.
    }

    public void update(UpdateJobOpeningReferralRequest request) {
        JobOpening jobOpening = jobOpeningRepository.findById(request.getJobOpeningId()).orElse(null);
        if (jobOpening == null)
            throw new NotFoundException("Job opening not found");

        Referral target = jobOpening.getReferrals().stream()
                .filter(x -> x.getId().equals(request.getId()))
                .findFirst().orElse(null);

        if (target == null)
            throw new NotFoundException("Expense not found");

        target.setCvUrl(request.getCvUrl());
        target.setEmail(request.getEmail());
        target.setNote(request.getNote());
        target.setName(request.getName());

        jobOpeningRepository.save(jobOpening);
    }
}
