package com.aayush.lad.hrms.modules.travel.models;

import com.aayush.lad.hrms.shared.base_models.AuditableModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "expense_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseCategory extends AuditableModel {

    @Column(nullable = false, unique = true)
    private String name;
}
