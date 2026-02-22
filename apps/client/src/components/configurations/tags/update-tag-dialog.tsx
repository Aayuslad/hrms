import {
    useUpdateTag,
    type Tag,
    type UpdateTagRequest,
} from '@/api/tag-api';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import z from 'zod';

const updateTagFormSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must be at most 50 characters long'),
}) satisfies z.ZodType<Omit<UpdateTagRequest, 'id'>>;

export function UpdateTagDialog() {
    const location = useLocation();
    const navigate = useNavigate();
    const tag = location.state as Tag;
    const updateTagMutation = useUpdateTag();

    const form = useForm<Omit<UpdateTagRequest, 'id'>>({
        resolver: zodResolver(updateTagFormSchema),
        defaultValues: {
            name: '',
        },
    });

    useEffect(() => {
        if (tag) {
            form.reset({
                name: tag.name || '',
            });
        }
    }, [tag, form]);

    const onSubmit = async (data: Omit<UpdateTagRequest, 'id'>) => {
        updateTagMutation.mutate(
            { ...data, id: tag.id! },
            {
                onSuccess: () => {
                    navigate('/configuration/tags');
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
        <Dialog open={true}>
            <DialogContent className="sm:max-w-[425px]">
                <form
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    className="grid gap-7"
                >
                    <DialogHeader>
                        <DialogTitle>Update Tag</DialogTitle>
                        <DialogDescription>
                            Edit the tag details and click Update.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Tag name"
                                {...form.register('name')}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                disabled={updateTagMutation.isPending}
                                onClick={() =>
                                    navigate('/configuration/tags')
                                }
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={updateTagMutation.isPending}
                        >
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
