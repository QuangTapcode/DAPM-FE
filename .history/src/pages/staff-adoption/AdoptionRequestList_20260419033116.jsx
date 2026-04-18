import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import adoptionApi from '../../api/adoptionApi';
import Pagination from '../../components/common/Pagination';
import { REQUEST_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

export default function AdoptionRequestList() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, loading } = useFetch(
    () => adoptionApi.getAll({ page, status: statusFilter }),
    [page, statusFilter]
  );

  // 🔥 fallback
  const fallbackData = [
    { id: 1, adopterName: 'Nguyễn Văn A', childName: 'Bé An', status: REQUEST_STATUS.PENDING, createdAt: new Date() },
    { id: 2, adopterName: 'Trần Thị B', childName: 'Bé Bình', status: REQUEST_STATUS.APPROVED, createdAt: new Date() },
    { id: 3, adopterName: 'Lê Văn C', childName: 'Bé Cường', status: REQUEST_STATUS.REJECTED, createdAt: new Date() },
    { id: 4, adopterName: 'Phạm Văn D', childName: 'Bé Duy', status: REQUEST_STATUS.PENDING, createdAt: new Date() },
    { id: 5, adopterName: 'Hoàng Văn E', childName: 'Bé Hải', status: REQUEST_STATUS.PENDING, createdAt: new Date() },
  ];

  const items = data?.items?.length ? data.items : fallbackData;

  const filteredItems =
    !statusFilter ? items : items.filter(i => i.status === statusFilter);

  const getStatusColor = (status) => {
    if (status === REQUEST_STATUS.APPROVED) return 'bg-green-100 text-green-600';
    if (status === REQUEST_STATUS.REJECTED) return 'bg-red-100 text-red-600';
    return 'bg-yellow-100 text-yellow-600';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Danh sách đơn nhận nuôi
        </h1>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow">
          <img src="https://i.pravatar.cc/40" className="w-10 h-10 rounded-full" />
          <span className="font-medium">Hiệp Nguyễn</span>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-6">
        {[
          { label: 'Tất cả', value: '' },
          { label: 'Chờ xử lý', value: REQUEST_STATUS.PENDING },
          { label: 'Đã duyệt', value: REQUEST_STATUS.APPROVED },
          { label: 'Từ chối', value: REQUEST_STATUS.REJECTED },
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => {
              setStatusFilter(btn.value);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-sm shadow transition ${
              statusFilter === btn.value
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* TABLE CARD */}
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg overflow-hidden">

        {/* TABLE */}
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 text-sm">
            <tr>
              <th className="p-4 text-left">Người nhận nuôi</th>
              <th className="p-4 text-left">Trẻ đăng ký</th>
              <th className="p-4 text-left">Ngày nộp</th>
              <th className="p-4 text-left">Trạng thái</th>
              <th className="p-4 text-left">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition"
              >
                {/* USER */}
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/40?u=${item.id}`}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium">{item.adopterName}</span>
                </td>

                <td className="p-4 text-gray-700">{item.childName}</td>

                <td className="p-4 text-gray-500">
                  {formatDate(item.createdAt)}
                </td>

                {/* STATUS */}
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>

                {/* ACTION */}
                <td className="p-4 flex gap-2">
                  {item.status === REQUEST_STATUS.PENDING && (
                    <>
                      <button className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition">
                        Duyệt
                      </button>

                      <button className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition">
                        Từ chối
                      </button>
                    </>
                  )}

                  <Link
                    to={`/can-bo-nhan-nuoi/chi-tiet/${item.id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                  >
                    Xem
                  </Link>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-400">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-6">
        <Pagination
          page={page}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}