package com.aayush.lad.hrms.modules.user.dtos.user.write;

import java.util.UUID;

import com.aayush.lad.hrms.modules.user.dtos.user.write.internal.UpdateUserProfileByAdminRequest;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserByAdminRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

//    private MultipartFile avatar;

    private UpdateUserProfileByAdminRequest profile;
}
