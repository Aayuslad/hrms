import type { JobOpening } from '@/api/jobs-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BriefcaseBusiness, ExternalLink } from 'lucide-react';

const JobOpeningCard = ({ jobOpening }: { jobOpening: JobOpening }) => {
    return (
        <Card
            key={jobOpening.id}
            className="border-primary max-w-md gap-0 bg-transparent shadow-none"
        >
            <CardHeader>
                <CardTitle>{jobOpening?.designation?.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4">
                    <span>
                        <BriefcaseBusiness /> Required experiense -{' '}
                        {jobOpening.requiredExperience}
                    </span>
                    <span>
                        <a
                            href={jobOpening.jdUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit items-center gap-1 text-sm underline hover:cursor-pointer"
                        >
                            <span className="text-sm">
                                View job description
                            </span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </span>
                </div>
                <div>{jobOpening.description}</div>
            </CardContent>
        </Card>
    );
};

export default JobOpeningCard;
