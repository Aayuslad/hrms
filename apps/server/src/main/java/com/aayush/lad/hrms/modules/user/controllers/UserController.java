package com.aayush.lad.hrms.modules.user.controllers;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.core.security.JwtUtil;
import com.aayush.lad.hrms.modules.user.dtos.user.read.NotificationResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.OrgCharts;
import com.aayush.lad.hrms.modules.user.dtos.user.read.UserDetailResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.write.*;
import com.aayush.lad.hrms.modules.user.services.UserService;
import com.aayush.lad.hrms.shared.dtos.GlobalUserResponseSummary;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    @PreAuthorize("hasRole('Employee')")
    @PutMapping("/me/notifications/mark-as-read")
    public ResponseEntity<Result<Void>> markNotificationsAsRead(
            @Valid @RequestBody MarkNotificationsReadRequest request) {
        userService.markNotificationsAsRead(request.getNotificationIds());
        return ResultMapper.handle(HttpStatus.OK, "Notifications marked as read");
    }

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

    @GetMapping("/me")
    public ResponseEntity<Result<UserDetailResponse>> getMe() {
        UserDetailResponse responseDto = userService.getCurrentUser();
        return ResultMapper.handle(HttpStatus.OK, responseDto);
    }

    @PreAuthorize("hasRole('Employee')")
    @GetMapping("/{id}")
    public ResponseEntity<Result<UserDetailResponse>> getUserById(@PathVariable("id") UUID id) {
        UserDetailResponse responseDto = userService.getUserById(id);
        return ResultMapper.handle(HttpStatus.OK, responseDto);
    }

    // @PostMapping(value = "/profile", consumes =
    // MediaType.MULTIPART_FORM_DATA_VALUE)
    @PostMapping("/profile")
    public ResponseEntity<Result<Void>> createProfile(
            @Valid @RequestBody CreateUserProfileRequest request) {
        userService.createProfile(request);
        return ResultMapper.handle(HttpStatus.CREATED, "Profile created");
    }

    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Result<Void>> updateBySelf(
            @Valid @ModelAttribute UpdateUserBySelfRequest request) {
        userService.update(request);
        return ResultMapper.handle(HttpStatus.CREATED, "User updated");
    }

    // @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    public ResponseEntity<Result<Void>> updateByAdmin(
            @PathVariable("id") UUID id,
            @Valid @RequestBody UpdateUserByAdminRequest request) {
        request.setUserId(id);
        userService.update(request);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('Employee')")
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

    @PreAuthorize("hasRole('Employee')")
    @GetMapping("/summary")
    public ResponseEntity<Result<List<GlobalUserResponseSummary>>> getUsersSummary() {
        List<GlobalUserResponseSummary> responseDto = userService.getUsersSummary();
        return ResultMapper.handle(HttpStatus.OK, responseDto);
    }

    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    @GetMapping("/details")
    public ResponseEntity<Result<List<UserDetailResponse>>> getAllUsersDetails() {
        List<UserDetailResponse> responseDto = userService.getAllUsersDetails();
        return ResultMapper.handle(HttpStatus.OK, responseDto);
    }

    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    @PutMapping("/{id}/roles")
    public ResponseEntity<Result<Void>> updateRoles(
            @PathVariable("id") UUID id,
            @Valid @RequestBody UpdateUserRolesRequest request) {
        request.setUserId(id);
        userService.updateUserRoles(request);
        return ResultMapper.handle(HttpStatus.OK, "User roles updated");
    }

    @PreAuthorize("hasRole('Employee')")
    @GetMapping("/org-charts")
    public ResponseEntity<Result<OrgCharts>> getOrgCharts(
            @RequestParam(value = "userId", required = false) UUID userId) {
        OrgCharts responseDto;
        if (userId == null) {
            responseDto = userService.getOrgCharts();
        } else {
            responseDto = userService.getOrgCharts(userId);
        }
        return ResultMapper.handle(HttpStatus.OK, responseDto);
    }
}
