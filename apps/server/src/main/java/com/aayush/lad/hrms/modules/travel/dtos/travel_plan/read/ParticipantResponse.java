package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ParticipantDocumentResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ParticipantExpenseResponse;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantResponse {

    private UUID id;

    private String userName;

    private List<ParticipantDocumentResponse> documents;

    private List<ParticipantExpenseResponse> expenses;
}
