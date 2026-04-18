import { useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatDate';
import { REQUEST_STATUS } from '../../utils/constants';

export default function AdoptionChildList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  // 🔥 DATA GIẢ (CHẮC CHẮN HIỆN)
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

  // 🎨 STATUS COLOR
  const getStatusColor = (status) => {
    if (status === REQUEST_STATUS.APPROVED)
      return 'bg-green-100 text-green-600';
    if (status === REQUEST_STATUS.REJECTED)
      return 'bg-red-100 text-red-600';
    return 'bg-yellow-100 text-yellow-600';
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen animate-fadeIn">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Danh sách trẻ trong trung tâm
      </h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Tìm theo tên, mã trẻ..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2 text-sm w-72 mb-4"
      />

      {/* FILTER */}
      <div className="flex gap-2 mb-4">
        {[
          { label: 'Tất cả', value: 'ALL' },
          { label: 'Chờ xử lý', value: REQUEST_STATUS.PENDING },
{ label: 'Đã duyệt', value: REQUEST_STATUS.APPROVED },
          { label: 'Từ chối', value: REQUEST_STATUS.REJECTED },
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === btn.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-3 text-left">Mã trẻ</th>
              <th className="p-3 text-left">Họ tên</th>
              <th className="p-3 text-left">Ngày sinh</th>
              <th className="p-3 text-left">GT</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Chi tiết</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3">{item.code}</td>
                <td className="p-3 font-medium">
                  {item.fullName}
                </td>
                <td className="p-3">
                  {formatDate(item.dob)}
                </td>
                <td className="p-3">
                  {item.gender === 'male' ? 'Nam' : 'Nữ'}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3">
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
                <td
                  colSpan="6"
                  className="text-center p-4 text-gray-400"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Pagination
        page={page}
        totalPages={1}
        onPageChange={setPage}
      />
    </div>
  );
}