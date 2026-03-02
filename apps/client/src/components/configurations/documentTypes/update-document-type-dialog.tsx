import {
    useUpdateDocumentType,
    type UpdateDocumentTypeRequest
} from '@/api/document-type-api';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useShallow } from 'zustand/react/shallow';

const updateDocumentTypeFormSchema = z.object({
    id: z.string().nonempty('Document ID is required'),
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must be at most 50 characters long'),
}) satisfies z.ZodType<UpdateDocumentTypeRequest>;

export function UpdateDocTypeDialog() {
    const updateDocumentTypeMutation = useUpdateDocumentType();
    const { configDialogOpen, configDialogTarget, closeConfigDialog } =
        useAppStore(
            useShallow((s) => ({
                configDialogOpen: s.configDialogOpen,
                configDialogTarget: s.configDialogTarget,
                closeConfigDialog: s.closeConfigDialog,
            }))
        );

    const form = useForm<UpdateDocumentTypeRequest>({
        resolver: zodResolver(updateDocumentTypeFormSchema),
    });

    useEffect(() => {
        if (configDialogTarget?.payload) {
            form.reset({
                id: configDialogTarget.payload.id,
                name: configDialogTarget.payload.name,
            });
        }
    }, [configDialogTarget?.payload]);

    const onSubmit = async (data: UpdateDocumentTypeRequest) => {
        updateDocumentTypeMutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                closeConfigDialog();
            },
        });
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        messages.reverse().forEach((msg) => toast.error(msg));
    };

    return (
        <Dialog
            open={
                configDialogOpen &&
                configDialogTarget?.entity === 'documentTypes' &&
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
                        <DialogTitle>Update Document Type</DialogTitle>
                        <DialogDescription>
                            Update the document type details and click Save.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...form.register('name')} />
                        </div>
                    </div>

                    <DialogFooter>
                        <div>
                            <Button
                                variant="outline"
                                type="button"
                                disabled={updateDocumentTypeMutation.isPending}
                                onClick={() => closeConfigDialog()}
                            >
                                Cancel
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            disabled={updateDocumentTypeMutation.isPending}
                        >
                            {updateDocumentTypeMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
