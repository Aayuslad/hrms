import { OrgChartNode } from './OrgChartNode';

interface ChartNode {
    name: string;
    title: string;
    department: string | null;
    avatarUrl: string | null;
    children: ChartNode[];
}

interface CustomOrgChartProps {
    readonly tree: ChartNode;
}

export function CustomOrgChart({ tree }: CustomOrgChartProps) {
    // Helper to recursively render nodes and draw lines
    return (
        <div style={{ width: '100%', overflowX: 'auto', paddingBottom: 0 }} >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: 0,
                }}
            >
                <OrgChartNode node={tree} />
                {tree.children && tree.children.length > 0 && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginTop: 24,
                            position: 'relative',
                            minWidth: 0,
                            justifyContent: 'center',
                        }}
                    >
                        {/* Draw horizontal connector line only if more than one child */}
                        {tree.children.length > 1 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: -16,
                                    left:
                                        'calc(50% / ' +
                                        tree.children.length +
                                        ')',
                                    width: `calc(100% - ${100 / tree.children.length}%)`,
                                    height: 0,
                                    borderTop: '2px solid #888',
                                    zIndex: 0,
                                }}
                            />
                        )}
                        {
                            tree.children.length !== 0 && (
                                <div
                                    style={{
                                       position: 'absolute',
                                            top: -24,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 0,
                                            height: 8,
                                            borderLeft: '2px solid #888',
                                            zIndex: 1,
                                            display: 'block',
                                    }}
                                />
                            )
                        }
                        {tree.children.map((child: ChartNode, idx: number) => {
                            const key = `${child.name}-${child.title}-${child.department}`;
                            return (
                                <div
                                    key={key}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        margin: '0 24px',
                                        position: 'relative',
                                        minWidth: 0,
                                    }}
                                >
                                    {/* Draw vertical connector line for each child, perfectly centered */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: -16,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 0,
                                            height: 16,
                                            borderLeft: '2px solid #888',
                                            zIndex: 1,
                                            display: 'block',
                                        }}
                                    />
                                    <CustomOrgChart tree={child} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
