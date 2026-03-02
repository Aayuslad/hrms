package com.aayush.lad.hrms.modules.engagement.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aayush.lad.hrms.core.exeptions.ConflictException;
import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.modules.engagement.dtos.read.TagResponse;
import com.aayush.lad.hrms.modules.engagement.dtos.write.CreateTagRequest;
import com.aayush.lad.hrms.modules.engagement.dtos.write.UpdateTagRequest;
import com.aayush.lad.hrms.modules.engagement.mappers.TagMapper;
import com.aayush.lad.hrms.modules.engagement.models.Tag;
import com.aayush.lad.hrms.modules.engagement.repositories.PostRepository;
import com.aayush.lad.hrms.modules.engagement.repositories.TagRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final PostRepository postRepository;
    private final TagMapper mapper;

    public List<TagResponse> getAll() {
        List<Tag> tags = tagRepository.findAll();
        return mapper.toResponseList(tags);
    }

    public TagResponse getOne(UUID tagId) {
        Tag tag = getTagEntityById(tagId);
        return mapper.toResponse(tag);
    }

    @Transactional
    public void create(CreateTagRequest request) {
        if (tagRepository.findByName(request.getName()).isPresent()) {
            throw new ConflictException("Tag with this name already exists");
        }

        Tag tag = mapper.create(request);
        tagRepository.save(tag);
    }

    @Transactional
    public void update(UpdateTagRequest request) {
        Tag tag = getTagEntityById(request.getId());

        if (!tag.getName().equals(request.getName()) && tagRepository.findByName(request.getName()).isPresent()) {
            throw new ConflictException("Tag with this name already exists");
        }

        mapper.update(request, tag);
        tagRepository.save(tag);
    }

    @Transactional
    public void delete(UUID tagId) {
        Tag tag = getTagEntityById(tagId);
        postRepository.deleteTagFromJoinTable(tagId);
        tagRepository.delete(tag);
    }

    private Tag getTagEntityById(UUID id) {
        Tag tag = tagRepository.findById(id).orElse(null);
        if (tag == null)
            throw new NotFoundException("Tag not found");
        return tag;
    }
}
