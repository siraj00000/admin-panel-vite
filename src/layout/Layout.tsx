
import { Outlet } from 'react-router-dom'; 
import AdminLayout from '../components/layout/AdminLayout';

const Layout = () => {
    return (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    );
};

export default Layout;