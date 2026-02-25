import { useDeleteDesignation } from '@/api/designation-api';
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
import { Loader2 } from 'lucide-react';

export function DeleteDesignationDialog() {
    const location = useLocation();
    const id = location.state as string;
    const deleteDesignationMutation = useDeleteDesignation();
    const navigate = useNavigate();

    const submit = async (id: string | null) => {
        if (!id) {
            return;
        }
        deleteDesignationMutation.mutate(id, {
            onSuccess: () => {
                navigate('/configuration/designations');
            },
        });
    };

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-lg space-y-2">
                <DialogHeader className="space-y-2">
                    <DialogTitle>Confirm Delete Designation</DialogTitle>
                    <DialogDescription>
                        This designation will be removed and this action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild className="flex-1">
                        <Button
                            variant="secondary"
                            disabled={deleteDesignationMutation.isPending}
                            onClick={() =>
                                navigate('/configuration/designations')
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
                        disabled={deleteDesignationMutation.isPending}
                    >
                        {deleteDesignationMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}