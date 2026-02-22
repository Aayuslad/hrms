import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';

export function useAccessChecker() {
    const { userRoles } = useAppStore(
        useShallow((s) => ({
            userRoles: s.userRoles ?? [],
        }))
    );

    return (requiredRoles?: string[]) => {
        if (!requiredRoles || requiredRoles.length === 0) return true;
        return requiredRoles.some((role) => userRoles.includes(role));
    };
}
