package com.aayush.lad.hrms.modules.travel.mappers;

import com.aayush.lad.hrms.modules.travel.dtos.document_type.read.DocumentTypeResponse;
import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.modules.travel.dtos.document_type.write.CreateDocumentTypeRequest;
import com.aayush.lad.hrms.modules.travel.dtos.document_type.write.UpdateDocumentTypeRequest;
import com.aayush.lad.hrms.modules.travel.models.DocumentType;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;


import java.util.List;

@Component
@RequiredArgsConstructor
public class DocumentTypeMapper {

    private final ModelMapper modelMapper;
    private final CurrentUserService currentUserService;

    public DocumentType create(CreateDocumentTypeRequest request) {
        DocumentType dt = modelMapper.map(request, DocumentType.class);
        dt.setCreatedBy(currentUserService.getCurrentUserEntity());
        return dt;
    }

    public void update(UpdateDocumentTypeRequest request, DocumentType existing) {
        modelMapper.map(request, existing);
        existing.setUpdatedBy(currentUserService.getCurrentUserEntity());
    }

    public DocumentTypeResponse toResponse(DocumentType documentType) {
        return modelMapper.map(documentType, DocumentTypeResponse.class);
    }

    public List<DocumentTypeResponse> toResponseList(List<DocumentType> documentTypes) {
        return documentTypes.stream()
                .map(this::toResponse)
                .toList();
    }
}
