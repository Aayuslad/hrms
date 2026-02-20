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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

import { WEEK_DAYS } from '@/types/enums';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Label } from '../ui/label';
import { NumberInputWithEndButtons } from '../ui/number-input-with-end-buttons';
import TimeInput from '../ui/time-input';
import { WeekDaySelector } from '../ui/week-day-selector';
import {
    useCreateJobOpening,
    type CreateJobOpeningRequest,
} from '@/api/jobs-api';
import { DesignationSelector } from './designations-selector';
import { TextArea } from 'react-aria-components';

const createJobOpeningFormSchema = z.object({
    description: z.string().optional(),
    designationId: z.string().min(1),
    requiredExperience: z.number().optional(),
    jd: z.string().optional(),
    defaultHrId: z.string(),
    hrs: z.array(z.string()).optional(),
    reviewers: z.array(z.string()).optional(),
}) satisfies z.ZodType<CreateJobOpeningRequest>;

const CreateJobOpeningDialog = () => {
    const createJobOpeningMutation = useCreateJobOpening();
    const [open, setOpen] = useState(false);
    const [jd, setJd] = useState<File>();

    const form = useForm({
        resolver: zodResolver(createJobOpeningFormSchema),
    } as const);

    const onSubmit = async (data: CreateJobOpeningRequest) => {
        const formData = new FormData();
        formData.append('description', data.description ?? '');
        formData.append('designationId', data.designationId ?? '');
        formData.append(
            'requiredExperience',
            data.requiredExperience?.toString() ?? ''
        );
        formData.append('jd', jd ?? '');
        formData.append('defaultHrId', data.defaultHrId);
        data.hrs?.forEach((x) => formData.append('hrs[]', x));
        data.reviewers?.forEach((x) => formData.append('reviewers[]', x));

        await createJobOpeningMutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                setOpen(false);
            },
        });
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        messages.reverse().forEach((msg) => toast.error(msg));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create job opening</Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[min(700px,85vh)] flex-col gap-0 p-0 sm:max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                        <DialogHeader className="px-6 pt-6">
                            <DialogTitle>Create job opening</DialogTitle>
                        </DialogHeader>

                        <ScrollArea className="px-6 py-4">
                            <div className="space-y-5">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Designation*</Label>
                                    <DesignationSelector
                                        setSelectedDesignationId={(
                                            selectedId
                                        ) =>
                                            form.setValue(
                                                'designationId',
                                                selectedId
                                            )
                                        }
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="descirption">
                                        Description
                                    </Label>
                                    <TextArea                               
                                        {...form.register('description')}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <NumberInputWithEndButtons
                                        name="slotDuration"
                                        control={form.control}
                                        label="Slot Duration (minutes)*"
                                        minValue={1}
                                        step={1}
                                    />

                                    <NumberInputWithEndButtons
                                        name="maxSlotPlayers"
                                        control={form.control}
                                        label="Max Players per Slot*"
                                        minValue={1}
                                        step={1}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <TimeInput
                                        name="openTime"
                                        control={form.control}
                                        label="Open Time*"
                                    />
                                    <TimeInput
                                        name="closeTime"
                                        control={form.control}
                                        label="Close Time*"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <WeekDaySelector
                                        name="openingDayOfWeek"
                                        control={form.control}
                                        label="Opening Day*"
                                    />
                                    <WeekDaySelector
                                        name="closingDayOfWeek"
                                        control={form.control}
                                        label="Closing Day*"
                                    />
                                </div>
                            </div>
                        </ScrollArea>

                        <DialogFooter className="flex-row justify-end gap-3 border-t px-6 py-4">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                disabled={createJobOpeMutation.isPending}
                            >
                                {createJobOpeMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create JobOpe
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateJobOpeningDialog;
