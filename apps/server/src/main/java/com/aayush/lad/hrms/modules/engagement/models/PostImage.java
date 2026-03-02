package com.aayush.lad.hrms.modules.engagement.models;

import com.aayush.lad.hrms.shared.base_models.BaseModel;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "post_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostImage extends BaseModel {

    @Column(nullable = false)
    private String docUrl;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
}
