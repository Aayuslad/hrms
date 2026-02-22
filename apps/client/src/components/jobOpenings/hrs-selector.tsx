import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useGetUserList, type UserSummary } from '@/api/user-api';
import { useState, useEffect } from 'react';

type Props = {
    readonly setSelectedHrIds: (ids: string[]) => void;
    readonly value?: string[];
};

export function HrsSelector({ setSelectedHrIds, value = [] }: Props) {
    const [selected, setSelected] = useState<string[]>(value);
    const { data: users = [] } = useGetUserList();

    useEffect(() => {
        setSelectedHrIds(selected);
    }, [selected, setSelectedHrIds]);

    const toggleUser = (id: string) => {
        setSelected((prev) => {
            if (prev.includes(id)) return prev.filter((p) => p !== id);
            return [...prev, id];
        });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    {selected.length > 0
                        ? `${selected.length} HR(s) selected`
                        : 'Select HRs...'}
                </Button>
            </PopoverTrigger>

            <PopoverContent>
                <div className="max-h-60 w-64 overflow-auto">
                    <div className="space-y-2">
                        {users.map((u: UserSummary) => {
                            return (
                                <div
                                    key={u.id}
                                    className="flex items-center justify-between gap-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={selected.includes(
                                                u.id as string
                                            )}
                                            onCheckedChange={() =>
                                                toggleUser(u.id as string)
                                            }
                                            className="me-2"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {u.userName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {u.firstName} {u.lastName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default HrsSelector;
