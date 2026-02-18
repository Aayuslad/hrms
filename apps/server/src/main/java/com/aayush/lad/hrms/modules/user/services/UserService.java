package com.aayush.lad.hrms.modules.user.services;

import com.aayush.lad.hrms.core.exeptions.ConflictException;
import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.exeptions.UnauthorisedException;
import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.modules.user.dtos.user.read.NotificationResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.UserDetailResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.UserSummaryResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.write.*;
import com.aayush.lad.hrms.modules.user.mappers.UserMapper;
import com.aayush.lad.hrms.modules.user.models.Notification;
import com.aayush.lad.hrms.modules.user.models.Profile;
import com.aayush.lad.hrms.modules.user.models.Role;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.repositories.DepartmentRepository;
import com.aayush.lad.hrms.modules.user.repositories.DesignationRepository;
import com.aayush.lad.hrms.modules.user.repositories.RoleRepository;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;

    private final UserMapper userMapper;
    private final CurrentUserService currentUserService;
    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserDetailResponse registerUser(RegisterUserRequest request) {
        if (userRepository.existsByUserName(request.getUserName()))
            throw new ConflictException("Username already exists");

        if (userRepository.existsByEmail(request.getEmail()))
            throw new ConflictException("Email already exists");

        User newUser = userMapper.create(request);
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(newUser);

        return userMapper.toDetailResponse(savedUser);
    }

    public UserDetailResponse loginUser(LoginUserRequest request) {
        User user = userRepository.findByUserNameOrEmail(
                request.getEmailOrUserName(),
                request.getEmailOrUserName()
        ).orElse(null);
        if (user == null) throw new NotFoundException("User not found with given email or username");

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash()))
            throw new UnauthorisedException("Invalid password");

        return userMapper.toDetailResponse(user);
    }

    public void createProfile(CreateUserProfileRequest request) {
        User user = userRepository.findByUserName(currentUserService.getUsername()).orElse(null);
        if (user == null) throw new UnauthorisedException("User does not exist");

        Profile profile = userMapper.create(request);
//        profile.setAvatarUrl(fileUploadService.uploadFile(request.getAvatar()));
        profile.setUser(user);
        user.setProfile(profile);

        userRepository.save(user);
    }

    public UserDetailResponse getCurrentUser() {
        User user = userRepository.findByUserName(currentUserService.getUsername()).orElse(null);
        if (user == null) throw new UnauthorisedException();
        return userMapper.toDetailResponse(user);
    }

    public UserDetailResponse getUserById(UUID id) {
        User user = this.getUserEntityById(id);
        return userMapper.toDetailResponse(user);
    }

    public void update(UpdateUserBySelfRequest request) {
        User user = currentUserService.getCurrentUserEntity();

        userMapper.update(request, user);
//        if (request.getAvatar() != null) {
//            fileUploadService.deleteFileByURL(user.getProfile().getAvatarUrl());
//            updatedUser.getProfile().setAvatarUrl(fileUploadService.uploadFile(request.getAvatar()));
//        }

        userRepository.save(user);
    }

    public void update(UpdateUserByAdminRequest request) {
        User user = this.getUserEntityById(request.getUserId());

        userMapper.update(request, user);

        user.getProfile().setUser(user);
        UUID departmentId = request.getProfile().getDepartmentId();
        UUID designationId = request.getProfile().getDesignationId();
        UUID mangerId = request.getProfile().getManagerId();

        if (departmentId != null) {
            departmentRepository.findById(departmentId)
                    .ifPresent(value -> user.getProfile().setDepartment(value));
        }
        if (designationId != null) {
            designationRepository.findById(designationId)
                    .ifPresent(value -> user.getProfile().setDesignation(value));
        }
        if (mangerId != null) {
            userRepository.findById(mangerId)
                    .ifPresent(value -> user.getProfile().setManager(value));
        }

//        if (request.getAvatar() != null) {
//            fileUploadService.deleteFileByURL(user.getProfile().getAvatarUrl());
//            updatedUser.getProfile().setAvatarUrl(fileUploadService.uploadFile(request.getAvatar()));
//        }

        userRepository.save(user);
    }

    public List<NotificationResponse> getRecentNotifications() {
        User user = currentUserService.getCurrentUserEntity();

        List<Notification> notifications = userRepository.fetchAllNotifications(user.getId());

        return userMapper.toNotificationResponseList(notifications);
    }

    public List<UserSummaryResponse> getUsersSummary() {
        List<User> users = userRepository.findAll();
        return users.stream().map(x -> UserSummaryResponse
                .builder()
                .id(x.getId())
                .email(x.getEmail())
                .userName(x.getUserName())
//                .firstName(x.getProfile().getFirstName())
//                .lastName(x.getProfile().getLastName())
//                .avatarUrl(x.getProfile().getLastName())
                .build()
        ).toList();
    }

    public void updateUserRoles(UpdateUserRolesRequest request) {
        User user = this.getUserEntityById(request.getUserId());

        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            List<Role> roles = roleRepository.findAllById(request.getRoles());
            user.getRoles().addAll(roles);
        }

        userRepository.save(user);
    }

    private User getUserEntityById(UUID id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) throw new NotFoundException("User not found");

        return user;
    }
}
