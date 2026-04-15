import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import receptionApi from '../../api/receptionApi';
import { REQUEST_STATUS } from '../../utils/constants';

/* ─── helpers ─────────────────────────────────────────── */
const STATUS_META = {
  [REQUEST_STATUS.PENDING]:      { label: 'Đang chờ',        color: 'text-amber-700  bg-amber-50  border-amber-200',  dot: 'bg-amber-400'  },
  [REQUEST_STATUS.MISSING_INFO]: { label: 'Thiếu thông tin', color: 'text-orange-700 bg-orange-50 border-orange-200', dot: 'bg-orange-400' },
  [REQUEST_STATUS.APPROVED]:     { label: 'Đã duyệt',        color: 'text-green-700  bg-green-50  border-green-200',  dot: 'bg-green-400'  },
  [REQUEST_STATUS.REJECTED]:     { label: 'Từ chối',         color: 'text-red-700    bg-red-50    border-red-200',    dot: 'bg-red-400'    },
  [REQUEST_STATUS.INVALID]:      { label: 'Không hợp lệ',    color: 'text-gray-700   bg-gray-50   border-gray-200',   dot: 'bg-gray-400'   },
};

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/* ─── Sub-components ──────────────────────────────────── */
function StatCard({ icon, label, value, sub, accent, delay }) {
  const ref = useScrollReveal({ threshold: 0.2 });
  return (
    <div ref={ref} className={`reveal reveal--scale ${delay}`}>
      <div className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
        <div className="flex items-start justify-between mb-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${accent} shadow-sm`}>
            {icon}
          </div>
          <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
          </svg>
        </div>
        <p className="text-2xl font-black text-gray-800">{value}</p>
        <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META[REQUEST_STATUS.PENDING];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${m.color} whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.dot}`} />
      {m.label}
    </span>
  );
}

function QuickCard({ to, icon, label, desc, bg, border }) {
  return (
    <Link to={to}
      className={`flex items-center gap-3.5 p-4 rounded-xl border-2 ${bg} ${border} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group`}>
      <div className="text-2xl flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 text-sm leading-tight truncate">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{desc}</p>
      </div>
      <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
      </svg>
    </Link>
  );
}

/* ─── Main ────────────────────────────────────────────── */
export default function SenderDashboard() {
  const { user } = useAuth();
  const { data: raw = [], loading } = useFetch(receptionApi.getAll);
  const requests = Array.isArray(raw) ? raw : [];

  const total    = requests.length;
  const pending  = requests.filter(r => [REQUEST_STATUS.PENDING, REQUEST_STATUS.MISSING_INFO].includes(r.status)).length;
  const approved = requests.filter(r => r.status === REQUEST_STATUS.APPROVED).length;
  const rejected = requests.filter(r => [REQUEST_STATUS.REJECTED, REQUEST_STATUS.INVALID].includes(r.status)).length;
  const recent   = [...requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  const heroRef    = useScrollReveal({ threshold: 0.1 });
  const tableRef   = useScrollReveal({ threshold: 0.08 });
  const sideRef    = useScrollReveal({ threshold: 0.08 });

  return (
    <div className="space-y-6 max-w-6xl mx-auto" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ── Welcome banner ─────────────────────────────── */}
      <div ref={heroRef} className="reveal reveal--left">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2a47] via-[#1e3a5f] to-[#1d4ed8] text-white p-6 sm:p-8 min-h-[140px] flex items-center">
          {/* blobs */}
          <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 right-20 w-36 h-36 rounded-full bg-[#f97316]/15 translate-y-1/2 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 w-full">
            <div>
              <p className="text-blue-300 text-sm font-semibold mb-1 flex items-center gap-2">
                <span>👋</span> Xin chào trở lại
              </p>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight">
                {user?.fullName || 'Người dùng'}
              </h1>
              <p className="text-blue-200 text-sm mt-2 max-w-sm leading-relaxed">
                Quản lý hồ sơ giao trẻ và theo dõi quá trình xét duyệt tại đây.
              </p>
            </div>
            <Link
              to="/gui-tre/tao-yeu-cau"
              className="flex-shrink-0 self-start sm:self-auto inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-600/30 hover:-translate-y-0.5 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Tạo yêu cầu mới
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="📋" label="Tổng hồ sơ"     value={loading ? '…' : total}    sub="đã giao"         accent="bg-blue-50 text-blue-600"   delay="reveal-delay-1" />
        <StatCard icon="⏳" label="Đang chờ duyệt"  value={loading ? '…' : pending}  sub="chờ xử lý"      accent="bg-amber-50 text-amber-600"  delay="reveal-delay-2" />
        <StatCard icon="✅" label="Đã tiếp nhận"    value={loading ? '…' : approved} sub="được duyệt"     accent="bg-green-50 text-green-600"  delay="reveal-delay-3" />
        <StatCard icon="❌" label="Không được duyệt" value={loading ? '…' : rejected} sub="bị từ chối"     accent="bg-red-50 text-red-600"      delay="reveal-delay-4" />
      </div>

      {/* ── Content grid ───────────────────────────────── */}
      <div className="grid xl:grid-cols-3 gap-6">

        {/* Recent requests */}
        <div ref={tableRef} className="reveal reveal--left xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            {/* header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-5 bg-[#1d4ed8] rounded-full" />
                <h2 className="font-black text-gray-800">Yêu cầu gần đây</h2>
              </div>
              <Link to="/gui-tre/trang-thai"
                className="text-xs font-bold text-[#1d4ed8] hover:text-[#f97316] transition-colors flex items-center gap-1">
                Xem tất cả
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>

            {/* body */}
            {loading ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <div className="w-9 h-9 border-4 border-[#1d4ed8]/20 border-t-[#1d4ed8] rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Đang tải dữ liệu...</p>
              </div>
            ) : recent.length === 0 ? (
              <div className="py-16 text-center px-6">
                <div className="text-5xl mb-4">📭</div>
                <p className="font-black text-gray-700 mb-2">Chưa có yêu cầu nào</p>
                <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
                  Bắt đầu bằng cách tạo yêu cầu giao trẻ đầu tiên của bạn.
                </p>
                <Link to="/gui-tre/tao-yeu-cau"
                  className="inline-flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Tạo yêu cầu đầu tiên
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recent.map((r, i) => (
                  <div key={r.id}
                    className="flex items-center gap-4 px-5 sm:px-6 py-3.5 hover:bg-gray-50/80 transition-colors group">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500 flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-800 truncate">
                        {r.childName || `Hồ sơ #${r.id}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {fmt(r.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                    {[REQUEST_STATUS.PENDING, REQUEST_STATUS.MISSING_INFO].includes(r.status) && (
                      <Link to={`/gui-tre/cap-nhat/${r.id}`}
                        className="text-xs font-bold text-[#1d4ed8] hover:text-[#f97316] transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                        Cập nhật
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div ref={sideRef} className="reveal reveal--right space-y-5">

          {/* Quick actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
              <div className="w-1 h-5 bg-[#f97316] rounded-full" />
              <h2 className="font-black text-gray-800">Thao tác nhanh</h2>
            </div>
            <div className="p-4 space-y-3">
              <QuickCard to="/gui-tre/tao-yeu-cau" icon="📝"
                label="Tạo yêu cầu mới" desc="Giao trẻ vào trung tâm"
                bg="bg-blue-50" border="border-blue-200 hover:border-blue-400" />
              <QuickCard to="/gui-tre/trang-thai" icon="📊"
                label="Xem trạng thái" desc="Theo dõi hồ sơ đã gửi"
                bg="bg-amber-50" border="border-amber-200 hover:border-amber-400" />
              <QuickCard to="/gui-tre/ho-so" icon="👤"
                label="Hồ sơ cá nhân" desc="Cập nhật thông tin của bạn"
                bg="bg-green-50" border="border-green-200 hover:border-green-400" />
            </div>
          </div>

          {/* Progress overview */}
          {total > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-1 h-5 bg-purple-500 rounded-full" />
                <h2 className="font-black text-gray-800 text-sm">Tổng quan</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Đang chờ',    val: pending,  max: total, color: 'bg-amber-400' },
                  { label: 'Đã duyệt',    val: approved, max: total, color: 'bg-green-400' },
                  { label: 'Từ chối',     val: rejected, max: total, color: 'bg-red-400'   },
                ].map(({ label, val, max, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                      <span>{label}</span>
                      <span>{val}/{max}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${color}`}
                        style={{ width: max > 0 ? `${(val / max) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hotline */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#1d4ed8] rounded-2xl p-5 text-white">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10">
              <div className="text-2xl mb-3">📞</div>
              <p className="font-black text-sm mb-1.5">Cần hỗ trợ?</p>
              <p className="text-blue-200 text-xs leading-relaxed mb-4">
                Liên hệ cán bộ tiếp nhận để được tư vấn về quy trình.
              </p>
              <a href="tel:02838401406"
                className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl py-2.5 text-sm font-bold transition">
                (028) 3840 1406
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
