import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useGetParticipant } from '@/api/travel-api';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ExternalLink, Scroll } from 'lucide-react';
import React from 'react';
import HrCreateDocumentDialog from './hr-create-document-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

type Document = {
    id?: string;
    owner?: {
        id?: string;
        userName?: string;
    };
    docUrl?: string;
    documentType?: string;
    uploadedAt?: string;
    uploadedBy?: {
        id?: string;
        userName?: string;
    };
};

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
            <SheetContent className="w-[35vw]">
                <SheetHeader>
                    <SheetTitle>{participantName}'s Documents</SheetTitle>
                    <SheetDescription>
                        View and manage documents for this participant.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-1 px-4">
                    {documents.length ? (
                        documents.map((doc) => (
                            <Card key={doc.id} className="py-3 mb-3">
                                <CardContent className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>
                                            {doc.documentType}
                                        </CardTitle>
                                        <CardDescription>
                                            belongs to - {doc.owner?.userName}
                                        </CardDescription>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex flex-col text-center">
                                        <span>Uploaded on: </span>
                                        <span>
                                            {new Date(
                                                doc.uploadedAt!
                                            ).toLocaleDateString()}
                                        </span>
                                    </p>
                                    <a
                                        href={doc.docUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm underline hover:cursor-pointer mt-2"
                                    >
                                        <span>View</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </CardContent>
                            </Card>
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
