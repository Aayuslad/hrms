import type { JobOpeningReferralResponse } from '@/api/jobs-api';
import { UserProfileDialog } from '@/components/auth/user-profile-dialog';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ExternalLink, Mail, User } from 'lucide-react';

type Props = {
    readonly referrals: readonly JobOpeningReferralResponse[];
};

const columnHelper = createColumnHelper<JobOpeningReferralResponse>();

const columns = [
    columnHelper.accessor('name', {
        header: () => <div className="ml-4">Candidate Name</div>,
        cell: (info) => (
            <span className="font-medium ml-4">{info.getValue()}</span>
        ),
    }),
    columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => (
            <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{info.getValue()}</span>
            </div>
        ),
    }),
    columnHelper.accessor('referredBy', {
        header: 'Referred By',
        cell: (info) => {
            const referredBy = info.getValue();
            const fullName =
                `${referredBy?.profile?.firstName || ''} ${referredBy?.profile?.lastName || ''}`.trim();
            return (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <UserProfileDialog userId={referredBy?.id as string}>
                        <span>{fullName}</span>
                    </UserProfileDialog>
                </div>
            );
        },
    }),
    // columnHelper.accessor('status', {
    //     header: 'Status',
    //     cell: (info) => {
    //         const status = info.getValue() || 'NEW';
    //         const getStatusColor = (status: string) => {
    //             switch (status) {
    //                 case 'NEW':
    //                     return 'bg-blue-100 text-blue-800';
    //                 case 'IN_REVIEW':
    //                     return 'bg-yellow-100 text-yellow-800';
    //                 case 'ACCEPTED':
    //                     return 'bg-green-100 text-green-800';
    //                 case 'REJECTED':
    //                     return 'bg-red-100 text-red-800';
    //                 default:
    //                     return 'bg-gray-100 text-gray-800';
    //             }
    //         };
    //         return <Badge className={getStatusColor(status)}>{status}</Badge>;
    //     },
    // }),
    columnHelper.accessor('cvUrl', {
        header: 'CV',
        cell: (info) => {
            const cvUrl = info.getValue();
            return cvUrl ? (
                <a
                    href={cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm underline text-primary hover:text-primary/80"
                >
                    <span>View</span>
                    <ExternalLink className="w-4 h-4" />
                </a>
            ) : (
                <span className="text-muted-foreground">-</span>
            );
        },
    }),
];

export function ReferralsTable({ referrals }: Props) {
    const table = useReactTable({
        data: referrals as any,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (referrals.length === 0) {
        return (
            <div className="text-center py-6">
                <p className="text-muted-foreground">No referrals yet.</p>
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
