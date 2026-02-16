'use client';

import { MinusIcon, PlusIcon } from 'lucide-react';

import { Button, Group, Input } from 'react-aria-components';

type Props = {
    field: number;
    increase: () => void;
    decrease: () => void;
    name?: string;
    min?: number;
    max?: number;
    small?: boolean;
};

const NumberInputWithEndButtons = ({
    field,
    increase,
    decrease,
    name,
    min,
    small,
    max,
}: Props) => {
    return (
        <Group
            className={`dark:bg-input/30 border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex ${small ? 'h-7' : 'h-8'} w-full min-w-0 items-center overflow-hidden rounded-md border bg-transparent text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-within:ring-[3px] md:text-sm`}
        >
            <Input
                value={field}
                disabled
                name={name}
                className={`selection:bg-primary selection:text-primary-foreground w-full grow px-3 ${small ? 'py-1' : 'py-2'} text-center tabular-nums outline-none`}
            />
            <Button
                type="button"
                slot="decrement"
                className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                    if (field === min) return;
                    decrease();
                }}
            >
                <MinusIcon className={`${small ? 'h-4 w-4' : ''}`} />
                <span className="sr-only">Decrement</span>
            </Button>
            <Button
                type="button"
                slot="increment"
                className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center rounded-r-md border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                    if (field === max) return;
                    increase();
                }}
            >
                <PlusIcon className={`${small ? 'h-4 w-4' : ''}`} />
                <span className="sr-only">Increment</span>
            </Button>
        </Group>
    );
};

export default NumberInputWithEndButtons;
