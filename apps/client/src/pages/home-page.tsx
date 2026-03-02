import { useGetMe } from '@/api/user-api';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
    const navigate = useNavigate();
    const { data: user, isLoading } = useGetMe();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                Please log in
            </div>
        );
    }

    const now = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
     //@ts-ignore
    const date = now.toLocaleDateString('en-US', dateOptions);
    const hour = now.getHours();

    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17 && hour < 21) greeting = 'Good evening';
    else if (hour >= 21 || hour < 5) greeting = 'Good night';

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="text-center mr-12">
                <p className="text-base  mb-4 font-semibold">{date}</p>
                <h1 className="text-3xl font-bold text-fuchsia-500">
                    {greeting}, {user?.profile?.firstName}{' '}
                    {user?.profile?.lastName}
                </h1>
            </div>

            <div className="w-full py-10 flex flex-wrap justify-center gap-10">
                <Card
                    onClick={() => navigate('/games')}
                    className="border-none w-[70vw] gap-0 bg-transparent  cursor-pointer flex flex-row"
                >
                    <div className="flex-[40%] flex justify-center items-center">
                        <h2 className="text-2xl text-center">
                            Games & <br /> Slot Booking
                        </h2>
                    </div>
                    <div className="flex-[60%] px-10 text-center">
                        Book game slots with fair rotation scheduling, daily
                        limits, and automatic notifications for participants.
                    </div>
                </Card>

                <Separator />

                <Card
                    onClick={() => navigate('/travel-plans')}
                    className="border-none w-[70vw] gap-0 bg-transparent shadow-none transition cursor-pointer flex flex-row-reverse"
                >
                    <div className="flex-[40%] flex justify-center items-center">
                        <div className="text-2xl text-center">
                            Travel & <br /> Expenses
                        </div>
                    </div>
                    <div className="flex-[60%] px-10 text-center">
                        Manage assigned trips, upload documents, and submit
                        verified expenses within policy-controlled timelines and
                        approvals.
                    </div>
                </Card>

                <Separator />

                <Card
                    onClick={() => navigate('/job-openings')}
                    className="border-none w-[70vw] gap-0 bg-transparent shadow-none  transition cursor-pointer flex flex-row"
                >
                    <div className="flex-[40%] flex justify-center items-center">
                        <h2 className="text-2xl text-center mb-2">
                            Job Opportunities <br /> & Referrals
                        </h2>
                    </div>
                    <div className="flex-[60%] px-10 text-center">
                        Browse openings, share jobs via email, and refer friends
                        with CV uploads and tracking.
                    </div>
                </Card>

                <Separator />

                <Card
                    onClick={() => navigate('/achievements')}
                    className="border-none w-[70vw] gap-0 bg-transparent shadow-none  transition cursor-pointer flex flex-row-reverse"
                >
                    <div className="flex-[40%] flex justify-center items-center">
                        <h2 className="text-2xl text-center mb-2">
                            Achievements <br /> & Celebrations
                        </h2>
                    </div>
                    <div className="flex-[60%] px-10 text-center">
                        Share milestones, celebrate birthdays and anniversaries,
                        and engage with colleagues through likes and comments.
                    </div>
                </Card>
            </div>
        </div>
    );
}
