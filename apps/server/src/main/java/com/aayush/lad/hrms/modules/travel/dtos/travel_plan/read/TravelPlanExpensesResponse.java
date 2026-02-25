package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read;

import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ParticipantExpenseResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TravelPlanExpensesResponse {

    private List<ParticipantExpenseResponse> expenses;

    private float total;
}