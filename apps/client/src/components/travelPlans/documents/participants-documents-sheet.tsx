import type { Participant } from '@/api/travel-api';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { DocumentCard } from './document-card';
import HrCreateDocumentDialog from './hr-create-document-dialog';

interface ParticipantDocumentsSheetProps {
    travelPlanId: string;
    participant: Participant;
    participantName: string;
}

export function ParticipantDocumentsSheet({
    travelPlanId,
    participant,
    participantName,
}: Readonly<ParticipantDocumentsSheetProps>) {
    const documents = participant?.documents || [];

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="link"
                    type="button"
                    className="h-auto p-0 text-sm"
                >
                    Documents
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[38vw]">
                <SheetHeader>
                    <SheetTitle>{participantName}'s Documents</SheetTitle>
                    <SheetDescription>
                        View and manage documents for this participant.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-1 px-4">
                    {documents.length ? (
                        documents.map((doc) => (
                            <DocumentCard key={doc.id} document={doc} />
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground">
                            No documents found.
                        </p>
                    )}
                </ScrollArea>
                <SheetFooter>
                    <HrCreateDocumentDialog
                        travelPlanId={travelPlanId}
                        participantId={participant.id as string}
                        participantName={participantName}
                    />
                    <SheetClose asChild>
                        <Button variant="outline" className="">
                            Close
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
