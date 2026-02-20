import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BriefcaseBusiness, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ShareJobOpeningDialog from './share-job-opening-dialog';
import ReferJobOpeningDialog from './refer-job-opening-dialog';
import type { JobOpeningSummary } from '@/api/jobs-api';

type Props = {
    jobOpening: JobOpeningSummary;
};

const JobOpeningCard = ({ jobOpening }: Props) => {
    const navigate = useNavigate();

    return (
        <Card className="w-[400px] border-primary/40 bg-transparent shadow-none p-6 rounded-2xl">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold leading-tight">
                        {jobOpening.designation?.name}
                    </CardTitle>
                </div>

                <Button
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${jobOpening.id}`);
                    }}
                    className="shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                >
                    View Details
                </Button>
            </div>

            <CardContent className="px-0 space-y-4">
                <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <BriefcaseBusiness className="h-4 w-4 shrink-0" />
                        <span>
                            Required Experience: {jobOpening.requiredExperience}{' '}
                            years
                        </span>
                    </div>

                    {jobOpening.jdUrl && (
                        <div className="flex items-center gap-3">
                            <a
                                href={jobOpening.jdUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm underline hover:cursor-pointer"
                            >
                                <span>View Job Description</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    )}

                    <p>{jobOpening.description}</p>
                </div>

                <div className="flex gap-2 pt-4">
                    <ShareJobOpeningDialog jobOpeningId={jobOpening.id!} />
                    <ReferJobOpeningDialog jobOpeningId={jobOpening.id!} />
                </div>
            </CardContent>
        </Card>
    );
};

export default JobOpeningCard;
