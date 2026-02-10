package com.aayush.lad.hrms.modules.travel.mappers;

import com.aayush.lad.hrms.modules.travel.dtos.document_type.write.CreateDocumentTypeRequest;
import com.aayush.lad.hrms.modules.travel.dtos.document_type.write.UpdateDocumentTypeRequest;
import com.aayush.lad.hrms.modules.travel.dtos.expense_category.read.ExpenseCategoryResponse;
import com.aayush.lad.hrms.modules.travel.dtos.expense_category.write.CreateExpenseCategoryRequest;
import com.aayush.lad.hrms.modules.travel.dtos.expense_category.write.UpdateExpenseCategoryRequest;
import com.aayush.lad.hrms.modules.travel.models.ExpenseCategory;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ExpenseCategoryMapper {

    private final ModelMapper modelMapper;

    public ExpenseCategory toEntity(CreateExpenseCategoryRequest request) {
        return modelMapper.map(request, ExpenseCategory.class);
    }

    public ExpenseCategory toEntity(UpdateExpenseCategoryRequest request) {
        return modelMapper.map(request, ExpenseCategory.class);
    }

    public ExpenseCategoryResponse toResponse(ExpenseCategory expenseCategory) {
        return modelMapper.map(expenseCategory, ExpenseCategoryResponse.class);
    }

    public List<ExpenseCategoryResponse> toResponseList(List<ExpenseCategory> expenseCategories) {
        return expenseCategories.stream()
                .map(this::toResponse)
                .toList();
    }
}
