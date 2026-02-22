package com.aayush.lad.hrms.modules.engagement.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.modules.engagement.dtos.read.PostResponse;
import com.aayush.lad.hrms.modules.engagement.dtos.write.CreateCommentRequest;
import com.aayush.lad.hrms.modules.engagement.dtos.write.CreatePostRequest;
import com.aayush.lad.hrms.modules.engagement.dtos.write.UpdateCommentRequest;
import com.aayush.lad.hrms.modules.engagement.dtos.write.UpdatePostRequest;
import com.aayush.lad.hrms.modules.engagement.services.PostService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("api/engagement/posts")
public class PostController {

    private final PostService postService;

    @PreAuthorize("hasRole('Employee')")
    @GetMapping
    public ResponseEntity<Result<List<PostResponse>>> getAll() {
        List<PostResponse> response = postService.getAll();
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PreAuthorize("hasRole('Employee')")
    @GetMapping("/{id}")
    public ResponseEntity<Result<PostResponse>> get(@PathVariable UUID id) {
        PostResponse response = postService.getOne(id);
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PreAuthorize("hasRole('Employee')")
    @PostMapping
    public ResponseEntity<Result<Void>> create(@Valid @RequestBody CreatePostRequest request) {
        postService.create(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('Employee')")
    @PutMapping("/{id}")
    public ResponseEntity<Result<Void>> update(@PathVariable("id") UUID id,
            @Valid @RequestBody UpdatePostRequest request) {
        request.setId(id);
        postService.update(request);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('Employee')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Result<Void>> delete(@PathVariable UUID id) {
        postService.delete(id);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('Employee')")
    @PatchMapping("/{id}/like")
    public ResponseEntity<Result<Void>> like(@PathVariable("id") UUID id) {
        postService.like(id);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('Employee')")
    @PatchMapping("/{id}/unlike")
    public ResponseEntity<Result<Void>> unlike(@PathVariable("id") UUID id) {
        postService.unlike(id);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('Employee')")
    @PostMapping("/{id}/comment")
    public ResponseEntity<Result<Void>> createComment(@PathVariable("id") UUID id,
            @Valid @RequestBody CreateCommentRequest request) {
        postService.createComment(id, request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('Employee')")
    @PutMapping("/{postId}/comment/{commentId}")
    public ResponseEntity<Result<Void>> updateComment(@PathVariable("postId") UUID postId,
            @PathVariable("commentId") UUID commentId,
            @Valid @RequestBody UpdateCommentRequest request) {
        request.setId(commentId);
        postService.updateComment(postId, commentId, request);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('Employee')")
    @DeleteMapping("/{postId}/comment/{commentId}")
    public ResponseEntity<Result<Void>> deleteComment(@PathVariable("postId") UUID postId,
            @PathVariable("commentId") UUID commentId) {
        postService.deleteComment(postId, commentId);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('Employee')")
    @PatchMapping("/{postId}/comment/{commentId}/like")
    public ResponseEntity<Result<Void>> likeComment(@PathVariable("postId") UUID postId,
            @PathVariable("commentId") UUID commentId) {
        postService.likeComment(postId, commentId);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('Employee')")
    @PatchMapping("/{postId}/comment/{commentId}/unlike")
    public ResponseEntity<Result<Void>> unlikeComment(@PathVariable("postId") UUID postId,
            @PathVariable("commentId") UUID commentId) {
        postService.unlikeComment(postId, commentId);
        return ResultMapper.handle(HttpStatus.OK);
    }
}
