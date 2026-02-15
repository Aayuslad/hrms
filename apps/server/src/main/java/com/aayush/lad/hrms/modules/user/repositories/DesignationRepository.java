package com.aayush.lad.hrms.modules.user.repositories;

import com.aayush.lad.hrms.modules.user.models.Designation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface DesignationRepository extends JpaRepository<Designation, UUID> {

    boolean existsByName(String name);
}

