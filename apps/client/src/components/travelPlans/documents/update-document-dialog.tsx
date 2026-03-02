import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

import { useUpdateDocument, type TravelPlanDocument } from '@/api/travel-api';
import { useGetMe } from '@/api/user-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { DocumentTypeSelector } from './documentTypeSelector';

const updateDocumentFormSchema = z.object({
    id: z.string(),
    documentTypeId: z.string().min(1, 'Type is required'),
});

interface UpdateDocumentDialogProps {
    travelPlanId: string;
    participantId: string;
    document: TravelPlanDocument | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const UpdateDocumentDialog = ({
    travelPlanId,
    participantId,
    document,
    open,
    onOpenChange,
}: UpdateDocumentDialogProps) => {
    const updateDocumentMutation = useUpdateDocument();
    const { data: me } = useGetMe();

    const form = useForm({
        resolver: zodResolver(updateDocumentFormSchema),
        defaultValues: {
            id: document?.id || '',
            documentTypeId: document?.documentType?.id || '',
        },
    } as const);

    const onSubmit = async (data: z.infer<typeof updateDocumentFormSchema>) => {
        const formData = new FormData();
        formData.append('id', data.id);
        formData.append('documentTypeId', data.documentTypeId);
        formData.append('travelPlanId', travelPlanId);
        formData.append('ownerId', me?.id as string);

        updateDocumentMutation.mutate(
            {
                travelPlanId,
                participantId,
                documentId: data.id,
                payload: formData as any,
            },
            {
                onSuccess: () => {
                    form.reset();
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
            <DialogContent className="flex w-[400px] max-h-[min(700px,85vh)] flex-col gap-0 p-0 sm:max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                        <DialogHeader className="px-6 pt-6">
                            <DialogTitle>Update Document</DialogTitle>
                        </DialogHeader>

                        <ScrollArea className="px-6 py-4">
                            <div className="space-y-5">
                                <div className="grid gap-3">
                                    <label htmlFor="documentTypeId">
                                        Document type
                                    </label>
                                    <DocumentTypeSelector
                                        selectedDocumentTypeId={form.watch(
                                            'documentTypeId'
                                        )}
                                        setSelectedDocumentTypeId={(
                                            selectedId
                                        ) =>
                                            form.setValue(
                                                'documentTypeId',
                                                selectedId
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </ScrollArea>

                        <DialogFooter className="px-6 py-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={updateDocumentMutation.isPending}
                            >
                                {updateDocumentMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Update Document
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateDocumentDialog;
