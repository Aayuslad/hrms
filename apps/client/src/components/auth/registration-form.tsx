import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRegisterUser, type RegisterUserRequest } from '@/api/user-api';
import { cn } from '@/lib/utils';

const registerFormSchema = z.object({
    userName: z.string().min(1, 'Username is required'),
    email: z.email('Invalid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters long.')
        .max(100, 'Password must be at most 100 characters long.')
        .regex(/^[A-Za-z\d@#$%&*!]{6,10}$/, {
            message:
                'Password can only include letters, digits, and @ # $ % & * !',
        }),
}) satisfies z.ZodType<RegisterUserRequest>;

export function RegistrationForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const navigate = useNavigate();
    const registerUserMutation = useRegisterUser();

    const form = useForm<RegisterUserRequest>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            userName: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: RegisterUserRequest) => {
        registerUserMutation.mutate(data);
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        messages.reverse().forEach((msg) => toast.error(msg));
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form
                        className="p-6 md:p-8"
                        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    >
                        <div className="flex flex-col gap-6 w-[200px] md:w-[300px]">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">
                                    Create an account
                                </h1>
                                <p className="text-muted-foreground text-balance">
                                    Enter your details to get started
                                </p>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    {...form.register('email')}
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Username</Label>
                                <Input
                                    id="userName"
                                    type="userName"
                                    placeholder="your username"
                                    required
                                    {...form.register('userName')}
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    {...form.register('password')}
                                />
                            </div>
                            <Button
                                type="submit"
                                className={`w-full hover:cursor-pointer ${
                                    registerUserMutation.isPending
                                        ? 'cursor-not-allowed opacity-70'
                                        : ''
                                }`}
                                disabled={registerUserMutation.isPending}
                            >
                                Register
                            </Button>

                            <div className="text-center text-sm">
                                Already have an account?{' '}
                                <Button
                                    type="button"
                                    variant={'link'}
                                    size={'sm'}
                                    onClick={() => navigate('/login')}
                                    className="underline underline-offset-2 -ml-3 hover:cursor-pointer"
                                >
                                    login
                                </Button>
                            </div>
                        </div>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/placeholder.svg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
