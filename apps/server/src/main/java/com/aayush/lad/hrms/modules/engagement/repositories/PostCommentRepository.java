package com.aayush.lad.hrms.modules.engagement.repositories;

import com.aayush.lad.hrms.modules.engagement.models.PostComment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, UUID> {

    @EntityGraph(attributePaths = {
            "author",
            "likedBy"
    })
    @Query("select pc from PostComment pc where pc.id = :id")
    Optional<PostComment> findByIdWithAll(@Param("id") UUID id);
}