import { useGetJobOpening } from '@/api/jobs-api';
import CloseJobOpeningDialog from '@/components/jobOpenings/dialogs/close-job-opening-dialog';
import DeleteJobOpeningDialog from '@/components/jobOpenings/dialogs/delete-job-opening-dialog';
import ReopenJobOpeningDialog from '@/components/jobOpenings/dialogs/re-open-job-opening-dialog';
import UpdateJobOpeningDialog from '@/components/jobOpenings/dialogs/update-job-opening-dialog';
import { ReferralsTable } from '@/components/jobOpenings/tables/referrals-table';
import { SharesTable } from '@/components/jobOpenings/tables/shares-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { UserPill } from '@/components/user-pill';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion';
import { useAccessChecker } from '@/hooks/use-has-access';
import { BriefcaseBusiness, Dot, ExternalLink, User } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export function JobOpeningDetailsPage() {
    const canAccess = useAccessChecker();
    const [descriptionView, setDescriptionView] = useState<'short' | 'full'>(
        'short'
    );
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
            <div className="bg h-[130px] w-full flex items-center ">
                <div className="px-10 flex-1 flex items-center">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {jobOpening.designation?.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <BriefcaseBusiness className="h-4 w-4 shrink-0" />
                                <span>
                                    {jobOpening.requiredExperience} years of
                                    experience
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

                            {/* <Dot /> */}

                            {/* <div className="flex items-center gap-2">
                                <span>
                                    Status:{' '}
                                    {jobOpening.closed ? 'Closed' : 'Open'}
                                </span>
                            </div> */}

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
                    </div>
                </div>

                <div className="mr-10 mb-4 flex gap-2">
                    {canAccess(['Admin', 'HR']) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Other Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="">
                                <UpdateJobOpeningDialog
                                    jobOpening={jobOpening}
                                />
                                <DropdownMenuSeparator />
                                <DeleteJobOpeningDialog
                                    jobOpeningId={jobOpening.id!}
                                />
                                {!jobOpening.closed && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <CloseJobOpeningDialog
                                            jobOpeningId={jobOpening.id!}
                                        />
                                    </>
                                )}
                                {jobOpening.closed && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <ReopenJobOpeningDialog
                                            jobOpeningId={jobOpening.id!}
                                        />
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            <div className="w-full flex justify-center pt-2 pb-10">
                <div className="w-full mr-12 max-w-6xl px-8 space-y-10">
                    <p className="text-sm px-2 w-full text-foreground/90 leading-relaxed">
                        {descriptionView === 'short'
                            ? jobOpening.description?.slice(0, 100) + '...'
                            : jobOpening.description}
                        <button
                            className="ml-2 text-sm text-blue-500 hover:underline cursor-pointer"
                            onClick={() =>
                                setDescriptionView(
                                    descriptionView === 'short'
                                        ? 'full'
                                        : 'short'
                                )
                            }
                        >
                            {descriptionView === 'short'
                                ? 'read more'
                                : 'read less'}
                        </button>
                    </p>

                    <div className="mx-10 ">
                        <Tabs defaultValue="referrals" className="gap-4">
                            <TabsList className="bg-background rounded-none border-b w-full p-0">
                                <TabsTrigger
                                    value="referrals"
                                    className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
                                >
                                    Referrals
                                </TabsTrigger>
                                <TabsTrigger
                                    value="shares"
                                    className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
                                >
                                    Shares
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="referrals">
                                <ReferralsTable
                                    referrals={jobOpening.referrals || []}
                                />
                            </TabsContent>

                            <TabsContent value="shares">
                                <SharesTable
                                    shares={jobOpening.shareAudits ?? []}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="mx-10">
                        <Accordion type="multiple" className=" space-y-2">
                            <AccordionItem value="hrs">
                                <AccordionTrigger className="px-2 py-2">
                                    HRs
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-wrap gap-2">
                                        {jobOpening?.hrs?.map((hr) => (
                                            <UserPill key={hr.id} user={hr} />
                                        ))}
                                        {!jobOpening.hrs ||
                                        jobOpening.hrs.length === 0 ? (
                                            <span className="text-sm text-muted-foreground">
                                                No HRs assigned
                                            </span>
                                        ) : null}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="reviewers">
                                <AccordionTrigger className="px-2 py-2">
                                    Reviewers
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-wrap gap-2">
                                        {jobOpening?.reviewers?.map(
                                            (reviewer) => (
                                                <UserPill
                                                    key={reviewer.id}
                                                    user={reviewer}
                                                />
                                            )
                                        )}
                                        {!jobOpening.reviewers ||
                                        jobOpening.reviewers.length === 0 ? (
                                            <span className="text-sm text-muted-foreground">
                                                No reviewers assigned
                                            </span>
                                        ) : null}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    );
}
