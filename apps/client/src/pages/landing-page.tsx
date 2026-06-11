import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { useLoginUser } from '@/api/user-api';
import { Loader2 } from 'lucide-react';

function LandingPage() {
    const navigate = useNavigate();
    const loginMutation = useLoginUser();
    const [loadingDemo, setLoadingDemo] = useState<null | 'admin' | 'employee'>(null);

    const loginAsDemo = useCallback((type: 'admin' | 'employee') => {
        const creds =
            type === 'admin'
                ? { emailOrUserName: 'admin.user@example.com', password: '123###' }
                : { emailOrUserName: 'employee.one@example.com', password: '123###' };
        setLoadingDemo(type);
        loginMutation.mutate(creds as any, {
            onSettled: () => setLoadingDemo(null),
        });
    }, [loginMutation]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-zinc-900 px-8">

            <div className="w-full max-w-[530px] flex flex-col">

                {/* Identity */}
                <div className="text-center pb-10 border-b border-zinc-200">
                    <h1 className="text-5xl font-bold tracking-tight text-zinc-900 mb-3">
                        HR Management System
                    </h1>
                    <p className="text-base text-zinc-500 mb-4">
                        Your all-in-one platform for modern HR management
                    </p>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                        Manage employees, roles, departments, travel, games, and more with a seamless and intuitive experience.
                    </p>
                </div>

                {/* Demo */}
                <div className="mt-9 px-6 py-6 bg-white border border-zinc-200 border-l-2 border-l-fuchsia-500 rounded-r-md">
                    <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-500 mb-1.5">
                        Try it now
                    </p>
                    <p className="text-base font-semibold text-zinc-800 mb-1.5">Explore the demo</p>
                    <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
                        These demo accounts let you explore features without registering.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            className="flex-1 bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-medium rounded-md h-11 px-4 shadow-none"
                            onClick={() => loginAsDemo('admin')}
                            disabled={loadingDemo !== null}
                        >
                            {loadingDemo === 'admin' ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</>
                            ) : 'Explore as Admin / HR'}
                        </Button>
                        <Button
                            className="flex-1 bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-medium rounded-md h-11 px-4 shadow-none"
                            onClick={() => loginAsDemo('employee')}
                            disabled={loadingDemo !== null}
                        >
                            {loadingDemo === 'employee' ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</>
                            ) : 'Explore as Employee'}
                        </Button>
                    </div>
                </div>

                {/* Auth */}
                <div className="mt-7 flex items-center gap-3">
                    <div className="flex-1 h-px bg-zinc-200" />
                    <span className="text-sm text-zinc-400">or</span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="h-9 px-5 text-sm text-zinc-500 border-zinc-200 bg-white hover:bg-zinc-50 hover:text-zinc-700 rounded-md shadow-none"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>
                        <Button
                            variant="outline"
                            className="h-9 px-5 text-sm text-zinc-500 border-zinc-200 bg-white hover:bg-zinc-50 hover:text-zinc-700 rounded-md shadow-none"
                            onClick={() => navigate('/register')}
                        >
                            Register
                        </Button>
                    </div>
                </div>

            </div>

            <footer className="mt-12 text-sm text-zinc-400">
                © {new Date().getFullYear()} HRMS Project
            </footer>
        </div>
    );
}

export default LandingPage;