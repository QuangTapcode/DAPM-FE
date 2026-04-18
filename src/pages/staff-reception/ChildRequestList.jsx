import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import receptionApi from '../../api/receptionApi';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { REQUEST_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

const COLUMNS = [
  { key: 'childName',  title: 'Tên trẻ' },
  { key: 'senderName', title: 'Người giao' },
  { key: 'createdAt',  title: 'Ngày gửi', render: formatDate },
  { key: 'status',     title: 'Trạng thái', render: (v) => <Badge status={v} /> },
  {
    key: 'id', title: 'Thao tác',
    render: (id) => (
      <Link to={`/can-bo-tiep-nhan/yeu-cau/${id}`} className="text-blue-600 hover:underline text-xs">
        Xem chi tiết
      </Link>
    ),
  },
];

export default function ChildRequestList() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const { data, loading } = useFetch(() => receptionApi.getAll({ page, status: statusFilter }), [page, statusFilter]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Danh sách yêu cầu gửi trẻ</h1>

      <div className="flex gap-2 mb-4">
        {['', REQUEST_STATUS.PENDING, REQUEST_STATUS.APPROVED, REQUEST_STATUS.REJECTED].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded text-xs border transition
              ${statusFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            {s === '' ? 'Tất cả' : s === REQUEST_STATUS.PENDING ? 'Chờ xử lý' : s === REQUEST_STATUS.APPROVED ? 'Đã duyệt' : 'Từ chối'}
          </button>
        ))}
      </div>

      <Table columns={COLUMNS} data={data?.items} loading={loading} />
      <Pagination page={page} totalPages={data?.totalPages || 1} onPageChange={setPage} />
    </div>
  );
}
