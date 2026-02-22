package com.aayush.lad.hrms.modules.user.dtos.user.read.internal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeOrgChartNodeResponse {
    private UUID userId;
    private String username;
    private String firstName;
    private String lastName;
    private String designation;
    private String department;
    private List<EmployeeOrgChartNodeResponse> manages;
    private String avatarUrl;
}
