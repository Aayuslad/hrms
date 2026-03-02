package com.aayush.lad.hrms.modules.user.dtos.user.write;

import com.aayush.lad.hrms.modules.user.dtos.user.write.internal.UpdateProfileBySelfRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserBySelfRequest {

    private UpdateProfileBySelfRequest profile;

    private MultipartFile avatar;

    private List<UUID> gameInterests = new ArrayList<>();
}
