package com.aayush.lad.hrms.shared.base_models;

import com.aayush.lad.hrms.modules.user.models.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
public abstract class AuditableModel extends SoftDeletableModel {

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "updated_by_id")
    private User updatedBy;
}
