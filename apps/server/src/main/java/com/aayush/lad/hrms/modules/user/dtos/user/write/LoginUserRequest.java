package com.aayush.lad.hrms.modules.user.dtos.user.write;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginUserRequest {

    @NotBlank(message = "Email or Username cannot be blank")
    private String emailOrUserName;

    @NotBlank(message = "Password cannot be blank")
    private String password;
}
