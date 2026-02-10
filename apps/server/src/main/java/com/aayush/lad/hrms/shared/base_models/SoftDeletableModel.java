package com.aayush.lad.hrms.shared.base_models;

import com.aayush.lad.hrms.modules.user.models.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import lombok.*;

import java.time.LocalDateTime;

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
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User deletedBy;
}
