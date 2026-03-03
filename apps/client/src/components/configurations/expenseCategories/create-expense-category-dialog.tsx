import {
    useCreateExpenseCategory,
    type CreateExpenseCategoryRequest,
} from '@/api/expense-category-api';
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
import { useAccessChecker } from '@/hooks/use-has-access';
import { zodResolver } from '@hookform/resolvers/zod';
// no local react state required for store-controlled dialog
import { useAppStore } from '@/store';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useShallow } from 'zustand/react/shallow';

const createExpenseCatrgoryFormSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must be at most 50 characters long'),
}) satisfies z.ZodType<CreateExpenseCategoryRequest>;

type Props = {
    visibleTo: string[];
};

export function CreateExpenseCatrgoryDialog({ visibleTo }: Props) {
    // store-controlled dialog; local state not required
    const canAccess = useAccessChecker();
    const createExpenseCategoryMutation = useCreateExpenseCategory();

    const { configDialogOpen, configDialogTarget, closeConfigDialog } =
        useAppStore(
            useShallow((s) => ({
                configDialogOpen: s.configDialogOpen,
                configDialogTarget: s.configDialogTarget,
                closeConfigDialog: s.closeConfigDialog,
            }))
        );

    const controlledOpen =
        configDialogOpen &&
        configDialogTarget?.entity === 'expenseCategories' &&
        configDialogTarget?.mode === 'create';

    const form = useForm<CreateExpenseCategoryRequest>({
        resolver: zodResolver(createExpenseCatrgoryFormSchema),
        defaultValues: {
            name: '',
        },
    });

    const onSubmit = async (data: CreateExpenseCategoryRequest) => {
        createExpenseCategoryMutation.mutate(data, {
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
        <Dialog
            open={controlledOpen}
            onOpenChange={(state) => state === false && closeConfigDialog()}
        >
            <DialogContent className="sm:max-w-[425px]">
                <form
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    className="grid gap-7"
                >
                    <DialogHeader>
                        <DialogTitle>Create Expense Categories</DialogTitle>
                        <DialogDescription>
                            Enter the expense categories details and click
                            Create.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Food"
                                {...form.register('name')}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                disabled={
                                    createExpenseCategoryMutation.isPending
                                }
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={createExpenseCategoryMutation.isPending}
                        >
                            {createExpenseCategoryMutation.isPending && (
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
