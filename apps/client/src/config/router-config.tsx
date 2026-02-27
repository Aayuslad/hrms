import { departmentsLoader } from '@/api/department-api';
import { designationsLoader } from '@/api/designation-api';
import { documentTypesLoader } from '@/api/document-type-api';
import { expenseCategoriesLoader } from '@/api/expense-category-api';
import { tagsLoader } from '@/api/tag-api';
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
import { DeleteTagDialog } from '@/components/configurations/tags/delete-tag-dialog';
import { UpdateTagDialog } from '@/components/configurations/tags/update-tag-dialog';
import HomeLayout from '@/components/home-layout';
import CreateUserProfilePage from '@/pages/auth/create-user-profile-page';
import LoginPage from '@/pages/auth/login-page';
import RegistrationPage from '@/pages/auth/registration-page';
import { DepartmentPage } from '@/pages/configurations/department-page';
import { DesignationPage } from '@/pages/configurations/designation-page';
import { DocumentTypePage } from '@/pages/configurations/document-type-page';
import { EmployeePage } from '@/pages/configurations/employee-page';
import { ExpenseCatrgoryPage } from '@/pages/configurations/expense-categories';
import { TagPage } from '@/pages/configurations/tag-page';
import { EngagementPage } from '@/pages/engagement/engagement-page';
import { ErrorPage } from '@/pages/error-page';
import { Index as GamesPage } from '@/pages/games';
import { GameDetailsPage } from '@/pages/games/game-details-page';
import { HomePage } from '@/pages/home-page';
import { Index as JobOpeningsPage } from '@/pages/jobOpenings';
import { JobOpeningDetailsPage } from '@/pages/jobOpenings/job-opening-details-page';
import LandingPage from '@/pages/landing-page';
import NotFoundPage from '@/pages/not-found-page';
import { NotificationsPage } from '@/pages/notifications-page';
import { ProfilePage } from '@/pages/profile-page';
import { Index as TravelPlans } from '@/pages/travelPlans';
import { TravelPlanDetailsPage } from '@/pages/travelPlans/travel-plan-details-page';
import { TravelPlanManagePage } from '@/pages/travelPlans/travel-plan-manage-page';
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
                // loader: jobOpeningsLoader,
                // errorElement: <ErrorPage />,
            },
            {
                path: 'job-openings/:jobOpeningId',
                element: <JobOpeningDetailsPage />,
                // loader: jobOpeningLoader,
                // errorElement: <ErrorPage />,
            },
            {
                path: 'games',
                element: <GamesPage />,
                // loader: gamesLoader,
                // errorElement: <ErrorPage />,
            },
            {
                path: 'games/:gameId',
                element: <GameDetailsPage />,
                // loader: gameLoader,
                // errorElement: <ErrorPage />,
            },
            {
                path: 'travel-plans',
                element: <TravelPlans />,
                // loader: travelPlansLoader,
                // errorElement: <ErrorPage />,
            },
            {
                path: 'travel-plans/:travelPlanId',
                element: <TravelPlanDetailsPage />,
                // loader: travelPlanLoader,
                // errorElement: <ErrorPage />,
            },
            {
                path: 'travel-plans/:travelPlanId/manage',
                element: <TravelPlanManagePage />,
                // loader: travelPlanLoader,
                // errorElement: <ErrorPage />,
            },
            {
                path: 'user-profile',
                element: <ProfilePage />,
            },
            {
                path: 'notifications',
                element: <NotificationsPage />,
                // loader: notificationsLoader,
                // errorElement: <ErrorPage />,
            },
            {
                path: 'engagement',
                element: <EngagementPage />,
                // loader: postsLoader,
                // errorElement: <ErrorPage />,
            },
            {
                path: '',
                children: [
                    // {
                    //     path: 'configuration/roles',
                    //     element: <RolePage />,
                    //     loader: rolesLoader,
                    //     errorElement: <ErrorPage />,
                    // },
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
                        errorElement: <ErrorPage />,
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
                        errorElement: <ErrorPage />,
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
                        errorElement: <ErrorPage />,
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
                        errorElement: <ErrorPage />,
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
                    {
                        path: 'configuration/tags',
                        element: <TagPage />,
                        loader: tagsLoader,
                        errorElement: <ErrorPage />,
                        children: [
                            {
                                path: 'update',
                                element: <UpdateTagDialog />,
                            },
                            {
                                path: 'delete',
                                element: <DeleteTagDialog />,
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
