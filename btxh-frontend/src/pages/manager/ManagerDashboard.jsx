import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import adminApi from '../../api/adminApi';

function StatCard({ label, value, color, to }) {
  const inner = (
    <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${color}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value ?? '—'}</p>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export default function ManagerDashboard() {
  const { data: stats, loading } = useFetch(adminApi.getStats);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tổng quan — Trưởng phòng</h1>

      {loading ? (
        <p className="text-gray-400">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Trẻ trong trung tâm"      value={stats?.totalChildren}     color="border-blue-500" />
          <StatCard label="Hồ sơ chờ duyệt"          value={stats?.pendingProfiles}   color="border-yellow-500" to="/truong-phong/cho-duyet" />
          <StatCard label="Nhận nuôi thành công"      value={stats?.completedAdoptions} color="border-green-500" />
          <StatCard label="Tiếp nhận trong tháng"     value={stats?.monthlyReceptions} color="border-purple-500" />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/truong-phong/cho-duyet" className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
          <h2 className="font-semibold text-gray-700 mb-1">Hồ sơ chờ duyệt</h2>
          <p className="text-sm text-gray-400">Xem và phê duyệt hồ sơ tiếp nhận / nhận nuôi</p>
        </Link>
        <Link to="/truong-phong/thong-ke" className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
          <h2 className="font-semibold text-gray-700 mb-1">Thống kê báo cáo</h2>
          <p className="text-sm text-gray-400">Biểu đồ tổng hợp theo tháng / quý</p>
        </Link>
      </div>
    </div>
  );
}
