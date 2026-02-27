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
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Share } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useShareJobOpening,
    type ShareJobOpeningRequest,
} from '@/api/jobs-api';

const shareJobOpeningFormSchema = z.object({
    shareToEmail: z.string().email({ message: 'Invalid email address' }),
}) satisfies z.ZodType<Omit<ShareJobOpeningRequest, 'jobOpeningId'>>;

type Props = {
    jobOpeningId: string;
    disabled?: boolean;
};

const ShareJobOpeningDialog = ({ jobOpeningId, disabled }: Props) => {
    const shareJobOpeningMutation = useShareJobOpening();
    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(shareJobOpeningFormSchema),
        defaultValues: {
            shareToEmail: '',
        },
    });

    const onSubmit = (data: Omit<ShareJobOpeningRequest, 'jobOpeningId'>) => {
        shareJobOpeningMutation.mutate(
            { id: jobOpeningId, payload: { ...data, jobOpeningId } },
            {
                onSuccess: () => {
                    setOpen(false);
                    form.reset();
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    disabled={disabled}
                >
                    <Share className="w-4 h-4 mr-2" />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Job Opening</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="shareToEmail">Email Address</Label>
                            <Input
                                id="shareToEmail"
                                type="email"
                                {...form.register('shareToEmail')}
                            />
                            {form.formState.errors.shareToEmail && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.shareToEmail.message}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={shareJobOpeningMutation.isPending}
                            >
                                {shareJobOpeningMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Share className="w-4 h-4 mr-2" />
                                )}
                                Share
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ShareJobOpeningDialog;
