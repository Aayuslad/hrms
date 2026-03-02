import { useSubmitExpense, type TravelPlanExpense } from '@/api/travel-api';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useAppStore } from '@/store';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import CreateExpenseDialog from '../expense/create-expense-dialog';
import { DeleteExpenseDialog } from '../expense/delete-expense-dialog';
import UpdateExpenseDialog from '../expense/update-expense-dialog';

interface MyExpensesTableProps {
    expenses: TravelPlanExpense[];
    travelPlanId: string;
    participantId?: string;
    total?: number; 
}

export function MyExpensesTable({
    expenses,
    travelPlanId,
    participantId,
    total,
}: Readonly<MyExpensesTableProps>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const submitExpenseMutation = useSubmitExpense();
    const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [selectedExpense, setSelectedExpense] =
        React.useState<TravelPlanExpense | null>(null);

    const { openProofsDialog } = useAppStore(
        useShallow((s) => ({ openProofsDialog: s.openProofsDialog }))
    );

    const columns: ColumnDef<TravelPlanExpense>[] = [
        {
            accessorKey: 'date',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-medium pl-3 w-[120px]">
                    {new Date(row.getValue('date')).toLocaleDateString()}
                </div>
            ),
        },
        {
            accessorKey: 'amount',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-medium ml-3 w-[100px]">
                    ₹{row.original.amount}
                </div>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => (
                <div className="font-medium w-[120px]">
                    {row.original.expenseCategory?.name}
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <div
                    className={`font-medium w-[100px] capitalize ${row.original?.status === 'DRAFTING' ? 'text-yellow-500' : ''} ${row.original?.status === 'SUBMITTED' ? 'text-blue-500' : ''} ${row.original?.status === 'REJECTED' ? 'text-red-500' : ''} ${row.original?.status === 'APPROVED' ? 'text-green-500' : ''}`}
                >
                    {row.getValue('status')}
                </div>
            ),
        },
        {
            accessorKey: 'proofs',
            header: 'Proofs',
            cell: ({ row }) => {
                const proofs = row.original.proofs;
                if (!proofs || proofs.length === 0) {
                    return <div className="pl-9">-</div>;
                }
                return (
                    <Button
                        variant="link"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            openProofsDialog(proofs);
                        }}
                        className="h-auto"
                    >
                        View ({proofs.length})
                    </Button>
                );
            },
        },

        {
            id: 'actions',
            header: '',
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            {row.original.status !== 'APPROVED' &&
                                row.original.status !== 'REJECTED' && (
                                    <Button
                                        variant="ghost"
                                        className="h-auto w-8 p-0"
                                    >
                                        <span className="sr-only">
                                            Open menu
                                        </span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {(row.original.status === 'DRAFTING' ||
                                row.original.status === 'SUBMITTED') && (
                                <DropdownMenuItem
                                    onClick={() => {
                                        setSelectedExpense(row.original);
                                        setUpdateDialogOpen(true);
                                    }}
                                >
                                    Update
                                </DropdownMenuItem>
                            )}
                            {(row.original.status === 'DRAFTING' ||
                                row.original.status === 'SUBMITTED') && (
                                <DropdownMenuItem
                                    onClick={() => {
                                        setSelectedExpense(row.original);
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    Delete
                                </DropdownMenuItem>
                            )}
                            {row.original.status === 'DRAFTING' && (
                                <DropdownMenuItem
                                    onClick={() => {
                                        submitExpenseMutation.mutate(
                                            {
                                                expenseId: row.original.id!,
                                                travelPlanId,
                                                participantId: participantId!,
                                            },
                                            {
                                                onSuccess: () => {
                                                    toast.success(
                                                        'Expense submitted successfully'
                                                    );
                                                },
                                            }
                                        );
                                    }}
                                >
                                    Submit
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: expenses,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="">
            {/* header */}
            <div className="flex items-center py-2">
                <div className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 bg-muted/40">
                    {/* <IndianRupee className="h-4 w-4 text-primary" /> */}

                    <span className="text-sm text-muted-foreground">
                        Claimed amount:
                    </span>

                    <span className="text-sm font-semibold">₹{total ?? 0}</span>
                </div>

                {participantId && (
                    <div className="ml-auto">
                        <CreateExpenseDialog
                            travelPlanId={travelPlanId}
                            participantId={participantId}
                        />
                    </div>
                )}
            </div>

            {/* table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="bg-border">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* footer */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {selectedExpense && (
                <UpdateExpenseDialog
                    travelPlanId={travelPlanId}
                    participantId={participantId!}
                    expense={selectedExpense}
                    open={updateDialogOpen}
                    onOpenChange={setUpdateDialogOpen}
                />
            )}

            {selectedExpense && (
                <DeleteExpenseDialog
                    expenseId={selectedExpense?.id!}
                    travelPlanId={travelPlanId}
                    participantId={participantId!}
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                />
            )}
        </div>
    );
}
