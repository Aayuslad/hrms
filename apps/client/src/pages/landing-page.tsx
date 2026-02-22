import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 px-4">
            <header className="mb-10 text-center">
                <h1 className="text-5xl font-extrabold mb-3 text-fuchsia-400 drop-shadow-lg">
                    HR Management System
                </h1>
                <p className="text-lg text-zinc-300 font-medium">Your all-in-one platform for modern HR management</p>
            </header>

            <main className="max-w-2xl w-full text-center space-y-6 bg-zinc-900/80 rounded-2xl shadow-xl p-8 border border-fuchsia-700">
                <p className="text-xl text-zinc-200 font-semibold mb-2">
                    Welcome to the <span className="text-fuchsia-400">HRMS</span> platform.<br/>
                </p>
                <p className="text-zinc-400 mb-6">
                    Manage employees, roles, departments, travel, games, and more with a seamless and intuitive experience.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <Button
                        size={'lg'}
                        className="bg-fuchsia-600 text-white text-lg hover:bg-fuchsia-700 hover:scale-105 transition-all shadow-md px-8 py-2 rounded-lg"
                        onClick={() => navigate('/home')}
                    >
                        Home
                    </Button>
                    <Button
                        size={'lg'}
                        className="bg-blue-600 text-white text-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-md px-8 py-2 rounded-lg"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </Button>
                    <Button
                        size={'lg'}
                        className="bg-green-600 text-white text-lg hover:bg-green-700 hover:scale-105 transition-all shadow-md px-8 py-2 rounded-lg"
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
