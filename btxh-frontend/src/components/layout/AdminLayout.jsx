import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Footer from '../common/Footer';

const ADMIN_MENU = [
  { path: '/admin/dashboard', label: 'Tổng quan' },
  { path: '/admin/accounts',  label: 'Quản lý tài khoản' },
  { path: '/admin/roles',     label: 'Phân quyền' },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar menuItems={ADMIN_MENU} />
        <main className="flex-1 bg-gray-50 p-6 min-h-screen">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
