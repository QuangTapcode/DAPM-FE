import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import childApi from '../../api/childApi';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';

const COLUMNS = [
  { key: 'code',        title: 'Mã trẻ', width: 90 },
  { key: 'fullName',    title: 'Họ tên' },
  { key: 'dob',         title: 'Ngày sinh', render: formatDate },
  { key: 'gender',      title: 'GT', render: (v) => v === 'male' ? 'Nam' : 'Nữ', width: 60 },
  { key: 'admissionDate', title: 'Ngày tiếp nhận', render: formatDate },
  { key: 'status',      title: 'Trạng thái', render: (v) => <Badge status={v} /> },
  {
    key: 'id', title: 'Thao tác',
    render: (id) => (
      <div className="flex gap-2">
        <Link to={`/can-bo-tiep-nhan/tre/${id}/sua`} className="text-blue-600 hover:underline text-xs">Sửa</Link>
        <Link to={`/can-bo-tiep-nhan/tre/${id}/suc-khoe`} className="text-green-600 hover:underline text-xs">SK</Link>
      </div>
    ),
  },
];

export default function ChildList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, loading } = useFetch(() => childApi.getAll({ page, search }), [page, search]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Danh sách trẻ trong trung tâm</h1>
        <Link to="/can-bo-tiep-nhan/tre/tao">
          <Button size="sm">+ Thêm trẻ</Button>
        </Link>
      </div>

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
