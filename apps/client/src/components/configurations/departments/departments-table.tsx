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
import * as React from 'react';

import { useGetDepartmentes, type Department } from '@/api/department-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useAccessChecker } from '@/hooks/use-has-access';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';

export function DepartmentsTable() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const canAccess = useAccessChecker();
    const { openConfigDialog } =
        useAppStore(
            useShallow((s) => ({
                openConfigDialog: s.openConfigDialog,
            }))
        );
    const { data, isLoading, isError } = useGetDepartmentes();

    const columns: ColumnDef<Department>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Department
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-medium pl-4 w-[200px]">
                    {row.getValue('name')}
                </div>
            ),
        },
        ...(canAccess(['Admin', 'HR'])
            ? ([
                  {
                      accessorKey: 'actions',
                      header: () => <div className="w-[130px]">Actions</div>,
                      cell: ({ row }) => {
                          return (
                              <div className="flex gap-10 font-semibold">
                                  <button
                                      className="text-gray-400 hover:cursor-pointer"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          openConfigDialog({ entity: 'departments', mode: 'update', payload: row.original });
                                      }}
                                  >
                                      Edit
                                  </button>
                                  <button
                                      className="text-destructive hover:cursor-pointer"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          openConfigDialog({ entity: 'departments', mode: 'delete', payload: row.original.id });
                                      }}
                                  >
                                      Delete
                                  </button>
                              </div>
                          );
                      },
                  },
              ] as ColumnDef<Department>[])
            : []),
    ];

    const table = useReactTable({
        data: data as Department[],
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

    if (isLoading)
        return (
            <div className="w-full h-[50vh] flex justify-center items-center">
                <Spinner className="size-8" />
            </div>
        );
    if (isError)
        return (
            <div className="w-full h-[50vh] flex justify-center items-center">
                Error Loading Departments
            </div>
        );

    return (
        <div className="w-[600px]">
            {/* header */}
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter departments..."
                    value={
                        (table.getColumn('name')?.getFilterValue() as string) ??
                        ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn('name')
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
                                        {(() => {
                                            if (header.isPlaceholder) {
                                                return null;
                                            }
                                            return flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            );
                                        })()}
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
                                    // onClick={() =>
                                    //     // TODO: use navigation and outlet
                                    //     // openDesignationDialog(
                                    //     //     'view',
                                    //     //     row.original
                                    //     // )
                                    // }
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
                                    No departments found.
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
