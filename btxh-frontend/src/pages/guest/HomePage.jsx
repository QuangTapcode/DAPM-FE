import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '📋',
    title: 'Gửi trẻ vào trung tâm',
    desc: 'Nộp hồ sơ giao trẻ trực tuyến, theo dõi trạng thái duyệt hồ sơ theo thời gian thực.',
    to: '/dang-ky',
    color: 'border-blue-500',
    btnColor: 'bg-[#1d4ed8] hover:bg-[#1e40af]',
  },
  {
    icon: '🏠',
    title: 'Nhận nuôi trẻ',
    desc: 'Xem danh sách trẻ chờ nhận nuôi, tạo đơn và theo dõi quá trình xét duyệt.',
    to: '/dang-ky',
    color: 'border-green-500',
    btnColor: 'bg-green-600 hover:bg-green-700',
  },
  {
    icon: '🏛️',
    title: 'Cán bộ / Trưởng phòng',
    desc: 'Quản lý hồ sơ tiếp nhận, nhận nuôi, theo dõi sức khỏe và duyệt hồ sơ.',
    to: '/dang-nhap',
    color: 'border-orange-500',
    btnColor: 'bg-[#f97316] hover:bg-[#ea580c]',
  },
];

const STATS = [
  { value: '1,240+', label: 'Trẻ được chăm sóc' },
  { value: '380+',   label: 'Trẻ được nhận nuôi' },
  { value: '12',     label: 'Năm hoạt động' },
  { value: '98%',    label: 'Hồ sơ xử lý đúng hạn' },
];

export default function HomePage() {
  return (
    <div className="bg-[#f0f5fb] min-h-screen">
      {/* Hero */}
      <div
        className="relative bg-[#1e3a5f] text-white py-20 px-6 text-center overflow-hidden"
        style={{ backgroundImage: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)' }}
      >
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-blue-200 text-sm font-medium mb-3 uppercase tracking-widest">
            Trung tâm Bảo trợ Xã hội
          </p>
          <h1 className="text-4xl font-black leading-tight mb-4">
            Hệ thống Quản lý<br />
            <span className="text-[#f97316]">Trẻ Em Mồ Côi</span>
          </h1>
          <p className="text-blue-100 text-base mb-8 leading-relaxed">
            Kết nối những trái tim yêu thương — hỗ trợ trẻ em có hoàn cảnh khó khăn
            tìm được mái ấm gia đình.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/dang-ky"
              className="px-6 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold rounded-xl transition shadow-lg">
              Đăng ký ngay
            </Link>
            <Link to="/huong-dan"
              className="px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl transition border border-white/30">
              Xem hướng dẫn
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {STATS.map((s) => (
            <div key={s.label} className="py-5 text-center">
              <p className="text-2xl font-black text-[#1d4ed8]">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Bạn cần làm gì?</h2>
        <p className="text-center text-gray-500 text-sm mb-10">Chọn vai trò phù hợp để bắt đầu sử dụng hệ thống</p>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title}
              className={`bg-white rounded-2xl shadow-md p-6 border-t-4 ${f.color} flex flex-col`}>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 flex-1 leading-relaxed">{f.desc}</p>
              <Link to={f.to}
                className={`mt-5 block text-center py-2.5 rounded-xl text-white text-sm font-semibold transition ${f.btnColor}`}>
                Bắt đầu →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links for dev */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Truy cập nhanh (Dev)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {[
              ['/dang-nhap', 'Đăng nhập'],
              ['/gui-tre/dashboard', 'Dashboard - Gửi trẻ'],
              ['/gui-tre/tao-yeu-cau', 'Tạo yêu cầu gửi trẻ'],
              ['/nhan-nuoi/dashboard', 'Dashboard - Nhận nuôi'],
              ['/can-bo-tiep-nhan/dashboard', 'CB Tiếp nhận'],
              ['/can-bo-nhan-nuoi/dashboard', 'CB Nhận nuôi'],
              ['/truong-phong/dashboard', 'Trưởng phòng'],
              ['/admin/dashboard', 'Admin'],
            ].map(([to, label]) => (
              <Link key={to} to={to}
                className="px-3 py-2 bg-gray-50 hover:bg-blue-50 hover:text-[#1d4ed8] rounded-lg text-gray-600 transition text-center">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
