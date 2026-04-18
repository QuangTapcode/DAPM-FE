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

  // 🔥 DATA GIẢ (fallback khi API rỗng)
  const fallbackData = [
    { id: 1, adopterName: 'Nguyễn Văn A', childName: 'Bé An', status: REQUEST_STATUS.PENDING, createdAt: new Date() },
    { id: 2, adopterName: 'Trần Thị B', childName: 'Bé Bình', status: REQUEST_STATUS.APPROVED, createdAt: new Date() },
    { id: 3, adopterName: 'Lê Văn C', childName: 'Bé Cường', status: REQUEST_STATUS.REJECTED, createdAt: new Date() },
    { id: 4, adopterName: 'Phạm Văn D', childName: 'Bé Duy', status: REQUEST_STATUS.PENDING, createdAt: new Date() },
    { id: 5, adopterName: 'Hoàng Văn E', childName: 'Bé Hải', status: REQUEST_STATUS.PENDING, createdAt: new Date() },
  ];

  // 👉 ưu tiên API, không có thì dùng fake
  const items = data?.items?.length ? data.items : fallbackData;

  // 🎯 FILTER FRONTEND (để chắc chắn có data)
  const filteredItems =
    !statusFilter ? items : items.filter(i => i.status === statusFilter);

  // 🎨 màu trạng thái
  const getStatusColor = (status) => {
    if (status === REQUEST_STATUS.APPROVED) return 'bg-green-100 text-green-600';
    if (status === REQUEST_STATUS.REJECTED) return 'bg-red-100 text-red-600';
    return 'bg-yellow-100 text-yellow-600';
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Danh sách đơn nhận nuôi
      </h1>

      {/* FILTER */}
      <div className="flex gap-2 mb-4">
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
            className={`px-4 py-2 rounded-lg text-sm transition ${
              statusFilter === btn.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-200'
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
              <th className="p-3 text-left">Người nhận nuôi</th>
              <th className="p-3 text-left">Trẻ đăng ký</th>
              <th className="p-3 text-left">Ngày nộp</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{item.adopterName}</td>
                <td className="p-3">{item.childName}</td>
                <td className="p-3">{formatDate(item.createdAt)}</td>

                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>

                <td className="p-3 flex gap-2">
                  {/* 👉 nếu đang chờ thì cho duyệt */}
                  {item.status === REQUEST_STATUS.PENDING && (
                    <>
                      <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:opacity-90">
                        Duyệt
                      </button>

                      <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:opacity-90">
                        Từ chối
                      </button>
                    </>
                  )}

                  <Link
                    to={`/can-bo-nhan-nuoi/chi-tiet/${item.id}`}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    Xem
                  </Link>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-400">
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
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}