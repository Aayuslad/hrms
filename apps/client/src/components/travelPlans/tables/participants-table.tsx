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
import { ArrowUpDown } from 'lucide-react';
import React from 'react';
import type { Participant } from '@/api/travel-api';
import { useAccessChecker } from '@/hooks/use-has-access';
import { ParticipantExpensesSheet } from '../expense/participant-expenses-sheet';
import { ParticipantDocumentsSheet } from '../documents/participants-documents-sheet';
import { useGetMe } from '@/api/user-api';


interface ParticipantsTableProps {
    participants: Participant[];
    travelPlanId: string;
}

export function ParticipantsTable({
    participants,
    travelPlanId,
}: Readonly<ParticipantsTableProps>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const canAccess = useAccessChecker();
    const { data: me } = useGetMe();

    const columns: ColumnDef<Participant>[] = [
        {
            accessorKey: 'user.userName',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    User Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-medium pl-4 w-[150px]">
                    {row.original.userName}
                </div>
            ),
        },
        {
            id: 'fullName',
            header: 'Full Name',
            cell: ({ row }) => {
                const profile = row.original.profile;
                const fullName = [
                    profile?.firstName,
                    profile?.middleName,
                    profile?.lastName,
                ]
                    .filter(Boolean)
                    .join(' ');
                return <div className="font-medium w-[200px]">{fullName}</div>;
            },
        },
        ...(canAccess(['Admin', 'HR'])
            ? ([
                  {
                      accessorKey: 'actions',
                      header: () => <div className="w-[250px]">Actions</div>,
                      cell: ({ row }) => {
                          return (
                              <div className="flex gap-6">
                                  <ParticipantExpensesSheet
                                      travelPlanId={travelPlanId}
                                      participantId={row.original.id!}
                                      participantName={row.original.userName!}
                                  />
                                  <ParticipantDocumentsSheet
                                      travelPlanId={travelPlanId}
                                      participantId={row.original.id!}
                                      participantName={row.original.userName!}
                                  />
                              </div>
                          );
                      },
                  },
              ] as ColumnDef<Participant>[])
            : []),
    ];

    const table = useReactTable({
        data: participants,
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
                    placeholder="Filter participants..."
                    value={
                        (table
                            .getColumn('user.userName')
                            ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn('user.userName')
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
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
        </div>
    );
}
