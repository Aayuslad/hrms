import {
    useUpdateJobOpening,
    type JobOpening,
    type UpdateJobOpeningRequest,
} from '@/api/jobs-api';
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
import { NumberInputWithEndButtons } from '@/components/ui/number-input-with-end-buttons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import z from 'zod';
import { DefaultHrSelector } from '../internal/default-hr-selector';
import { HRsSelector } from '../internal/hrs-selector';
import { ReviewersSelector } from '../internal/reviewers-selector';

const updateJobOpeningFormSchema = z.object({
    description: z.string().optional(),
    designationId: z.string().min(1),
    requiredExperience: z.number().min(0).optional(),
    jd: z.string().optional(),
    defaultHrId: z.string(),
    hrs: z.array(z.string()).optional(),
    reviewers: z.array(z.string()).optional(),
}) satisfies z.ZodType<Omit<UpdateJobOpeningRequest, 'id'>>;

type Props = {
    jobOpening: JobOpening;
};

const UpdateJobOpeningDialog = ({ jobOpening }: Props) => {
    const [open, setOpen] = useState(false);
    const updateJobOpeningMutation = useUpdateJobOpening();
    const [jd, setJd] = useState<File>();

    const form = useForm({
        resolver: zodResolver(updateJobOpeningFormSchema),
        defaultValues: {
            description: jobOpening.description || '',
            designationId: jobOpening.designation?.id || '',
            requiredExperience: jobOpening.requiredExperience || 0,
            jd: undefined,
            defaultHrId: jobOpening.defaultHr?.id || '',
            hrs: jobOpening.hrs?.map((hr) => hr.id!) || [],
            reviewers:
                jobOpening.reviewers?.map((reviewer) => reviewer.id!) || [],
        },
    });

    const hrsFieldArray = useFieldArray({
        control: form.control,
        //@ts-ignore
        name: 'hrs',
    });

    const reviewersFieldArray = useFieldArray({
        control: form.control,
        //@ts-ignore
        name: 'reviewers',
    });

    const onSubmit = (data: Omit<UpdateJobOpeningRequest, 'id'>) => {
        const formData = new FormData();
        formData.append('id', jobOpening.id!);
        formData.append('description', data.description || '');
        formData.append('designationId', data.designationId);
        if (data.requiredExperience !== undefined) {
            formData.append(
                'requiredExperience',
                data.requiredExperience.toString()
            );
        }
        if (jd) {
            formData.append('jd', jd);
        }
        formData.append('defaultHrId', data.defaultHrId);
        data.hrs?.forEach((hr) => formData.append('hrs', hr));
        data.reviewers?.forEach((reviewer) =>
            formData.append('reviewers', reviewer)
        );

        updateJobOpeningMutation.mutate(
            { ...data, id: jobOpening.id! },
            {
                onSuccess: () => {
                    setOpen(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center w-full gap-2"
                >
                    <Pencil className="h-4 w-4" />
                    Update Job Opening
                </Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[min(700px,85vh)] flex-col gap-0 p-0 sm:max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <DialogHeader className="px-6 pt-6 pb-4 border-b">
                            <DialogTitle>Update Job Opening</DialogTitle>
                        </DialogHeader>

                        <ScrollArea className="px-6 h-[400px]">
                            <div className="space-y-5 py-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Job description"
                                        {...form.register('description')}
                                        className="min-h-25"
                                    />
                                </div>

                                <div className="grid gap-3 w-full">
                                    <NumberInputWithEndButtons
                                        name="requiredExperience"
                                        control={form.control}
                                        minValue={0}
                                        label="Required Experience (years)"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="jd">
                                        Job Description File
                                    </Label>
                                    <Input
                                        id="jd"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) =>
                                            setJd(e.target.files?.[0])
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="defaultHrId">
                                        Default HR
                                    </Label>
                                    <DefaultHrSelector
                                        setSelectedHrId={(selectedId) =>
                                            form.setValue(
                                                'defaultHrId',
                                                selectedId
                                            )
                                        }
                                        value={form.watch('defaultHrId')}
                                    />
                                </div>

                                <HRsSelector
                                    fields={form.watch('hrs') ?? []}
                                    append={hrsFieldArray.append}
                                    remove={hrsFieldArray.remove}
                                />

                                <ReviewersSelector
                                    fields={form.watch('reviewers') ?? []}
                                    append={reviewersFieldArray.append}
                                    remove={reviewersFieldArray.remove}
                                />
                            </div>
                        </ScrollArea>

                        <DialogFooter className="flex-row justify-end gap-3 border-t px-6 py-4">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                disabled={updateJobOpeningMutation.isPending}
                            >
                                {updateJobOpeningMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Update Job Opening
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateJobOpeningDialog;
