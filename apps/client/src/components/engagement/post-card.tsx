import { Heart, MessageCircle } from 'lucide-react';

import { useLikePost, useUnlikePost, type Post } from '@/api/engagement-api';
import { useGetMe } from '@/api/user-api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useAccessChecker } from '@/hooks/use-has-access';

type PostCardProps = {
    readonly post: Post;
    readonly onCommentClick: (post: Post) => void;
    readonly onEditClick: (post: Post) => void;
    readonly onDeleteClick: (post: Post) => void;
};

export function PostCard({
    post,
    onCommentClick,
    onEditClick,
    onDeleteClick,
}: PostCardProps) {
    const { data: currentUser } = useGetMe();
    const likeMutation = useLikePost();
    const unlikeMutation = useUnlikePost();
    const [isLiked, setIsLiked] = useState(post.liked ?? false);
    const canAccess = useAccessChecker();

    const isAuthor = currentUser?.id === post.author?.id;

    const handleLike = () => {
        if (isLiked) {
            unlikeMutation.mutate(post.id!);
            setIsLiked(false);
        } else {
            likeMutation.mutate(post.id!);
            setIsLiked(true);
        }
    };

    return (
        <Card className="w-[600px] pb-3 px-0 gap-3 bg-transparent shadow-xl/30 rounded-lg">
            <CardHeader className="">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <CardTitle className="text-lg">
                                {post.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {post.author?.userName} •{' '}
                                {new Date(post.createdAt!).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

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
                                        onClick={() => onEditClick(post)}
                                    >
                                        Edit
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    onClick={() => onDeleteClick(post)}
                                    className="text-destructive"
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>
            <CardContent className="">
                <p className="text-sm">{post.content}</p>
                {post.tags && post.tags.length > 0 && (
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag) => (
                            <Badge key={tag.id} variant="secondary">
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex  items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLike}
                        className={isLiked ? 'text-red-500' : ''}
                    >
                        <Heart
                            className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`}
                        />
                        {post.likeCount}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCommentClick(post)}
                    >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.commentCount}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
