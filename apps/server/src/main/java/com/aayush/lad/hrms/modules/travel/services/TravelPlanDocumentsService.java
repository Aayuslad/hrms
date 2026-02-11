package com.aayush.lad.hrms.modules.travel.services;

import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.security.CurrentUserUtil;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateTravelPlanDocumentRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.UpdateTravelPlanDocumentRequest;
import com.aayush.lad.hrms.modules.travel.mappers.TravelPlanMapper;
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
public class TravelPlanDocumentsService {
    private final TravelPlanRepository travelPlanRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final UserRepository userRepository;

    private final TravelPlanMapper travelPlanMapper;
    private final CurrentUserUtil currentUserUtil;

    public void createDocument(CreateTravelPlanDocumentRequest request) {
        TravelPlan travelPlan = travelPlanRepository.findById(request.getTravelPlanId()).orElse(null);
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        User owner = userRepository.findById(request.getOwnerId()).orElse(null);
        if (owner == null)
            throw new NotFoundException("Owner not found");

        DocumentType dt = documentTypeRepository.findById(request.getDocumentTypeId()).orElse(null);
        if (dt == null)
            throw new NotFoundException("Document type not found");

        String username = currentUserUtil.getUsername();
        User uploadedBy = userRepository.findByUserName(username).orElse(null);

        TravelPlanDocument doc = travelPlanMapper.toDocumentEntity(request, travelPlan, owner, dt, uploadedBy);

        travelPlan.getTravelPlanDocuments().add(doc);
        travelPlanRepository.save(travelPlan);
    }

    public void updateDocument(UpdateTravelPlanDocumentRequest request) {
        TravelPlan travelPlan = travelPlanRepository.findByIdWithAll(request.getTravelPlanId()).orElse(null);
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        TravelPlanDocument target = travelPlan.getTravelPlanDocuments().stream()
                .filter(d -> d.getId().equals(request.getId()))
                .findFirst().orElse(null);
        if (target == null)
            throw new NotFoundException("Document not found");

        User owner = userRepository.findById(request.getOwnerId()).orElse(null);
        if (owner == null)
            throw new NotFoundException("Owner not found");

        DocumentType dt = documentTypeRepository.findById(request.getDocumentTypeId()).orElse(null);
        if (dt == null)
            throw new NotFoundException("Document type not found");

        target.setOwner(owner);
        target.setDocumentType(dt);

        travelPlanRepository.save(travelPlan);
    }

    public void deleteDocument(UUID travelPlanId, UUID participantId, UUID documentId) {
        TravelPlan travelPlan = travelPlanRepository.findById(travelPlanId).orElse(null);
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        boolean removed = travelPlan.getTravelPlanDocuments()
                .removeIf(d ->
                        d.getId().equals(documentId) &&
                                d.getOwner() != null && d.getOwner().getId().equals(participantId)
                );

        if (!removed)
            throw new NotFoundException("Document not found");

        travelPlanRepository.save(travelPlan);
    }
}
