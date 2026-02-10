package com.aayush.lad.hrms.modules.travel.controllers;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.ParticipantResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ParticipantExpenseResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateExpenseRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateTravelPlanDocumentRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.UpdateExpenseRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.UpdateTravelPlanDocumentRequest;
import com.aayush.lad.hrms.modules.travel.services.TravelPlanService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/travel-plans")
@AllArgsConstructor
public class TravelPlanParticipantController {

    private final TravelPlanService travelPlanService;

    @GetMapping("/{travelPlanId}/participant/{participantId}")
    public ResponseEntity<Result<ParticipantResponse>> getParticipant(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID participantId) {
        ParticipantResponse response = travelPlanService.getTravelParticipant(travelPlanId, participantId);
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PostMapping("/{travelPlanId}/participant/{participantId}/expenses")
    public ResponseEntity<Result<Void>> createExpense(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID participantId,
            @Valid @RequestBody CreateExpenseRequest request) {
        request.setTravelPlanId(travelPlanId);
        request.setParticipantId(participantId);
        travelPlanService.createExpense(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    @PutMapping("/{travelPlanId}/participant/{participantId}/expenses/{expenseId}")
    public ResponseEntity<Result<ParticipantExpenseResponse>> updateExpense(
            @PathVariable UUID expenseId,
            @Valid @RequestBody UpdateExpenseRequest request) {
        request.setId(expenseId);
        ParticipantExpenseResponse response = travelPlanService.updateExpense(request);
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @DeleteMapping("/{travelPlanId}/participant/{participantId}/expenses/{expenseId}")
    public ResponseEntity<Result<Void>> deleteExpense(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID participantId,
            @PathVariable UUID expenseId) {
        travelPlanService.deleteExpense(travelPlanId, participantId, expenseId);
        return ResultMapper.handle(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/{travelPlanId}/participant/{participantId}/expenses/{expenseId}/submit")
    public ResponseEntity<Result<ParticipantExpenseResponse>> submitExpense(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID participantId,
            @PathVariable UUID expenseId) {
        ParticipantExpenseResponse response = travelPlanService.submitExpense(travelPlanId, participantId, expenseId);
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PostMapping("/{travelPlanId}/participant/{participantId}/documents")
    public ResponseEntity<Result<Void>> createDocument(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID participantId,
            @Valid @RequestBody CreateTravelPlanDocumentRequest request) {

        request.setTravelPlanId(travelPlanId);
        if (request.getOwnerId() == null)
            request.setOwnerId(participantId);

        travelPlanService.createDocument(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    @PutMapping("/{travelPlanId}/participant/{participantId}/documents/{documentId}")
    public ResponseEntity<Result<Void>> updateDocument(
            @PathVariable UUID documentId,
            @Valid @RequestBody UpdateTravelPlanDocumentRequest request) {
        request.setId(documentId);
        travelPlanService.updateDocument(request);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @DeleteMapping("/{travelPlanId}/participant/{participantId}/documents/{documentId}")
    public ResponseEntity<Result<Void>> deleteDocument(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID participantId,
            @PathVariable UUID documentId) {
        travelPlanService.deleteDocument(travelPlanId, participantId, documentId);
        return ResultMapper.handle(HttpStatus.NO_CONTENT);
    }
}
