import {
    useUpdateExpenseCategory,
    type ExpenseCategory,
    type UpdateExpenseCategoryRequest,
} from '@/api/expense-category-api';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';
import z from 'zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const updateExpenseCategoryFormSchema = z.object({
    id: z.string().nonempty('Expense Category ID is required'),
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must be at most 50 characters long'),
}) satisfies z.ZodType<UpdateExpenseCategoryRequest>;

export function UpdateExpenseCategoryDialog() {
    const updateExpenseCategoryMutation = useUpdateExpenseCategory();
    const { configDialogOpen, configDialogTarget, closeConfigDialog } =
        useAppStore(
            useShallow((s) => ({
                configDialogOpen: s.configDialogOpen,
                configDialogTarget: s.configDialogTarget,
                closeConfigDialog: s.closeConfigDialog,
            }))
        );

    const form = useForm<UpdateExpenseCategoryRequest>({
        resolver: zodResolver(updateExpenseCategoryFormSchema),
    });

    useEffect(() => {
        if (configDialogTarget?.payload) {
            form.reset({
                id: configDialogTarget.payload.id,
                name: configDialogTarget.payload.name,
            });
        }
    }, [configDialogTarget?.payload]);

    const onSubmit = async (data: UpdateExpenseCategoryRequest) => {
        updateExpenseCategoryMutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                closeConfigDialog();
            },
        });
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        messages
            .slice()
            .reverse()
            .forEach((msg) => toast.error(msg));
    };

    return (
        <Dialog
            open={
                configDialogOpen &&
                configDialogTarget?.entity === 'expenseCategories' &&
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
                        <DialogTitle>Update Expense Category</DialogTitle>
                        <DialogDescription>
                            Update the expense category details and click Save.
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
                                disabled={
                                    updateExpenseCategoryMutation.isPending
                                }
                                onClick={() => closeConfigDialog()}
                            >
                                Cancel
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            disabled={updateExpenseCategoryMutation.isPending}
                        >
                            {updateExpenseCategoryMutation.isPending && (
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
