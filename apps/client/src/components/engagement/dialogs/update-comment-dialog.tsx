import { useUpdateComment, type Post } from '@/api/engagement-api';
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
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

type Comment = NonNullable<Post['comments']>[number];

type UpdateCommentDialogProps = {
    readonly comment: Comment | null;
    readonly postId: string;
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
};

export function UpdateCommentDialog({
    comment,
    postId,
    open,
    onOpenChange,
}: UpdateCommentDialogProps) {
    const updateCommentMutation = useUpdateComment();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (comment) {
            setContent(comment.content || '');
        }
    }, [comment]);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!comment?.id || !postId) return;

        if (!content.trim()) {
            return;
        }

        setIsSubmitting(true);
        updateCommentMutation.mutate(
            {
                postId,
                commentId: comment.id,
                payload: { content: content.trim() },
            },
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
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit} className="grid gap-7">
                    <DialogHeader>
                        <DialogTitle>Update Comment</DialogTitle>
                        <DialogDescription>
                            Edit your comment.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Textarea
                                placeholder="Comment content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                disabled={
                                    isSubmitting ||
                                    updateCommentMutation.isPending
                                }
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                updateCommentMutation.isPending ||
                                !content.trim()
                            }
                        >
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
