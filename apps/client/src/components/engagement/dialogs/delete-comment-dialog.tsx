import { useDeleteComment, type Post } from '@/api/engagement-api';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Trash2 } from 'lucide-react';

type Comment = NonNullable<Post['comments']>[number];

type DeleteCommentDialogProps = {
    readonly comment: Comment | null;
    readonly postId: string;
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
};

export function DeleteCommentDialog({
    comment,
    postId,
    open,
    onOpenChange,
}: DeleteCommentDialogProps) {
    const deleteCommentMutation = useDeleteComment();

    const onDelete = () => {
        if (!comment?.id || !postId) return;
        deleteCommentMutation.mutate(
            { postId, commentId: comment.id },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Comment</DialogTitle>
                </DialogHeader>
                <p>
                    Are you sure you want to delete this comment? This action
                    cannot be undone.
                </p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onDelete}
                        disabled={deleteCommentMutation.isPending}
                    >
                        {deleteCommentMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
