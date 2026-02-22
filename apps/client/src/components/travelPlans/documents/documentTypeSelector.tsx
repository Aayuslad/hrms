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

type Props = {
    setSelectedDocumentTypeId: (id: string) => void;
};

export function DocumentTypeSelector({ setSelectedDocumentTypeId }: Props) {
    const [open, setOpen] = React.useState(false);
    const [selectedDocumentType, setSelectedDocumentType] =
        React.useState<DocumentType>();
    const { data: documentTypes, isLoading } = useGetDocumentTypes();

    React.useEffect(() => {
        if (selectedDocumentType) {
            setSelectedDocumentTypeId(selectedDocumentType.id as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDocumentType]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedDocumentType
                        ? documentTypes?.find(
                              (designation) =>
                                  designation.name === selectedDocumentType.name
                          )?.name
                        : 'Select document type...'}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search document type..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No document type found.</CommandEmpty>
                        {isLoading && (
                            <CommandEmpty>
                                Loading document types...
                            </CommandEmpty>
                        )}
                        <CommandGroup>
                            {documentTypes?.map((documentType) => (
                                <CommandItem
                                    key={documentType.id}
                                    value={documentType.name}
                                    onSelect={(
                                        currentValue: string | undefined
                                    ) => {
                                        setSelectedDocumentType(
                                            documentTypes.find(
                                                (documentType) =>
                                                    documentType.name ===
                                                    currentValue
                                            )
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    {documentType.name}
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            selectedDocumentType?.id ===
                                                documentType.id
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
