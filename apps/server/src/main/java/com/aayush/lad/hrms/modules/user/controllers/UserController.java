package com.aayush.lad.hrms.modules.user.controllers;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.core.security.JwtUtil;
import com.aayush.lad.hrms.modules.user.dtos.user.read.NotificationResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.UserDetailResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.UserSummaryResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.write.*;
import com.aayush.lad.hrms.modules.user.services.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Result<UserDetailResponse>> register(
            @Valid @RequestBody RegisterUserRequest request,
            HttpServletResponse response) {
        UserDetailResponse responseDto = userService.registerUser(request);
        jwtUtil.issueAccessTokenCookie(responseDto.getUserName(), response);

        return ResultMapper.handle(HttpStatus.CREATED, responseDto);
    }

    @PostMapping("/login")
    public ResponseEntity<Result<UserDetailResponse>> login(
            @Valid @RequestBody LoginUserRequest request,
            HttpServletResponse response) {
        UserDetailResponse responseDto = userService.loginUser(request);
        jwtUtil.issueAccessTokenCookie(responseDto.getUserName(), response);

        return ResultMapper.handle(HttpStatus.CREATED, responseDto);
    }

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

    @PostMapping("/profile")
    public ResponseEntity<Result<UserDetailResponse>> createProfile(@Valid @RequestBody CreateUserProfileRequest request) {
        UserDetailResponse responseDto = userService.createProfile(request);
        return ResultMapper.handle(HttpStatus.CREATED, responseDto);
    }

    @PutMapping("/me")
    public ResponseEntity<Result<UserDetailResponse>> updateBySelf(@Valid @RequestBody UpdateUserBySelfRequest request) {
        UserDetailResponse responseDto = userService.update(request);
        return ResultMapper.handle(HttpStatus.CREATED, responseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Result<UserDetailResponse>> updateByAdmin(@PathVariable("id") UUID id, @Valid @RequestBody UpdateUserByAdminRequest request) {
        request.setUserId(id);
        UserDetailResponse responseDto = userService.update(request);
        return ResultMapper.handle(HttpStatus.CREATED, responseDto);
    }

    @GetMapping("/me/notifications")
    public ResponseEntity<Result<Page<NotificationResponse>>> getNotifications(Pageable pageable) {
        Page<NotificationResponse> responseDto = userService.getRecentNotifications(pageable);
        return  ResultMapper.handle(HttpStatus.OK, responseDto);
    }

    @PostMapping("/logout")
    public ResponseEntity<Result<Void>> logout(HttpServletResponse response) {
        jwtUtil.removeAccessTokenCookie(response);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @GetMapping("/summary")
    public ResponseEntity<Page<UserSummaryResponse>> getUsersSummary(Pageable pageable) {
        Page<UserSummaryResponse> responseDto = userService.getUsersSummary(pageable);
        return ResponseEntity.ok(responseDto);
    }
}
