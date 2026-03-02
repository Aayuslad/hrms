import { Send } from 'lucide-react';

import {
    useCreateComment,
    useGetPost,
    type Post
} from '@/api/engagement-api';
import { useGetMe } from '@/api/user-api';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { CommentCard } from './comment-card';
import { DeleteCommentDialog } from './dialogs/delete-comment-dialog';
import { UpdateCommentDialog } from './dialogs/update-comment-dialog';

type Comment = NonNullable<Post['comments']>[number];

type CommentsSheetProps = {
    postId?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function CommentsSheet({
    postId,
    open,
    onOpenChange,
}: Readonly<CommentsSheetProps>) {
    const { data: currentUser } = useGetMe();
    const createCommentMutation = useCreateComment();
    const [newComment, setNewComment] = useState('');
    const { data: post } = useGetPost(postId);
    const [selectedComment, setSelectedComment] = useState<Comment | null>(
        null
    );
    const [updateOpen, setUpdateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleSubmitComment = () => {
        if (!post?.id || !newComment.trim()) return;
        createCommentMutation.mutate(
            { postId: post.id, payload: { content: newComment.trim() } },
            {
                onSuccess: () => {
                    setNewComment('');
                },
            }
        );
    };

    const handleEditComment = (comment: Comment) => {
        setSelectedComment(comment);
        setUpdateOpen(true);
    };

    const handleDeleteComment = (comment: Comment) => {
        setSelectedComment(comment);
        setDeleteOpen(true);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[450px] sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Comments</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-full px-3 pb-3">
                    <div className="flex-1 overflow-y-auto space-y-4">
                        {post?.comments?.map((comment) => (
                            <CommentCard
                                key={comment.id}
                                comment={comment}
                                postId={post.id!}
                                onEditClick={handleEditComment}
                                onDeleteClick={handleDeleteComment}
                            />
                        ))}
                        {(!post?.comments || post.comments.length === 0) && (
                            <p className="text-center text-muted-foreground py-8">
                                No comments yet. Be the first to comment!
                            </p>
                        )}
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                    {currentUser?.userName?.[0]?.toUpperCase() ||
                                        'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-2">
                                <Textarea
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) =>
                                        setNewComment(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSubmitComment();
                                        }
                                    }}
                                />
                                <Button
                                    size="sm"
                                    onClick={handleSubmitComment}
                                    disabled={
                                        !newComment.trim() ||
                                        createCommentMutation.isPending
                                    }
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
            <UpdateCommentDialog
                comment={selectedComment}
                postId={post?.id || ''}
                open={updateOpen}
                onOpenChange={setUpdateOpen}
            />
            <DeleteCommentDialog
                comment={selectedComment}
                postId={post?.id || ''}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </Sheet>
    );
}
