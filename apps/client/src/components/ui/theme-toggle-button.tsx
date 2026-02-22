import { useAppStore } from '@/store';
import { Moon, Sun } from 'lucide-react';
import { Button } from './button';

export function ThemeToggleButton() {
    const { theme, toggleTheme } = useAppStore();

    return (
        <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            className="flex items-center space-x-2 mx-3"
        >
            {theme === 'dark' ? <Sun size={96} /> : <Moon size={96} />}
        </Button>
    );
}
