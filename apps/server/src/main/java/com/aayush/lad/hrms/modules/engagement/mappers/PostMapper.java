package com.aayush.lad.hrms.modules.engagement.mappers;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.modules.engagement.dtos.read.PostResponse;
import com.aayush.lad.hrms.modules.engagement.dtos.write.CreateCommentRequest;
import com.aayush.lad.hrms.modules.engagement.dtos.write.CreatePostRequest;
import com.aayush.lad.hrms.modules.engagement.dtos.write.UpdateCommentRequest;
import com.aayush.lad.hrms.modules.engagement.dtos.write.UpdatePostRequest;
import com.aayush.lad.hrms.modules.engagement.models.Post;
import com.aayush.lad.hrms.modules.engagement.models.PostComment;
import com.aayush.lad.hrms.modules.engagement.models.Tag;
import com.aayush.lad.hrms.modules.engagement.repositories.TagRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PostMapper {

    private final ModelMapper modelMapper;
    private final TagRepository tagRepository;
    private final CurrentUserService currentUserService;

    public Post create(CreatePostRequest request) {
        Post post = modelMapper.map(request, Post.class);

        post.setAuthor(currentUserService.getCurrentUserEntity());

        post.getTags().clear();

        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            List<Tag> tags = tagRepository.findAllById(request.getTagIds());
            post.getTags().addAll(tags);
        }

        return post;
    }

    public void update(UpdatePostRequest request, Post existing) {
        modelMapper.map(request, existing);

        existing.setUpdatedBy(currentUserService.getCurrentUserEntity());

        // Update tags
        existing.getTags().clear();
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            List<Tag> tags = tagRepository.findAllById(request.getTagIds());
            existing.getTags().addAll(tags);
        }
    }

    public PostResponse toResponse(Post post) {
        PostResponse response = modelMapper.map(post, PostResponse.class);

        var currentUser = currentUserService.getCurrentUserEntity();
        response.setLiked(post.getLikedBy() != null && post.getLikedBy().contains(currentUser));

        for (var commentResponse : response.getComments()) {
            var comment = post.getComments().stream()
                    .filter(c -> c.getId().equals(commentResponse.getId()))
                    .findFirst().orElse(null);

            commentResponse.setLiked(
                    comment != null && comment.getLikedBy() != null && comment.getLikedBy().contains(currentUser));
        }

        return response;
    }

    public List<PostResponse> toResponseList(List<Post> posts) {
        return posts.stream().map(this::toResponse).toList();
    }

    public PostComment createComment(CreateCommentRequest request, Post post) {
        PostComment comment = modelMapper.map(request, PostComment.class);

        comment.setAuthor(currentUserService.getCurrentUserEntity());
        comment.setPost(post);

        return comment;
    }

    public void updateComment(UpdateCommentRequest request, PostComment existing) {
        modelMapper.map(request, existing);
    }
}