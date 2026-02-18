import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Controller } from 'react-hook-form';

interface WeekDaySelectorProps {
    name: string;
    control: any;
    label?: string;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
}

export function WeekDaySelector({
    name,
    control,
    label = 'Week day',
    disabled,
    className,
    placeholder = 'Week day',
}: WeekDaySelectorProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className={className}>
                    {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
                    <Select
                        value={field.value ?? ''}
                        onValueChange={field.onChange}
                        disabled={disabled}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="SUNDAY">Sunday</SelectItem>
                                <SelectItem value="MONDAY">Monday</SelectItem>
                                <SelectItem value="TUESDAY">Tuesday</SelectItem>
                                <SelectItem value="WEDNESDAY">Wednesday</SelectItem>
                                <SelectItem value="THURSDAY">Thursday</SelectItem>
                                <SelectItem value="FRIDAY">Friday</SelectItem>
                                <SelectItem value="SATURDAY">Saturday</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {fieldState.error && (
                        <span className="text-xs text-red-500">{fieldState.error.message}</span>
                    )}
                </div>
            )}
        />
    );
}
