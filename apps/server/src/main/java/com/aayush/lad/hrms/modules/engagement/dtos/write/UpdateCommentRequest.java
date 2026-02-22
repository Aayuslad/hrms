package com.aayush.lad.hrms.modules.engagement.dtos.write;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCommentRequest {

    private UUID id;

    @NotBlank(message = "Content cannot be empty")
    private String content;
}
