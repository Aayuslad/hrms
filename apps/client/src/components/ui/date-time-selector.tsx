'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Label } from './label';

interface Props {
    name: string;
    setDateTime: (dateTime: Date) => void;
    label?: string;
    defaultDate?: Date;
    disabled?: boolean;
}

const DateTimeSelector = ({
    name,
    label,
    disabled,
    defaultDate,
    setDateTime,
}: Props) => {
    const [date, setDate] = React.useState(defaultDate);
    const [isOpen, setIsOpen] = React.useState(false);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
        if (date) {
            const newDate = new Date(date);
            if (type === 'hour') {
                newDate.setHours(parseInt(value));
            } else if (type === 'minute') {
                newDate.setMinutes(parseInt(value));
            }
            setDate(newDate);
        }
    };

    React.useEffect(() => {
        date && setDateTime(date);
    }, [date]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div className="grid gap-3">
                    <Label>{label}</Label>
                    <Button
                        variant="outline"
                        disabled={disabled}
                        name={name}
                        type="button"
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                            format(date, 'MM/dd/yyyy HH:mm')
                        ) : (
                            <span>MM/DD/YYYY HH:MM</span>
                        )}
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="sm:flex">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {hours.reverse().map((hour) => (
                                    <Button
                                        key={hour}
                                        size="icon"
                                        variant={
                                            date && date.getHours() === hour
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() =>
                                            handleTimeChange(
                                                'hour',
                                                hour.toString()
                                            )
                                        }
                                    >
                                        {hour}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                            />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from(
                                    { length: 12 },
                                    (_, i) => i * 5
                                ).map((minute) => (
                                    <Button
                                        key={minute}
                                        size="icon"
                                        variant={
                                            date && date.getMinutes() === minute
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() =>
                                            handleTimeChange(
                                                'minute',
                                                minute.toString()
                                            )
                                        }
                                    >
                                        {minute.toString().padStart(2, '0')}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                            />
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default DateTimeSelector;
