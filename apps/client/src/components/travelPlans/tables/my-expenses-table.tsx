import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { components } from '@/types/generated/api';
import CreateExpenseDialog from '../expense/create-expense-dialog';
import { useSubmitExpense } from '@/api/travel-api';
import UpdateExpenseDialog from '../expense/update-expense-dialog';
import { DeleteExpenseDialog } from '../expense/delete-expense-dialog';
import { toast } from 'sonner';

type Expense = {
    id?: string | undefined;
    amount?: number | undefined;
    date?: string | undefined;
    status?: 'DRAFTING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | undefined;
    remarks?: string | undefined;
    submittedAt?: string | undefined;
    expenseCategory?: string | undefined;
    approvedBy?:
        | {
              id?: string | undefined;
              userName?: string | undefined;
          }
        | undefined;
    proofs?:
        | {
              id?: string | undefined;
              docUrl?: string | undefined;
          }[]
        | undefined;
};

interface MyExpensesTableProps {
    expenses: Expense[];
    travelPlanId: string;
    participantId?: string;
}

export function MyExpensesTable({
    expenses,
    travelPlanId,
    participantId,
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
        React.useState<Expense | null>(null);

    const columns: ColumnDef<Expense>[] = [
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
                    {row.original.expenseCategory}
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <div className="font-medium w-[100px]">
                    {row.getValue('status')}
                </div>
            ),
        },
        {
            id: 'actions',
            header: () => <div className="w-[100px]">Actions</div>,
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedExpense(row.original);
                                    setUpdateDialogOpen(true);
                                }}
                            >
                                Update
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedExpense(row.original);
                                    setDeleteDialogOpen(true);
                                }}
                            >
                                Delete
                            </DropdownMenuItem>
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
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter expenses..."
                    value={
                        (table
                            .getColumn('category')
                            ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn('category')
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
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
                    expense={selectedExpense as Expense}
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
