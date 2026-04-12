import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, ROLE_REDIRECT } from '../../utils/constants';

const ROLE_NAV = {
  [ROLES.SENDER]: [
    { to: '/gui-tre/dashboard',   label: 'Tổng quan' },
    { to: '/gui-tre/tao-yeu-cau', label: 'Giao trẻ' },
    { to: '/gui-tre/trang-thai',  label: 'Trạng thái' },
  ],
  [ROLES.ADOPTER]: [
    { to: '/nhan-nuoi/dashboard',     label: 'Tổng quan' },
    { to: '/nhan-nuoi/danh-sach-tre', label: 'Danh sách trẻ' },
    { to: '/nhan-nuoi/trang-thai',    label: 'Đơn của tôi' },
  ],
  [ROLES.STAFF_RECEPTION]: [
    { to: '/can-bo-tiep-nhan/dashboard', label: 'Tổng quan' },
    { to: '/can-bo-tiep-nhan/yeu-cau',   label: 'Yêu cầu' },
    { to: '/can-bo-tiep-nhan/tre',       label: 'Quản lý trẻ' },
  ],
  [ROLES.STAFF_ADOPTION]: [
    { to: '/can-bo-nhan-nuoi/dashboard', label: 'Tổng quan' },
    { to: '/can-bo-nhan-nuoi/danh-sach', label: 'Đơn nhận nuôi' },
  ],
  [ROLES.MANAGER]: [
    { to: '/truong-phong/dashboard', label: 'Tổng quan' },
    { to: '/truong-phong/cho-duyet', label: 'Chờ duyệt' },
    { to: '/truong-phong/thong-ke',  label: 'Thống kê' },
  ],
  [ROLES.ADMIN]: [
    { to: '/admin/dashboard', label: 'Tổng quan' },
    { to: '/admin/accounts',  label: 'Tài khoản' },
    { to: '/admin/roles',     label: 'Phân quyền' },
  ],
};

const GUEST_NAV = [
  { to: '/',           label: 'Trang chủ' },
  { to: '/huong-dan',  label: 'Hướng dẫn' },
];

function BellIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  );
}

function UserAvatar({ name }) {
  return (
    <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
      {name?.[0]?.toUpperCase() ?? 'U'}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = user ? (ROLE_NAV[user.role] ?? []) : GUEST_NAV;

  return (
    <header className="bg-[#1e3a5f] text-white shadow-lg sticky top-0 z-40">
      {/* Top bar */}
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo + Title */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3h2v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-7-7z" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <p className="text-[11px] text-blue-200 leading-none">Hệ thống quản lý</p>
            <p className="text-sm font-bold leading-tight tracking-tight">TRUNG TÂM BẢO TRỢ XÃ HỘI</p>
          </div>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notification bell */}
              <button className="relative p-2 rounded-lg hover:bg-white/10 transition text-blue-200 hover:text-white">
                <BellIcon />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#f97316] rounded-full" />
              </button>

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition"
                >
                  <UserAvatar name={user.fullName || user.email} />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-medium leading-none">{user.fullName || 'Người dùng'}</p>
                    <p className="text-[11px] text-blue-300 mt-0.5">{user.email}</p>
                  </div>
                  <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1">
                      <Link
                        to={`${ROLE_REDIRECT[user.role] ?? '/'}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Trang chủ của tôi
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => { logout(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/dang-nhap"
              className="px-4 py-1.5 bg-[#f97316] hover:bg-[#ea580c] text-white text-sm font-medium rounded-lg transition"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="border-t border-white/10 px-6">
        <div className="flex items-center gap-1 -mb-px overflow-x-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-[#f97316] text-white'
                    : 'border-transparent text-blue-200 hover:text-white hover:border-white/40'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
