import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import adoptionApi from '../../api/adoptionApi';
import Badge from '../../components/common/Badge';
import { REQUEST_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

function StatCard({ label, value, color }) {
  return (
    <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${color}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value ?? 0}</p>
    </div>
  );
}

export default function AdopterDashboard() {
  const { data, loading } = useFetch(adoptionApi.getAll);
  const items = data?.items || [];
  const pending  = items.filter(r => r.status === REQUEST_STATUS.PENDING).length;
  const approved = items.filter(r => r.status === REQUEST_STATUS.APPROVED).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Tổng quan</h1>
        <Link to="/nhan-nuoi/danh-sach-tre" className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition">
          Xem danh sách trẻ
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard label="Đơn đang chờ"  value={pending}  color="border-yellow-500" />
        <StatCard label="Đơn đã duyệt"  value={approved} color="border-green-500" />
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-medium text-gray-700 mb-3">Đơn nhận nuôi gần đây</h2>
        {loading ? <p className="text-gray-400 text-sm">Đang tải...</p> : (
          <div className="divide-y">
            {items.slice(0, 5).map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.childName || `Đơn #${r.id}`}</p>
                  <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                </div>
                <Badge status={r.status} />
              </div>
            ))}
            {items.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">Chưa có đơn nào.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
