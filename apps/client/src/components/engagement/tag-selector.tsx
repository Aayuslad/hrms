import { useGetTags, useCreateTag } from '@/api/tag-api';
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
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, Plus, Tags } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

type TagSelectorProps = {
    readonly selectedTagIds: string[];
    readonly onTagsChange: (tagIds: string[]) => void;
};

export function TagSelector({
    selectedTagIds,
    onTagsChange,
}: TagSelectorProps) {
    const { data: tags = [], isLoading } = useGetTags();
    const createTagMutation = useCreateTag();
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');

    const handleTagToggle = (tagId: string) => {
        if (selectedTagIds.includes(tagId)) {
            onTagsChange(selectedTagIds.filter((id) => id !== tagId));
        } else {
            onTagsChange([...selectedTagIds, tagId]);
        }
    };

    const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id!));

    // Find if inputValue matches any tag (case-insensitive)
    const inputTrimmed = inputValue.trim();
    const tagExists = tags.some(
        (tag) => tag?.name?.toLowerCase() === inputTrimmed.toLowerCase()
    );

    const handleCreateTag = async () => {
        if (!inputTrimmed || tagExists) return;
        await createTagMutation.mutateAsync({ name: inputTrimmed });
        setInputValue('');
    };

    return (
        <div className="space-y-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between"
                        role="combobox"
                        aria-expanded={open}
                    >
                        <div className="w-full flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1">
                                <Tags className="h-4 w-4" />

                                {selectedTags.length > 0
                                    ? `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''} selected`
                                    : 'Select Tags'}
                            </span>

                            <ChevronsUpDown className="opacity-50" />
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                    <Command>
                        <CommandInput
                            placeholder="Search or create tag..."
                            className="h-9"
                            value={inputValue}
                            onValueChange={setInputValue}
                        />
                        <CommandList>
                            <CommandEmpty>
                                {isLoading
                                    ? 'Loading tags...'
                                    : 'No tag found.'}
                            </CommandEmpty>
                            <CommandGroup>
                                {tags
                                    .filter((tag) =>
                                        tag?.name
                                            ?.toLowerCase()
                                            ?.includes(
                                                inputTrimmed.toLowerCase()
                                            )
                                    )
                                    .map((tag) => (
                                        <CommandItem
                                            key={tag.id}
                                            value={tag.name}
                                            onSelect={() => {
                                                handleTagToggle(tag.id!);
                                                setOpen(false);
                                            }}
                                        >
                                            {tag.name}
                                            <Check
                                                className={cn(
                                                    'ml-auto',
                                                    selectedTagIds.includes(
                                                        tag.id!
                                                    )
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                {!tagExists && inputTrimmed.length > 0 && (
                                    <CommandItem
                                        value={inputTrimmed}
                                        onSelect={async () => {
                                            await handleCreateTag();
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create "{inputTrimmed}"
                                    </CommandItem>
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {selectedTags.length > 0 && (
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant="outline"
                                className="cursor-pointer hover:bg-destructive/20"
                                onClick={() => handleTagToggle(tag.id!)}
                            >
                                {tag.name} ×
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
