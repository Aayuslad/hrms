package com.aayush.lad.hrms.modules.user.services;

import com.aayush.lad.hrms.core.exeptions.ConflictException;
import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.exeptions.UnauthorisedException;
import com.aayush.lad.hrms.core.security.CurrentUserUtil;
import com.aayush.lad.hrms.core.services.FileUploadService;
import com.aayush.lad.hrms.modules.user.dtos.user.read.NotificationResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.UserDetailResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.UserSummaryResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.write.*;
import com.aayush.lad.hrms.modules.user.mappers.UserMapper;
import com.aayush.lad.hrms.modules.user.models.*;
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
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final RoleRepository roleRepository;
    private final FileUploadService fileUploadService;
    private final UserMapper userMapper;
    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final CurrentUserUtil currentUserUtil;

    public UserDetailResponse registerUser(RegisterUserRequest request) {
        if (userRepository.existsByUserName(request.getUserName())) {
            throw new ConflictException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already exists");
        }

        User newUser = new User();
        newUser.setUserName(request.getUserName());
        newUser.setEmail(request.getEmail());
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(newUser);

        return userMapper.toDetailResponse(savedUser);
    }

    public UserDetailResponse loginUser(LoginUserRequest request) {
        User user = userRepository.findByUserNameOrEmail(request.getEmailOrUserName(), request.getEmailOrUserName()).orElse(null);

        if (user == null) {
            throw new NotFoundException("User not found with given email or username");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new NotFoundException("Invalid password");
        }

        return userMapper.toDetailResponse(user);
    }

    public UserDetailResponse createProfile(CreateUserProfileRequest request) {
        User user = userRepository.findByUserName(currentUserUtil.getUsername()).orElse(null);

        if (user == null) {
            throw new UnauthorisedException("User does not exist");
        }

        Profile profile = userMapper.toEntity(request);
        profile.setAvatarUrl(fileUploadService.uploadFile(request.getAvatar()));
        profile.setUser(user);
        user.setProfile(profile);

        User savedUser = userRepository.save(user);

        return userMapper.toDetailResponse(savedUser);
    }

    public UserDetailResponse getCurrentUser() {

        User user = userRepository.findByUserName(currentUserUtil.getUsername()).orElse(null);

        if (user == null) {
            throw new UnauthorisedException("User not found");
        }

        return userMapper.toDetailResponse(user);
    }

    public UserDetailResponse getUserById(UUID id) {
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            throw new NotFoundException("User not found");
        }

        return userMapper.toDetailResponse(user);
    }

    public UserDetailResponse update(UpdateUserBySelfRequest request) {
        User user = userRepository.findByUserName(currentUserUtil.getUsername()).orElse(null);

        if (user == null) {
            throw new UnauthorisedException("User not found");
        }

        User updatedUser = userMapper.updateEntity(request, user);
//        if (request.getAvatar() != null) {
//            fileUploadService.deleteFileByURL(user.getProfile().getAvatarUrl());
//            updatedUser.getProfile().setAvatarUrl(fileUploadService.uploadFile(request.getAvatar()));
//        }

        User savedUser = userRepository.save(updatedUser);

        return userMapper.toDetailResponse(savedUser);
    }

    public UserDetailResponse update(UpdateUserByAdminRequest request) {
        User user = userRepository.findById(request.getUserId()).orElse(null);

        if (user == null) {
            throw new NotFoundException("User not found");
        }

        User updatedUser = userMapper.updateEntity(request, user);

        updatedUser.getProfile().setUser(user);
        UUID departmentId = request.getProfile().getDepartmentId();
        UUID designationId = request.getProfile().getDesignationId();
        UUID mangerId = request.getProfile().getManagerId();

        if (departmentId != null) {
            departmentRepository.findById(departmentId)
                    .ifPresent(value -> updatedUser.getProfile().setDepartment(value));
        }
        if (designationId != null) {
            designationRepository.findById(designationId)
                    .ifPresent(value -> updatedUser.getProfile().setDesignation(value));
        }
        if (mangerId != null) {
            userRepository.findById(mangerId)
                    .ifPresent(value -> updatedUser.getProfile().setManager(value));
        }

//        if (request.getAvatar() != null) {
//            fileUploadService.deleteFileByURL(user.getProfile().getAvatarUrl());
//            updatedUser.getProfile().setAvatarUrl(fileUploadService.uploadFile(request.getAvatar()));
//        }

        User savedUser = userRepository.save(updatedUser);

        return userMapper.toDetailResponse(savedUser);
    }

    public Page<NotificationResponse> getRecentNotifications(Pageable pageable) {
        User user = userRepository.findByUserName(currentUserUtil.getUsername()).orElse(null);

        if (user == null) {
            throw new UnauthorisedException("User not found");
        }

        Page<Notification> notifications = userRepository.findRecentNotifications(user.getId(), pageable);

        return userMapper.toNotificationResponseList(notifications);
    }

    public Page<UserSummaryResponse> getUsersSummary(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return userMapper.toSummaryResponseList(users);
    }

    public void updateUserRoles(UpdateUserRolesRequest request) {
        User user = userRepository.findById(request.getUserId()).orElse(null);

        if (user == null) {
            throw new NotFoundException("User not found");
        }

        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            List<Role> roles = roleRepository.findAllById(request.getRoles());
            user.getRoles().addAll(roles);
        }

        userRepository.save(user);
    }
}
