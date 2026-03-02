package com.aayush.lad.hrms.modules.travel.services;

import com.aayush.lad.hrms.core.exeptions.ConflictException;
import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.modules.travel.dtos.document_type.read.DocumentTypeResponse;
import com.aayush.lad.hrms.modules.travel.dtos.document_type.write.CreateDocumentTypeRequest;
import com.aayush.lad.hrms.modules.travel.dtos.document_type.write.UpdateDocumentTypeRequest;
import com.aayush.lad.hrms.modules.travel.mappers.DocumentTypeMapper;
import com.aayush.lad.hrms.modules.travel.models.DocumentType;
import com.aayush.lad.hrms.modules.travel.repositories.DocumentTypeRepository;
import com.aayush.lad.hrms.modules.travel.repositories.TravelPlanRepository;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class DocumentTypeService {

    private final DocumentTypeRepository documentTypeRepository;
    private final TravelPlanRepository travelPlanRepository;
    private final DocumentTypeMapper documentTypeMapper;

    public void create(CreateDocumentTypeRequest request) {
        if (documentTypeRepository.existsByName(request.getName()))
            throw new ConflictException("Document type with name '" + request.getName() + "' already exists");

        DocumentType documentType = documentTypeMapper.create(request);
        documentTypeRepository.save(documentType);
    }

    public List<DocumentTypeResponse> getAll() {
        List<DocumentType> documentTypes = documentTypeRepository.findAll();
        return documentTypeMapper.toResponseList(documentTypes);
    }

    public void update(UpdateDocumentTypeRequest request) {
        DocumentType documentType = documentTypeRepository.findById(request.getId()).orElse(null);

        if (documentType == null)
            throw new NotFoundException("Document type not found");

        if (!documentType.getName().equals(request.getName())
                && documentTypeRepository.existsByName(request.getName())) {
            throw new ConflictException("document type with name '" + request.getName() + "' already exists");
        }

        documentTypeMapper.update(request, documentType);
        documentTypeRepository.save(documentType);
    }

    public void delete(UUID id) {
        if (!documentTypeRepository.existsById(id))
            throw new NotFoundException("Document type not found");

        if (travelPlanRepository.existsByDocumentTypeId(id))
            throw new ConflictException(
                    "Cannot delete document type as it is associated with existing travel plan documents");

        // TODO: soft delete
        documentTypeRepository.deleteById(id);
    }
}
