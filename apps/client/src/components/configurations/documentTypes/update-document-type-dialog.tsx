import {
    useUpdateDocumentType,
    type DocumentType,
    type UpdateDocumentTypeRequest,
} from '@/api/document-type-api';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import z from 'zod';

const updateDocumentTypeFormSchema = z.object({
    id: z.string().nonempty('Document ID is required'),
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must be at most 50 characters long'),
}) satisfies z.ZodType<UpdateDocumentTypeRequest>;

export function UpdateDocTypeDialog() {
    const location = useLocation();
    const documentType = location.state as DocumentType;
    const updateDocumentTypeMutation = useUpdateDocumentType();
    const navigate = useNavigate();

    const form = useForm<UpdateDocumentTypeRequest>({
        resolver: zodResolver(updateDocumentTypeFormSchema),
        defaultValues: {
            id: documentType.id,
            name: documentType.name,
        },
    });

    const onSubmit = async (data: UpdateDocumentTypeRequest) => {
        updateDocumentTypeMutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                navigate('/configuration/document-types');
            },
        });
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        messages.reverse().forEach((msg) => toast.error(msg));
    };

    return (
        <Dialog open={true}>
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
                                onClick={() =>
                                    navigate('/configuration/document-types')
                                }
                            >
                                Cancel
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            disabled={updateDocumentTypeMutation.isPending}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
