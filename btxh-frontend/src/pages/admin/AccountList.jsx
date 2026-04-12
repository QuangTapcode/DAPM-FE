import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import adminApi from '../../api/adminApi';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import { ROLES } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

const ROLE_LABEL = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.SENDER]: 'Người gửi trẻ',
  [ROLES.ADOPTER]: 'Người nhận nuôi',
  [ROLES.STAFF_RECEPTION]: 'Cán bộ tiếp nhận',
  [ROLES.STAFF_ADOPTION]: 'Cán bộ nhận nuôi',
  [ROLES.MANAGER]: 'Trưởng phòng',
};

const COLUMNS = [
  { key: 'fullName', title: 'Họ tên' },
  { key: 'email', title: 'Email' },
  { key: 'role', title: 'Vai trò', render: (v) => ROLE_LABEL[v] || v },
  { key: 'createdAt', title: 'Ngày tạo', render: formatDate },
  { key: 'status', title: 'Trạng thái', render: (v) => <Badge status={v} /> },
  {
    key: 'id', title: 'Thao tác',
    render: (id) => (
      <div className="flex gap-2">
        <Link to={`/admin/accounts/${id}/edit`} className="text-blue-600 hover:underline text-xs">Sửa</Link>
      </div>
    ),
  },
];

export default function AccountList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, loading } = useFetch(() => adminApi.getUsers({ page, search }), [page, search]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Danh sách tài khoản</h1>
        <Link to="/admin/accounts/new">
          <Button size="sm">+ Thêm tài khoản</Button>
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên, email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border rounded px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <Table columns={COLUMNS} data={data?.items} loading={loading} />
      <Pagination page={page} totalPages={data?.totalPages || 1} onPageChange={setPage} />
    </div>
  );
}
