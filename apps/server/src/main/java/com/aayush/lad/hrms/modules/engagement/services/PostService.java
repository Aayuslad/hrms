package com.aayush.lad.hrms.modules.engagement.services;

import java.util.List;
import java.util.UUID;

import com.aayush.lad.hrms.core.exeptions.CustomAccessDeniedException;
import com.aayush.lad.hrms.core.services.FileUploadService;
import com.aayush.lad.hrms.modules.user.services.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aayush.lad.hrms.core.exeptions.ConflictException;
import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.modules.engagement.dtos.read.PostResponse;
import com.aayush.lad.hrms.modules.engagement.dtos.write.CreateCommentRequest;
import com.aayush.lad.hrms.modules.engagement.dtos.write.CreatePostRequest;
import com.aayush.lad.hrms.modules.engagement.dtos.write.UpdateCommentRequest;
import com.aayush.lad.hrms.modules.engagement.dtos.write.UpdatePostRequest;
import com.aayush.lad.hrms.modules.engagement.mappers.PostMapper;
import com.aayush.lad.hrms.modules.engagement.models.Post;
import com.aayush.lad.hrms.modules.engagement.models.PostComment;
import com.aayush.lad.hrms.modules.engagement.models.PostImage;
import com.aayush.lad.hrms.modules.engagement.repositories.PostCommentRepository;
import com.aayush.lad.hrms.modules.engagement.repositories.PostRepository;
import com.aayush.lad.hrms.modules.user.models.User;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostCommentRepository postCommentRepository;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;
    private final FileUploadService fileUploadService;
    private final PostMapper mapper;

    public List<PostResponse> getAll() {
        List<Post> posts = postRepository.findAllOrderByCreatedAtDesc();
        return mapper.toResponseList(posts);
    }

    public PostResponse getOne(UUID postId) {
        Post post = getPostEntityById(postId);
        return mapper.toResponse(post);
    }

    @Transactional
    public void create(CreatePostRequest request) {
        Post post = mapper.create(request);

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            var urls = request.getImages().stream()
                    .map(fileUploadService::uploadFile)
                    .toList();
            var images = urls.stream()
                    .map(u -> PostImage.builder().docUrl(u).post(post).build())
                    .toList();
            post.getImages().clear();
            post.getImages().addAll(images);
        }

        postRepository.save(post);
    }

    @Transactional
    public void update(UpdatePostRequest request) {
        Post post = getPostEntityById(request.getId());

        if (!currentUserService.getUsername().equals(post.getAuthor().getUserName())) {
            throw new CustomAccessDeniedException();
        }


        if (request.getDeletedImageIds() != null && !request.getDeletedImageIds().isEmpty()) {
            for (UUID id : request.getDeletedImageIds()) {
                PostImage img = post.getImages().stream()
                        .filter(i -> i.getId().equals(id))
                        .findFirst().orElse(null);
                if (img != null) {
                    fileUploadService.deleteFileByURL(img.getDocUrl());
                }
            }
            post.getImages().removeIf(i -> request.getDeletedImageIds().contains(i.getId()));
        }

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            var urls = request.getImages().stream()
                    .map(fileUploadService::uploadFile)
                    .toList();
            var images = urls.stream()
                    .map(u -> PostImage.builder().docUrl(u).post(post).build())
                    .toList();
            post.getImages().addAll(images);
        }

        mapper.update(request, post);
        postRepository.save(post);
    }

    @Transactional
    public void delete(UUID postId) {
        Post post = getPostEntityById(postId);

        if (!currentUserService.getUsername().equals(post.getAuthor().getUserName()) && !currentUserService.isUserAdminOrHR()) {
            throw new CustomAccessDeniedException();
        }

        User currentUser = currentUserService.getCurrentUserEntity();
        if (!currentUser.getId().equals(post.getAuthor().getId())) {
            String message = "Your post with title '" + post.getTitle() + "' was deleted by " + currentUser.getUserName();
            notificationService.createNotification(post.getAuthor().getId(), message);
        }

        if (post.getImages() != null) {
            post.getImages().forEach(img -> fileUploadService.deleteFileByURL(img.getDocUrl()));
        }

        postRepository.delete(post);
    }

    @Transactional
    public void like(UUID postId) {
        Post post = getPostEntityById(postId);
        User currentUser = currentUserService.getCurrentUserEntity();

        if (post.getLikedBy().contains(currentUser)) {
            throw new ConflictException("Post already liked");
        }

        post.getLikedBy().add(currentUser);
        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);
    }

    @Transactional
    public void unlike(UUID postId) {
        Post post = getPostEntityById(postId);
        User currentUser = currentUserService.getCurrentUserEntity();

        if (!post.getLikedBy().contains(currentUser)) {
            throw new ConflictException("Post not liked");
        }

        post.getLikedBy().remove(currentUser);
        post.setLikeCount(post.getLikeCount() - 1);
        postRepository.save(post);
    }

    @Transactional
    public void createComment(UUID postId, CreateCommentRequest request) {
        Post post = getPostEntityById(postId);
        PostComment comment = mapper.createComment(request, post);
        postCommentRepository.save(comment);

        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);
    }

    @Transactional
    public void updateComment(UUID postId, UUID commentId, UpdateCommentRequest request) {
        PostComment comment = getCommentEntityById(commentId);

        if (!currentUserService.getUsername().equals(comment.getAuthor().getUserName())) {
            throw new CustomAccessDeniedException();
        }

        mapper.updateComment(request, comment);
        postCommentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(UUID postId, UUID commentId) {
        PostComment comment = getCommentEntityById(commentId);
        User currentUser = currentUserService.getCurrentUserEntity();

        if (!currentUserService.getUsername().equals(comment.getAuthor().getUserName()) && !currentUserService.isUserAdminOrHR()) {
            throw new CustomAccessDeniedException();
        }

        if (!currentUser.getId().equals(comment.getAuthor().getId())) {
            String message = "Your comment on post '" + comment.getPost().getTitle() + "' was deleted by " + currentUser.getUserName();
            notificationService.createNotification(comment.getAuthor().getId(), message);
        }

        Post post = comment.getPost();
        post.getComments().remove(comment);
        post.setCommentCount(post.getCommentCount() - 1);
        postRepository.save(post);

        postCommentRepository.delete(comment);
    }

    @Transactional
    public void likeComment(UUID postId, UUID commentId) {
        PostComment comment = getCommentEntityById(commentId);
        User currentUser = currentUserService.getCurrentUserEntity();

        if (comment.getLikedBy().contains(currentUser)) {
            throw new ConflictException("Comment already liked");
        }

        comment.getLikedBy().add(currentUser);
        comment.setLikeCount(comment.getLikeCount() + 1);
        postCommentRepository.save(comment);
    }

    @Transactional
    public void unlikeComment(UUID postId, UUID commentId) {
        PostComment comment = getCommentEntityById(commentId);
        User currentUser = currentUserService.getCurrentUserEntity();

        if (!comment.getLikedBy().contains(currentUser)) {
            throw new ConflictException("Comment not liked");
        }

        comment.getLikedBy().remove(currentUser);
        comment.setLikeCount(comment.getLikeCount() - 1);
        postCommentRepository.save(comment);
    }

    private Post getPostEntityById(UUID id) {
        Post post = postRepository.findByIdWithAll(id).orElse(null);
        if (post == null)
            throw new NotFoundException("Post not found");
        return post;
    }

    private PostComment getCommentEntityById(UUID id) {
        PostComment comment = postCommentRepository.findByIdWithAll(id).orElse(null);
        if (comment == null)
            throw new NotFoundException("Comment not found");
        return comment;
    }
}
