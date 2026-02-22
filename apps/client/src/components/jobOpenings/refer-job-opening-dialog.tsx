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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useCreateJobOpeningReferral,
    type CreateJobOpeningReferralRequest,
} from '@/api/jobs-api';

const referJobOpeningFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required'),
    cvUrl: z.string().min(1, 'CV URL is required'),
    note: z.string().optional(),
}) satisfies z.ZodType<Omit<CreateJobOpeningReferralRequest, 'jobOpeningId'>>;

type Props = {
    jobOpeningId: string;
};

const ReferJobOpeningDialog = ({ jobOpeningId }: Props) => {
    const createReferralMutation = useCreateJobOpeningReferral();
    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(referJobOpeningFormSchema),
        defaultValues: {
            name: '',
            email: '',
            cvUrl: '',
            note: '',
        },
    });

    const onSubmit = (
        data: Omit<CreateJobOpeningReferralRequest, 'jobOpeningId'>
    ) => {
        createReferralMutation.mutate(
            { ...data, jobOpeningId },
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
                <Button size="sm" variant="outline" className="flex-1">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Refer
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Refer Candidate</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div  className="grid gap-2">
                            <Label htmlFor="name">Candidate Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter candidate name"
                                {...form.register('name')}
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>
                        <div  className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter candidate email"
                                {...form.register('email')}
                            />
                            {form.formState.errors.email && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>
                        <div  className="grid gap-2">
                            <Label htmlFor="cvUrl">CV URL</Label>
                            <Input
                                id="cvUrl"
                                type="url"
                                placeholder="Enter CV URL"
                                {...form.register('cvUrl')}
                            />
                            {form.formState.errors.cvUrl && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.cvUrl.message}
                                </p>
                            )}
                        </div>
                        <div  className="grid gap-2">
                            <Label htmlFor="note">Note (Optional)</Label>
                            <Textarea
                                id="note"
                                placeholder="Any additional notes"
                                {...form.register('note')}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={createReferralMutation.isPending}
                            >
                                {createReferralMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <UserPlus className="w-4 h-4 mr-2" />
                                )}
                                Refer
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ReferJobOpeningDialog;
