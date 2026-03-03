import {
    useCreateUserProfile,
    type CreateUserProfileRequest,
} from '@/api/user-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { GENDER, type Gender } from '@/types/enums';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const createUserProfileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    contactNumber: z.string().min(1, 'Contact number is required').optional(),
    gender: z.enum(GENDER).optional(),
    joiningDate: z.string().min(1, 'Joining date is required.').optional(),
    dateOfBirth: z
        .string()
        .min(1, 'date of birth is required')
        .refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid date',
        })
        .optional(),
}) satisfies z.ZodType<CreateUserProfileRequest>;

export function CreateUserProfileForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const createUserMutation = useCreateUserProfile();

    const form = useForm<CreateUserProfileRequest>({
        resolver: zodResolver(createUserProfileSchema),
        defaultValues: {
            firstName: '',
            middleName: '',
            lastName: '',
            gender: undefined,
            contactNumber: '',
            dateOfBirth: '',
            joiningDate: '',
        },
    });

    const onSubmit = async (data: CreateUserProfileRequest) => {
        const contactNumber = data.contactNumber?.trim();
        const dateOfBirth = data.dateOfBirth?.trim();
        data.contactNumber = contactNumber?.replace(/[\s\-()]/g, '');
        data.dateOfBirth = new Date(dateOfBirth ?? '').toISOString();
        createUserMutation.mutate(data);
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        messages.reverse().forEach((msg) => toast.error(msg));
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/placeholder.svg"
                            alt="a quote"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                    <form
                        className="p-6 md:p-8"
                        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    >
                        <div className="flex flex-col gap-6 w-[200px] md:w-[350px]">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">
                                    Profile Details
                                </h1>
                                <p className="text-muted-foreground text-balance">
                                    Enter your details to complete your profile
                                </p>
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="firstName">First Name*</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="your first name"
                                    {...form.register('firstName')}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="middleName">Middle Name</Label>
                                <Input
                                    id="middleName"
                                    type="text"
                                    placeholder="your middle name"
                                    {...form.register('middleName')}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="lastName">Last Name*</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="your last name"
                                    {...form.register('lastName')}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="contactNumber">
                                    Contact Number*
                                </Label>
                                <Input
                                    id="contactNumber"
                                    type="text"
                                    placeholder="+91 999999999"
                                    {...form.register('contactNumber')}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    value={form.watch('gender')}
                                    onValueChange={(value: Gender) =>
                                        form.setValue('gender', value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={GENDER.MALE}>
                                            Male
                                        </SelectItem>
                                        <SelectItem value={GENDER.FEMALE}>
                                            Female
                                        </SelectItem>
                                        <SelectItem value={GENDER.OTHER}>
                                            Other
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-between">
                                <div className="grid gap-3">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input
                                        id="dob"
                                        type="date"
                                        placeholder="your date of birth"
                                        {...form.register('dateOfBirth')}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="doj">Date of Joining</Label>
                                    <Input
                                        id="doj"
                                        type="date"
                                        placeholder="your date of joining"
                                        {...form.register('joiningDate')}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full hover:cursor-pointer"
                                disabled={createUserMutation.isPending}
                            >
                                {createUserMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Submit
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
