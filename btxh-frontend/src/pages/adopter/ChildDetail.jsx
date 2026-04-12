import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import childApi from '../../api/childApi';
import { formatDate } from '../../utils/formatDate';

function InfoRow({ label, value }) {
  return (
    <div className="flex py-2 border-b last:border-0">
      <span className="w-48 text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-800">{value || '—'}</span>
    </div>
  );
}

export default function ChildDetail() {
  const { id } = useParams();
  const { data: child, loading } = useFetch(() => childApi.getById(id));

  if (loading) return <p className="text-gray-400">Đang tải...</p>;
  if (!child)  return <p className="text-gray-400">Không tìm thấy thông tin trẻ.</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Thông tin trẻ</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-4">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl">
            {child.fullName?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{child.fullName}</h2>
            <p className="text-sm text-gray-400">{child.gender === 'male' ? 'Nam' : 'Nữ'} &bull; {formatDate(child.dob)}</p>
          </div>
        </div>
        <InfoRow label="Dân tộc"            value={child.ethnicity} />
        <InfoRow label="Tình trạng sức khỏe" value={child.healthStatus} />
        <InfoRow label="Ngày tiếp nhận"      value={formatDate(child.admissionDate)} />
        <InfoRow label="Ghi chú"             value={child.notes} />
      </div>

      <Link
        to={`/nhan-nuoi/tao-don?childId=${id}`}
        className="block text-center bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition"
      >
        Tạo đơn nhận nuôi trẻ này
      </Link>
    </div>
  );
}
