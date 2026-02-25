import { useLoginUser, type LoginUserRequest } from '@/api/user-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const loginFormSchema = z.object({
    emailOrUserName: z.string().min(1, 'Username or Email is required'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters long.')
        .max(100, 'Password must be at most 100 characters long.')
        .regex(/^[A-Za-z\d@#$%&*!]{6,10}$/, {
            message:
                'Password can only include letters, digits, and @ # $ % & * !',
        }),
}) satisfies z.ZodType<LoginUserRequest>;

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const navigate = useNavigate();
    const loginUserMutation = useLoginUser();

    const form = useForm<LoginUserRequest>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            emailOrUserName: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginUserRequest) => {
        loginUserMutation.mutate(data);
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
                                    Welcome back
                                </h1>
                                <p className="text-muted-foreground text-balance">
                                    Login to your account
                                </p>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Username or Email</Label>
                                <Input
                                    id="usernameOrEmail"
                                    type="text"
                                    placeholder="m@example.com or username"
                                    {...form.register('emailOrUserName')}
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    {...form.register('password')}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full hover:cursor-pointer"
                                disabled={loginUserMutation.isPending}
                            >
                                {loginUserMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Login
                            </Button>

                            <div className="text-center text-sm">
                                Don&apos;t have an account?{' '}
                                <Button
                                    type="button"
                                    variant={'link'}
                                    size={'sm'}
                                    onClick={() => navigate('/register')}
                                    className="underline underline-offset-2 -ml-3 hover:cursor-pointer"
                                >
                                    register
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
