import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';

const ADMIN_MENU = [
  { path: '/admin/dashboard', label: 'Tổng quan' },
  { path: '/admin/accounts', label: 'Quản lý tài khoản' },
  { path: '/admin/roles', label: 'Phân quyền' },
];

export default function AdminLayout() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="absolute left-0 top-0 bottom-0 z-30 w-60">
        <Sidebar menuItems={ADMIN_MENU} />
      </div>

      <div className="flex min-h-screen flex-col">
        <main className="ml-60 flex-1 bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
