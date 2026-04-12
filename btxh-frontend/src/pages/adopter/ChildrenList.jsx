import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import childApi from '../../api/childApi';
import Pagination from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatDate';

function ChildCard({ child }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
          {child.fullName?.[0] || '?'}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{child.fullName}</p>
          <p className="text-xs text-gray-400">{child.gender === 'male' ? 'Nam' : 'Nữ'} &bull; {formatDate(child.dob)}</p>
        </div>
      </div>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{child.healthStatus || 'Không có thông tin sức khỏe.'}</p>
      <Link
        to={`/nhan-nuoi/tre/${child.id}`}
        className="block text-center text-sm bg-green-600 text-white py-1.5 rounded hover:bg-green-700 transition"
      >
        Xem chi tiết
      </Link>
    </div>
  );
}

export default function ChildrenList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, loading } = useFetch(() => childApi.getAll({ page, search, available: true }), [page, search]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Danh sách trẻ chờ nhận nuôi</h1>

      <input
        type="text"
        placeholder="Tìm theo tên trẻ..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="border rounded px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-green-400 mb-5"
      />

      {loading ? (
        <p className="text-gray-400">Đang tải...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.items?.map((c) => <ChildCard key={c.id} child={c} />)}
            {!data?.items?.length && <p className="text-gray-400 col-span-3 text-center py-8">Không có trẻ nào.</p>}
          </div>
          <Pagination page={page} totalPages={data?.totalPages || 1} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
