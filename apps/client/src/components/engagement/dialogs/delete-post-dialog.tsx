import { useDeletePost, type Post } from '@/api/engagement-api';
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

type DeletePostDialogProps = {
    readonly post: Post | null;
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
};

export function DeletePostDialog({ post, open, onOpenChange }: DeletePostDialogProps) {
    const deletePostMutation = useDeletePost();

    const onDelete = () => {
        if (!post?.id) return;
        deletePostMutation.mutate(post.id, {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Post</DialogTitle>
                </DialogHeader>
                <p>
                    Are you sure you want to delete this post? This action cannot be undone.
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
                        disabled={deletePostMutation.isPending}
                    >
                        {deletePostMutation.isPending ? (
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