import { useGetParticipant } from '@/api/travel-api';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from '@/components/ui/card';
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
import { ExternalLink } from 'lucide-react';
import HrCreateDocumentDialog from './hr-create-document-dialog';
import { DocumentCard } from './document-card';

interface ParticipantDocumentsSheetProps {
    travelPlanId: string;
    participantId: string;
    participantName: string;
}

export function ParticipantDocumentsSheet({
    travelPlanId,
    participantId,
    participantName,
}: Readonly<ParticipantDocumentsSheetProps>) {
    const { data: participant } = useGetParticipant(
        travelPlanId,
        participantId
    );

    const documents = participant?.documents || [];

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    type="button"
                    className="text-gray-400 font-semibold hover:cursor-pointer"
                >
                    Documents
                </button>
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
                        participantId={participantId}
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
