import { useGetDepartmentes, type Department } from '@/api/department-api';
import { useGetAllUsersDetails, type User } from '@/api/user-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

export function EmployeesTable() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [departmentFilter, setDepartmentFilter] =
        React.useState<Department>();
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const canAccess = useAccessChecker();
    const { openConfigDialog } = useAppStore(
        useShallow((s) => ({
            openConfigDialog: s.openConfigDialog,
        }))
    );
    const { data, isLoading, isError } = useGetAllUsersDetails();
    const { data: departments } = useGetDepartmentes();
    const [updatedDepartments, setUpdatedDepartments] =
        useState<Department[]>();

    useEffect(() => {
        if (departments) {
            setUpdatedDepartments([
                {
                    id: '00000000-0000-0000-0000-000000000000',
                    name: 'All Departments',
                } as Department,
                ...departments,
            ]);
            setDepartmentFilter(
                departments.find(
                    (x) => x.id == '00000000-0000-0000-0000-000000000000'
                )
            );
        }
    }, [departments]);

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
                                          openConfigDialog({
                                              entity: 'employees',
                                              mode: 'update-profile',
                                              payload: row.original,
                                          })
                                      }
                                  >
                                      Update Profile
                                  </button>
                                  <button
                                      type="button"
                                      className="text-gray-400 font-semibold hover:cursor-pointer"
                                      onClick={() =>
                                          openConfigDialog({
                                              entity: 'employees',
                                              mode: 'update-roles',
                                              payload: row.original,
                                          })
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
        <div className="w-[70vw]">
            {/* header */}
            <div className="flex items-center justify-between py-4">
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

                <div className="w-[200px]">
                    <Select
                        value={departmentFilter?.id}
                        onValueChange={(value) =>
                            setDepartmentFilter(
                                updatedDepartments?.find((d) => d.id === value)
                            )
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                            {updatedDepartments?.map((dept) => (
                                <SelectItem key={dept.id!} value={dept.id!}>
                                    {dept.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
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
                        {table.getRowModel().rows?.filter((row) => {
                            const deptId = row.original.profile?.department?.id;
                            return (
                                departmentFilter?.id ===
                                    '00000000-0000-0000-0000-000000000000' ||
                                deptId === departmentFilter?.id
                            );
                        }).length ? (
                            table
                                .getRowModel()
                                .rows.filter((row) => {
                                    const deptId =
                                        row.original.profile?.department?.id;
                                    return (
                                        departmentFilter?.id ===
                                            '00000000-0000-0000-0000-000000000000' ||
                                        deptId === departmentFilter?.id
                                    );
                                })
                                .map((row) => (
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
