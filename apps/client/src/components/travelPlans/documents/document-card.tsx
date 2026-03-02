import type { TravelPlanDocument } from '@/api/travel-api';
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface DocumentCardProps {
    document: TravelPlanDocument;
}

export function DocumentCard({ document }: DocumentCardProps) {
    return (
        <Card className="py-3 mb-3">
            <CardContent className="flex justify-between items-center">
                <div>
                    <CardTitle>{document.documentType}</CardTitle>
                    <CardDescription>
                        <span className="text-xs">
                            belongs to - {document.owner?.userName}
                        </span>
                    </CardDescription>
                </div>
                <p className="text-sm text-muted-foreground flex flex-col text-center">
                    <span>Uploaded on</span>
                    <span>
                        {new Date(
                            document?.uploadedAt ?? ''
                        ).toLocaleDateString()}
                    </span>
                </p>
                <a
                    href={document.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm underline hover:cursor-pointer mt-2"
                >
                    <span>View</span>
                    <ExternalLink className="w-4 h-4" />
                </a>
            </CardContent>
        </Card>
    );
}
