package com.aayush.lad.hrms.modules.engagement.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aayush.lad.hrms.core.exeptions.ConflictException;
import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.exeptions.UnauthorisedException;
import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.modules.engagement.dtos.read.PostResponse;
import com.aayush.lad.hrms.modules.engagement.dtos.write.CreateCommentRequest;
import com.aayush.lad.hrms.modules.engagement.dtos.write.CreatePostRequest;
import com.aayush.lad.hrms.modules.engagement.dtos.write.UpdateCommentRequest;
import com.aayush.lad.hrms.modules.engagement.dtos.write.UpdatePostRequest;
import com.aayush.lad.hrms.modules.engagement.mappers.PostMapper;
import com.aayush.lad.hrms.modules.engagement.models.Post;
import com.aayush.lad.hrms.modules.engagement.models.PostComment;
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
        postRepository.save(post);
    }

    @Transactional
    public void update(UpdatePostRequest request) {
        Post post = getPostEntityById(request.getId());
        mapper.update(request, post);
        postRepository.save(post);
    }

    @Transactional
    public void delete(UUID postId) {
        Post post = getPostEntityById(postId);
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
        User currentUser = currentUserService.getCurrentUserEntity();

        if (!comment.getAuthor().equals(currentUser) && !currentUser.getRoles().stream().anyMatch(role -> "Admin".equals(role.getName()) || "HR".equals(role.getName()))) {
            throw new UnauthorisedException("You can only update your own comments");
        }

        mapper.updateComment(request, comment);
        postCommentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(UUID postId, UUID commentId) {
        PostComment comment = getCommentEntityById(commentId);
        User currentUser = currentUserService.getCurrentUserEntity();

        if (!comment.getAuthor().equals(currentUser) && !currentUser.getRoles().stream().anyMatch(role -> "Admin".equals(role.getName()) || "HR".equals(role.getName()))) {
            throw new UnauthorisedException("You can only delete your own comments");
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
