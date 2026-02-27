import type { TravelPlanExpense } from '@/api/travel-api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from '@/components/ui/card';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { ViewProofsDialog } from './view-proofs-dialog';

interface ExpenseCardProps {
    expense: TravelPlanExpense;
    onApproveClick: (expenseId: string) => void;
    onRejectClick: (expenseId: string) => void;
}

export function ExpenseCard({
    expense,
    onApproveClick,
    onRejectClick,
}: ExpenseCardProps) {
    const { openProofsDialog } = useAppStore(
        useShallow((s) => ({ openProofsDialog: s.openProofsDialog }))
    );

    return (
        <Card className="py-2.5">
            <CardContent className="px-3">
                <div className="flex justify-between items-center">
                    <div className="mt-1">
                        <CardTitle>₹{expense.amount}</CardTitle>
                        <CardDescription>
                            <span className="text-xs">
                                {expense.expenseCategory}
                            </span>
                        </CardDescription>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        {new Date(expense?.date as string).toLocaleDateString()}
                    </p>

                    {expense.status !== 'SUBMITTED' && (
                        <div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={
                                        expense.status === 'APPROVED'
                                            ? 'default'
                                            : expense.status === 'REJECTED'
                                              ? 'destructive'
                                              : 'secondary'
                                    }
                                >
                                    {expense.status}
                                </Badge>
                            </div>
                        </div>
                    )}

                    {expense.status === 'SUBMITTED' && (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={() =>
                                    onApproveClick(expense?.id as string)
                                }
                            >
                                Approve
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                    onRejectClick(expense?.id as string)
                                }
                            >
                                Reject
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex">
                    <div className="flex-1">
                        {expense.remarks && (
                            <p className="text-sm mt-2 w-full">
                                <span className="font-semibold">
                                    Remarks -{' '}
                                </span>{' '}
                                {expense.remarks}
                            </p>
                        )}
                    </div>

                    {expense.proofs && expense.proofs.length > 0 && (
                        <Button
                            variant="link"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                openProofsDialog(expense.proofs ?? []);
                            }}
                        >
                            View proofs ({expense.proofs.length})
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
