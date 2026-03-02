package com.aayush.lad.hrms.modules.engagement.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.modules.engagement.dtos.read.TagResponse;
import com.aayush.lad.hrms.modules.engagement.dtos.write.CreateTagRequest;
import com.aayush.lad.hrms.modules.engagement.dtos.write.UpdateTagRequest;
import com.aayush.lad.hrms.modules.engagement.services.TagService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("api/engagement/tags")
public class TagController {

    private final TagService tagService;

    @PreAuthorize("hasRole('Employee')")
    @GetMapping
    public ResponseEntity<Result<List<TagResponse>>> getAll() {
        List<TagResponse> response = tagService.getAll();
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PreAuthorize("hasRole('Employee')")
    @GetMapping("/{id}")
    public ResponseEntity<Result<TagResponse>> get(@PathVariable UUID id) {
        TagResponse response = tagService.getOne(id);
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PreAuthorize("hasRole('Employee')")
    @PostMapping
    public ResponseEntity<Result<Void>> create(@Valid @RequestBody CreateTagRequest request) {
        tagService.create(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    @PutMapping("/{id}")
    public ResponseEntity<Result<Void>> update(@PathVariable("id") UUID id,
                                               @Valid @RequestBody UpdateTagRequest request) {
        request.setId(id);
        tagService.update(request);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Result<Void>> delete(@PathVariable UUID id) {
        tagService.delete(id);
        return ResultMapper.handle(HttpStatus.OK);
    }
}
