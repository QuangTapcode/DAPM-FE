import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import childApi from '../../api/childApi';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/formatDate';

function InfoRow({ label, value }) {
  return (
    <div className="flex py-2 border-b last:border-0">
      <span className="w-48 text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-800">{value || '—'}</span>
    </div>
  );
}

export default function AdoptionChildDetail() {
  const { id } = useParams();
  const { data: child, loading } = useFetch(() => childApi.getById(id));

  if (loading) return <p className="text-gray-400">Đang tải...</p>;
  if (!child)  return <p className="text-gray-400">Không tìm thấy thông tin trẻ.</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-semibold text-gray-800">Thông tin trẻ — Chỉ xem</h1>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Read-only</span>
      </div>
      <p className="text-sm text-gray-400 mb-5">Dữ liệu này chỉ dành cho tham khảo khi xem xét hồ sơ nhận nuôi.</p>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
              {child.fullName?.[0]}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{child.fullName}</p>
              <p className="text-xs text-gray-400">Mã: {child.code}</p>
            </div>
          </div>
          <Badge status={child.status} />
        </div>
        <InfoRow label="Ngày sinh"           value={formatDate(child.dob)} />
        <InfoRow label="Giới tính"           value={child.gender === 'male' ? 'Nam' : 'Nữ'} />
        <InfoRow label="Dân tộc"             value={child.ethnicity} />
        <InfoRow label="Tình trạng sức khỏe" value={child.healthStatus} />
        <InfoRow label="Ngày tiếp nhận"      value={formatDate(child.admissionDate)} />
        <InfoRow label="Ghi chú"             value={child.notes} />
      </div>
    </div>
  );
}
