import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CloudUpload, FileIcon, Loader2, X } from 'lucide-react';

import {
    useUpdateExpense,
    type TravelPlanExpense,
    type UpdateExpenseRequest,
} from '@/api/travel-api';
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadList,
    FileUploadTrigger,
} from '@/components/ui/file-upload';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { ExpenseCategorySelector } from './expense-category-selector';

const updateExpenseFormSchema = z.object({
    id: z.string(),
    travelPlanId: z.string(),
    date: z.string().optional(),
    amount: z.string().min(0, 'Amount must be positive'),
    expenseCategoryId: z.string().min(1, 'Category is required'),
    proofs: z.array(z.file()).optional(),
    deletedProofIds: z.array(z.string()).optional(),
}) satisfies z.ZodType<UpdateExpenseRequest>;

interface UpdateExpenseDialogProps {
    travelPlanId: string;
    participantId: string;
    expense: TravelPlanExpense;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Custom Proof Item Component for existing proofs (with URL preview)
const ProofItemDisplay = ({
    proof,
    index,
    onRemove,
}: {
    proof: NonNullable<TravelPlanExpense['proofs']>[number];
    index: number;
    onRemove: () => void;
}) => {
    const fileName = proof.docUrl?.split('/').pop() || `Proof ${index + 1}`;
    const isImage =
        proof.docUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(proof.docUrl);

    return (
        <div className="relative flex items-center gap-2.5 rounded-md border p-3">
            <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border bg-accent/50">
                {isImage && proof.docUrl ? (
                    <img
                        src={proof.docUrl}
                        alt={fileName}
                        className="size-full object-cover"
                    />
                ) : (
                    <FileIcon className="size-10" />
                )}
            </div>
            <div className="flex flex-1 flex-col gap-0.5 text-sm">
                <p className="font-medium text-foreground">{fileName}</p>
                <p className="text-xs text-muted-foreground">Existing proof</p>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={onRemove}
                type="button"
            >
                <X className="size-4" />
            </Button>
        </div>
    );
};

const UpdateExpenseDialog = ({
    travelPlanId,
    participantId,
    expense,
    open,
    onOpenChange,
}: UpdateExpenseDialogProps) => {
    const updateExpenseMutation = useUpdateExpense();
    const [newProofs, setNewProofs] = useState<File[]>([]);
    const [existingProofs, setExistingProofs] = useState<
        NonNullable<TravelPlanExpense['proofs']>
    >([]);

    const form = useForm({
        resolver: zodResolver(updateExpenseFormSchema),
        defaultValues: {
            id: expense.id || '',
            date: expense.date || '',
            amount: expense.amount?.toString() || '',
            expenseCategoryId: expense.expenseCategory?.id || '',
        },
    } as const);

    useEffect(() => {
        if (expense) {
            form.reset({
                id: expense.id || '',
                date: expense.date || '',
                amount: expense.amount?.toString() || '',
                expenseCategoryId: expense.expenseCategory?.id || '',
                travelPlanId: travelPlanId,
                deletedProofIds: [],
            });
            setNewProofs([]);
        }
    }, [expense, form]);

    useEffect(() => {
        const deletedIds = form.getValues('deletedProofIds') || [];
        const filteredProofs = (expense.proofs || []).filter(
            (proof) => !deletedIds.includes(proof.id || '')
        );
        setExistingProofs(filteredProofs);
    }, [form.watch('deletedProofIds')]);

    const handleRemoveExistingProof = (proofId: string | undefined) => {
        if (proofId) {
            form.setValue('deletedProofIds', [
                ...(form.getValues('deletedProofIds') || []),
                proofId,
            ]);
        }
    };

    const handleRemoveNewProof = (proof: File) => {
        setNewProofs((prev) => prev.filter((f) => f !== proof));
    };

    const onSubmit = async (data: z.infer<typeof updateExpenseFormSchema>) => {
        const formData = new FormData();
        formData.append('id', data.id);
        if (data.date) formData.append('date', data.date);
        formData.append('travelPlanId', travelPlanId);
        formData.append('amount', data.amount);
        formData.append('expenseCategoryId', data.expenseCategoryId);

        // Add new proofs
        for (const proof of newProofs) {
            formData.append('proofs[]', proof);
        }

        // add deleted proof ids
        for (const deletedId of data.deletedProofIds || []) {
            formData.append('deletedProofIds[]', deletedId);
        }

        updateExpenseMutation.mutate(
            {
                travelPlanId,
                participantId,
                expenseId: data.id,
                payload: formData as any,
            },
            {
                onSuccess: () => {
                    form.reset();
                    setNewProofs([]);
                    onOpenChange(false);
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[min(700px,85vh)] flex-col gap-0 p-0 sm:max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                        <DialogHeader className="px-6 py-5 border-b">
                            <DialogTitle>Update Expense</DialogTitle>
                        </DialogHeader>

                        <ScrollArea className="px-6 py-4 h-[400px]">
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
                                    <Label htmlFor="expenseCategoryId">
                                        Expense Category*
                                    </Label>
                                    <ExpenseCategorySelector
                                        selectedExpenseCategoryId={form.watch(
                                            'expenseCategoryId'
                                        )}
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
                                        value={newProofs}
                                        onValueChange={setNewProofs}
                                        multiple
                                    >
                                        <div className="space-y-3">
                                            {/* Upload Dropzone - First */}
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

                                            {/* Display All Proofs - Existing and New Combined */}
                                            {(existingProofs.length > 0 ||
                                                newProofs.length > 0) && (
                                                <div className="space-y-2">
                                                    {/* Display Existing Proofs */}
                                                    {existingProofs.map(
                                                        (proof, index) => (
                                                            <ProofItemDisplay
                                                                key={`existing-${proof.id}`}
                                                                proof={proof}
                                                                index={index}
                                                                onRemove={() =>
                                                                    handleRemoveExistingProof(
                                                                        proof.id
                                                                    )
                                                                }
                                                            />
                                                        )
                                                    )}

                                                    {/* Display New Proofs */}
                                                    {newProofs.length > 0 && (
                                                        <FileUploadList>
                                                            {newProofs.map(
                                                                (
                                                                    file,
                                                                    index
                                                                ) => (
                                                                    <FileUploadItem
                                                                        key={
                                                                            file.name +
                                                                            index
                                                                        }
                                                                        value={
                                                                            file
                                                                        }
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
                                                                                handleRemoveNewProof(
                                                                                    file
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

                        <DialogFooter className="px-6 py-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={updateExpenseMutation.isPending}
                            >
                                {updateExpenseMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Update Expense
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateExpenseDialog;
