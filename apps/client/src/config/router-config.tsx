import { departmentsLoader } from '@/api/department-api';
import { designationsLoader } from '@/api/designation-api';
import { documentTypesLoader } from '@/api/document-type-api';
import { expenseCategoriesLoader } from '@/api/expense-category-api';
import { gameLoader, gamesLoader } from '@/api/games-api';
import { jobOpeningLoader, jobOpeningsLoader } from '@/api/jobs-api';
import { rolesLoader } from '@/api/role-api';
import { travelPlanLoader, travelPlansLoader } from '@/api/travel-api';
import { notificationsLoader } from '@/api/user-api';
import { DeleteDepartmentDialog } from '@/components/configurations/departments/delete-department-dialog';
import { UpdateDepartmentDialog } from '@/components/configurations/departments/update-department-dialog';
import { DeleteDesignationDialog } from '@/components/configurations/designations/delete-designation-dialog';
import { UpdateDesignationDialog } from '@/components/configurations/designations/update-designation-dialog';
import { DeleteDocTypeDialog } from '@/components/configurations/documentTypes/delete-document-type-dialog';
import { UpdateDocTypeDialog } from '@/components/configurations/documentTypes/update-document-type-dialog';
import { UpdateEmployeeDialog } from '@/components/configurations/employees/update-employee-dialog';
import { UpdateEmployeeRolesDialog } from '@/components/configurations/employees/update-employee-roles-dialog';
import { DeleteExpenseCategoryDialog } from '@/components/configurations/expenseCategories/delete-expense-category-dialog';
import { UpdateExpenseCategoryDialog } from '@/components/configurations/expenseCategories/update-expense-category-dialog';
import HomeLayout from '@/components/home-layout';
import CreateUserProfilePage from '@/pages/auth/create-user-profile-page';
import LoginPage from '@/pages/auth/login-page';
import RegistrationPage from '@/pages/auth/registration-page';
import { DepartmentPage } from '@/pages/configurations/department-page';
import { DesignationPage } from '@/pages/configurations/designation-page';
import { DocumentTypePage } from '@/pages/configurations/document-type-page';
import { EmployeePage } from '@/pages/configurations/employee-page';
import { ExpenseCatrgoryPage } from '@/pages/configurations/expense-categories';
import { RolePage } from '@/pages/configurations/role-page';
import { Index as GamesPage } from '@/pages/games';
import { GameDetailsPage } from '@/pages/games/game-details-page';
import { HomePage } from '@/pages/home-page';
import { Index as JobOpeningsPage } from '@/pages/jobOpenings';
import { JobOpeningDetailsPage } from '@/pages/jobOpenings/job-opening-details-page';
import LandingPage from '@/pages/landing-page';
import NotFoundPage from '@/pages/not-found-page';
import { NotificationsPage } from '@/pages/notifications-page';
import { Index as OrgChartPage } from '@/pages/orgChart';
import { ProfilePage } from '@/pages/profile-page';
import { Index as TravelPlans } from '@/pages/travelPlans';
import { TravelPlanDetailsPage } from '@/pages/travelPlans/travel-plan-details-page';
import { createBrowserRouter } from 'react-router';

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
                loader: jobOpeningsLoader,
            },
            {
                path: 'job-openings/:jobOpeningId',
                element: <JobOpeningDetailsPage />,
                loader: jobOpeningLoader,
            },
            {
                path: 'games',
                element: <GamesPage />,
                loader: gamesLoader,
            },
            {
                path: 'games/:gameId',
                element: <GameDetailsPage />,
                loader: gameLoader,
            },
            {
                path: 'travel-plans',
                element: <TravelPlans />,
                loader: travelPlansLoader,
            },
            {
                path: 'travel-plans/:travelPlanId',
                element: <TravelPlanDetailsPage />,
                loader: travelPlanLoader,
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
                loader: notificationsLoader,
            },
            {
                path: '',
                children: [
                    {
                        path: 'configuration/roles',
                        element: <RolePage />,
                        loader: rolesLoader,
                    },
                    {
                        path: 'configuration/employees',
                        element: <EmployeePage />,
                        children: [
                            {
                                path: 'update-profile',
                                element: <UpdateEmployeeDialog />,
                            },
                            {
                                path: 'update-roles',
                                element: <UpdateEmployeeRolesDialog />,
                            },
                        ],
                    },
                    {
                        path: 'configuration/designations',
                        element: <DesignationPage />,
                        loader: designationsLoader,
                        children: [
                            {
                                path: 'update',
                                element: <UpdateDesignationDialog />,
                            },
                            {
                                path: 'delete',
                                element: <DeleteDesignationDialog />,
                            },
                        ],
                    },
                    {
                        path: 'configuration/departments',
                        element: <DepartmentPage />,
                        loader: departmentsLoader,
                        children: [
                            {
                                path: 'update',
                                element: <UpdateDepartmentDialog />,
                            },
                            {
                                path: 'delete',
                                element: <DeleteDepartmentDialog />,
                            },
                        ],
                    },
                    {
                        path: 'configuration/document-types',
                        element: <DocumentTypePage />,
                        loader: documentTypesLoader,
                        children: [
                            {
                                path: 'update',
                                element: <UpdateDocTypeDialog />,
                            },
                            {
                                path: 'delete',
                                element: <DeleteDocTypeDialog />,
                            },
                        ],
                    },
                    {
                        path: 'configuration/expense-categories',
                        element: <ExpenseCatrgoryPage />,
                        loader: expenseCategoriesLoader,
                        children: [
                            {
                                path: 'update',
                                element: <UpdateExpenseCategoryDialog />,
                            },
                            {
                                path: 'delete',
                                element: <DeleteExpenseCategoryDialog />,
                            },
                        ],
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
