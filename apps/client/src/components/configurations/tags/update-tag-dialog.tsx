import { useUpdateTag, type Tag, type UpdateTagRequest } from '@/api/tag-api';
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
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';
import z from 'zod';
import { Loader2 } from 'lucide-react';

const updateTagFormSchema = z.object({
    id: z.string().optional(),
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must be at most 50 characters long'),
}) satisfies z.ZodType<UpdateTagRequest>;

export function UpdateTagDialog() {
    const updateTagMutation = useUpdateTag();
    const { configDialogOpen, configDialogTarget, closeConfigDialog } =
        useAppStore(
            useShallow((s) => ({
                configDialogOpen: s.configDialogOpen,
                configDialogTarget: s.configDialogTarget,
                closeConfigDialog: s.closeConfigDialog,
            }))
        );

    const tag = configDialogTarget?.payload as Tag | undefined;

    const form = useForm<UpdateTagRequest>({
        resolver: zodResolver(updateTagFormSchema),
    });

    useEffect(() => {
        if (tag) {
            form.reset({
                id: tag.id,
                name: tag.name || '',
            });
        }
    }, [tag, form]);

    useEffect(() => {
        if (configDialogTarget?.payload) {
            form.reset({
                id: configDialogTarget.payload.id,
                name: configDialogTarget.payload.name,
            });
        }
    }, [configDialogTarget?.payload]);

    const onSubmit = async (data: UpdateTagRequest) => {
        updateTagMutation.mutate(data, {
            onSuccess: () => {
                closeConfigDialog();
            },
        });
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        const reversedMessages = [...messages].reverse();
        reversedMessages.forEach((msg) => toast.error(msg));
    };

    return (
        <Dialog
            open={
                configDialogOpen &&
                configDialogTarget?.entity === 'tags' &&
                configDialogTarget?.mode === 'update'
            }
            onOpenChange={(state) => state === false && closeConfigDialog()}
        >
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
                                onClick={() => closeConfigDialog()}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={updateTagMutation.isPending}
                        >
                            {' '}
                            {updateTagMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}{' '}
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
