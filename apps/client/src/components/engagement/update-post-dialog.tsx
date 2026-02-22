import {
    useUpdatePost,
    type Post,
    type UpdatePostRequest,
} from '@/api/engagement-api';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TagSelector } from '@/components/engagement/tag-selector';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type UpdatePostDialogProps = {
    readonly post: Post | null;
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
};

export function UpdatePostDialog({ post, open, onOpenChange }: UpdatePostDialogProps) {
    const updatePostMutation = useUpdatePost();
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (post) {
            const postTagIds = post.tags?.map((t) => t.id!) || [];
            setSelectedTagIds(postTagIds);
            setTitle(post.title || '');
            setContent(post.content || '');
        }
    }, [post]);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        
        if (!post?.id) return;
        
        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        if (title.length > 200) {
            toast.error('Title must be at most 200 characters');
            return;
        }

        setIsSubmitting(true);
        updatePostMutation.mutate(
            {
                id: post.id,
                title,
                content,
                tagIds: selectedTagIds,
            } as UpdatePostRequest & { tagIds: string[] },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    onOpenChange(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleSubmit} className="grid gap-7">
                    <DialogHeader>
                        <DialogTitle>Update Post</DialogTitle>
                        <DialogDescription>
                            Edit your post details.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Post title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="What's on your mind?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label>Tags</Label>
                            <TagSelector
                                selectedTagIds={selectedTagIds}
                                onTagsChange={setSelectedTagIds}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                disabled={isSubmitting || updatePostMutation.isPending}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isSubmitting || updatePostMutation.isPending}
                        >
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}