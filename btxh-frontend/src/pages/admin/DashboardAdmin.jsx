import { useFetch } from '../../hooks/useFetch';
import adminApi from '../../api/adminApi';

function StatCard({ label, value, color }) {
  return (
    <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${color}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value ?? '—'}</p>
    </div>
  );
}

export default function DashboardAdmin() {
  const { data: stats, loading } = useFetch(adminApi.getStats);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tổng quan hệ thống</h1>

      {loading ? (
        <p className="text-gray-400">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Tổng tài khoản" value={stats?.totalUsers} color="border-blue-500" />
          <StatCard label="Trẻ trong trung tâm" value={stats?.totalChildren} color="border-green-500" />
          <StatCard label="Hồ sơ chờ duyệt" value={stats?.pendingProfiles} color="border-yellow-500" />
          <StatCard label="Hồ sơ đã hoàn thành" value={stats?.completedProfiles} color="border-purple-500" />
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-medium text-gray-700 mb-3">Truy cập nhanh</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <a href="/admin/accounts" className="px-4 py-3 bg-gray-50 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition">Quản lý tài khoản</a>
          <a href="/admin/roles" className="px-4 py-3 bg-gray-50 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition">Phân quyền</a>
        </div>
      </div>
    </div>
  );
}
