import { Outlet, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Footer } from './Footer';

export function MainLayout() {
    const { user } = useAuth();
    const location = useLocation();
    const noFooterRoutes = ['/login/donor', '/login/hospital', '/login/admin'];
    const showFooter = !noFooterRoutes.includes(location.pathname);

    const isClientAdminDashboard = location.pathname === '/dashboard' && user?.role === 'admin';

    return (
        <>
            <Outlet />
            {showFooter && (
                <div style={isClientAdminDashboard ? { marginLeft: '260px' } : {}}>
                    <Footer />
                </div>
            )}
        </>
    );
}
