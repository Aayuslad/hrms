import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '../ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    useUpdateJobOpening,
    type JobOpening,
    type UpdateJobOpeningRequest,
} from '@/api/jobs-api';
import { DesignationSelector } from './designations-selector';
import { DefaultHrSelector } from './default-hr-selector';
import { HrsSelector } from './hrs-selector';
import { ReviewersSelector } from './reviewers-selector';

const updateJobOpeningFormSchema = z.object({
    description: z.string().optional(),
    designationId: z.string().min(1),
    requiredExperience: z.number().optional(),
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
            jd: '',
            defaultHrId: jobOpening.defaultHr?.id || '',
            hrs: jobOpening.hrs?.map((hr) => hr.id!) || [],
            reviewers:
                jobOpening.reviewers?.map((reviewer) => reviewer.id!) || [],
        },
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
                    size="sm"
                    className="w-full justify-start text-blue-600 hover:text-blue-700"
                >
                    Update
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Update Job Opening</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=""
                >
                    <ScrollArea className="h-[400px] py-3">
                        <div className='space-y-2 px-4'>
                            <div className="grid gap-2">
                                <Label htmlFor="designationId">
                                    Designation
                                </Label>
                                <DesignationSelector
                                    setSelectedDesignationId={(selectedId) =>
                                        form.setValue(
                                            'designationId',
                                            selectedId
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Job description"
                                    {...form.register('description')}
                                    className="min-h-25"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="requiredExperience">
                                    Required Experience (years)
                                </Label>
                                <Input
                                    id="requiredExperience"
                                    type="number"
                                    min={0}
                                    {...form.register('requiredExperience', {
                                        valueAsNumber: true,
                                    })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="jd">Job Description File</Label>
                                <Input
                                    id="jd"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setJd(e.target.files?.[0])}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="defaultHrId">Default HR</Label>
                                <DefaultHrSelector
                                    setSelectedHrId={(selectedId) =>
                                        form.setValue('defaultHrId', selectedId)
                                    }
                                    value={form.watch('defaultHrId')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="hrs">HRs</Label>
                                <HrsSelector
                                    setSelectedHrIds={(selectedIds) =>
                                        form.setValue('hrs', selectedIds)
                                    }
                                    value={form.getValues('hrs')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="reviewers">Reviewers</Label>
                                <ReviewersSelector
                                    setSelectedReviewerIds={(selectedIds) =>
                                        form.setValue('reviewers', selectedIds)
                                    }
                                    value={form.getValues('reviewers')}
                                />
                            </div>
                        </div>
                    </ScrollArea>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateJobOpeningMutation.isPending}
                        >
                            {updateJobOpeningMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            Update
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateJobOpeningDialog;
