import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import adoptionApi from "../../api/adoptionApi";
import { REQUEST_STATUS } from "../../utils/constants";
import { formatDate } from "../../utils/formatDate";

export default function AdoptionDashboard() {
  const { data, loading } = useFetch(adoptionApi.getAll);

  // 👉 fallback nếu chưa có API
  const fallback = [
    {
      id: 1,
      adopterName: "Nguyễn Văn A",
      childName: "Bé An",
      createdAt: new Date(),
      status: REQUEST_STATUS.PENDING,
    },
    {
      id: 2,
      adopterName: "Trần Thị B",
      childName: "Bé Bình",
      createdAt: new Date(),
      status: REQUEST_STATUS.APPROVED,
    },
    {
      id: 3,
      adopterName: "Lê Văn C",
      childName: "Bé Cường",
      createdAt: new Date(),
      status: REQUEST_STATUS.REJECTED,
    },
  ];

  const list = data?.items?.length ? data.items : fallback;

  const pending = list.filter(i => i.status === REQUEST_STATUS.PENDING);
  const approved = list.filter(i => i.status === REQUEST_STATUS.APPROVED);
  const rejected = list.filter(i => i.status === REQUEST_STATUS.REJECTED);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Tổng quan - Cán bộ nhận nuôi
        </h1>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow">
          <img
            src="https://i.pravatar.cc/40"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Hiệp Nguyễn</span>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-6">

        {/* Pending */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-yellow-200 to-orange-300 shadow hover:scale-105 transition">
          <p className="text-gray-700">Hồ sơ chờ xét duyệt</p>
          <h2 className="text-3xl font-bold text-orange-600">
            {pending.length}
          </h2>
          <p className="text-sm mt-2 text-gray-700">
            {pending[0]?.adopterName || "Không có"}
          </p>
        </div>

        {/* Approved */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-green-200 to-teal-300 shadow hover:scale-105 transition">
          <p className="text-gray-700">Đã duyệt</p>
          <h2 className="text-3xl font-bold text-green-600">
            {approved.length}
          </h2>
          <p className="text-sm mt-2 text-gray-700">
            {approved[0]?.adopterName || "Không có"}
          </p>
        </div>

        {/* Rejected */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-red-200 to-pink-300 shadow hover:scale-105 transition">
          <p className="text-gray-700">Từ chối</p>
          <h2 className="text-3xl font-bold text-red-600">
            {rejected.length}
          </h2>
          <p className="text-sm mt-2 text-gray-700">
            {rejected[0]?.adopterName || "Không có"}
          </p>
        </div>

        {/* Circle chart fake */}
        <div className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-4">
          <div className="w-32 h-32 rounded-full border-[14px]
            border-green-400 border-t-yellow-400 border-r-red-400 animate-spin-slow">
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Tỉ lệ xử lý hồ sơ
          </p>
        </div>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Đơn nhận nuôi gần đây
          </h2>
          <Link
            to="/can-bo-nhan-nuoi/danh-sach"
            className="text-blue-500 hover:underline"
          >
            Xem tất cả →
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400">Đang tải...</p>
        ) : (
          <div className="space-y-3">
            {list.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/40?u=${item.id}`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{item.adopterName}</p>
                    <p className="text-sm text-gray-400">
                      {item.childName}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  {formatDate(item.createdAt)}
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    item.status === REQUEST_STATUS.APPROVED
                      ? "bg-green-100 text-green-600"
                      : item.status === REQUEST_STATUS.REJECTED
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {list.length === 0 && !loading && (
          <p className="text-sm text-gray-400 py-4 text-center">
            Không có hồ sơ nào.
          </p>
        )}
      </div>
    </div>
  );
}