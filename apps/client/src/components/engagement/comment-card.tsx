import { Dot, Heart, MoreHorizontal } from 'lucide-react';
import { UserProfileDialog } from '@/components/auth/user-profile-dialog';

import {
    useLikeComment,
    useUnlikeComment,
    type Post,
} from '@/api/engagement-api';
import { useGetMe } from '@/api/user-api';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { useAccessChecker } from '@/hooks/use-has-access';

type Comment = NonNullable<Post['comments']>[number];

type CommentCardProps = {
    readonly comment: Comment;
    readonly postId: string;
    readonly onEditClick: (comment: Comment) => void;
    readonly onDeleteClick: (comment: Comment) => void;
};

export function CommentCard({
    comment,
    postId,
    onEditClick,
    onDeleteClick,
}: CommentCardProps) {
    const { data: currentUser } = useGetMe();
    const likeMutation = useLikeComment();
    const unlikeMutation = useUnlikeComment();
    const [isLiked, setIsLiked] = useState(comment.liked ?? false);
    const canAccess = useAccessChecker();

    const isAuthor = currentUser?.id === comment.author?.id;

    console.log(currentUser?.id, comment.author?.id, isAuthor);

    const handleLike = () => {
        if (isLiked) {
            unlikeMutation.mutate({ postId, commentId: comment.id! });
            setIsLiked(false);
        } else {
            likeMutation.mutate({ postId, commentId: comment.id! });
            setIsLiked(true);
        }
    };

    return (
        <div className="flex gap-3">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-muted-foreground ml-1 flex items-center">
                        <UserProfileDialog userId={comment.author?.id!}>
                            <span className="underline cursor-pointer">
                                {comment.author?.userName}
                            </span>
                        </UserProfileDialog>

                        <Dot />
                        <div>
                            {new Date(comment.createdAt!).toLocaleDateString()}
                        </div>
                    </p>
                    {(isAuthor || canAccess(['Admin', 'HR'])) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {isAuthor && (
                                    <DropdownMenuItem
                                        onClick={() => onEditClick(comment)}
                                    >
                                        Edit
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    onClick={() => onDeleteClick(comment)}
                                    className="text-destructive"
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
                <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm">{comment.content}</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`text-xs h-auto py-1 px-2 ${
                            isLiked ? 'text-red-500' : ''
                        }`}
                        onClick={handleLike}
                        disabled={
                            likeMutation.isPending || unlikeMutation.isPending
                        }
                    >
                        <Heart
                            className={`h-3 w-3 mr-1 ${
                                isLiked ? 'fill-current' : ''
                            }`}
                        />
                        {comment.likeCount}
                    </Button>
                </div>
            </div>
        </div>
    );
}
