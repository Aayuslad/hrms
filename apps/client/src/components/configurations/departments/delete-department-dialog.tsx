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
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function DeleteDepartmentDialog() {
    const location = useLocation();
    const id = location.state as string;
    const deleteDepartmentMutation = useDeleteDepartment();
    const navigate = useNavigate();

    const submit = async (id: string | null) => {
        if (!id) {
            return;
        }
        deleteDepartmentMutation.mutate(id, {
            onSuccess: () => {
                navigate('/configuration/departments');
            },
        });
    };

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-[425px] space-y-2">
                <DialogHeader className="space-y-2">
                    <DialogTitle>Confirm Delete Department</DialogTitle>
                    <DialogDescription>
                        This department will be removed and this action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild className="flex-1">
                        <Button
                            variant="secondary"
                            disabled={deleteDepartmentMutation.isPending}
                            onClick={() =>
                                navigate('/configuration/departments')
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