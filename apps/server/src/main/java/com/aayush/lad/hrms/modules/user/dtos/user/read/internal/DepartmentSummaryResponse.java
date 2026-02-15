package com.aayush.lad.hrms.modules.user.dtos.user.read.internal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentSummaryResponse {

    private UUID id;

    private String name;
}
