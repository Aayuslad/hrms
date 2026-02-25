import {
    useCreatePost,
    type CreatePostRequest,
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
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TagSelector } from '@/components/engagement/tag-selector';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const createPostFormSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(200, 'Title must be at most 200 characters'),
    content: z.string().optional(),
    tagIds: z.array(z.string()).optional(),
}) satisfies z.ZodType<CreatePostRequest>;

export function CreatePostDialog() {
    const [open, setOpen] = useState(false);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const createPostMutation = useCreatePost();

    const form = useForm<CreatePostRequest>({
        resolver: zodResolver(createPostFormSchema),
        defaultValues: {
            title: '',
            content: '',
            tagIds: [],
        },
    });

    const onSubmit = async (data: CreatePostRequest) => {
        createPostMutation.mutate(
            { ...data, tagIds: selectedTagIds },
            {
                onSuccess: () => {
                    form.reset();
                    setSelectedTagIds([]);
                    setOpen(false);
                },
            }
        );
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        const reversedMessages = [...messages].reverse();
        reversedMessages.forEach((msg) => toast.error(msg));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="border">
                    + Create Post
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
                <form
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    className="grid gap-7"
                >
                    <DialogHeader>
                        <DialogTitle>Create Post</DialogTitle>
                        <DialogDescription>
                            Share your thoughts with the team.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Post title"
                                {...form.register('title')}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="What's on your mind?"
                                {...form.register('content')}
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
                                disabled={createPostMutation.isPending}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={createPostMutation.isPending}
                        >
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}