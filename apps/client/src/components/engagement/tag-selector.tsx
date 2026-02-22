import { useGetTags } from '@/api/tag-api';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Check, Tags } from 'lucide-react';

type TagSelectorProps = {
    readonly selectedTagIds: string[];
    readonly onTagsChange: (tagIds: string[]) => void;
};

export function TagSelector({ selectedTagIds, onTagsChange }: TagSelectorProps) {
    const { data: tags = [] } = useGetTags();

    const handleTagToggle = (tagId: string) => {
        if (selectedTagIds.includes(tagId)) {
            onTagsChange(selectedTagIds.filter((id) => id !== tagId));
        } else {
            onTagsChange([...selectedTagIds, tagId]);
        }
    };

    const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id!));

    return (
        <div className="space-y-3">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                            <Tags className="h-4 w-4" />
                            Select Tags
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                    <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Available Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Button
                                    key={tag.id}
                                    type="button"
                                    variant={
                                        selectedTagIds.includes(tag.id!)
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    className="relative"
                                    onClick={() => handleTagToggle(tag.id!)}
                                >
                                    {tag.name}
                                    {selectedTagIds.includes(tag.id!) && (
                                        <Check className="ml-2 h-3 w-3" />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            {selectedTags.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Tags:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant="secondary"
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
