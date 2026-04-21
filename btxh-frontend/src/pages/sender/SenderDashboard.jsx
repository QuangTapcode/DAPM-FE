import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import receptionApi from '../../api/receptionApi';
import { REQUEST_STATUS } from '../../utils/constants';

/* ─── helpers ─────────────────────────────────────────── */
const STATUS_META = {
  [REQUEST_STATUS.PENDING]:      { label: 'Đang chờ',        pill: 'bg-amber-50 text-amber-700 border border-amber-200',  dot: 'bg-amber-400'  },
  [REQUEST_STATUS.MISSING_INFO]: { label: 'Thiếu thông tin', pill: 'bg-orange-50 text-orange-700 border border-orange-200', dot: 'bg-orange-400' },
  [REQUEST_STATUS.APPROVED]:     { label: 'Đã duyệt',        pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-400' },
  [REQUEST_STATUS.REJECTED]:     { label: 'Từ chối',         pill: 'bg-red-50 text-red-700 border border-red-200',    dot: 'bg-red-400'    },
  [REQUEST_STATUS.INVALID]:      { label: 'Không hợp lệ',    pill: 'bg-slate-50 text-slate-600 border border-slate-200',   dot: 'bg-slate-400'   },
};

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const card28 = 'rounded-[28px] border border-[#E3ECF8] bg-white shadow-[0_14px_36px_rgba(42,74,122,0.08)]';

function StatCard({ label, value, loading, colorClass, icon }) {
  return (
    <div className={`${card28} p-6 flex flex-col gap-3`}>
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${colorClass}`}>{icon}</div>
      <div>
        <p className="text-[32px] font-bold text-[#0D47A1] leading-none">{loading ? '…' : value}</p>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8] mt-1">{label}</p>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const m = STATUS_META[status] || STATUS_META[REQUEST_STATUS.PENDING];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase whitespace-nowrap ${m.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.dot}`} />
      {m.label}
    </span>
  );
}

export default function SenderDashboard() {
  const { user } = useAuth();
  const { data: raw = [], loading } = useFetch(receptionApi.getAll);
  const requests = Array.isArray(raw) ? raw : [];

  const total    = requests.length;
  const pending  = requests.filter(r => [REQUEST_STATUS.PENDING, REQUEST_STATUS.MISSING_INFO].includes(r.status)).length;
  const approved = requests.filter(r => r.status === REQUEST_STATUS.APPROVED).length;
  const rejected = requests.filter(r => [REQUEST_STATUS.REJECTED, REQUEST_STATUS.INVALID].includes(r.status)).length;
  const recent   = [...requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#F5F9FE]">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 space-y-6">

        {/* ── Welcome banner ─────────────────────────────── */}
        <div className={`${card28} overflow-hidden`}>
          <div className="relative bg-gradient-to-br from-[#0D47A1] via-[#1565C0] to-[#1976D2] p-7 sm:p-9 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 right-24 w-40 h-40 rounded-full bg-white/5 translate-y-1/2 pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <p className="text-blue-200 text-sm font-semibold mb-2">👋 Xin chào trở lại</p>
                <h1 className="text-[28px] sm:text-[32px] font-bold leading-tight">
                  {user?.fullName || 'Người dùng'}
                </h1>
                <p className="text-blue-200 text-sm mt-2 max-w-sm leading-relaxed">
                  Quản lý hồ sơ giao trẻ và theo dõi quá trình xét duyệt tại đây.
                </p>
              </div>
              <Link
                to="/gui-tre/tao-yeu-cau"
                className="flex-shrink-0 self-start sm:self-auto inline-flex items-center gap-2 bg-white text-[#0D47A1] font-bold px-6 py-3 rounded-2xl hover:bg-blue-50 transition-all shadow-lg text-sm"
              >
                + Tạo yêu cầu mới
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon="📋" label="Tổng hồ sơ"      value={total}    loading={loading} colorClass="bg-blue-50 text-blue-600" />
          <StatCard icon="⏳" label="Đang chờ duyệt"   value={pending}  loading={loading} colorClass="bg-amber-50 text-amber-600" />
          <StatCard icon="✅" label="Đã tiếp nhận"     value={approved} loading={loading} colorClass="bg-emerald-50 text-emerald-600" />
          <StatCard icon="❌" label="Không được duyệt"  value={rejected} loading={loading} colorClass="bg-red-50 text-red-600" />
        </div>

        {/* ── Content grid ───────────────────────────────── */}
        <div className="grid xl:grid-cols-3 gap-6">

          {/* Recent requests */}
          <div className={`${card28} xl:col-span-2 overflow-hidden`}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E3ECF8]">
              <h2 className="text-[15px] font-bold text-[#0D47A1]">Yêu cầu gần đây</h2>
              <Link to="/gui-tre/trang-thai"
                className="text-xs font-semibold text-[#5F81BC] hover:text-[#0D47A1] transition-colors">
                Xem tất cả →
              </Link>
            </div>

            {loading ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <div className="w-9 h-9 border-4 border-[#0D47A1]/20 border-t-[#0D47A1] rounded-full animate-spin" />
                <p className="text-sm text-[#8FA0B8]">Đang tải dữ liệu...</p>
              </div>
            ) : recent.length === 0 ? (
              <div className="py-16 text-center px-6">
                <div className="text-5xl mb-4">📭</div>
                <p className="font-bold text-[#334155] mb-2">Chưa có yêu cầu nào</p>
                <p className="text-sm text-[#8FA0B8] mb-6 max-w-xs mx-auto leading-relaxed">
                  Bắt đầu bằng cách tạo yêu cầu giao trẻ đầu tiên.
                </p>
                <Link to="/gui-tre/tao-yeu-cau"
                  className="inline-flex items-center gap-2 bg-[#0D47A1] text-white text-sm font-bold px-5 py-2.5 rounded-2xl transition hover:bg-[#1565C0]">
                  + Tạo yêu cầu đầu tiên
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#F0F5FC]">
                {recent.map((r, i) => (
                  <div key={r.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-[#F5F9FE] transition-colors group">
                    <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] flex items-center justify-center text-xs font-bold text-[#0D47A1] flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[15px] text-[#334155] truncate">
                        {r.childName || `Hồ sơ #${r.id}`}
                      </p>
                      <p className="text-[12px] text-[#8FA0B8] mt-0.5">{fmt(r.createdAt)}</p>
                    </div>
                    <StatusPill status={r.status} />
                    {[REQUEST_STATUS.PENDING, REQUEST_STATUS.MISSING_INFO].includes(r.status) && (
                      <Link to={`/gui-tre/cap-nhat/${r.id}`}
                        className="text-xs font-bold text-[#5F81BC] hover:text-[#0D47A1] transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                        Cập nhật
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Quick actions */}
            <div className={`${card28} overflow-hidden`}>
              <div className="px-6 py-5 border-b border-[#E3ECF8]">
                <h2 className="text-[15px] font-bold text-[#0D47A1]">Thao tác nhanh</h2>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { to: '/gui-tre/tao-yeu-cau', label: 'Tạo yêu cầu mới',   desc: 'Giao trẻ vào trung tâm',        bg: 'bg-[#EAF3FF]', text: 'text-[#0D47A1]' },
                  { to: '/gui-tre/trang-thai',   label: 'Xem trạng thái',    desc: 'Theo dõi hồ sơ đã gửi',        bg: 'bg-amber-50',  text: 'text-amber-700' },
                  { to: '/gui-tre/ho-so',        label: 'Hồ sơ cá nhân',     desc: 'Cập nhật thông tin của bạn',   bg: 'bg-emerald-50', text: 'text-emerald-700' },
                ].map(({ to, label, desc, bg, text }) => (
                  <Link key={to} to={to}
                    className={`flex items-center gap-3 p-4 rounded-2xl ${bg} hover:brightness-95 transition-all group`}>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${text}`}>{label}</p>
                      <p className="text-xs text-[#8FA0B8] mt-0.5">{desc}</p>
                    </div>
                    <span className="text-[#8FA0B8] group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Progress overview */}
            {total > 0 && (
              <div className={`${card28} p-6`}>
                <h2 className="text-[15px] font-bold text-[#0D47A1] mb-4">Tổng quan</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Đang chờ',  val: pending,  color: 'bg-amber-400' },
                    { label: 'Đã duyệt',  val: approved, color: 'bg-emerald-400' },
                    { label: 'Từ chối',   val: rejected, color: 'bg-red-400'   },
                  ].map(({ label, val, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.1em] text-[#8FA0B8] mb-1.5">
                        <span>{label}</span>
                        <span>{val}/{total}</span>
                      </div>
                      <div className="h-2 bg-[#EAF3FF] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${color} transition-all duration-700`}
                          style={{ width: total > 0 ? `${(val / total) * 100}%` : '0%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotline */}
            <div className={`${card28} overflow-hidden`}>
              <div className="bg-gradient-to-br from-[#0D47A1] to-[#1976D2] p-5 text-white rounded-[28px]">
                <div className="text-2xl mb-3">📞</div>
                <p className="font-bold text-sm mb-1">Cần hỗ trợ?</p>
                <p className="text-blue-200 text-xs leading-relaxed mb-4">
                  Liên hệ cán bộ tiếp nhận để được tư vấn về quy trình.
                </p>
                <a href="tel:02838401406"
                  className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-2xl py-2.5 text-sm font-bold transition">
                  (028) 3840 1406
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
