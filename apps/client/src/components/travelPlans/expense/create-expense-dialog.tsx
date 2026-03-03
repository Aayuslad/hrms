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
import { CloudUpload, Loader2, X } from 'lucide-react';

import { useCreateExpense, type CreateExpenseRequest } from '@/api/travel-api';
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
import { Label } from '@/components/ui/label';
import { NumberInputWithEndButtons } from '@/components/ui/number-input-with-end-buttons';
import { EXPENSE_STATUS } from '@/types/enums';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { ExpenseCategorySelector } from './expense-category-selector';

const createExpenseFormSchema = z.object({
    participantId: z.string().min(1, 'Participant is required').optional(),
    travelPlanId: z.string().min(1, 'Travel Plan is required'),
    amount: z.string().min(0, 'Amount must be positive'),
    date: z.string().optional(),
    status: z.enum(EXPENSE_STATUS).optional(),
    expenseCategoryId: z.string().min(1, 'Category is required'),
    proofs: z.string().array().optional(),
    //@ts-ignore
}) satisfies z.ZodType<CreateExpenseRequest>;

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
            travelPlanId,
            participantId,
            amount: undefined,
        },
    });

    const onSubmit = async (
        data: z.infer<typeof createExpenseFormSchema>,
        status: string
    ) => {
        const formData = new FormData();

        formData.append('travelPlanId', data.travelPlanId);
        formData.append('participantId', data.participantId ?? '');
        formData.append('amount', data.amount);
        data.date && formData.append('date', data.date);
        formData.append('status', status);
        formData.append('expenseCategoryId', data.expenseCategoryId);

        for (const element of proofs) {
            formData.append('proofs[]', element);
        }

        createExpenseMutation.mutate(
            {
                payload: formData,
                travelPlanId,
                participantId,
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={'secondary'}>+ Add Expense</Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[min(700px,85vh)] flex-col gap-0 p-0 sm:w-[450px]">
                <Form {...form}>
                    <form>
                        <DialogHeader className="px-6 py-5 border-b">
                            <DialogTitle>Add Expense</DialogTitle>
                        </DialogHeader>

                        <ScrollArea className="px-6 py-4 h-[400px]">
                            <div className="space-y-5">
                                <NumberInputWithEndButtons
                                    control={form.control}
                                    name="amount"
                                    minValue={0}
                                    label="Amount*"
                                />

                                <div className="grid gap-3 flex-1">
                                    <Label htmlFor="date">Date*</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        {...form.register('date')}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="date">
                                        Expense category*
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

                        <DialogFooter className="px-6 py-4 border-t">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={form.handleSubmit(
                                    (data) =>
                                        onSubmit(data, EXPENSE_STATUS.DRAFTING),
                                    onInvalid
                                )}
                                disabled={createExpenseMutation.isPending}
                            >
                                {createExpenseMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save as Draft
                            </Button>
                            <Button
                                type="button"
                                onClick={form.handleSubmit(
                                    (data) =>
                                        onSubmit(
                                            data,
                                            EXPENSE_STATUS.SUBMITTED
                                        ),
                                    onInvalid
                                )}
                                disabled={createExpenseMutation.isPending}
                            >
                                {createExpenseMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Submit
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateExpenseDialog;
