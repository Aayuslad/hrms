package com.aayush.lad.hrms.modules.engagement.mappers;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.modules.engagement.dtos.read.TagResponse;
import com.aayush.lad.hrms.modules.engagement.dtos.write.CreateTagRequest;
import com.aayush.lad.hrms.modules.engagement.dtos.write.UpdateTagRequest;
import com.aayush.lad.hrms.modules.engagement.models.Tag;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TagMapper {

    private final ModelMapper modelMapper;
    private final CurrentUserService currentUserService;

    public Tag create(CreateTagRequest request) {
        Tag tag = modelMapper.map(request, Tag.class);

        tag.setCreatedBy(currentUserService.getCurrentUserEntity());

        return tag;
    }

    public void update(UpdateTagRequest request, Tag existing) {
        modelMapper.map(request, existing);

        existing.setUpdatedBy(currentUserService.getCurrentUserEntity());
    }

    public TagResponse toResponse(Tag tag) {
        return modelMapper.map(tag, TagResponse.class);
    }

    public List<TagResponse> toResponseList(List<Tag> tags) {
        return tags.stream().map(this::toResponse).toList();
    }
}