import { useGetMe } from '@/api/user-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    const date = now.toLocaleDateString('en-US', dateOptions);
    const hour = now.getHours();

    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17 && hour < 21) greeting = 'Good evening';
    else if (hour >= 21 || hour < 5) greeting = 'Good night';

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="text-center">
                <p className="text-base  mb-4 font-semibold">
                    {date}
                </p>
                <h1 className="text-3xl font-bold text-fuchsia-500">
                    {greeting}, {user?.profile?.firstName}{' '}
                    {user?.profile?.lastName}
                </h1>
            </div>

            <div className="w-full py-10 flex flex-wrap justify-center gap-10">
                <Card
                    onClick={() => navigate('/games')}
                    className="border-primary max-w-md gap-0 bg-transparent shadow-none transition cursor-pointer"
                >
                    <CardHeader>
                        <CardTitle className="text-2xl text-center mb-2">
                            Explore Games
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Delectus aperiam nemo, nesciunt aspernatur
                        distinctio hic quaerat veritatis dolorum ea! Corrupti.
                    </CardContent>
                </Card>

                <Card
                    onClick={() => navigate('/travel-plans')}
                    className="border-primary max-w-md gap-0 bg-transparent shadow-none  transition cursor-pointer"
                >
                    <CardHeader>
                        <CardTitle className="text-2xl text-center mb-2">
                            Explore Your Travels
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        Step into a space where design skills are tested, ideas
                        come alive, and only the boldest concepts win the
                        spotlight.
                    </CardContent>
                </Card>

                <Card
                    onClick={() => navigate('/job-openings')}
                    className="border-primary max-w-md gap-0 bg-transparent shadow-none transition cursor-pointer"
                >
                    <CardHeader>
                        <CardTitle className="text-2xl text-center mb-2">
                            Explore Job Opportunities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Cum magnam quae consequuntur doloribus maxime eius
                        ducimus suscipit omnis quisquam saepe?
                    </CardContent>
                </Card>

                <Card
                    onClick={() => navigate('/achievements')}
                    className="border-primary max-w-md gap-0 bg-transparent shadow-none  transition cursor-pointer"
                >
                    <CardHeader>
                        <CardTitle className="text-2xl text-center mb-2">
                            Connect with colleagues
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Cum magnam quae consequuntur doloribus maxime eius
                        ducimus suscipit omnis quisquam saepe?
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
