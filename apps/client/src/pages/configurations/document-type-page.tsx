import { CreateDocumentTypeDialog } from '@/components/configurations/documentTypes/create-document-type-dialog';
import { DocumentTypesTable } from '@/components/configurations/documentTypes/document-types-table';
import { Outlet } from 'react-router';

export function DocumentTypePage() {
    return (
        <div className=" h-full">
            <div className="bg-muted  h-[100px] w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">Document Types</h1>
                    <p>Standardize travel document categories.</p>
                </div>
                <div className="w-[230px] mb-4">
                    <CreateDocumentTypeDialog visibleTo={['Admin', 'HR']} />
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
        </div>
    );
}
