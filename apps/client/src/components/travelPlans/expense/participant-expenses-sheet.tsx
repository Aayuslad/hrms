import { useGetParticipant } from '@/api/travel-api';
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
import React from 'react';
import { ApproveExpenseDialog } from './approve-expense-dialog';
import { ExpenseCard } from './expense-card';
import { RejectExpenseDialog } from './reject-expense-dialog';

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
            <SheetContent className="w-[38vw]">
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
                                    <ExpenseCard
                                        key={expense.id}
                                        expense={expense}
                                        onApproveClick={(expenseId) => {
                                            setSelectedExpenseId(expenseId);
                                            setApproveDialogOpen(true);
                                        }}
                                        onRejectClick={(expenseId) => {
                                            setSelectedExpenseId(expenseId);
                                            setRejectDialogOpen(true);
                                        }}
                                    />
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
