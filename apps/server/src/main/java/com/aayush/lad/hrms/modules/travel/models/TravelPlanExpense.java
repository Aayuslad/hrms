package com.aayush.lad.hrms.modules.travel.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.aayush.lad.hrms.modules.travel.enums.ExpenseStatus;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.shared.base_models.BaseModel;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "travel_plan_expenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TravelPlanExpense extends BaseModel {

    @Column(nullable = false)
    private float amount;

    private LocalDate date;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ExpenseStatus status = ExpenseStatus.DRAFTING;

    private String remarks;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime submittedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "travel_plan_id", nullable = false)
    private TravelPlan travelPlan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expence_category_id", nullable = false)
    private ExpenseCategory expenseCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_id")
    private User approvedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id", nullable = false)
    private User participant;

    @OneToMany(mappedBy = "expense", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<TravelPlanExpenseProof> proofs = new HashSet<>();
}
