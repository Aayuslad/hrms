import { useGetPosts, type Post } from '@/api/engagement-api';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import { PostCard } from './post-card';
import { CommentsSheet } from './comments-sheet';
import { UpdatePostDialog } from './update-post-dialog';
import { DeletePostDialog } from './delete-post-dialog';

export function PostsList() {
    const { data: posts = [], isLoading, isError } = useGetPosts();
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleCommentClick = (post: Post) => {
        setSelectedPost(post);
        setCommentsOpen(true);
    };

    const handleEditClick = (post: Post) => {
        setSelectedPost(post);
        setUpdateOpen(true);
    };

    const handleDeleteClick = (post: Post) => {
        setSelectedPost(post);
        setDeleteOpen(true);
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        return <div>Error loading posts</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onCommentClick={handleCommentClick}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                />
            ))}

            <CommentsSheet
                post={selectedPost}
                open={commentsOpen}
                onOpenChange={setCommentsOpen}
            />

            <UpdatePostDialog
                post={selectedPost}
                open={updateOpen}
                onOpenChange={setUpdateOpen}
            />

            <DeletePostDialog
                post={selectedPost}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </div>
    );
}