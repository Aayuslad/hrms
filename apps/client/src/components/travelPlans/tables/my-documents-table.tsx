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
import { ArrowUpDown, ExternalLink, MoreHorizontal } from 'lucide-react';
import React from 'react';
import UpdateDocumentDialog from '../documents/update-document-dialog';
import { DeleteDocumentDialog } from '../documents/delete-document-dialog';
import CreateDocumentDialog from '../documents/create-document-dialog';
import type { TravelPlanDocument } from '@/api/travel-api';

interface MyDocumentsTableProps {
    documents: TravelPlanDocument[];
    travelPlanId: string;
    participantId?: string;
}

export function MyDocumentsTable({
    documents,
    travelPlanId,
    participantId,
}: Readonly<MyDocumentsTableProps>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [selectedDocument, setSelectedDocument] =
        React.useState<TravelPlanDocument | null>(null);

    const columns: ColumnDef<TravelPlanDocument>[] = [
        {
            accessorKey: 'type',
            header: () => <div className="ml-4">Type</div>,
            cell: ({ row }) => (
                <div className="font-medium ml-4 w-[150px]">
                    {row.original.documentType?.name}
                </div>
            ),
        },
        {
            accessorKey: 'doc',
            header: () => <div className="w-[150px]">Document</div>,
            cell: ({ row }) => (
                <div className="font-medium w-[150px]">
                    <a
                        href={row.original.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=""
                    >
                        <Button variant={'link'} className="-ml-3 h-auto p-0">
                            <span className="text-sm">View Document</span>
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </a>
                </div>
            ),
        },
        {
            accessorKey: 'uploadedAt',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Uploaded At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-medium w-[150px] ml-3">
                    {new Date(row.getValue('uploadedAt')).toLocaleDateString()}
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
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedDocument(row.original);
                                    setUpdateDialogOpen(true);
                                }}
                            >
                                Update
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedDocument(row.original);
                                    setDeleteDialogOpen(true);
                                }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: documents ?? [],
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
                    placeholder="Filter documents..."
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
                {participantId && (
                    <div className="ml-auto">
                        <CreateDocumentDialog
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
            {selectedDocument && (
                <UpdateDocumentDialog
                    travelPlanId={travelPlanId}
                    participantId={participantId!}
                    document={selectedDocument}
                    open={updateDialogOpen}
                    onOpenChange={setUpdateDialogOpen}
                />
            )}
            {selectedDocument && (
                <DeleteDocumentDialog
                    documentId={selectedDocument?.id!}
                    travelPlanId={travelPlanId}
                    participantId={participantId!}
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                />
            )}
        </div>
    );
}
