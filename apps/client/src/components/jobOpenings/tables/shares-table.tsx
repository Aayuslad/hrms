import type { components } from '@/types/generated/api';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Mail, User } from 'lucide-react';
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    flexRender,
} from '@tanstack/react-table';
import { UserProfileDialog } from '@/components/auth/user-profile-dialog';
import { Button } from '@/components/ui/button';

// Assuming a ShareResponse type, since it's not in the API yet

type Props = {
    shares: components['schemas']['JobOpeningShareAuditResponse'][];
};

const columnHelper =
    createColumnHelper<components['schemas']['JobOpeningShareAuditResponse']>();

const columns = [
    columnHelper.accessor('sharedToEmail', {
        header: () => <div className="ml-4">Shared To</div>,
        cell: (info) => (
            <div className="flex items-center gap-2 ml-4">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{info.getValue()}</span>
            </div>
        ),
    }),
    columnHelper.accessor('sharedBy', {
        header: 'Shared By',
        cell: (info) => {
            const sharedBy = info.getValue();
            return (
                <UserProfileDialog userId={sharedBy?.id as string}>
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>
                            {sharedBy?.profile?.firstName}{' '}
                            {sharedBy?.profile?.lastName}
                        </span>
                    </div>
                </UserProfileDialog>
            );
        },
    }),
    columnHelper.accessor('sharedAt', {
        header: 'Shared At',
        cell: (info) => {
            const sharedAt = info.getValue();
            return sharedAt ? (
                <span className="text-sm text-muted-foreground">
                    {new Date(sharedAt).toLocaleDateString()}
                </span>
            ) : (
                <span className="text-muted-foreground">-</span>
            );
        },
    }),
];

export function SharesTable({ shares }: Props) {
    const table = useReactTable({
        data: shares as any,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (shares.length === 0) {
        return (
            <div className="text-center py-6">
                <p className="text-muted-foreground">No shares yet.</p>
            </div>
        );
    }

    return (
        <div className="mt-5">
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
