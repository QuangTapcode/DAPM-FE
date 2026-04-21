import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../hooks/useAuth';

const ADMIN_MENU = [
  {
    path: '/admin/dashboard',
    label: 'Tổng quan',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
      </svg>
    ),
  },
  {
    path: '/admin/accounts',
    label: 'Quản lý tài khoản',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout?.();
    navigate('/dang-nhap');
  };

  return (
    <div className="relative min-h-screen bg-[#F5F9FE]">
      {/* Sidebar */}
      <div className="absolute left-0 top-0 bottom-0 z-30 w-60 flex flex-col">
        {/* Logo header */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#E3ECF8] bg-[#F8FAFC]">
          <div className="w-9 h-9 rounded-xl bg-[#0D47A1] flex items-center justify-center shrink-0 shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#334155] uppercase tracking-wide leading-tight">Trung tâm</p>
            <p className="text-[10px] text-[#8FA0B8] leading-tight">Bảo trợ xã hội</p>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1">
          <Sidebar menuItems={ADMIN_MENU} />
        </div>

        {/* User + Logout */}
        <div className="border-t border-[#E3ECF8] bg-[#F8FAFC] px-4 py-4 space-y-2">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#EAF3FF] flex items-center justify-center font-bold text-[#0D47A1] text-sm shrink-0">
              {(user?.fullName || 'A')[0]}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#334155] truncate">{user?.fullName || 'Admin'}</p>
              <p className="text-[10px] text-[#8FA0B8]">Quản trị viên</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium text-[#64748B] hover:bg-red-50 hover:text-red-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-60 min-h-screen">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
