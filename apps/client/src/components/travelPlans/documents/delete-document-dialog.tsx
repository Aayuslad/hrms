import { useDeleteDocument } from '@/api/travel-api';
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

interface DeleteDocumentDialogProps {
    documentId: string;
    travelPlanId: string;
    participantId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteDocumentDialog({
    documentId,
    travelPlanId,
    participantId,
    open,
    onOpenChange,
}: Readonly<DeleteDocumentDialogProps>) {
    const deleteDocumentMutation = useDeleteDocument();

    const submit = async (id: string) => {
        if (!id) {
            return;
        }
        deleteDocumentMutation.mutate(
            {
                documentId: documentId,
                travelPlanId: travelPlanId,
                participantId: participantId,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg space-y-2">
                <DialogHeader className="space-y-2">
                    <DialogTitle>Confirm Delete Document</DialogTitle>
                    <DialogDescription>
                        This document will be removed and this action cannot be
                        undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild className="flex-1">
                        <Button
                            variant="secondary"
                            disabled={deleteDocumentMutation.isPending}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        variant="default"
                        className="flex-1 bg-red-500 text-white hover:bg-red-600"
                        onClick={() => submit(id)}
                        disabled={deleteDocumentMutation.isPending}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
