package com.aayush.lad.hrms.modules.engagement.repositories;

import com.aayush.lad.hrms.modules.engagement.models.Post;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {

    @EntityGraph(attributePaths = {
            "author",
            "tags",
            "comments.author",
            "likedBy",
            "images"
    })
    @Query("select p from Post p where p.id = :id")
    Optional<Post> findByIdWithAll(@Param("id") UUID id);

    @EntityGraph(attributePaths = {
            "author",
            "tags",
            "images"
    })
    @Query("select p from Post p order by p.createdAt desc")
    java.util.List<Post> findAllOrderByCreatedAtDesc();

    @Modifying
    @Query(value = "DELETE FROM post_tags WHERE tag_id = :tagId", nativeQuery = true)
    void deleteTagFromJoinTable(UUID tagId);
}
