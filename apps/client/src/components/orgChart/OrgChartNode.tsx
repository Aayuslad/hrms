import { Card, CardContent } from '@/components/ui/card';

interface OrgChartNodeProps {
    node: {
        name: string;
        title: string;
        department: string | null;
        avatarUrl: string | null;
    };
}

export function OrgChartNode({ node }: OrgChartNodeProps) {
    return (
        <Card className="w-36 p-0.5 shadow-lg border-2 border-primary/20 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-3 flex flex-col items-center text-center space-y-2">
                {/* <Avatar className="w-16 h-16 border-2 border-primary/30">
                    <AvatarImage src={node.avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {node.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                </Avatar> */}
                <div className="space-y-0.5">
                    <h3 className="font-bold text-sm text-foreground">{node.name}</h3>
                    <p className="text-xs font-medium text-primary">{node.title}</p>
                    {node.department && (
                        <p className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                            {node.department}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}