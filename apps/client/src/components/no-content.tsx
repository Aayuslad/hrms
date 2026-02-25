import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Frown } from 'lucide-react';

type AppEmptyStateProps = {
    title?: string;
    description?: string;
};

export function NoContent({
    title = 'No Data Found',
    description = 'There is nothing to display here yet.',
}: AppEmptyStateProps) {
    return (
        <Empty className={`max-w-sm mx-auto`}>
            <EmptyHeader>
                <EmptyMedia variant="default">
                    <Frown />
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent />
        </Empty>
    );
}
