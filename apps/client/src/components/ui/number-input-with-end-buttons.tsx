import { MinusIcon, PlusIcon } from 'lucide-react';
import {
    Button,
    Group,
    Input,
    Label,
    NumberField,
} from 'react-aria-components';
import { Controller } from 'react-hook-form';

interface NumberInputWithEndButtonsProps {
    name: string;
    control: any;
    label?: string;
    minValue?: number;
    maxValue?: number;
    step?: number;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function NumberInputWithEndButtons({
    name,
    control,
    label = 'Input with end buttons',
    minValue = 0,
    maxValue,
    step = 1,
    placeholder,
    disabled,
    className,
}: NumberInputWithEndButtonsProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <NumberField
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    minValue={minValue}
                    maxValue={maxValue}
                    step={step}
                    isDisabled={disabled}
                    className={`w-full max-w-xs space-y-2 ${className ?? ''}`}
                >
                    <Label className="flex items-center gap-2 text-sm leading-none font-medium select-none">
                        {label}
                    </Label>
                    <Group className="dark:bg-input/30 border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border bg-transparent text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-within:ring-[3px] md:text-sm">
                        <Input
                            className="selection:bg-primary selection:text-primary-foreground w-full grow px-3 py-2 text-center tabular-nums outline-none"
                            placeholder={placeholder}
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            disabled={disabled}
                        />
                        <Button
                            slot="decrement"
                            className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            onPress={() =>
                                field.onChange((field.value ?? minValue) - step)
                            }
                            isDisabled={
                                disabled ||
                                (field.value ?? minValue) <= minValue
                            }
                        >
                            <MinusIcon />
                            <span className="sr-only">Decrement</span>
                        </Button>
                        <Button
                            slot="increment"
                            className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center rounded-r-md border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            onPress={() =>
                                field.onChange((field.value ?? minValue) + step)
                            }
                            isDisabled={
                                disabled ||
                                (maxValue !== undefined &&
                                    (field.value ?? minValue) >= maxValue)
                            }
                        >
                            <PlusIcon />
                            <span className="sr-only">Increment</span>
                        </Button>
                    </Group>
                    {fieldState.error && (
                        <span className="text-xs text-red-500">
                            {fieldState.error.message}
                        </span>
                    )}
                </NumberField>
            )}
        />
    );
}
