import { useDeleteDepartment } from '@/api/department-api';
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
import { useAppStore } from '@/store';
import { Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

export function DeleteDepartmentDialog() {
    const deleteDepartmentMutation = useDeleteDepartment();
    const { configDialogOpen, configDialogTarget, closeConfigDialog } =
        useAppStore(
            useShallow((s) => ({
                configDialogOpen: s.configDialogOpen,
                configDialogTarget: s.configDialogTarget,
                closeConfigDialog: s.closeConfigDialog,
            }))
        );

    const id = configDialogTarget?.payload as string | undefined;

    const submit = async (id?: string) => {
        if (!id) {
            return;
        }
        deleteDepartmentMutation.mutate(id, {
            onSuccess: () => {
                closeConfigDialog();
            },
        });
    };

    return (
        <Dialog
            open={
                configDialogOpen &&
                configDialogTarget?.entity === 'departments' &&
                configDialogTarget?.mode === 'delete'
            }
            onOpenChange={(state) => state === false && closeConfigDialog()}
        >
            <DialogContent className="sm:max-w-[425px] space-y-2">
                <DialogHeader className="space-y-2">
                    <DialogTitle>Confirm Delete Department</DialogTitle>
                    <DialogDescription>
                        This department will be removed and this action cannot
                        be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild className="flex-1">
                        <Button
                            variant="secondary"
                            disabled={deleteDepartmentMutation.isPending}
                            onClick={() => closeConfigDialog()}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        variant="default"
                        className="flex-1 bg-red-500 text-white hover:bg-red-600"
                        onClick={() => submit(id)}
                        disabled={deleteDepartmentMutation.isPending}
                    >
                        {deleteDepartmentMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
