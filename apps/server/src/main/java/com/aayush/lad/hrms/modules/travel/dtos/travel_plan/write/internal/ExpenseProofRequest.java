package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.internal;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseProofRequest {

    @NotBlank(message = "proof doc can not be blank")
    private String docUrl;
}
