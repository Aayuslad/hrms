import { Loader2, Trash, TriangleAlertIcon } from 'lucide-react';

import { useDeleteTravelPlan } from '@/api/travel-api';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const DeleteTravelPlanDialog = ({
    travelPlanId,
}: {
    travelPlanId?: string;
}) => {
    const [open, setOpen] = useState(false);
    const deleteTravelPlanMutation = useDeleteTravelPlan();

    const handleDelete = () => {
        travelPlanId &&
            deleteTravelPlanMutation.mutate(travelPlanId, {
                onSuccess: () => {
                    setOpen(false);
                },
            });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center w-full gap-2"
                >
                    <Trash className="h-4 w-4" />
                    Delete Travel Plan
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader className="items-center">
                    <div className="bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
                        <TriangleAlertIcon className="text-destructive size-6" />
                    </div>
                    <AlertDialogTitle>
                        Are you absolutely sure you want to delete?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        This action cannot be undone. This will permanently
                        deleted with all related data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        type="button"
                        disabled={deleteTravelPlanMutation.isPending}
                        onClick={handleDelete}
                    >
                        {deleteTravelPlanMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteTravelPlanDialog;
