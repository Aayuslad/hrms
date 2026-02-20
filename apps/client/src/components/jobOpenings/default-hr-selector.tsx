import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { useGetUserList, type UserSummary } from '@/api/user-api';
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

type Props = {
    readonly setSelectedHrId: (id: string) => void;
    readonly value?: string;
};

export function DefaultHrSelector({ setSelectedHrId, value }: Props) {
    const [open, setOpen] = React.useState(false);
    const [selectedHr, setSelectedHr] = React.useState<UserSummary | undefined>();
    const { data: users = [], isLoading } = useGetUserList();

    React.useEffect(() => {
        if (selectedHr) {
            setSelectedHrId(selectedHr.id as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedHr]);

    React.useEffect(() => {
        if (value && users.length > 0 && !selectedHr) {
            const user = users.find((u) => u.id === value);
            if (user) {
                setSelectedHr(user);
            }
        }
    }, [value, users, selectedHr]);

    const handleSelect = (user: UserSummary) => {
        setSelectedHr(user);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedHr
                        ? users?.find(
                              (user) =>
                                  user.id === selectedHr.id
                          )?.userName
                        : 'Select HR...'}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-62.5 p-0">
                <Command>
                    <CommandInput
                        placeholder="Search HR..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No HR found.</CommandEmpty>
                        {isLoading && (
                            <CommandEmpty>
                                Loading HRs...
                            </CommandEmpty>
                        )}
                        <CommandGroup>
                            {users?.map((user) => (
                                <CommandItem
                                    key={user.id}
                                    value={user.userName || ''}
                                    onSelect={() => handleSelect(user)}
                                >
                                    <div className="flex flex-col">
                                        <span>{user.userName}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {user.firstName} {user.lastName}
                                        </span>
                                    </div>
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            selectedHr?.id === user.id
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
