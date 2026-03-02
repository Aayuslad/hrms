import type { TravelPlanExpense } from '@/api/travel-api';
import { UserProfileDialog } from '@/components/auth/user-profile-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

interface AllExpensesTableProps {
    expenses: TravelPlanExpense[];
    total?: number;
}

export function AllExpensesTable({
    expenses,
    total,
}: Readonly<AllExpensesTableProps>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const { openProofsDialog, openApproveDialog, openRejectDialog } =
        useAppStore(
            useShallow((s) => ({
                openProofsDialog: s.openProofsDialog,
                openApproveDialog: s.openApproveDialog,
                openRejectDialog: s.openRejectDialog,
            }))
        );

    const { travelPlanId } = useParams<{ travelPlanId?: string }>();

    const columns: ColumnDef<TravelPlanExpense>[] = [
        {
            accessorKey: 'participant.userName',
            header: () => <div className="ml-3 min-w-[100px]">Participant</div>,
            cell: ({ row }) => (
                <div className=" ml-3 min-w-[100px]">
                    <UserProfileDialog userId={row.original.participant?.id!}>
                        {row.original.participant?.userName}
                    </UserProfileDialog>
                </div>
            ),
        },
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
                    <ArrowUpDown className=" h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="">
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
                    className="w-[80px]"
                >
                    Amount
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className=" w-[80px]">₹{row.original.amount}</div>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => (
                <div className="">{row.original.expenseCategory?.name}</div>
            ),
        },
        {
            accessorKey: 'proofs',
            header: 'Proofs',
            cell: ({ row }) => {
                const proofs = row.original.proofs;
                if (!proofs || proofs.length === 0) {
                    return <div className="pl-5">-</div>;
                }
                return (
                    <Button
                        variant="link"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            openProofsDialog(proofs);
                        }}
                        type="button"
                        className="h-auto p-0 text-sm"
                    >
                        View ({proofs.length})
                    </Button>
                );
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <div
                    className={`  capitalize ${row.original?.status === 'DRAFTING' ? 'text-yellow-500' : ''} ${row.original?.status === 'SUBMITTED' ? 'text-blue-500' : ''} ${row.original?.status === 'REJECTED' ? 'text-red-500' : ''} ${row.original?.status === 'APPROVED' ? 'text-green-500' : ''}`}
                >
                    {row.getValue('status')}
                </div>
            ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-auto w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {(row.original.status === 'SUBMITTED' ||
                                row.original.status === 'REJECTED') && (
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!travelPlanId) return;
                                        openApproveDialog({
                                            travelPlanId: travelPlanId!,
                                            participantId:
                                                row.original.participant?.id!,
                                            expenseId: row.original.id!,
                                        });
                                    }}
                                    className="text-green-500"
                                >
                                    Approve
                                </DropdownMenuItem>
                            )}
                            {(row.original.status === 'SUBMITTED' ||
                                row.original.status === 'APPROVED') && (
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!travelPlanId) return;
                                        openRejectDialog({
                                            travelPlanId: travelPlanId!,
                                            participantId:
                                                row.original.participant?.id!,
                                            expenseId: row.original.id!,
                                        });
                                    }}
                                    className="text-red-500"
                                >
                                    Reject
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
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Filter participants..."
                    value={
                        (table
                            .getColumn('participant.userName')
                            ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn('participant.userName')
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                <div className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 bg-muted/40">
                    {/* <IndianRupee className="h-4 w-4 text-primary" /> */}

                    <span className="text-sm text-muted-foreground">
                        Total Approved expenses:
                    </span>

                    <span className="text-sm font-semibold">₹{total}</span>
                </div>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="bg-border">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
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
        </div>
    );
}
