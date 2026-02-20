package com.aayush.lad.hrms.modules.user.controllers;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;

import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.core.security.JwtUtil;
import com.aayush.lad.hrms.modules.user.dtos.user.read.NotificationResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.UserDetailResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.UserSummaryResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.write.CreateUserProfileRequest;
import com.aayush.lad.hrms.modules.user.dtos.user.write.LoginUserRequest;
import com.aayush.lad.hrms.modules.user.dtos.user.write.RegisterUserRequest;
import com.aayush.lad.hrms.modules.user.dtos.user.write.UpdateUserByAdminRequest;
import com.aayush.lad.hrms.modules.user.dtos.user.write.UpdateUserBySelfRequest;
import com.aayush.lad.hrms.modules.user.dtos.user.write.UpdateUserRolesRequest;
import com.aayush.lad.hrms.modules.user.services.UserService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Result<Void>> register(
            @Valid @RequestBody RegisterUserRequest request,
            HttpServletResponse response) {
        UserDetailResponse responseDto = userService.registerUser(request);
        jwtUtil.issueAccessTokenCookie(responseDto.getUserName(), response);
        return ResultMapper.handle(HttpStatus.CREATED, "Registered");
    }

    @PostMapping("/login")
    public ResponseEntity<Result<Void>> login(
            @Valid @RequestBody LoginUserRequest request,
            HttpServletResponse response) {
        UserDetailResponse responseDto = userService.loginUser(request);
        jwtUtil.issueAccessTokenCookie(responseDto.getUserName(), response);
        return ResultMapper.handle(HttpStatus.CREATED, "Logged in");
    }

    //    @PreAuthorize("hasRole('Employee')")
    @GetMapping("/me")
    public ResponseEntity<Result<UserDetailResponse>> getMe() {
        UserDetailResponse responseDto = userService.getCurrentUser();
        return ResultMapper.handle(HttpStatus.OK, responseDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Result<UserDetailResponse>> getUserById(@PathVariable("id") UUID id) {
        UserDetailResponse responseDto = userService.getUserById(id);
        return ResultMapper.handle(HttpStatus.OK, responseDto);
    }

    //    @PostMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PostMapping("/profile")
    public ResponseEntity<Result<Void>> createProfile(
            @Valid @RequestBody CreateUserProfileRequest request) {
        userService.createProfile(request);
        return ResultMapper.handle(HttpStatus.CREATED, "Profile created");
    }

    //    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PutMapping("/me")
    public ResponseEntity<Result<Void>> updateBySelf(
            @Valid @RequestBody UpdateUserBySelfRequest request) {
        userService.update(request);
        return ResultMapper.handle(HttpStatus.CREATED, "User updated");
    }

    //    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PutMapping("/{id}")
    public ResponseEntity<Result<Void>> updateByAdmin(
            @PathVariable("id") UUID id,
            @Valid @RequestBody UpdateUserByAdminRequest request) {
        request.setUserId(id);
        userService.update(request);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @GetMapping("/me/notifications")
    public ResponseEntity<Result<List<NotificationResponse>>> getNotifications() {
        List<NotificationResponse> responseDto = userService.getRecentNotifications();
        return ResultMapper.handle(HttpStatus.OK, responseDto);
    }

    @PostMapping("/logout")
    public ResponseEntity<Result<Void>> logout(HttpServletResponse response) {
        jwtUtil.removeAccessTokenCookie(response);
        return ResultMapper.handle(HttpStatus.OK, "Logged out");
    }

    @GetMapping("/summary")
    public ResponseEntity<Result<List<UserSummaryResponse>>> getUsersSummary() {
        List<UserSummaryResponse> responseDto = userService.getUsersSummary();
        return ResultMapper.handle(HttpStatus.OK, responseDto);
    }

    @GetMapping("/details")
    public ResponseEntity<Result<List<UserDetailResponse>>> getAllUsersDetails() {
        List<UserDetailResponse> responseDto = userService.getAllUsersDetails();
        return ResultMapper.handle(HttpStatus.OK, responseDto);
    }

    @PutMapping("/{id}/roles")
    public ResponseEntity<Result<Void>> updateRoles(
            @PathVariable("id") UUID id,
            @Valid @RequestBody UpdateUserRolesRequest request) {
        request.setUserId(id);
        userService.updateUserRoles(request);
        return ResultMapper.handle(HttpStatus.OK, "User roles updated");
    }
}
