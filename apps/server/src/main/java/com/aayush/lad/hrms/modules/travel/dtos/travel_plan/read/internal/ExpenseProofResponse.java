package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseProofResponse {

    private UUID id;

    private String docUrl;
}
