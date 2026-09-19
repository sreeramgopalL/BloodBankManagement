import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HomePage } from './components/HomePage';
import { DonorLogin } from './components/auth/DonorLogin';
import { HospitalLogin } from './components/auth/HospitalLogin';
import { AdminLogin } from './components/auth/AdminLogin';
import { Header } from './components/Header';
import { MainLayout } from './components/MainLayout';
import { DonorPortal } from './components/DonorPortal';
import { HospitalPortal } from './components/HospitalPortal';
import { AdminPortal } from './components/AdminPortal';
import { DonorRegistration } from './components/DonorRegistration';

function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/" replace />;
    return <Outlet />;
}

import { DataProvider } from './contexts/DataContext';

const DashboardRoute = () => {
    const { user } = useAuth();
    return (
        <DataProvider>
            <Header />
            <main style={{ paddingTop: '72px' }}>
                {user?.role === 'donor' && <DonorPortal />}
                {user?.role === 'hospital' && <HospitalPortal />}
                {user?.role === 'admin' && <AdminPortal />}
            </main>
        </DataProvider>
    );
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <AuthProvider>
                <MainLayout />
            </AuthProvider>
        ),
        children: [
            {
                index: true,
                Component: HomePage,
            },
            {
                path: 'login/donor',
                Component: DonorLogin,
            },
            {
                path: 'login/hospital',
                Component: HospitalLogin,
            },
            {
                path: 'login/admin',
                Component: AdminLogin,
            },
            {
                path: 'donor/register',
                element: (
                    <>
                        <Header showBackButton={true} hideUserInfo={true} />
                        <DonorRegistration />
                    </>
                ),
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: 'dashboard',
                        Component: DashboardRoute,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        Component: () => <Navigate to="/" replace />,
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
