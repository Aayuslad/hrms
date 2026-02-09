package com.aayush.lad.hrms.modules.user.dtos.user.write;

import java.util.List;

import com.aayush.lad.hrms.modules.user.dtos.user.write.internal.GameInterestRequest;
import com.aayush.lad.hrms.modules.user.dtos.user.write.internal.UpdateProfileBySelfRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserBySelfRequest {

    private UpdateProfileBySelfRequest profile;

    private List<GameInterestRequest> gameInterests;
}
