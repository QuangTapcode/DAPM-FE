import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import receptionApi from '../../api/receptionApi';
import childApi from '../../api/childApi';
import Badge from '../../components/common/Badge';
import { REQUEST_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

function StatCard({ label, value, color, to }) {
  const inner = (
    <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${color} ${to ? 'hover:shadow-md transition cursor-pointer' : ''}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value ?? 0}</p>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export default function ReceptionDashboard() {
  const { data: reqData } = useFetch(receptionApi.getAll);
  const { data: childData } = useFetch(childApi.getAll);

  const requests = reqData?.items || [];
  const pending = requests.filter(r => r.status === REQUEST_STATUS.PENDING).length;
  const total   = childData?.total || 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tổng quan - Cán bộ tiếp nhận</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Yêu cầu chờ xử lý" value={pending} color="border-yellow-500" to="/can-bo-tiep-nhan/yeu-cau" />
        <StatCard label="Tổng trẻ trong trung tâm" value={total} color="border-blue-500" to="/can-bo-tiep-nhan/tre" />
        <StatCard label="Tiếp nhận hôm nay" value={requests.filter(r => r.status === REQUEST_STATUS.APPROVED && r.approvedToday).length} color="border-green-500" />
        <StatCard label="Từ chối" value={requests.filter(r => r.status === REQUEST_STATUS.REJECTED).length} color="border-red-500" />
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium text-gray-700">Yêu cầu mới nhất</h2>
          <Link to="/can-bo-tiep-nhan/yeu-cau" className="text-sm text-blue-600 hover:underline">Xem tất cả</Link>
        </div>
        <div className="divide-y">
          {requests.slice(0, 5).map((r) => (
            <div key={r.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{r.childName || `Yêu cầu #${r.id}`}</p>
                <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
              </div>
              <Badge status={r.status} />
            </div>
          ))}
          {requests.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">Không có yêu cầu nào.</p>}
        </div>
      </div>
    </div>
  );
}
