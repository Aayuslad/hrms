package com.aayush.lad.hrms.modules.user.dtos.designation.write;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateDesignationRequest {

    @NotNull(message = "Designation ID cannot be blank")
    private UUID id;

    @NotBlank(message = "Designation name cannot be blank")
    private String name;
}
