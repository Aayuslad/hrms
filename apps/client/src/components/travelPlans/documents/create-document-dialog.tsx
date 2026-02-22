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
import { Loader2 } from 'lucide-react';

import {
    useCreateDocument,
    type CreateDocumentRequest,
} from '@/api/travel-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { DocumentTypeSelector } from './documentTypeSelector';
import { Label } from '@/components/ui/label';
import { useGetMe } from '@/api/user-api';

const createDocumentFormSchema = z.object({
    documentTypeId: z.string().min(1, 'Type is required'),
    doc: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, 'File is required'),
});

interface CreateDocumentDialogProps {
    travelPlanId: string;
    participantId: string;
}

const CreateDocumentDialog = ({
    travelPlanId,
    participantId,
}: CreateDocumentDialogProps) => {
    const createDocumentMutation = useCreateDocument();
    const [open, setOpen] = useState(false);
    const { data: me } = useGetMe();

    const form = useForm({
        resolver: zodResolver(createDocumentFormSchema),
        defaultValues: {
            documentTypeId: '',
            doc: undefined,
        },
    } as const);

    const onSubmit = async (data: z.infer<typeof createDocumentFormSchema>) => {
        const formData = new FormData();
        formData.append('documentTypeId', data.documentTypeId);
        formData.append('travelPlanId', travelPlanId);
        formData.append('ownerId', me?.id as string);
        if (data.doc && data.doc[0]) formData.append('doc', data.doc[0]);

        createDocumentMutation.mutate(
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Document</Button>
            </DialogTrigger>

            <DialogContent className="flex w-[400px] max-h-[min(700px,85vh)] flex-col gap-0 p-0 sm:max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                        <DialogHeader className="px-6 pt-6">
                            <DialogTitle>Add Document</DialogTitle>
                        </DialogHeader>

                        <ScrollArea className="px-6 py-4">
                            <div className="space-y-5">
                                <div className="grid gap-3">
                                    <label htmlFor="documentTypeId">
                                        Document type
                                    </label>
                                    <DocumentTypeSelector
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

                                <div className="grid gap-3">
                                    <Label htmlFor="doc">Your document*</Label>
                                    <Input
                                        id="doc"
                                        type="file"
                                        className=''
                                        accept="image/*,.pdf,.doc,.docx"
                                        {...form.register('doc')}
                                    />
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
                                disabled={createDocumentMutation.isPending}
                            >
                                {createDocumentMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Add Document
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateDocumentDialog;
