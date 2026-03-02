package com.aayush.lad.hrms.modules.engagement.dtos.read.internal;

import com.aayush.lad.hrms.shared.dtos.GlobalUserResponseSummary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostCommentResponse {

    private UUID id;

    private GlobalUserResponseSummary author;

    private String content;

    private long likeCount;

    private boolean isLiked;

    private LocalDateTime createdAt;

    private List<GlobalUserResponseSummary> likedBy;
}
