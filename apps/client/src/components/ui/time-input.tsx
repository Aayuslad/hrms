import { Clock8Icon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label as RACLabel } from 'react-aria-components';
import { Controller } from 'react-hook-form';

interface TimeInputProps {
    name: string;
    control: any;
    label?: string;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
}

const TimeInput = ({
    name,
    control,
    label = 'Time input with start icon',
    disabled,
    className,
    placeholder,
}: TimeInputProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className={`w-full max-w-xs space-y-2 ${className ?? ''}`}>
                    <RACLabel htmlFor={name}>{label}</RACLabel>
                    <div className="relative">
                        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
                            <Clock8Icon className="size-4" />
                            <span className="sr-only">User</span>
                        </div>
                        <Input
                            type="time"
                            id={name}
                            step="1"
                            className="peer bg-background appearance-none pl-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            disabled={disabled}
                            placeholder={placeholder}
                        />
                    </div>
                    {fieldState.error && (
                        <span className="text-xs text-red-500">{fieldState.error.message}</span>
                    )}
                </div>
            )}
        />
    );
};

export default TimeInput;
