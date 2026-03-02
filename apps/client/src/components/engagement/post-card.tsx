import { useLikePost, useUnlikePost, type Post } from '@/api/engagement-api';
import { useGetMe } from '@/api/user-api';
import { UserProfileDialog } from '@/components/auth/user-profile-dialog';
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
import { useAccessChecker } from '@/hooks/use-has-access';
import { Dot, Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from '@/components/ui/carousel';

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

    const [api, setApi] = useState<CarouselApi>();
    const [imgIndex, setImgIndex] = useState(0);

    useEffect(() => {
        if (!api) return;
        setImgIndex(api.selectedScrollSnap());
        api.on('select', () => {
            setImgIndex(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <Card className="w-125 pb-3 px-0 gap-2 bg-transparent shadow-xl/30 rounded-lg">
            <CardHeader className="px-5">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center">
                            <UserProfileDialog userId={post.author?.id!}>
                                <span className="underline cursor-pointer">
                                    {post.author?.userName}
                                </span>
                            </UserProfileDialog>
                            <Dot />
                            <div>
                                {new Date(post.createdAt!).toLocaleDateString()}
                            </div>
                        </p>
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

            {post.images && post.images.length > 0 && (
                <div className="w-full ">
                    <div className="relative w-full h-[350px] overflow-hidden bg-muted">
                        <Carousel setApi={setApi} className="w-full h-full">
                            <CarouselContent className="h-full">
                                {post.images.map((img, index) => (
                                    <CarouselItem
                                        key={img.id || index}
                                        className="h-[350px] flex items-center justify-center"
                                    >
                                        <div className="w-full h-full flex items-center justify-center">
                                            <img
                                                src={img.docUrl}
                                                alt={`post-img-${index + 1}`}
                                                className="max-h-[350px] max-w-full object-contain"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            <CarouselPrevious className="left-3 h-6 w-6" />
                            <CarouselNext className="right-3 h-6 w-6" />
                        </Carousel>
                    </div>

                    <div className="mt-3 text-center text-xs">
                        {imgIndex + 1} of {post.images.length}
                    </div>
                </div>
            )}

            <CardContent className="px-5">
                <pre className="text-sm text-wrap font-sans">
                    {post.content}
                </pre>
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag) => (
                            <Badge key={tag.id} variant="outline">
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex px-4 items-center justify-between">
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
