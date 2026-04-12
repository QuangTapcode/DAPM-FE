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

export default function SentChildInfo() {
  const { id } = useParams();
  const { data: child, loading } = useFetch(() => childApi.getById(id));

  if (loading) return <p className="text-gray-400">Đang tải...</p>;
  if (!child) return <p className="text-gray-400">Không tìm thấy thông tin.</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Thông tin trẻ đã gửi</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg text-gray-800">{child.fullName}</h2>
          <Badge status={child.status} />
        </div>
        <InfoRow label="Ngày sinh"       value={formatDate(child.dob)} />
        <InfoRow label="Giới tính"       value={child.gender === 'male' ? 'Nam' : 'Nữ'} />
        <InfoRow label="Dân tộc"         value={child.ethnicity} />
        <InfoRow label="Tình trạng SK"   value={child.healthStatus} />
        <InfoRow label="Ngày tiếp nhận"  value={formatDate(child.admissionDate)} />
        <InfoRow label="Cán bộ tiếp nhận" value={child.staffName} />
      </div>
    </div>
  );
}
