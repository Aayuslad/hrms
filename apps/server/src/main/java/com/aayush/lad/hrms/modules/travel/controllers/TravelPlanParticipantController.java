package com.aayush.lad.hrms.modules.travel.controllers;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.ParticipantResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateExpenseRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateDocumentRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.UpdateExpenseRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.UpdateDocumentRequest;
import com.aayush.lad.hrms.modules.travel.services.TravelPlanDocumentService;
import com.aayush.lad.hrms.modules.travel.services.TravelPlanExpenseService;
import com.aayush.lad.hrms.modules.travel.services.TravelPlanService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/travel-plans")
@AllArgsConstructor
public class TravelPlanParticipantController {

    private final TravelPlanService travelPlanService;
    private final TravelPlanExpenseService travelPlanExpenseService;
    private final TravelPlanDocumentService travelPlanDocumentsService;

    @GetMapping("/{travelPlanId}/participant/{participantId}")
    public ResponseEntity<Result<ParticipantResponse>> getParticipant(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID participantId) {
        ParticipantResponse response = travelPlanService.getTravelParticipant(travelPlanId, participantId);
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PostMapping(value = "/{travelPlanId}/participant/{participantId}/expenses", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Result<Void>> createExpense(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID participantId,
            @Valid @ModelAttribute CreateExpenseRequest request) {
        request.setTravelPlanId(travelPlanId);
        request.setParticipantId(participantId);
        travelPlanExpenseService.createExpense(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    @PutMapping(value = "/{travelPlanId}/participant/{participantId}/expenses/{expenseId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Result<Void>> updateExpense(
            @PathVariable UUID expenseId,
            @PathVariable UUID travelPlanId,
            @Valid @ModelAttribute UpdateExpenseRequest request) {
        request.setId(expenseId);
        request.setTravelPlanId(travelPlanId);
        travelPlanExpenseService.updateExpense(request);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @DeleteMapping("/{travelPlanId}/participant/{participantId}/expenses/{expenseId}")
    public ResponseEntity<Result<Void>> deleteExpense(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID participantId,
            @PathVariable UUID expenseId) {
        travelPlanExpenseService.deleteExpense(travelPlanId, participantId, expenseId);
        return ResultMapper.handle(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/{travelPlanId}/participant/{participantId}/expenses/{expenseId}/submit")
    public ResponseEntity<Result<Void>> submitExpense(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID expenseId) {
        travelPlanExpenseService.submitExpense(travelPlanId, expenseId);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PostMapping(value = "/{travelPlanId}/participant/{participantId}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Result<Void>> createDocument(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID participantId,
            @Valid @ModelAttribute CreateDocumentRequest request) {

        request.setTravelPlanId(travelPlanId);
        if (request.getOwnerId() == null)
            request.setOwnerId(participantId);

        travelPlanDocumentsService.createDocument(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    @PutMapping(value = "/{travelPlanId}/participant/{participantId}/documents/{documentId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Result<Void>> updateDocument(
            @PathVariable UUID documentId,
            @PathVariable UUID travelPlanId,
            @Valid @ModelAttribute UpdateDocumentRequest request) {
        request.setId(documentId);
        request.setTravelPlanId(travelPlanId);
        travelPlanDocumentsService.updateDocument(request);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @DeleteMapping("/{travelPlanId}/participant/{participantId}/documents/{documentId}")
    public ResponseEntity<Result<Void>> deleteDocument(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID documentId) {
        travelPlanDocumentsService.deleteDocument(travelPlanId, documentId);
        return ResultMapper.handle(HttpStatus.NO_CONTENT);
    }
}
