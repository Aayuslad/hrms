package com.aayush.lad.hrms.shared.base_models;

import java.time.LocalDateTime;

import com.aayush.lad.hrms.modules.user.models.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
public abstract class SoftDeletableModel extends BaseModel {
    private LocalDateTime deletedAt;

    @ManyToOne
    @JoinColumn(name = "deleted_by_id")
    @JsonIgnore
    private User deletedBy;
}
