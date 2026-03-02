package com.aayush.lad.hrms.modules.travel.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aayush.lad.hrms.modules.travel.models.DocumentType;


public interface DocumentTypeRepository extends JpaRepository<DocumentType, UUID> {
    boolean existsByName(String name);
}
