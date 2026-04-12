import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Footer from '../common/Footer';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

const MENU_BY_ROLE = {
  [ROLES.SENDER]: [
    { path: '/gui-tre/dashboard',   label: 'Tổng quan' },
    { path: '/gui-tre/tao-yeu-cau', label: 'Giao trẻ' },
    { path: '/gui-tre/trang-thai',  label: 'Trạng thái' },
    { path: '/gui-tre/ho-so',       label: 'Hồ sơ cá nhân' },
  ],
  [ROLES.ADOPTER]: [
    { path: '/nhan-nuoi/dashboard',     label: 'Tổng quan' },
    { path: '/nhan-nuoi/danh-sach-tre', label: 'Danh sách trẻ' },
    { path: '/nhan-nuoi/trang-thai',    label: 'Đơn nhận nuôi' },
    { path: '/nhan-nuoi/ho-so',         label: 'Hồ sơ cá nhân' },
  ],
  [ROLES.STAFF_RECEPTION]: [
    { path: '/can-bo-tiep-nhan/dashboard', label: 'Tổng quan' },
    { path: '/can-bo-tiep-nhan/yeu-cau',   label: 'Yêu cầu gửi trẻ' },
    { path: '/can-bo-tiep-nhan/tre',       label: 'Quản lý trẻ' },
  ],
  [ROLES.STAFF_ADOPTION]: [
    { path: '/can-bo-nhan-nuoi/dashboard', label: 'Tổng quan' },
    { path: '/can-bo-nhan-nuoi/danh-sach', label: 'Đơn nhận nuôi' },
    { path: '/can-bo-nhan-nuoi/tre',       label: 'Danh sách trẻ' },
  ],
  [ROLES.MANAGER]: [
    { path: '/truong-phong/dashboard',  label: 'Tổng quan' },
    { path: '/truong-phong/cho-duyet',  label: 'Hồ sơ chờ duyệt' },
    { path: '/truong-phong/thong-ke',   label: 'Thống kê' },
  ],
};

export default function UserLayout() {
  const { user } = useAuth();
  const menuItems = MENU_BY_ROLE[user?.role] || [];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar menuItems={menuItems} />
        <main className="flex-1 bg-gray-50 p-6 min-h-screen">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
