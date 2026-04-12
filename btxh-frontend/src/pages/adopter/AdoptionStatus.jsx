import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import adoptionApi from '../../api/adoptionApi';
import Badge from '../../components/common/Badge';
import { REQUEST_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

export default function AdoptionStatus() {
  const { data, loading } = useFetch(adoptionApi.getAll);
  const items = data?.items || [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Trạng thái đơn nhận nuôi</h1>

      {loading ? (
        <p className="text-gray-400">Đang tải...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Bạn chưa có đơn nhận nuôi nào.</p>
          <Link to="/nhan-nuoi/danh-sach-tre" className="mt-3 inline-block text-green-600 hover:underline text-sm">
            Xem danh sách trẻ
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow p-5 flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-800">{r.childName || `Đơn #${r.id}`}</p>
                <p className="text-xs text-gray-400 mt-0.5">Ngày nộp: {formatDate(r.createdAt)}</p>
                {r.status === REQUEST_STATUS.MISSING_INFO && r.note && (
                  <p className="mt-2 text-sm text-yellow-700 bg-yellow-50 px-3 py-1 rounded">
                    Yêu cầu bổ sung: {r.note}
                  </p>
                )}
                {r.status === REQUEST_STATUS.REJECTED && r.reason && (
                  <p className="mt-2 text-sm text-red-700 bg-red-50 px-3 py-1 rounded">
                    Lý do từ chối: {r.reason}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge status={r.status} />
                {[REQUEST_STATUS.PENDING, REQUEST_STATUS.MISSING_INFO].includes(r.status) && (
                  <Link to={`/nhan-nuoi/cap-nhat/${r.id}`} className="text-xs text-green-600 hover:underline">
                    Cập nhật
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
