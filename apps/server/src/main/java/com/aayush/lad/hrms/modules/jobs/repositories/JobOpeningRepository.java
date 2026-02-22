package com.aayush.lad.hrms.modules.jobs.repositories;

import com.aayush.lad.hrms.modules.jobs.models.JobOpening;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

 //TODO: is this  annotation required here ?
public interface JobOpeningRepository extends JpaRepository<JobOpening, UUID> {

        @EntityGraph(attributePaths = {
            "hrs",
            "reviewers",
            "referrals",
            "shareAudits"
        })
        @Query("select jo from JobOpening jo where jo.id = :id")
        Optional<JobOpening> findByIdWithAll(@Param("id") UUID id);
}
