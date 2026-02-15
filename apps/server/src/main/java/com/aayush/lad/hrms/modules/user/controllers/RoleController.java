package com.aayush.lad.hrms.modules.user.controllers;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.modules.user.dtos.role.read.RoleResponse;
import com.aayush.lad.hrms.modules.user.services.RoleService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@AllArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<Result<List<RoleResponse>>> getAll() {
        List<RoleResponse> response = roleService.getAll();
        return ResultMapper.handle(HttpStatus.OK, response);
    }
}
