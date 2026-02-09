package com.aayush.lad.hrms.modules.travel.controllers;

import com.aayush.lad.hrms.modules.travel.services.ExpenseCategoryService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/expense-categories")
@AllArgsConstructor
public class ExpenseCategoryController {

    private final ExpenseCategoryService expenseCategoryService;
}
