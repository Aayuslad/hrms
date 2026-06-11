import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useLoginUser } from '@/api/user-api';
import { Loader2 } from 'lucide-react';

function LandingPage() {
    const navigate = useNavigate();
    const loginMutation = useLoginUser();

    const loginAsDemo = useCallback((type: 'admin' | 'employee') => {
        const creds =
            type === 'admin'
                ? { emailOrUserName: 'admin.user@example.com', password: '123###' }
                : { emailOrUserName: 'employee.one@example.com', password: '123###' };
        loginMutation.mutate(creds as any);
    }, [loginMutation]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 px-4">
            <header className="mb- text-center">
                <h1 className="text-5xl font-extrabold mb-3 drop-shadow-lg">
                    HR Management System
                </h1>
                <p className="text-lg text-zinc-300 font-medium">
                    Your all-in-one platform for modern HR management
                </p>
            </header>

            <main className="max-w-2xl w-full text-center space-y-6   shadow-xl p-8 ">
                <p className="text-zinc-400 mb-6">
                    Manage employees, roles, departments, travel, games, and
                    more with a seamless and intuitive experience.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                    {/* Demo explore buttons - primary and prominent */}
                    <Button
                        size={"lg"}
                        variant={"default"}
                        className="text-white text-lg hover:scale-105 transition-all shadow-2xl px-10 py-4 rounded-lg ring-2 ring-offset-2 ring-fuchsia-500"
                        onClick={() => loginAsDemo('admin')}
                    >
                        {loginMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Explore as Admin/HR'
                        )}
                    </Button>

                    <Button
                        size={"lg"}
                        variant={"default"}
                        className="text-white text-lg hover:scale-105 transition-all shadow-2xl px-10 py-4 rounded-lg ring-2 ring-offset-2 ring-fuchsia-500"
                        onClick={() => loginAsDemo('employee')}
                    >
                        {loginMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Explore as Employee'
                        )}
                    </Button>

                    {/* faded secondary actions */}
                    <Button
                        size={'lg'}
                        className="text-white text-lg opacity-60 hover:opacity-70 transition-all shadow-sm px-8 py-2 rounded-lg"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </Button>
                    <Button
                        size={'lg'}
                        className=" text-white text-lg opacity-60 hover:opacity-70 transition-all shadow-sm px-8 py-2 rounded-lg"
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </Button>
                </div>
            </main>

            <footer className="mt-12 text-sm text-zinc-400">
                © {new Date().getFullYear()} HRMS Project
            </footer>
        </div>
    );
}

export default LandingPage;
