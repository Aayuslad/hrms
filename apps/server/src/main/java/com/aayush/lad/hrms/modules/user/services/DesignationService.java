package com.aayush.lad.hrms.modules.user.services;

import com.aayush.lad.hrms.core.exeptions.ConflictException;
import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.modules.user.dtos.designation.read.DesignationResponse;
import com.aayush.lad.hrms.modules.user.dtos.designation.write.CreateDesignationRequest;
import com.aayush.lad.hrms.modules.user.dtos.designation.write.UpdateDesignationRequest;
import com.aayush.lad.hrms.modules.user.mappers.DesignationMapper;
import com.aayush.lad.hrms.modules.user.models.Designation;
import com.aayush.lad.hrms.modules.user.repositories.DesignationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class DesignationService {

    private final DesignationRepository designationRepository;
    private final DesignationMapper designationMapper;

    public void create(CreateDesignationRequest request) {
        if (designationRepository.existsByName(request.getName()))
            throw new ConflictException("Designation with name '" + request.getName() + "' already exists");

        Designation designation = designationMapper.create(request);
        designationRepository.save(designation);
    }

    public List<DesignationResponse> getAll() {
        List<Designation> designations = designationRepository.findAll();
        return designationMapper.toResponseList(designations);
    }

    public void update(UpdateDesignationRequest request) {
        Designation designation = designationRepository.findById(request.getId()).orElse(null);
        if (designation == null) throw new NotFoundException("Designation not found");

        if (!designation.getName().equals(request.getName()) &&
                designationRepository.existsByName(request.getName())) {
            throw new ConflictException("Designation with name '" + request.getName() + "' already exists");
        }

        designation.update(request);
        designationRepository.save(designation);
    }

    public void delete(UUID id) {
        if (!designationRepository.existsById(id)) throw new NotFoundException("Designation not found");
        // TODO: soft delete
        designationRepository.deleteById(id);
    }
}
