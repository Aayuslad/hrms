import type { TravelPlanExpense } from '@/api/travel-api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

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

                <div className="flex justify-between items-center">
                    {expense.proofs && expense.proofs.length > 0 && (
                        <div className="flex gap-x-3 flex-wrap">
                            {expense.proofs.map((proof, index) => (
                                <a
                                    href={proof.docUrl}
                                    key={proof.id}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm underline hover:cursor-pointer mt-2"
                                >
                                    <span>View proof {index + 1}</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {expense.remarks && (
                    <p className="text-sm mt-2">
                        <span className="font-semibold">Remarks - </span>{' '}
                        {expense.remarks}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
