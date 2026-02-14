package com.aayush.lad.hrms.modules.travel.services;

import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.core.services.FileUploadService;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateDocumentRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.UpdateDocumentRequest;
import com.aayush.lad.hrms.modules.travel.models.DocumentType;
import com.aayush.lad.hrms.modules.travel.models.TravelPlan;
import com.aayush.lad.hrms.modules.travel.models.TravelPlanDocument;
import com.aayush.lad.hrms.modules.travel.repositories.DocumentTypeRepository;
import com.aayush.lad.hrms.modules.travel.repositories.TravelPlanRepository;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class TravelPlanDocumentService {
    private final TravelPlanRepository travelPlanRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final UserRepository userRepository;
    private final FileUploadService fileUploadService;

    private final CurrentUserService currentUserService;

    private TravelPlan requirePlan(UUID id, boolean withAll) {
        return withAll
                ? travelPlanRepository.findByIdWithAll(id).orElseThrow(() -> new NotFoundException("Travel plan not found"))
                : travelPlanRepository.findById(id).orElseThrow(() -> new NotFoundException("Travel plan not found"));
    }

    private TravelPlanDocument requireDocument(TravelPlan plan, UUID docId) {
        return plan.getTravelPlanDocuments().stream()
                .filter(d -> d.getId().equals(docId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Document not found"));
    }

    public void createDocument(CreateDocumentRequest request) {
        TravelPlan travelPlan = requirePlan(request.getTravelPlanId(), false);

        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new NotFoundException("Owner not found"));

        DocumentType dt = documentTypeRepository.findById(request.getDocumentTypeId())
                .orElseThrow(() -> new NotFoundException("Document type not found"));

        User uploadedBy = currentUserService.getCurrentUserEntity();

        TravelPlanDocument doc = new TravelPlanDocument();
        if (request.getDoc() != null) {
            doc.setDocUrl(fileUploadService.uploadFile(request.getDoc()));
        }
        doc.setOwner(owner);
        doc.setTravelPlan(travelPlan);
        doc.setDocumentType(dt);
        doc.setUploadedBy(uploadedBy);

        travelPlan.getTravelPlanDocuments().add(doc);
        travelPlanRepository.save(travelPlan);
    }

    public void updateDocument(UpdateDocumentRequest request) {
        TravelPlan travelPlan = requirePlan(request.getTravelPlanId(), true);
        TravelPlanDocument target = requireDocument(travelPlan, request.getId());

        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new NotFoundException("Owner not found"));

        DocumentType dt = documentTypeRepository.findById(request.getDocumentTypeId())
                .orElseThrow(() -> new NotFoundException("Document type not found"));

        if (request.getDoc() != null) {
            fileUploadService.deleteFileByURL(target.getDocUrl());
            target.setDocUrl(fileUploadService.uploadFile(request.getDoc()));
        }

        target.setOwner(owner);
        target.setDocumentType(dt);

        travelPlanRepository.save(travelPlan);
    }

    // FIX: document and the img on cloud both not deleting
    public void deleteDocument(UUID travelPlanId, UUID documentId) {
        TravelPlan travelPlan = travelPlanRepository.findById(travelPlanId).orElse(null);
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        TravelPlanDocument target = travelPlan.getTravelPlanDocuments().stream()
                .filter(x -> x.getId().equals(documentId)).findFirst().orElse(null);

        if (target == null)
            throw new NotFoundException("Document does not exist");

        fileUploadService.deleteFileByURL(target.getDocUrl());

        travelPlan.getTravelPlanDocuments().remove(target);

        travelPlanRepository.save(travelPlan);
    }
}
