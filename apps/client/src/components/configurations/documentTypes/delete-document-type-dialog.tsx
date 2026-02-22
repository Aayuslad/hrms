import { useDeleteDocumentType } from '@/api/document-type-api';
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
import { useLocation, useNavigate } from 'react-router-dom';

export function DeleteDocTypeDialog() {
    const location = useLocation();
    const id = location.state as string;
    const deleteDocumentTypeMutation = useDeleteDocumentType();
    const navigate = useNavigate();

    const submit = async (id: string | null) => {
        if (!id) {
            return;
        }
        deleteDocumentTypeMutation.mutate(id, {
            onSuccess: () => {
                navigate('/configuration/document-types');
            },
        });
    };

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-[425px] space-y-2">
                <DialogHeader className="space-y-2">
                    <DialogTitle>Confirm Delete Document Type</DialogTitle>
                    <DialogDescription>
                        This document type will be removed and this action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild className="flex-1">
                        <Button
                            variant="secondary"
                            disabled={deleteDocumentTypeMutation.isPending}
                            onClick={() =>
                                navigate('/configuration/document-types')
                            }
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        variant="default"
                        className="flex-1 bg-red-500 text-white hover:bg-red-600"
                        onClick={() => submit(id)}
                        disabled={deleteDocumentTypeMutation.isPending}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
