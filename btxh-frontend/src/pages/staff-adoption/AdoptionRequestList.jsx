import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import adoptionApi from '../../api/adoptionApi';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { REQUEST_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

const COLUMNS = [
  { key: 'adopterName', title: 'Người nhận nuôi' },
  { key: 'childName',   title: 'Trẻ đăng ký' },
  { key: 'createdAt',   title: 'Ngày nộp', render: formatDate },
  { key: 'status',      title: 'Trạng thái', render: (v) => <Badge status={v} /> },
  {
    key: 'id', title: 'Thao tác',
    render: (id) => (
      <Link to={`/can-bo-nhan-nuoi/chi-tiet/${id}`} className="text-blue-600 hover:underline text-xs">
        Xem chi tiết
      </Link>
    ),
  },
];

const STATUS_FILTERS = [
  { value: '',                          label: 'Tất cả' },
  { value: REQUEST_STATUS.PENDING,      label: 'Chờ xử lý' },
  { value: REQUEST_STATUS.APPROVED,     label: 'Đã duyệt' },
  { value: REQUEST_STATUS.REJECTED,     label: 'Từ chối' },
];

export default function AdoptionRequestList() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const { data, loading } = useFetch(() => adoptionApi.getAll({ page, status: statusFilter }), [page, statusFilter]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Danh sách đơn nhận nuôi</h1>

      <div className="flex gap-2 mb-4">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setStatusFilter(f.value); setPage(1); }}
            className={`px-3 py-1.5 rounded text-xs border transition
              ${statusFilter === f.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Table columns={COLUMNS} data={data?.items} loading={loading} />
      <Pagination page={page} totalPages={data?.totalPages || 1} onPageChange={setPage} />
    </div>
  );
}
