package com.aayush.lad.hrms.modules.travel.services;

import com.aayush.lad.hrms.modules.travel.repositories.ExpenseCategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ExpenseCategoryService {

    private final ExpenseCategoryRepository expenseCategoryRepository;
}
