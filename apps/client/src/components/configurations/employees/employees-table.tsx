import { useGetAllUsersDetails, type User } from '@/api/user-api';
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
import { useNavigate } from 'react-router-dom';

export function EmployeesTable() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const canAccess = useAccessChecker();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetAllUsersDetails();

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'userName',
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
                    {row.getValue('userName')}
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
        {
            id: 'roles',
            header: 'Roles',
            cell: ({ row }) => {
                const roles =
                    row.original.roles?.map((r) => r.name).join(', ') || '';
                return <div className="font-medium w-[220px]">{roles}</div>;
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
                                  <button
                                      type="button"
                                      className="text-gray-400 font-semibold hover:cursor-pointer"
                                      onClick={() =>
                                          navigate(
                                              '/configuration/employees/update-profile',
                                              {
                                                  state: { user: row.original },
                                              }
                                          )
                                      }
                                  >
                                      Update Profile
                                  </button>
                                  <button
                                      type="button"
                                      className="text-gray-400 font-semibold hover:cursor-pointer"
                                      onClick={() =>
                                          navigate(
                                              '/configuration/employees/update-roles',
                                              {
                                                  state: { user: row.original },
                                              }
                                          )
                                      }
                                  >
                                      Update Roles
                                  </button>
                              </div>
                          );
                      },
                  },
              ] as ColumnDef<User>[])
            : []),
    ];

    const table = useReactTable({
        data: data || [],
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
                Error Loading Employees
            </div>
        );

    return (
        <div className="">
            {/* header */}
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter employees..."
                    value={
                        (table
                            .getColumn('userName')
                            ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn('userName')
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
