import {
    useCreateDocumentType,
    type CreateDocumentTypeRequest,
} from '@/api/document-type-api';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccessChecker } from '@/hooks/use-has-access';
import { zodResolver } from '@hookform/resolvers/zod';
// no local react state required for store-controlled dialog
import { useAppStore } from '@/store';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useShallow } from 'zustand/react/shallow';

const createDocumentTypeFormSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must be at most 50 characters long'),
}) satisfies z.ZodType<CreateDocumentTypeRequest>;

type Props = {
    visibleTo: string[];
};

export function CreateDocumentTypeDialog({ visibleTo }: Props) {
    // store-controlled dialog; local state not required
    const canAccess = useAccessChecker();
    const createDocumentTypeMutation = useCreateDocumentType();

    const { configDialogOpen, configDialogTarget, openConfigDialog, closeConfigDialog } =
        useAppStore(
            useShallow((s) => ({
                configDialogOpen: s.configDialogOpen,
                configDialogTarget: s.configDialogTarget,
                openConfigDialog: s.openConfigDialog,
                closeConfigDialog: s.closeConfigDialog,
            }))
        );

    const controlledOpen =
        configDialogOpen && configDialogTarget?.entity === 'documentTypes' && configDialogTarget?.mode === 'create';

    const form = useForm<CreateDocumentTypeRequest>({
        resolver: zodResolver(createDocumentTypeFormSchema),
        defaultValues: {
            name: '',
        },
    });

    const onSubmit = async (data: CreateDocumentTypeRequest) => {
        createDocumentTypeMutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                if (configDialogOpen) closeConfigDialog();
            },
        });
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        messages.reverse().forEach((msg) => toast.error(msg));
    };

    if (!canAccess(visibleTo)) return null;

    return (
        <Dialog open={controlledOpen} onOpenChange={(state) => state === false && closeConfigDialog()}>
            <DialogContent className="sm:max-w-[425px]">
                <form
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    className="grid gap-7"
                >
                    <DialogHeader>
                        <DialogTitle>Create Document type</DialogTitle>
                        <DialogDescription>
                            Enter the document details and click Create.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="PAN"
                                {...form.register('name')}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                disabled={createDocumentTypeMutation.isPending}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={createDocumentTypeMutation.isPending}
                        >
                            {createDocumentTypeMutation.isPending && (
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
