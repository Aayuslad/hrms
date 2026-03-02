import { useGetDepartmentes } from '@/api/department-api';
import { useGetDesignations } from '@/api/designation-api';
import {
    useGetUserList,
    useUpdateUserByAdmin,
    type UpdateUserByAdminRequest,
} from '@/api/user-api';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useShallow } from 'zustand/react/shallow';

type FormData = {
    userId: string;
    profile: {
        firstName: string;
        middleName?: string;
        lastName: string;
        contactNumber?: string;
        dateOfBirth?: string;
        gender?: 'MALE' | 'FEMALE' | 'OTHER';
        joiningDate?: string;
        departmentId?: string;
        designationId?: string;
        managerId?: string;
    };
};

const updateEmployeeFormSchema = z.object({
    userId: z.string(),
    profile: z.object({
        firstName: z.string().min(1, 'First name is required'),
        middleName: z.string().optional(),
        lastName: z.string().min(1, 'Last name is required'),
        contactNumber: z.string().optional(),
        dateOfBirth: z.string().optional(),
        gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
        joiningDate: z.string().optional(),
        departmentId: z.string().optional(),
        designationId: z.string().optional(),
        managerId: z.string().optional(),
    }),
});

export function UpdateEmployeeDialog() {
    const updateEmployeeMutation = useUpdateUserByAdmin();
    const { data: departments } = useGetDepartmentes();
    const { data: designations } = useGetDesignations();
    const { data: users } = useGetUserList();
    const { configDialogOpen, configDialogTarget, closeConfigDialog } =
        useAppStore(
            useShallow((s) => ({
                configDialogOpen: s.configDialogOpen,
                configDialogTarget: s.configDialogTarget,
                closeConfigDialog: s.closeConfigDialog,
            }))
        );

    const form = useForm<FormData>({
        resolver: zodResolver(updateEmployeeFormSchema),
    });

    useEffect(() => {
        if (configDialogTarget?.payload) {
            form.reset({
                userId: configDialogTarget?.payload.id!,
                profile: {
                    firstName:
                        configDialogTarget?.payload.profile?.firstName || '',
                    middleName:
                        configDialogTarget?.payload.profile?.middleName || '',
                    lastName:
                        configDialogTarget?.payload.profile?.lastName || '',
                    contactNumber:
                        configDialogTarget?.payload.profile?.contactNumber ||
                        '',
                    dateOfBirth:
                        configDialogTarget?.payload.profile?.dateOfBirth || '',
                    gender: configDialogTarget?.payload.profile?.gender,
                    joiningDate:
                        configDialogTarget?.payload.profile?.joiningDate || '',
                    departmentId:
                        configDialogTarget?.payload.profile?.department?.id ||
                        '',
                    designationId:
                        configDialogTarget?.payload.profile?.designation?.id ||
                        '',
                    managerId:
                        configDialogTarget?.payload.profile?.manager?.id || '',
                },
            });
        }
    }, [configDialogTarget?.payload]);

    const onSubmit = async (data: FormData) => {
        const payload: UpdateUserByAdminRequest = {
            userId: data.userId,
            profile: data.profile,
        };

        updateEmployeeMutation.mutate(
            { id: payload.userId, payload },
            {
                onSuccess: () => {
                    form.reset();
                    closeConfigDialog();
                },
            }
        );
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err: any) => err?.message);
        messages.reverse().forEach((msg) => msg && toast.error(msg));
    };

    return (
        <Dialog
            open={
                configDialogOpen &&
                configDialogTarget?.entity === 'employees' &&
                configDialogTarget?.mode === 'update-profile'
            }
            onOpenChange={(state) => state === false && closeConfigDialog()}
        >
            <DialogContent className="sm:max-w-[400px] max-h-[95vh] flex flex-col p-0">
                <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                    <DialogHeader className="px-6 pt-6 pb-4 border-b">
                        <DialogTitle>Update Employee Profile</DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="px-6 h-[450px]">
                        <div className="space-y-5 py-6">
                            <div className="grid gap-2">
                                <Label>First Name</Label>
                                <Input
                                    {...form.register('profile.firstName')}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Middle Name</Label>
                                <Input
                                    {...form.register('profile.middleName')}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Last Name</Label>
                                <Input {...form.register('profile.lastName')} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Contact Number</Label>
                                <Input
                                    {...form.register('profile.contactNumber')}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Date of Birth</Label>
                                <Input
                                    type="date"
                                    {...form.register('profile.dateOfBirth')}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Gender</Label>
                                <Select
                                    value={form.watch('profile.gender') || ''}
                                    onValueChange={(value) =>
                                        form.setValue(
                                            'profile.gender',
                                            value as 'MALE' | 'FEMALE' | 'OTHER'
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MALE">
                                            Male
                                        </SelectItem>
                                        <SelectItem value="FEMALE">
                                            Female
                                        </SelectItem>
                                        <SelectItem value="OTHER">
                                            Other
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Joining Date</Label>
                                <Input
                                    type="date"
                                    {...form.register('profile.joiningDate')}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Department</Label>
                                <Select
                                    value={
                                        form.watch('profile.departmentId') || ''
                                    }
                                    onValueChange={(value) =>
                                        form.setValue(
                                            'profile.departmentId',
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments?.map((dept) => (
                                            <SelectItem
                                                key={dept.id!}
                                                value={dept.id!}
                                            >
                                                {dept.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Designation</Label>
                                <Select
                                    value={
                                        form.watch('profile.designationId') ||
                                        ''
                                    }
                                    onValueChange={(value) =>
                                        form.setValue(
                                            'profile.designationId',
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select designation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {designations?.map((desig) => (
                                            <SelectItem
                                                key={desig.id!}
                                                value={desig.id!}
                                            >
                                                {desig.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Manager</Label>
                                <Select
                                    value={
                                        form.watch('profile.managerId') || ''
                                    }
                                    onValueChange={(value) =>
                                        form.setValue(
                                            'profile.managerId',
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select manager" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users?.map((usr) => (
                                            <SelectItem
                                                key={usr.id!}
                                                value={usr.id!}
                                            >
                                                {usr.profile?.firstName}{' '}
                                                {usr.profile?.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="flex-row justify-end gap-3 border-t px-6 py-4">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                type="button"
                                disabled={updateEmployeeMutation.isPending}
                            >
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            disabled={updateEmployeeMutation.isPending}
                        >
                            {updateEmployeeMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
