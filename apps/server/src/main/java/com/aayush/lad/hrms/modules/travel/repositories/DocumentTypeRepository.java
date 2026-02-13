package com.aayush.lad.hrms.modules.travel.repositories;

import com.aayush.lad.hrms.modules.travel.models.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


public interface DocumentTypeRepository extends JpaRepository<DocumentType, UUID> {
    boolean existsByName(String name);
}
