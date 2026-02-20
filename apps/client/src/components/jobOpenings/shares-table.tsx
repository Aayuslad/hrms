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

// Assuming a ShareResponse type, since it's not in the API yet
type ShareResponse = {
    id: string;
    sharedToEmail: string;
    sharedBy?: components['schemas']['GlobalUserResponseSummary'];
    sharedAt?: string;
};

type Props = {
    readonly shares: readonly ShareResponse[];
};

const columnHelper = createColumnHelper<ShareResponse>();

const columns = [
    columnHelper.accessor('sharedToEmail', {
        header: 'Shared To',
        cell: (info) => (
            <div className="flex items-center gap-2">
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
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>
                        {sharedBy?.profile?.firstName} {sharedBy?.profile?.lastName}
                    </span>
                </div>
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
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
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
                                data-state={row.getIsSelected() && 'selected'}
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
    );
}