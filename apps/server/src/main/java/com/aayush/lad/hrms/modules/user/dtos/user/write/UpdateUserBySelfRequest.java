package com.aayush.lad.hrms.modules.user.dtos.user.write;

import java.util.ArrayList;
import java.util.List;

import com.aayush.lad.hrms.modules.user.dtos.user.write.internal.GameInterestRequest;
import com.aayush.lad.hrms.modules.user.dtos.user.write.internal.UpdateProfileBySelfRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserBySelfRequest {

    private UpdateProfileBySelfRequest profile;

//    private MultipartFile avatar;

    private List<GameInterestRequest> gameInterests = new ArrayList<>();
}
