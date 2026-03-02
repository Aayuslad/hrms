import { useCreatePost, type CreatePostRequest } from '@/api/engagement-api';
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
import {
    FileUpload,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadList,
    FileUploadDropzone,
    FileUploadTrigger,
} from '@/components/ui/file-upload';
import { CloudUpload, X, Plus, Loader2 } from 'lucide-react';
import { TagSelector } from '@/components/engagement/tag-selector';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    const [images, setImages] = useState<File[]>([]);
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
        const formData = new FormData();
        formData.append('title', data.title);
        data.content && formData.append('content', data.content);
        selectedTagIds.forEach((id) => formData.append('tagIds[]', id));
        images.forEach((file) => formData.append('images[]', file));
        createPostMutation.mutate(
            { payload: formData },
            {
                onSuccess: () => {
                    form.reset();
                    setSelectedTagIds([]);
                    setImages([]);
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
                <Button
                    variant="secondary"
                    className="fixed bottom-4 right-4 z-50 rounded-full p-0 w-10 h-10 bg-repeat"
                >
                    <Plus strokeWidth={4} className="w-8 h-8" />
                </Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[min(700px,85vh)] flex-col gap-0 p-0 sm:w-[500px]">
                <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                    <DialogHeader className="px-6 pt-6 pb-4 border-b">
                        <DialogTitle>Create Post</DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="px-6 h-[400px]">
                        <div className="space-y-5 py-6">
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
                            <div className="grid gap-3">
                                <Label>Images</Label>
                                <FileUpload
                                    maxSize={5 * 1024 * 1024}
                                    value={images}
                                    onValueChange={setImages}
                                    multiple
                                >
                                    <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
                                        <CloudUpload className="size-4" />
                                        Drag and drop or
                                        <FileUploadTrigger asChild>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="p-0"
                                            >
                                                choose files
                                            </Button>
                                        </FileUploadTrigger>
                                        to upload
                                    </FileUploadDropzone>
                                    <FileUploadList>
                                        {images.map((file, index) => (
                                            <FileUploadItem
                                                key={file.name + index}
                                                value={file}
                                            >
                                                <FileUploadItemPreview />
                                                <FileUploadItemMetadata />
                                                <FileUploadItemDelete asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-7"
                                                    >
                                                        <X />
                                                    </Button>
                                                </FileUploadItemDelete>
                                            </FileUploadItem>
                                        ))}
                                    </FileUploadList>
                                </FileUpload>
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="flex-row justify-end gap-3 border-t px-6 py-4">
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
                            {createPostMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
