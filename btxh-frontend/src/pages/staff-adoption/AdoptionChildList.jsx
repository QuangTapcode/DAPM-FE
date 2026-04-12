import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import childApi from '../../api/childApi';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatDate';

const COLUMNS = [
  { key: 'code',     title: 'Mã trẻ', width: 90 },
  { key: 'fullName', title: 'Họ tên' },
  { key: 'dob',      title: 'Ngày sinh', render: formatDate },
  { key: 'gender',   title: 'GT', render: (v) => v === 'male' ? 'Nam' : 'Nữ', width: 60 },
  { key: 'status',   title: 'Trạng thái', render: (v) => <Badge status={v} /> },
  {
    key: 'id', title: 'Chi tiết',
    render: (id) => (
      <Link to={`/can-bo-nhan-nuoi/tre/${id}`} className="text-blue-600 hover:underline text-xs">Xem</Link>
    ),
  },
];

export default function AdoptionChildList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, loading } = useFetch(() => childApi.getAll({ page, search }), [page, search]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Danh sách trẻ trong trung tâm</h1>
      <p className="text-sm text-gray-500 mb-4">Chế độ xem chỉ đọc — không thể chỉnh sửa.</p>

      <input
        type="text"
        placeholder="Tìm theo tên, mã trẻ..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="border rounded px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
      />

      <Table columns={COLUMNS} data={data?.items} loading={loading} />
      <Pagination page={page} totalPages={data?.totalPages || 1} onPageChange={setPage} />
    </div>
  );
}
