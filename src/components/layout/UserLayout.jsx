import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Footer from '../common/Footer';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

const MENU_BY_ROLE = {
  [ROLES.SENDER]: [
    { path: '/', label: 'Trang chủ' },
    { path: '/gui-tre/tao-yeu-cau', label: 'Gửi trẻ' },
    { path: '/gui-tre/trang-thai', label: 'Trạng thái' },
    { path: '/gui-tre/ho-so', label: 'Hồ sơ cá nhân' },
  ],
  [ROLES.ADOPTER]: [
    { path: '/', label: 'Trang chủ' },
    { path: '/nhan-nuoi/tao-don', label: 'Tạo đơn nhận nuôi' },
    { path: '/nhan-nuoi/trang-thai', label: 'Đơn nhận nuôi' },
    { path: '/nhan-nuoi/ho-so', label: 'Hồ sơ cá nhân' },
  ],
  [ROLES.STAFF_RECEPTION]: [
    { path: '/can-bo-tiep-nhan/dashboard', label: 'Tổng quan' },
    { path: '/can-bo-tiep-nhan/yeu-cau', label: 'Yêu cầu gửi trẻ' },
    { path: '/can-bo-tiep-nhan/tre', label: 'Quản lý trẻ' },
  ],
  [ROLES.STAFF_ADOPTION]: [
    { path: '/can-bo-nhan-nuoi/dashboard', label: 'Tổng quan' },
    { path: '/can-bo-nhan-nuoi/danh-sach', label: 'Đơn nhận nuôi' },
    { path: '/can-bo-nhan-nuoi/tre', label: 'Danh sách trẻ' },
  ],
  [ROLES.MANAGER]: [
    { path: '/truong-phong/dashboard', label: 'Tổng quan' },
    { path: '/truong-phong/cho-duyet', label: 'Hồ sơ' },
    { path: '/truong-phong/lichsu-hoso', label: 'Lịch sử hồ sơ' },
    { path: '/truong-phong/thong-ke', label: 'Thống kê' },
  ],
};

export default function UserLayout() {
  const { user } = useAuth();
  const menuItems = MENU_BY_ROLE[user?.role] || [];

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="absolute left-0 top-0 bottom-0 z-30 w-60">
        <Sidebar menuItems={menuItems} />
      </div>

      <div className="flex min-h-screen flex-col">
        <main className="flex-1 ml-60 bg-gray-50 p-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}