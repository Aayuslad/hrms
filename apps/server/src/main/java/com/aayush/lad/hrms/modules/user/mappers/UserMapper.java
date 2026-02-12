package com.aayush.lad.hrms.modules.user.mappers;

import com.aayush.lad.hrms.modules.user.dtos.user.read.NotificationResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.UserDetailResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.UserSummaryResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.write.CreateUserProfileRequest;
import com.aayush.lad.hrms.modules.user.dtos.user.write.RegisterUserRequest;
import com.aayush.lad.hrms.modules.user.dtos.user.write.UpdateUserBySelfRequest;
import com.aayush.lad.hrms.modules.user.dtos.user.write.UpdateUserByAdminRequest;
import com.aayush.lad.hrms.modules.user.models.Notification;
import com.aayush.lad.hrms.modules.user.models.Profile;
import com.aayush.lad.hrms.modules.user.models.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final ModelMapper modelMapper;  

    public User toEntity(RegisterUserRequest request) {
        return modelMapper.map(request, User.class);
    }

    public UserDetailResponse toDetailResponse(User user) {
        return modelMapper.map(user, UserDetailResponse.class);
    }

    public UserSummaryResponse toSummaryResponse(User user) {
        return modelMapper.map(user, UserSummaryResponse.class);
    }

    public List<UserDetailResponse> toDetailResponseList(List<User> users) {
        return users.stream()
                .map(this::toDetailResponse)
                .toList();
    }

    public Page<UserSummaryResponse> toSummaryResponseList(Page<User> users) {
        return users.map(x ->
                modelMapper.map(x, UserSummaryResponse.class)
        );
    }

    public Profile toEntity(CreateUserProfileRequest request) {
        return modelMapper.map(request, Profile.class);
    }

    public User updateEntity(UpdateUserBySelfRequest request, User user) {
        modelMapper.map(request, user);
        return user;
    }

    public User updateEntity(UpdateUserByAdminRequest request, User user) {
        modelMapper.map(request, user);
        return user;
    }

    public List<NotificationResponse> toNotificationResponseList(List<Notification> notifications) {
        return notifications.stream().map(x ->
                modelMapper.map(x, NotificationResponse.class)
        ).toList();
    }
}
