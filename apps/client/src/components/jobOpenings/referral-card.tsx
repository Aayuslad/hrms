import type { JobOpeningReferralResponse } from '@/api/jobs-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Mail, User } from 'lucide-react';

type Props = {
    referral: JobOpeningReferralResponse;
};

const ReferralCard = ({ referral }: Props) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW':
                return 'bg-blue-100 text-blue-800';
            case 'IN_REVIEW':
                return 'bg-yellow-100 text-yellow-800';
            case 'ACCEPTED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="border-primary/40 bg-transparent shadow-none p-4 rounded-2xl">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold">
                        {referral.name}
                    </CardTitle>
                    <Badge className={getStatusColor(referral.status || 'NEW')}>
                        {referral.status || 'NEW'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span>{referral.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <User className="h-4 w-4 shrink-0" />
                    <span>Referred by: {referral.referredBy?.firstName} {referral.referredBy?.lastName}</span>
                </div>
                {referral.cvUrl && (
                    <div className="flex items-center gap-3">
                        <a
                            href={referral.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm underline"
                        >
                            <span>View CV</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                )}
                {referral.note && (
                    <div>
                        <p className="text-sm text-muted-foreground">{referral.note}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ReferralCard;