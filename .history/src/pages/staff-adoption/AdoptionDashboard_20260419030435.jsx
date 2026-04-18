import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import adoptionApi from "../../api/adoptionApi";
import { REQUEST_STATUS } from "../../utils/constants";
import { formatDate } from "../../utils/formatDate";

export default function AdoptionDashboard() {
  const { data, loading } = useFetch(adoptionApi.getAll);
  const items = data?.items?.length
  ? data.items
  : [
      {
        id: 1,
        adopterName: "Nguyễn Văn A",
        childName: "Bé An",
        status: REQUEST_STATUS.PENDING,
        createdAt: new Date(),
      },
      {
        id: 2,
        adopterName: "Trần Thị B",
        childName: "Bé Bình",
        status: REQUEST_STATUS.APPROVED,
        createdAt: new Date(),
      },
      {
        id: 3,
        adopterName: "Lê Văn C",
        childName: "Bé Cường",
        status: REQUEST_STATUS.REJECTED,
        createdAt: new Date(),
      },
    ];

  const pending = items.filter(
    (r) => r.status === REQUEST_STATUS.PENDING
  );
  const approved = items.filter(
    (r) => r.status === REQUEST_STATUS.APPROVED
  );
  const rejected = items.filter(
    (r) => r.status === REQUEST_STATUS.REJECTED
  );

  const stats = [
    {
      title: "Hồ sơ chờ xét duyệt",
      value: pending.length,
      color: "border-yellow-400",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      users: pending.slice(0, 2),
    },
    {
      title: "Đã duyệt",
      value: approved.length,
      color: "border-green-400",
      bg: "bg-green-50",
      text: "text-green-600",
      users: approved.slice(0, 2),
    },
    {
      title: "Từ chối",
      value: rejected.length,
      color: "border-red-400",
      bg: "bg-red-50",
      text: "text-red-600",
      users: rejected.slice(0, 2),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Tổng quan - Cán bộ nhận nuôi
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`p-5 rounded-2xl shadow border-l-4 ${item.color} ${item.bg}`}
          >
            <h3 className="text-gray-600">{item.title}</h3>
            <p className={`text-3xl font-bold ${item.text}`}>
              {item.value}
            </p>

            <ul className="mt-3 text-sm text-gray-500">
              {item.users.map((u, i) => (
                <li key={i}>
                  • {u.adopterName || `Đơn #${u.id}`}
                </li>
              ))}
            </ul>

            <Link
              to="/can-bo-nhan-nuoi/danh-sach"
              className="text-right block mt-2 text-blue-500 text-sm"
            >
              Xem chi tiết →
            </Link>
          </div>
        ))}

        {/* Fake chart */}
<div className="p-5 bg-white rounded-2xl shadow flex flex-col justify-center items-center">
          <div className="w-32 h-32 rounded-full border-[12px] border-green-400 border-t-yellow-400 border-r-red-400"></div>
          <p className="mt-3 text-gray-600 text-sm">
            Tỉ lệ xử lý hồ sơ
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Đơn nhận nuôi gần đây
          </h2>
          <Link
            to="/can-bo-nhan-nuoi/danh-sach"
            className="text-blue-500"
          >
            Xem tất cả
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400">Đang tải...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-gray-500 text-left">
                <th>Người đăng ký</th>
                <th>Trẻ</th>
                <th>Ngày nộp</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 5).map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-3">
                    {r.adopterName || `Đơn #${r.id}`}
                  </td>
                  <td>{r.childName}</td>
                  <td>{formatDate(r.createdAt)}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        r.status === REQUEST_STATUS.APPROVED
                          ? "bg-green-100 text-green-600"
                          : r.status === REQUEST_STATUS.REJECTED
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {items.length === 0 && !loading && (
          <p className="text-sm text-gray-400 py-4 text-center">
            Không có hồ sơ nào.
          </p>
        )}
      </div>
    </div>
  );
}