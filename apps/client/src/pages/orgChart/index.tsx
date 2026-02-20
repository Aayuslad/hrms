import type { OrgChartNodeType } from '@/api/user-api';
import { useGetOrgCharts } from '@/api/user-api';
import { OrgChartNode } from '@/components/orgChart/OrgChartNode';
import OrgChart from 'react-orgchart';

interface ChartNode {
    name: string;
    title: string;
    department: string | null;
    avatarUrl: string | null;
    children: ChartNode[];
}

function transformUser(user: OrgChartNodeType): ChartNode {
    return {
        name: `${user.firstName} ${user.lastName}`,
        title: user.designation || 'N/A',
        department: user?.department ?? 'N/A',
        avatarUrl: user?.avatarUrl ?? null,
        children: user?.manages?.map(transformUser) ?? [],
    };
}

export function Index() {
    const { data: orgCharts, isLoading } = useGetOrgCharts();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-full">
            <div className="bg-muted h-[100px] w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">Organisation Chart</h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Deserunt, nesciunt?
                    </p>
                </div>
                <div className="w-[230px] mb-4">
                    {/* <CreateJobOpeningSheet visibleTo={['Admin', 'Recruiter']} /> */}
                </div>
            </div>

            <div className="w-full pt-10">
                {orgCharts?.map((orgChart, index) => {
                    const tree = transformUser(orgChart);
                    return (
                        <div key={index} className="mb-10 flex justify-center items-center">
                            <OrgChart
                                tree={tree}
                                NodeComponent={OrgChartNode}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
