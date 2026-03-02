import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function handleApiError(
    error: AxiosError<{ message: string }>,
    fallbackMessage: string
) {
    toast.error(
        error.response?.data?.message ||
            error.message ||
            fallbackMessage
    );
    console.error(fallbackMessage, error);
}
