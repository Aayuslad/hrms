package com.aayush.lad.hrms.modules.user.mappers;

import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.modules.user.dtos.user.read.NotificationResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.UserDetailResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.UserSummaryResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.write.CreateUserProfileRequest;
import com.aayush.lad.hrms.modules.user.dtos.user.write.RegisterUserRequest;
import com.aayush.lad.hrms.modules.user.dtos.user.write.UpdateUserByAdminRequest;
import com.aayush.lad.hrms.modules.user.dtos.user.write.UpdateUserBySelfRequest;
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
    public final CurrentUserService currentUserService;

    public User create(RegisterUserRequest request) {
        return modelMapper.map(request, User.class);
    }

    public UserDetailResponse toDetailResponse(User user) {
        return modelMapper.map(user, UserDetailResponse.class);
    }

    public List<UserSummaryResponse> toSummaryResponseList(List<User> users) {
        return users.stream().map(x ->
                modelMapper.map(x, UserSummaryResponse.class)
        ).toList();
    }

    public Profile create(CreateUserProfileRequest request) {
        return modelMapper.map(request, Profile.class);
    }

    public void update(UpdateUserBySelfRequest request, User existing) {
        modelMapper.map(request, existing);
        existing.setUpdatedBy(currentUserService.getCurrentUserEntity());
    }

    public void update(UpdateUserByAdminRequest request, User existing) {
        modelMapper.map(request, existing);
        existing.setUpdatedBy(currentUserService.getCurrentUserEntity());
    }

    public List<NotificationResponse> toNotificationResponseList(List<Notification> notifications) {
        return notifications.stream().map(x ->
                modelMapper.map(x, NotificationResponse.class)
        ).toList();
    }
}
