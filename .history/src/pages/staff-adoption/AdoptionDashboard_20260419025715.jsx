import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import adoptionApi from '../../api/adoptionApi';
import Badge from '../../components/common/Badge';
import { REQUEST_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

function StatCard({ label, value, color, to }) {
  const inner = (
    <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${color}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value ?? 0}</p>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export default function AdoptionDashboard() {
  const { data, loading } = useFetch(adoptionApi.getAll);
  const items    = data?.items || [];
  const pending  = items.filter(r => r.status === REQUEST_STATUS.PENDING).length;
  const approved = items.filter(r => r.status === REQUEST_STATUS.APPROVED).length;
  const rejected = items.filter(r => r.status === REQUEST_STATUS.REJECTED).length;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tổng quan - Cán bộ nhận nuôi</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Hồ sơ chờ xét duyệt" value={pending}  color="border-yellow-500" to="/can-bo-nhan-nuoi/danh-sach" />
        <StatCard label="Đã duyệt"             value={approved} color="border-green-500" />
        <StatCard label="Từ chối"              value={rejected} color="border-red-500" />
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium text-gray-700">Đơn nhận nuôi gần đây</h2>
          <Link to="/can-bo-nhan-nuoi/danh-sach" className="text-sm text-blue-600 hover:underline">Xem tất cả</Link>
        </div>
        {loading ? <p className="text-gray-400 text-sm">Đang tải...</p> : (
          <div className="divide-y">
            {items.slice(0, 5).map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.adopterName || `Đơn #${r.id}`}</p>
                  <p className="text-xs text-gray-400">{r.childName} &bull; {formatDate(r.createdAt)}</p>
                </div>
                <Badge status={r.status} />
              </div>
            ))}
            {items.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">Không có hồ sơ nào.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
