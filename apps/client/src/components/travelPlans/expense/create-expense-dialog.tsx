import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CloudUpload, Loader2, Upload, X } from 'lucide-react';

import { useCreateExpense } from '@/api/travel-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Label } from '@/components/ui/label';
import { NumberInputWithEndButtons } from '@/components/ui/number-input-with-end-buttons';
import { ExpenseCategorySelector } from './expense-category-selector';
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadList,
    FileUploadTrigger,
} from '@/components/ui/file-upload';

const createExpenseFormSchema = z.object({
    date: z.string().optional(),
    amount: z.string().min(0, 'Amount must be positive'),
    expenseCategoryId: z.string().min(1, 'Category is required'),
    proofs: z.array(z.file()).optional(),
});

interface CreateExpenseDialogProps {
    travelPlanId: string;
    participantId: string;
}

const CreateExpenseDialog = ({
    travelPlanId,
    participantId,
}: CreateExpenseDialogProps) => {
    const createExpenseMutation = useCreateExpense();
    const [proofs, setProofs] = useState<File[]>([]);
    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(createExpenseFormSchema),
        defaultValues: {
            date: '',
            amount: '',
            expenseCategoryId: '',
        },
    } as const);

    const onSubmit = async (data: z.infer<typeof createExpenseFormSchema>) => {
        const formData = new FormData();
        if (data.date) formData.append('date', data.date);
        formData.append('amount', data.amount);
        formData.append('expenseCategoryId', data.expenseCategoryId);

        if (data.proofs) {
            for (let i = 0; i < data.proofs.length; i++) {
                formData.append('proofs[]', data.proofs[i]);
            }
        }

        createExpenseMutation.mutate(
            {
                travelPlanId,
                participantId,
                payload: formData as any,
            },
            {
                onSuccess: () => {
                    form.reset();
                    setOpen(false);
                },
            }
        );
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        const reversed = [...messages].reverse();
        reversed.forEach((msg) => toast.error(msg));
    };

    console.log(form.getValues('proofs'));

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Expense</Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[min(700px,85vh)] flex-col gap-0 p-0 sm:max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                        <DialogHeader className="px-6 pt-6">
                            <DialogTitle>Add Expense</DialogTitle>
                        </DialogHeader>

                        <ScrollArea className="px-6 py-4">
                            <div className="space-y-5">
                                <div className="flex justify-between gap-5">
                                    <div className="grid gap-3 flex-1">
                                        <Label htmlFor="amount">Amount*</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            {...form.register('amount')}
                                        />
                                    </div>

                                    <div className="grid gap-3 flex-1">
                                        <Label htmlFor="date">Date*</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            {...form.register('date')}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="date">
                                        Expense Catrgory*
                                    </Label>
                                    <ExpenseCategorySelector
                                        setSelectedExpenseCategoryId={(
                                            selectedId
                                        ) =>
                                            form.setValue(
                                                'expenseCategoryId',
                                                selectedId
                                            )
                                        }
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="proofs">Proofs</Label>
                                    <FileUpload
                                        maxSize={5 * 1024 * 1024}
                                        value={proofs}
                                        onValueChange={setProofs}
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
                                            {proofs.map((file, index) => (
                                                <FileUploadItem
                                                    key={index}
                                                    value={file}
                                                >
                                                    <FileUploadItemPreview />
                                                    <FileUploadItemMetadata />
                                                    <FileUploadItemDelete
                                                        asChild
                                                    >
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

                        <DialogFooter className="px-6 py-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={createExpenseMutation.isPending}
                            >
                                {createExpenseMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Add Expense
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateExpenseDialog;
