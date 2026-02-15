package com.aayush.lad.hrms.modules.user.models;

import com.aayush.lad.hrms.modules.user.dtos.department.write.UpdateDepartmentRequest;
import com.aayush.lad.hrms.shared.base_models.AuditableModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "departments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Department extends AuditableModel {

    @Column(nullable = false, unique = true)
    private String name;

    public void update(UpdateDepartmentRequest request) {
        this.name = request.getName();
    }
}
