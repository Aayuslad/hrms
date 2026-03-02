import { useUpdatePost, type Post } from '@/api/engagement-api';
import { TagSelector } from '@/components/engagement/tag-selector';
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
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadList,
    FileUploadTrigger,
} from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { CloudUpload, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type UpdatePostDialogProps = {
    readonly post: Post | null;
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
};

export function UpdatePostDialog({
    post,
    open,
    onOpenChange,
}: UpdatePostDialogProps) {
    const updatePostMutation = useUpdatePost();
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newImages, setNewImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<
        { id?: string; docUrl?: string }[]
    >([]);
    const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

    useEffect(() => {
        if (post) {
            const postTagIds = post.tags?.map((t) => t.id!) || [];
            setSelectedTagIds(postTagIds);
            setTitle(post.title || '');
            setContent(post.content || '');
            setExistingImages(post.images || []);
            setNewImages([]);
            setDeletedImageIds([]);
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

        const formData = new FormData();
        formData.append('title', title);
        if (content) formData.append('content', content);
        selectedTagIds.forEach((id) => formData.append('tagIds[]', id));
        newImages.forEach((file) => formData.append('images[]', file));
        deletedImageIds.forEach((id) =>
            formData.append('deletedImageIds[]', id)
        );

        updatePostMutation.mutate(
            { id: post.id, payload: formData },
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
            <DialogContent className="flex max-h-[min(700px,85vh)] flex-col gap-0 p-0 sm:w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="px-6 pt-6 pb-4 border-b">
                        <DialogTitle>Update Post</DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="px-6 h-[400px] ">
                        <div className="space-y-5 py-6">
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
                            <div className="grid gap-3">
                                <Label>Images</Label>
                                <FileUpload
                                    maxSize={5 * 1024 * 1024}
                                    value={newImages}
                                    onValueChange={setNewImages}
                                    multiple
                                >
                                    <div className="space-y-3">
                                        <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
                                            <CloudUpload className="size-4" />
                                            Drag and drop or
                                            <FileUploadTrigger asChild>
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="p-0"
                                                    type="button"
                                                >
                                                    choose files
                                                </Button>
                                            </FileUploadTrigger>
                                            to upload
                                        </FileUploadDropzone>

                                        {(existingImages.length > 0 ||
                                            newImages.length > 0) && (
                                            <div className="space-y-2">
                                                {existingImages.map(
                                                    (img, index) => (
                                                        <div
                                                            key={
                                                                img.id || index
                                                            }
                                                            className="relative flex items-center gap-2.5 rounded-md border p-3"
                                                        >
                                                            <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border bg-accent/50">
                                                                {img.docUrl ? (
                                                                    <img
                                                                        src={
                                                                            img.docUrl
                                                                        }
                                                                        alt={`image-${index + 1}`}
                                                                        className="size-full object-cover"
                                                                    />
                                                                ) : null}
                                                            </div>
                                                            <div className="flex flex-1 flex-col gap-0.5 text-sm">
                                                                <p className="font-medium text-foreground">
                                                                    {img.docUrl
                                                                        ?.split(
                                                                            '/'
                                                                        )
                                                                        ?.pop()}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Existing
                                                                    image
                                                                </p>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-7"
                                                                onClick={() => {
                                                                    if (
                                                                        img.id
                                                                    ) {
                                                                        setDeletedImageIds(
                                                                            (
                                                                                prev
                                                                            ) => [
                                                                                ...prev,
                                                                                img.id!,
                                                                            ]
                                                                        );
                                                                    }
                                                                    setExistingImages(
                                                                        (
                                                                            prev
                                                                        ) =>
                                                                            prev.filter(
                                                                                (
                                                                                    i
                                                                                ) =>
                                                                                    i !==
                                                                                    img
                                                                            )
                                                                    );
                                                                }}
                                                                type="button"
                                                            >
                                                                <X className="size-4" />
                                                            </Button>
                                                        </div>
                                                    )
                                                )}

                                                {newImages.length > 0 && (
                                                    <FileUploadList>
                                                        {newImages.map(
                                                            (file, index) => (
                                                                <FileUploadItem
                                                                    key={
                                                                        file.name +
                                                                        index
                                                                    }
                                                                    value={file}
                                                                >
                                                                    <FileUploadItemPreview />
                                                                    <div className="flex flex-1 flex-col gap-0.5">
                                                                        <FileUploadItemMetadata />
                                                                    </div>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="size-7"
                                                                        onClick={() =>
                                                                            setNewImages(
                                                                                (
                                                                                    prev
                                                                                ) =>
                                                                                    prev.filter(
                                                                                        (
                                                                                            f
                                                                                        ) =>
                                                                                            f !==
                                                                                            file
                                                                                    )
                                                                            )
                                                                        }
                                                                    >
                                                                        <X className="size-4" />
                                                                    </Button>
                                                                </FileUploadItem>
                                                            )
                                                        )}
                                                    </FileUploadList>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </FileUpload>
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="flex-row justify-end gap-3 border-t px-6 py-4">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                disabled={
                                    isSubmitting || updatePostMutation.isPending
                                }
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={
                                isSubmitting || updatePostMutation.isPending
                            }
                        >
                            {updatePostMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
