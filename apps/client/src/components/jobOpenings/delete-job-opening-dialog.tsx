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
import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteJobOpening } from '@/api/jobs-api';

type Props = {
    jobOpeningId: string;
};

const DeleteJobOpeningDialog = ({ jobOpeningId }: Props) => {
    const deleteJobOpeningMutation = useDeleteJobOpening();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const onDelete = () => {
        deleteJobOpeningMutation.mutate(jobOpeningId, {
            onSuccess: () => {
                setOpen(false);
                navigate('/job-openings');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-600 hover:text-red-700"
                >
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Job Opening</DialogTitle>
                </DialogHeader>
                <p>
                    Are you sure you want to delete this job opening? This
                    action cannot be undone.
                </p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onDelete}
                        disabled={deleteJobOpeningMutation.isPending}
                    >
                        {deleteJobOpeningMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteJobOpeningDialog;
