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
import { Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { useCloseJobOpening } from '@/api/jobs-api';

type Props = {
    jobOpeningId: string;
};

const CloseJobOpeningDialog = ({ jobOpeningId }: Props) => {
    const closeJobOpeningMutation = useCloseJobOpening();
    const [open, setOpen] = useState(false);

    const onClose = () => {
        closeJobOpeningMutation.mutate(jobOpeningId, {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                >
                    Close Job Opening
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Close Job Opening</DialogTitle>
                </DialogHeader>
                <p>
                    Are you sure you want to close this job opening? It will no
                    longer accept new referrals.
                </p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        onClick={onClose}
                        disabled={closeJobOpeningMutation.isPending}
                    >
                        {closeJobOpeningMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <X className="w-4 h-4 mr-2" />
                        )}
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CloseJobOpeningDialog;
