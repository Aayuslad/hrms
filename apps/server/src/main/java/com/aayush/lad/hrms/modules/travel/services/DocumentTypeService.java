package com.aayush.lad.hrms.modules.travel.services;

import com.aayush.lad.hrms.modules.travel.repositories.DocumentTypeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DocumentTypeService {

    private final DocumentTypeRepository documentTypeRepository;

}
