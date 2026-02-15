package com.aayush.lad.hrms.modules.user.dtos.department.write;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateDepartmentRequest {

    @NotNull(message = "Department ID cannot be blank")
    private UUID id;

    @NotBlank(message = "Department name cannot be blank")
    private String name;
}
