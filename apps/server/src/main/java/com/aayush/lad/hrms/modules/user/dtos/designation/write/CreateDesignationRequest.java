package com.aayush.lad.hrms.modules.user.dtos.designation.write;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateDesignationRequest {

    @NotBlank(message = "Designation name cannot be blank")
    private String name;
}
