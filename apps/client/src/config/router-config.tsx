import { createBrowserRouter } from 'react-router';
import LandingPage from '@/pages/landing-page';
import LoginPage from '@/pages/auth/login-page';
import RegistrationPage from '@/pages/auth/registration-page';
import CreateUserProfilePage from '@/pages/auth/create-user-profile-page';
import NotFoundPage from '@/pages/not-found-page';
import HomeLayout from '@/components/home-layout';
import { HomePage } from '@/pages/home-page';
import { Index as JobOpeningsPage } from '@/pages/jobOpenings';
import { Index as GamesPage } from '@/pages/games';
import { Index as TravelPlans } from '@/pages/travelPlans';
import { Index as OrgChartPage } from '@/pages/orgChart';
import { RolePage } from '@/pages/configurations/role-page';
import { EmployeePage } from '@/pages/configurations/employee-page';
import { DesignationPage } from '@/pages/configurations/designation-page';
import { DepartmentPage } from '@/pages/configurations/department-page';
import { DocumentTypePage } from '@/pages/configurations/document-type-page';
import { ExpenseCatrgoryPage } from '@/pages/configurations/expense-categories';
import { ProfilePage } from '@/pages/profile-page';
import { NotificationsPage } from '@/pages/notifications-page';
import { GameDetailsPage } from '@/pages/games/game-details-page';

// loaders / query client for prefetching
import { queryClient } from '@/lib/query-client';
import { gamesLoader, gameLoader } from '@/api/games-api';

const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegistrationPage />,
    },
    {
        path: '/create-user-profile',
        element: <CreateUserProfilePage />,
    },
    {
        path: '/',
        element: <HomeLayout />,
        children: [
            {
                path: 'home',
                element: <HomePage />,
            },
            {
                path: 'job-openings',
                element: <JobOpeningsPage />,
            },
            {
                path: 'games',
                element: <GamesPage />,   
                loader: gamesLoader(queryClient),
            },
            {
                path: 'games/:gameId',
                element: <GameDetailsPage />,   
                loader: gameLoader(queryClient),
            },
            {
                path: 'travel-plans',
                element: <TravelPlans />,
            },
            {
                path: 'org-chart',
                element: <OrgChartPage />,
            },
            {
                path: 'user-profile',
                element: <ProfilePage />,
            },
            {
                path: 'notifications',
                element: <NotificationsPage />,
            },
            {
                children: [
                    {
                        path: 'configuration/roles',
                        element: <RolePage />,
                    },
                    {
                        path: 'configuration/employees',
                        element: <EmployeePage />,
                    },
                    {
                        path: 'configuration/designations',
                        element: <DesignationPage />,
                    },
                    {
                        path: 'configuration/departments',
                        element: <DepartmentPage />,
                    },
                    {
                        path: 'configuration/document-types',
                        element: <DocumentTypePage />,
                    },
                    {
                        path: 'configuration/expense-categories',
                        element: <ExpenseCatrgoryPage />,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);

export default router;
