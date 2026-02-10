package com.aayush.lad.hrms.modules.user.mappers;

import com.aayush.lad.hrms.modules.user.dtos.designation.read.DesignationResponse;
import com.aayush.lad.hrms.modules.user.dtos.designation.write.CreateDesignationRequest;
import com.aayush.lad.hrms.modules.user.dtos.designation.write.UpdateDesignationRequest;
import com.aayush.lad.hrms.modules.user.models.Designation;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DesignationMapper {

    private final ModelMapper modelMapper;
    
    public Designation toEntity(CreateDesignationRequest request) {
        return modelMapper.map(request, Designation.class);
    }

    public Designation toEntity(UpdateDesignationRequest request) {
        return modelMapper.map(request, Designation.class);
    }

    public DesignationResponse toResponse(Designation designation) {
        return modelMapper.map(designation, DesignationResponse.class);
    }

    public List<DesignationResponse> toResponseList(List<Designation> designations) {
        return designations.stream()
                .map(this::toResponse)
                .toList();
    }
}
