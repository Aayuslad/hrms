package com.aayush.lad.hrms.modules.engagement.dtos.read;

import com.aayush.lad.hrms.modules.engagement.dtos.read.internal.PostCommentResponse;
import com.aayush.lad.hrms.shared.dtos.GlobalUserResponseSummary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponse {

    private UUID id;

    private String title;

    private String content;

    private GlobalUserResponseSummary author;

    private long likeCount;

    private long commentCount;

    private List<TagResponse> tags = new ArrayList<>();

    private List<PostCommentResponse> comments = new ArrayList<>();

    private boolean isLiked;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private GlobalUserResponseSummary createdBy;

    private GlobalUserResponseSummary updatedBy;
}
