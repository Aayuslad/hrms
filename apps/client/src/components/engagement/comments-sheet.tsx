import { Send, Heart } from 'lucide-react';

import { useGetMe } from '@/api/user-api';
import {
    useCreateComment,
    useLikeComment,
    useUnlikeComment,
    type Post,
} from '@/api/engagement-api';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useState } from 'react';

type CommentsSheetProps = {
    readonly post: Post | null;
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
};

export function CommentsSheet({
    post,
    open,
    onOpenChange,
}: CommentsSheetProps) {
    const { data: currentUser } = useGetMe();
    const createCommentMutation = useCreateComment();
    const likeCommentMutation = useLikeComment();
    const unlikeCommentMutation = useUnlikeComment();
    const [newComment, setNewComment] = useState('');

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

    const handleLikeComment = (commentId: string) => {
        if (!post?.id) return;
        likeCommentMutation.mutate({ postId: post.id, commentId });
    };

    const handleUnlikeComment = (commentId: string) => {
        if (!post?.id) return;
        unlikeCommentMutation.mutate({ postId: post.id, commentId });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[400px] sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Comments</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-full px-3 pb-3">
                    <div className="flex-1 overflow-y-auto space-y-4">
                        {post?.comments?.map((comment) => {
                            const isUserLiked = (comment as any).likedBy?.some(
                                (user: any) => user?.id === currentUser?.id
                            );
                            return (
                                <div key={comment.id} className="flex gap-3">
                                    {/* <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            {comment.author?.userName?.[0]?.toUpperCase() || 'U'}
                                        </AvatarFallback atarFallback>
                                    </Avatar> */}
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground mb-1 ml-1">
                                            {comment.author?.userName} •{' '}
                                            {new Date(
                                                comment.createdAt!
                                            ).toLocaleDateString()}
                                        </p>
                                        <div className="bg-muted rounded-lg p-3">
                                            <p className="text-sm">
                                                {comment.content}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`text-xs h-auto py-1 px-2 ${
                                                    isUserLiked
                                                        ? 'text-red-500'
                                                        : ''
                                                }`}
                                                onClick={() => {
                                                    if (isUserLiked) {
                                                        handleUnlikeComment(
                                                            comment.id!
                                                        );
                                                    } else {
                                                        handleLikeComment(
                                                            comment.id!
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    likeCommentMutation.isPending ||
                                                    unlikeCommentMutation.isPending
                                                }
                                            >
                                                <Heart
                                                    className={`h-3 w-3 mr-1 ${
                                                        isUserLiked
                                                            ? 'fill-current'
                                                            : ''
                                                    }`}
                                                />
                                                {comment.likeCount}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
                                <Input
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
        </Sheet>
    );
}
