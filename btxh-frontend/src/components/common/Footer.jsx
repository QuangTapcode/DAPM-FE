import { Link } from 'react-router-dom';

const QUICK_LINKS = [
  { to: '/',           label: 'Trang chủ' },
  { to: '/huong-dan',  label: 'Hướng dẫn sử dụng' },
  { to: '/dang-ky',    label: 'Đăng ký tài khoản' },
  { to: '/dang-nhap',  label: 'Đăng nhập' },
];

export default function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-blue-100 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Col 1 — Brand */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3h2v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">TRUNG TÂM BẢO TRỢ XÃ HỘI</p>
              <p className="text-blue-300 text-xs">Hệ thống quản lý trực tuyến</p>
            </div>
          </div>
          <p className="text-sm text-blue-200 leading-relaxed">
            Hỗ trợ, chăm sóc và kết nối trẻ em có hoàn cảnh đặc biệt với những gia đình yêu thương.
          </p>
          {/* Social */}
          <div className="flex gap-2 mt-4">
            {['facebook', 'youtube', 'email'].map((s) => (
              <button key={s}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                title={s}
              >
                <span className="text-xs text-blue-200 capitalize">{s[0].toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Col 2 — Quick links */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-3">Liên kết nhanh</h3>
          <ul className="space-y-2">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-blue-200 hover:text-white transition flex items-center gap-1.5">
                  <span className="text-[#f97316]">›</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Contact */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-3">Thông tin liên hệ</h3>
          <ul className="space-y-2 text-sm text-blue-200">
            <li className="flex items-start gap-2">
              <span className="text-[#f97316] mt-0.5">📍</span>
              <span>123 Đường ABC, Phường XYZ, TP. Hồ Chí Minh</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#f97316]">📞</span>
              <span>0961 234 567 &ndash; 028 3456 7890</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#f97316]">✉️</span>
              <span>btxh@example.gov.vn</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 py-3 text-center text-xs text-blue-300">
        &copy; {new Date().getFullYear()} Trung Tâm Bảo Trợ Xã Hội &mdash; Bản quyền thuộc về đơn vị quản lý
      </div>
    </footer>
  );
}
