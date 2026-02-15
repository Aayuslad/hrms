package com.aayush.lad.hrms.modules.user.repositories;

import com.aayush.lad.hrms.modules.user.models.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface DepartmentRepository extends JpaRepository<Department, UUID> {

    boolean existsByName(String name);
}

