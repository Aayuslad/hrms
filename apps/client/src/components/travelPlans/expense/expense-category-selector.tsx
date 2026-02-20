/* eslint-disable indent */
'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import {
    useGetDocumentTypes,
    type DocumentType,
} from '@/api/document-type-api';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useGetExpenseCategories } from '@/api/expense-category-api';

type Props = {
    setSelectedExpenseCategoryId: (id: string) => void;
};

export function ExpenseCategorySelector({
    setSelectedExpenseCategoryId,
}: Props) {
    const [open, setOpen] = React.useState(false);
    const [selectedExpenseCatrgory, setSelectedExpenseCategory] =
        React.useState<DocumentType>();
    const { data: expenseCatrgories, isLoading } = useGetExpenseCategories();

    React.useEffect(() => {
        if (selectedExpenseCatrgory) {
            setSelectedExpenseCategoryId(selectedExpenseCatrgory.id as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedExpenseCatrgory]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[300px] justify-between"
                >
                    {selectedExpenseCatrgory
                        ? expenseCatrgories?.find(
                              (expenseCategory) =>
                                  expenseCategory.name ===
                                  selectedExpenseCatrgory.name
                          )?.name
                        : 'Select expense category...'}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search expense category..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No expense category found.</CommandEmpty>
                        {isLoading && (
                            <CommandEmpty>
                                Loading expense categories...
                            </CommandEmpty>
                        )}
                        <CommandGroup>
                            {expenseCatrgories?.map((expenseCategory) => (
                                <CommandItem
                                    key={expenseCategory.id}
                                    value={expenseCategory.name}
                                    onSelect={(
                                        currentValue: string | undefined
                                    ) => {
                                        setSelectedExpenseCategory(
                                            expenseCatrgories.find(
                                                (expenseCategory) =>
                                                    expenseCategory.name ===
                                                    currentValue
                                            )
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    {expenseCategory.name}
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            selectedExpenseCatrgory?.id ===
                                                expenseCategory.id
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
