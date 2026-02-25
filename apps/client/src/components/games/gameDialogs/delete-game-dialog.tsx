import { Loader2, Trash, TriangleAlertIcon } from 'lucide-react';

import { useDeleteGame } from '@/api/games-api';
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

const DeleteGameDialog = ({ gameId }: { gameId: string }) => {
    const [open, setOpen] = useState(false);
    const deleteGameMutation = useDeleteGame();

    const handleDelete = () => {
        deleteGameMutation.mutate(gameId, {
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
                    Delete Game
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
                        disabled={deleteGameMutation.isPending}
                        onClick={handleDelete}
                    >
                        {deleteGameMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteGameDialog;
