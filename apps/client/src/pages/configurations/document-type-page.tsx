import { CreateDocumentTypeDialog } from '@/components/configurations/documentTypes/create-document-type-dialog';
import { DocumentTypesTable } from '@/components/configurations/documentTypes/document-types-table';
import { Button } from '@/components/ui/button';
import { Outlet } from 'react-router';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { UpdateEmployeeDialog } from '@/components/configurations/employees/update-employee-dialog';
import { DeleteDocTypeDialog } from '@/components/configurations/documentTypes/delete-document-type-dialog';
import { UpdateDocTypeDialog } from '@/components/configurations/documentTypes/update-document-type-dialog';

export function DocumentTypePage() {
    const { openConfigDialog } = useAppStore(
        useShallow((s) => ({
            openConfigDialog: s.openConfigDialog,
        }))
    );

    return (
        <div className=" h-full">
            <div className="bg-muted  h-[100px] w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">Document Types</h1>
                    <p>Standardize travel document categories.</p>
                </div>
                <div className="w-[260px] mb-4">
                    <Button
                        variant="secondary"
                        className="border"
                        onClick={() =>
                            openConfigDialog({
                                entity: 'documentTypes',
                                mode: 'create',
                            })
                        }
                    >
                        + Create Document type
                    </Button>
                </div>
            </div>

            <div className="w-full flex justify-evenly pt-10">
                <div className="w-full flex flex-col items-center">
                    <div className="mr-12 w-fit">
                        <DocumentTypesTable />
                        <Outlet />
                    </div>
                </div>
            </div>

            <CreateDocumentTypeDialog visibleTo={['Admin', 'HR']} />
            <UpdateDocTypeDialog />
            <DeleteDocTypeDialog />
        </div>
    );
}
