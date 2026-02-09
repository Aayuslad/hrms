package com.aayush.lad.hrms.modules.travel.mappers;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ExpenseCategoryMapper {

    private final ModelMapper modelMapper;
}
