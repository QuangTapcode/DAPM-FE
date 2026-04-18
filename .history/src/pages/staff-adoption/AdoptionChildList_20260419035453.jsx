import { useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatDate';
import { REQUEST_STATUS } from '../../utils/constants';

export default function AdoptionChildList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  // 🔥 DATA GIẢ
  const items = [
    { id: 1, code: 'T001', fullName: 'Nguyễn Văn A', dob: new Date(), gender: 'male', status: REQUEST_STATUS.PENDING },
    { id: 2, code: 'T002', fullName: 'Trần Thị B', dob: new Date(), gender: 'female', status: REQUEST_STATUS.APPROVED },
    { id: 3, code: 'T003', fullName: 'Lê Văn C', dob: new Date(), gender: 'male', status: REQUEST_STATUS.REJECTED },
    { id: 4, code: 'T004', fullName: 'Phạm Văn D', dob: new Date(), gender: 'male', status: REQUEST_STATUS.APPROVED },
    { id: 5, code: 'T005', fullName: 'Hoàng Thị E', dob: new Date(), gender: 'female', status: REQUEST_STATUS.PENDING },
    { id: 6, code: 'T006', fullName: 'Đỗ Văn F', dob: new Date(), gender: 'male', status: REQUEST_STATUS.APPROVED },
    { id: 7, code: 'T007', fullName: 'Ngô Thị G', dob: new Date(), gender: 'female', status: REQUEST_STATUS.REJECTED },
    { id: 8, code: 'T008', fullName: 'Bùi Văn H', dob: new Date(), gender: 'male', status: REQUEST_STATUS.PENDING },
    { id: 9, code: 'T009', fullName: 'Vũ Thị I', dob: new Date(), gender: 'female', status: REQUEST_STATUS.APPROVED },
    { id: 10, code: 'T010', fullName: 'Lý Văn K', dob: new Date(), gender: 'male', status: REQUEST_STATUS.PENDING },
  ];

  // 🔍 SEARCH
  const searchedItems = items.filter(
    (i) =>
      i.fullName.toLowerCase().includes(search.toLowerCase()) ||
      i.code.toLowerCase().includes(search.toLowerCase())
  );

  // 🎯 FILTER
  const filteredItems =
    filter === 'ALL'
      ? searchedItems
      : searchedItems.filter((i) => i.status === filter);

  // 🎨 STATUS STYLE
  const getStatusStyle = (status) => {
    if (status === REQUEST_STATUS.APPROVED)
      return 'bg-green-100 text-green-700';
    if (status === REQUEST_STATUS.REJECTED)
      return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getStatusText = (status) => {
    if (status === REQUEST_STATUS.APPROVED) return 'Đã duyệt';
    if (status === REQUEST_STATUS.REJECTED) return 'Từ chối';
    return 'Chờ xử lý';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          📋 Danh sách trẻ trong trung tâm
        </h1>
        <p className="text-sm text-gray-400">
          Quản lý và theo dõi thông tin trẻ
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-wrap items-center gap-3 mb-5">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Tìm theo tên, mã trẻ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-xl text-sm w-64 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* FILTER */}
        {[
          { label: 'Tất cả', value: 'ALL' },
          { label: 'Chờ xử lý', value: REQUEST_STATUS.PENDING },
          { label: 'Đã duyệt', value: REQUEST_STATUS.APPROVED },
          { label: 'Từ chối', value: REQUEST_STATUS.REJECTED },
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-4 py-1.5 rounded-full text-sm transition
              ${filter === btn.value
                ? 'bg-blue-500 text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-4 text-left">Mã trẻ</th>
              <th className="py-3 px-4 text-left">Họ tên</th>
              <th className="py-3 px-4 text-center">Ngày sinh</th>
              <th className="py-3 px-4 text-center">GT</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
              <th className="py-3 px-4 text-center">Chi tiết</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-blue-50 transition"
              >
                <td className="py-3 px-4 font-medium text-gray-700">
                  {item.code}
                </td>

                <td className="py-3 px-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {item.fullName[0]}
                  </div>
                  {item.fullName}
                </td>

                <td className="py-3 px-4 text-center">
                  {formatDate(item.dob)}
                </td>

                <td className="py-3 px-4 text-center">
                  {item.gender === 'male' ? 'Nam' : 'Nữ'}
                </td>

                <td className="py-3 px-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </td>

                <td className="py-3 px-4 text-center">
                  <Link
                    to={`/can-bo-nhan-nuoi/tre/${item.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Xem
                  </Link>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-400">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-4">
        <Pagination
          page={page}
          totalPages={1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}