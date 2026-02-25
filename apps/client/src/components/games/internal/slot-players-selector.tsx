import { useGetMe, useGetUserList, type UserSummary } from '@/api/user-api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import * as React from 'react';

type Props = {
    fields: string[];
    append: (x: string) => void;
    remove: (index: number) => void;
};

export function SlotPlayersSelector({ fields, append, remove }: Props) {
    const [open, setOpen] = React.useState(false);
    const { data: me } = useGetMe();
    const { data: users, isLoading } = useGetUserList();
    const filteredUsers = users?.filter((u: UserSummary) => u.id !== me?.id);

    const handleSelect = (user: UserSummary) => {
        if (fields.includes(user.id as string)) {
            remove(fields.indexOf(user.id as string));
            return;
        }
        append(user.id as string);
        setOpen(false);
    };

    if (isLoading)
        return (
            <div>
                <Spinner />
            </div>
        );

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center  w-full">
                <Label>Players</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            role="combobox"
                            aria-expanded={open}
                            className="justify-between hover:cursor-pointer"
                        >
                            + Add Player
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="p-0">
                        <Command>
                            <CommandInput
                                placeholder="Search player..."
                                className="h-9"
                            />
                            <CommandList>
                                <CommandEmpty>No player found.</CommandEmpty>
                                <CommandGroup className="overflow-y-auto">
                                    {filteredUsers?.map((user) => (
                                        <CommandItem
                                            key={user.id}
                                            value={user.id as string}
                                            onSelect={() => handleSelect(user)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Avatar className="border h-8 w-8">
                                                    <AvatarImage
                                                        src={
                                                            filteredUsers?.find(
                                                                (x) =>
                                                                    x.id ===
                                                                    user.id
                                                            )?.profile
                                                                ?.avatarUrl
                                                        }
                                                        alt="@shadcn"
                                                        className="grayscale"
                                                    />
                                                    <AvatarFallback>
                                                        {filteredUsers
                                                            ?.find(
                                                                (x) =>
                                                                    x.id ===
                                                                    user.id
                                                            )
                                                            ?.userName?.[0]?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4 className="text-sm font-medium">
                                                        {
                                                            filteredUsers?.find(
                                                                (x) =>
                                                                    x.id ===
                                                                    user.id
                                                            )?.profile
                                                                ?.firstName
                                                        }{' '}
                                                        {
                                                            filteredUsers?.find(
                                                                (x) =>
                                                                    x.id ===
                                                                    user.id
                                                            )?.profile?.lastName
                                                        }
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        {
                                                            filteredUsers?.find(
                                                                (x) =>
                                                                    x.id ===
                                                                    user.id
                                                            )?.email
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <Check
                                                className={cn(
                                                    'ml-auto',
                                                    fields?.includes(
                                                        user.id as string
                                                    )
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
            </div>

            <div className="rounded-xl overflow-hidden">
                <div className="flex flex-col gap-2  h-[150px] overflow-y-auto border rounded-xl p-2 px-2">
                    {fields?.map((field) => (
                        <div
                            key={field}
                            className="flex items-center bg-muted justify-between w-full gap-4 rounded-lg px-3 py-2 "
                        >
                            <div className="flex items-center gap-2">
                                <Avatar className="border h-8 w-8">
                                    <AvatarImage
                                        src={
                                            filteredUsers?.find(
                                                (x) => x.id === field
                                            )?.profile?.avatarUrl
                                        }
                                        alt="@shadcn"
                                        className="grayscale"
                                    />
                                    <AvatarFallback>
                                        {filteredUsers
                                            ?.find((x) => x.id === field)
                                            ?.userName?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="text-sm font-medium">
                                        {
                                            filteredUsers?.find(
                                                (x) => x.id === field
                                            )?.profile?.firstName
                                        }{' '}
                                        {
                                            filteredUsers?.find(
                                                (x) => x.id === field
                                            )?.profile?.lastName
                                        }
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        {
                                            filteredUsers?.find(
                                                (x) => x.id === field
                                            )?.email
                                        }
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => remove(fields.indexOf(field))}
                                className="ml-1 rounded-full hover:bg-muted hover:cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    {fields?.length === 0 && (
                        <div className="text-center text-muted-foreground flex items-center justify-center h-full">
                            No players selected
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
