package com.aayush.lad.hrms.modules.user.dtos.user.read;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.aayush.lad.hrms.modules.user.dtos.user.read.internal.EmployeeOrgChartNodeResponse;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrgCharts {
    private List<EmployeeOrgChartNodeResponse> orgCharts;
}
