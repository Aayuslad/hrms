package com.aayush.lad.hrms.modules.travel.controllers;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.modules.travel.dtos.document_type.read.DocumentTypeResponse;
import com.aayush.lad.hrms.modules.travel.dtos.document_type.write.CreateDocumentTypeRequest;
import com.aayush.lad.hrms.modules.travel.dtos.document_type.write.UpdateDocumentTypeRequest;
import com.aayush.lad.hrms.modules.travel.services.DocumentTypeService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/document-types")
@AllArgsConstructor
public class DocumentTypeController {

    private final DocumentTypeService documentTypeService;

    @PreAuthorize("hasRole('Employee')")
    @GetMapping
    public ResponseEntity<Result<List<DocumentTypeResponse>>> getAll() {
        List<DocumentTypeResponse> response = documentTypeService.getAll();
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    @PostMapping
    public ResponseEntity<Result<Void>> create(
            @Valid @RequestBody CreateDocumentTypeRequest request) {
        documentTypeService.create(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    @PutMapping("/{id}")
    public ResponseEntity<Result<Void>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateDocumentTypeRequest request) {
        request.setId(id);
        documentTypeService.update(request);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Result<Void>> delete(@PathVariable UUID id) {
        documentTypeService.delete(id);
        return ResultMapper.handle(HttpStatus.NO_CONTENT);
    }
}
