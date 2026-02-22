import { useGetJobOpening } from '@/api/jobs-api';
import CloseJobOpeningDialog from '@/components/jobOpenings/close-job-opening-dialog';
import DeleteJobOpeningDialog from '@/components/jobOpenings/delete-job-opening-dialog';
import { ReferralsTable } from '@/components/jobOpenings/referrals-table';
import { SharesTable } from '@/components/jobOpenings/shares-table';
import UpdateJobOpeningDialog from '@/components/jobOpenings/update-job-opening-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { useAccessChecker } from '@/hooks/use-has-access';
import { BriefcaseBusiness, Dot, ExternalLink, User } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function JobOpeningDetailsPage() {
    const canAccess = useAccessChecker();
    const { jobOpeningId } = useParams<{ jobOpeningId: string }>();
    const {
        data: jobOpening,
        isLoading,
        isError,
    } = useGetJobOpening(jobOpeningId);

    if (isLoading) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (isError || !jobOpening) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                Error fetching job opening details
            </div>
        );
    }

    return (
        <div className="h-full">
            <div className="bg h-[180px] w-full flex items-center">
                <div className="px-10 flex-1 flex items-center gap-6">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {jobOpening.designation?.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <BriefcaseBusiness className="h-4 w-4 shrink-0" />
                                <span>
                                    Required Experience:{' '}
                                    {jobOpening.requiredExperience} years
                                </span>
                            </div>

                            <Dot />

                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 shrink-0" />
                                <span>
                                    Default HR:{' '}
                                    {jobOpening.defaultHr?.profile?.firstName}{' '}
                                    {jobOpening.defaultHr?.profile?.lastName}
                                </span>
                            </div>

                            <Dot />

                            <div className="flex items-center gap-2">
                                <span>
                                    Status:{' '}
                                    {jobOpening.closed ? 'Closed' : 'Open'}
                                </span>
                            </div>

                            {jobOpening.jdUrl && (
                                <>
                                    <Dot />
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={jobOpening.jdUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 underline"
                                        >
                                            <span>View Job Description</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>

                        <p className="text-sm text-foreground/90 leading-relaxed max-w-3xl">
                            {jobOpening.description}
                        </p>
                    </div>
                </div>
                <div className="mr-10 mb-4 flex gap-2">
                    {canAccess(['Admin', 'HR']) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Other Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                                <DropdownMenuItem asChild>
                                    <UpdateJobOpeningDialog
                                        jobOpening={jobOpening}
                                    />
                                </DropdownMenuItem>
                                <DeleteJobOpeningDialog
                                    jobOpeningId={jobOpening.id!}
                                />
                                {!jobOpening.closed && (
                                    <CloseJobOpeningDialog
                                        jobOpeningId={jobOpening.id!}
                                    />
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            <div className="w-full flex justify-center pt-2 pb-10">
                <div className="w-full max-w-6xl px-8 space-y-6">
                    <div className="flex gap-8 mb-10">
                        {jobOpening.hrs && jobOpening.hrs.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">HRs:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {jobOpening.hrs.map((hr) => (
                                        <span
                                            key={hr.id}
                                            className="bg-muted px-2 py-1 rounded text-sm"
                                        >
                                            {hr?.profile?.firstName}{' '}
                                            {hr?.profile?.lastName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {jobOpening.reviewers &&
                            jobOpening.reviewers.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2">
                                        Reviewers:
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {jobOpening.reviewers.map(
                                            (reviewer) => (
                                                <span
                                                    key={reviewer.id}
                                                    className="bg-muted px-2 py-1 rounded text-sm"
                                                >
                                                    {
                                                        reviewer?.profile
                                                            ?.firstName
                                                    }{' '}
                                                    {
                                                        reviewer?.profile
                                                            ?.lastName
                                                    }
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Referrals */}
                    <div className="mx-10">
                        <h2 className="text-xl font-semibold mb-4 ">
                            Referrals
                        </h2>
                        <ReferralsTable
                            referrals={jobOpening.referrals || []}
                        />
                    </div>

                    {/* Shares */}
                    <div className="mx-10">
                        <h2 className="text-xl font-semibold mb-4 ">Shares</h2>
                        <SharesTable shares={jobOpening.shareAudits ?? []} />
                    </div>
                </div>
            </div>
        </div>
    );
}
