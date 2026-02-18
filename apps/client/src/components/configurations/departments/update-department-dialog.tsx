import {
    useUpdateDepartment,
    type Department,
    type UpdateDepartmentRequest,
} from '@/api/department-api';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import z from 'zod';

const updateDepartmentFormSchema = z.object({
    id: z.string().nonempty('Department ID is required'),
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must be at most 50 characters long'),
}) satisfies z.ZodType<UpdateDepartmentRequest>;

export function UpdateDepartmentDialog() {
    const location = useLocation();
    const department = location.state as Department;
    const updateDepartmentMutation = useUpdateDepartment();
    const navigate = useNavigate();

    const form = useForm<UpdateDepartmentRequest>({
        resolver: zodResolver(updateDepartmentFormSchema),
        defaultValues: {
            id: department.id,
            name: department.name,
        },
    });

    const onSubmit = async (data: UpdateDepartmentRequest) => {
        updateDepartmentMutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                navigate('/configuration/departments');
            },
        });
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        messages.slice().reverse().forEach((msg) => toast.error(msg));
    };

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-lg">
                <form
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    className="grid gap-7"
                >
                    <DialogHeader>
                        <DialogTitle>Update Department</DialogTitle>
                        <DialogDescription>
                            Update the department details and click Save.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...form.register('name')} />
                        </div>
                    </div>

                    <DialogFooter>
                        <div>
                            <Button
                                variant="outline"
                                type="button"
                                disabled={updateDepartmentMutation.isPending}
                                onClick={() =>
                                    navigate('/configuration/departments')
                                }
                            >
                                Cancel
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            disabled={updateDepartmentMutation.isPending}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}