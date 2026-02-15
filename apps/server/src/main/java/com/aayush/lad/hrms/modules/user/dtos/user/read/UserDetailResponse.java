package com.aayush.lad.hrms.modules.user.dtos.user.read;

import com.aayush.lad.hrms.modules.user.dtos.user.read.internal.GameInterestResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.internal.ProfileResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.internal.UserRoleResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailResponse {

    private UUID id;

    private String email;

    private String userName;

    private ProfileResponse profile;

    private Set<UserRoleResponse> roles = new HashSet<>();

    private Set<GameInterestResponse> interestedInGames = new HashSet<>();
}
