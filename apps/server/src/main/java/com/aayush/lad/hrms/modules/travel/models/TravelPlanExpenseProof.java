package com.aayush.lad.hrms.modules.travel.models;

import com.aayush.lad.hrms.shared.base_models.BaseModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "travel_plan_expense_proof")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TravelPlanExpenseProof extends BaseModel {

    @Column(nullable = false)
    private String docUrl;

    @ManyToOne
    @JoinColumn(name = "travel_plan_expense_id", nullable = false)
    private TravelPlanExpense expense;
}
