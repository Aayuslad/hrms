import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import React from 'react';
import { ApproveExpenseDialog } from './approve-expense-dialog';
import { RejectExpenseDialog } from './reject-expense-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

type Expense = {
    id?: string;
    amount?: number;
    date?: string;
    status?: 'DRAFTING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
    remarks?: string;
    submittedAt?: string;
    expenseCategory?: string;
    approvedBy?: {
        id?: string;
        userName?: string;
    };
    proofs?: {
        id?: string;
        docUrl?: string;
    }[];
};

interface ParticipantExpensesSheetProps {
    travelPlanId: string;
    participantId: string;
    participantName: string;
}

export function ParticipantExpensesSheet({
    travelPlanId,
    participantId,
    participantName,
}: Readonly<ParticipantExpensesSheetProps>) {
    const { data: participant } = useGetParticipant(
        travelPlanId,
        participantId
    );

    const expenses = participant?.expenses || [];

    const [approveDialogOpen, setApproveDialogOpen] = React.useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);
    const [selectedExpenseId, setSelectedExpenseId] = React.useState<
        string | null
    >(null);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    type="button"
                    className="text-gray-400 font-semibold hover:cursor-pointer"
                >
                    Expenses
                </button>
            </SheetTrigger>
            <SheetContent className="w-[35vw]">
                <SheetHeader>
                    <SheetTitle>{participantName}'s Expenses</SheetTitle>
                    <SheetDescription>
                        View and manage expenses for this participant.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-1 overflow-auto">
                    <div className="px-4 space-y-3">
                        {expenses.length ? (
                            expenses
                                .filter((x) => x.status !== 'DRAFTING')
                                .map((expense) => (
                                    <Card key={expense.id} className="py-2">
                                        <CardContent>
                                            <div className="flex justify-between items-center">
                                                <div className="mt-1">
                                                    <CardTitle>
                                                        ₹{expense.amount}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {
                                                            expense.expenseCategory
                                                        }
                                                    </CardDescription>
                                                </div>

                                                <p className="text-sm text-muted-foreground">
                                                    Date:{' '}
                                                    {new Date(
                                                        expense.date!
                                                    ).toLocaleDateString()}
                                                </p>

                                                {expense.status !==
                                                    'SUBMITTED' && (
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant={
                                                                    expense.status ===
                                                                    'APPROVED'
                                                                        ? 'default'
                                                                        : expense.status ===
                                                                            'REJECTED'
                                                                          ? 'destructive'
                                                                          : 'secondary'
                                                                }
                                                            >
                                                                {expense.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                )}

                                                {expense.status ===
                                                    'SUBMITTED' && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedExpenseId(
                                                                    expense.id!
                                                                );
                                                                setApproveDialogOpen(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => {
                                                                setSelectedExpenseId(
                                                                    expense.id!
                                                                );
                                                                setRejectDialogOpen(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                {expense.remarks && (
                                                    <p className="text-sm mt-2">
                                                        Remarks:{' '}
                                                        {expense.remarks}
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                        ) : (
                            <p className="text-center text-muted-foreground">
                                No expenses found.
                            </p>
                        )}
                    </div>
                </ScrollArea>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
            {selectedExpenseId && (
                <ApproveExpenseDialog
                    travelPlanId={travelPlanId}
                    participantId={participantId}
                    expenseId={selectedExpenseId}
                    open={approveDialogOpen}
                    onOpenChange={setApproveDialogOpen}
                />
            )}
            {selectedExpenseId && (
                <RejectExpenseDialog
                    travelPlanId={travelPlanId}
                    participantId={participantId}
                    expenseId={selectedExpenseId}
                    open={rejectDialogOpen}
                    onOpenChange={setRejectDialogOpen}
                />
            )}
        </Sheet>
    );
}
