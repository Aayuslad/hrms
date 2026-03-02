package com.aayush.lad.hrms.modules.engagement.dtos.write;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePostRequest {

    @NotBlank(message = "Title cannot be empty")
    private String title;

    private String content;

    private Set<UUID> tagIds = new HashSet<>();

    private List<MultipartFile> images;
}
