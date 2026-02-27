import { useReopenJobOpening } from '@/api/jobs-api';
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
import { Loader2, RefreshCw, X } from 'lucide-react';
import { useState } from 'react';

type Props = {
    jobOpeningId: string;
};

const ReopenJobOpeningDialog = ({ jobOpeningId }: Props) => {
    const reopenJobOpeningMutation = useReopenJobOpening();
    const [open, setOpen] = useState(false);

    const onReopen = () => {
        reopenJobOpeningMutation.mutate(jobOpeningId, {
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
                    className="flex items-center w-full gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Reopen Job Opening
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reopen Job Opening</DialogTitle>
                </DialogHeader>
                <p>
                    Are you sure you want to reopen this job opening? It will
                    start accepting new referrals again.
                </p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        onClick={onReopen}
                        disabled={reopenJobOpeningMutation.isPending}
                    >
                        {reopenJobOpeningMutation.isPending && (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        )}
                        Reopen
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReopenJobOpeningDialog;
