import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import adoptionApi from "../../api/adoptionApi";
import { REQUEST_STATUS } from "../../utils/constants";
import { formatDate } from "../../utils/formatDate";

const STATUS_META = {
  [REQUEST_STATUS.PENDING]:  { label: 'Chờ xử lý',  pill: 'bg-amber-50 text-amber-700 border border-amber-200',     dot: 'bg-amber-400' },
  [REQUEST_STATUS.APPROVED]: { label: 'Đã duyệt',    pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-400' },
  [REQUEST_STATUS.REJECTED]: { label: 'Từ chối',     pill: 'bg-red-50 text-red-700 border border-red-200',           dot: 'bg-red-400' },
};

const card28 = 'rounded-[28px] border border-[#E3ECF8] bg-white shadow-[0_14px_36px_rgba(42,74,122,0.08)]';

const fallback = [
  { id: 1, adopterName: 'Nguyễn Văn A', childName: 'Bé An',    createdAt: new Date(), status: REQUEST_STATUS.PENDING  },
  { id: 2, adopterName: 'Trần Thị B',   childName: 'Bé Bình',  createdAt: new Date(), status: REQUEST_STATUS.APPROVED },
  { id: 3, adopterName: 'Lê Văn C',     childName: 'Bé Cường', createdAt: new Date(), status: REQUEST_STATUS.REJECTED },
];

export default function AdoptionDashboard() {
  const { user } = useAuth();
  const { data, loading } = useFetch(adoptionApi.getAll);

  const list     = data?.items?.length ? data.items : fallback;
  const pending  = list.filter(i => i.status === REQUEST_STATUS.PENDING);
  const approved = list.filter(i => i.status === REQUEST_STATUS.APPROVED);
  const rejected = list.filter(i => i.status === REQUEST_STATUS.REJECTED);

  return (
    <div className="min-h-screen bg-[#F5F9FE]">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-[36px] font-bold text-[#0D47A1] leading-none">Tổng quan — Cán bộ nhận nuôi</h1>
          <p className="text-sm text-[#8FA0B8] mt-2">Xin chào, {user?.fullName || 'Cán bộ'}</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Hồ sơ chờ xét duyệt', value: pending.length,  colorBox: 'bg-amber-50 text-amber-600',    icon: '⏳' },
            { label: 'Đã duyệt',             value: approved.length, colorBox: 'bg-emerald-50 text-emerald-600', icon: '✅' },
            { label: 'Từ chối',              value: rejected.length, colorBox: 'bg-red-50 text-red-500',          icon: '❌' },
            { label: 'Tổng hồ sơ',           value: list.length,     colorBox: 'bg-[#EAF3FF] text-[#0D47A1]',   icon: '📋' },
          ].map((s, i) => (
            <div key={i} className={`${card28} p-5 flex items-center gap-4`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${s.colorBox}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8]">{s.label}</p>
                <p className="text-[32px] font-bold text-[#0D47A1] leading-none mt-0.5">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RECENT LIST */}
        <div className={`${card28} overflow-hidden`}>
          <div className="flex justify-between items-center px-6 py-5 border-b border-[#E3ECF8]">
            <h2 className="text-[15px] font-bold text-[#0D47A1]">Đơn nhận nuôi gần đây</h2>
            <Link to="/can-bo-nhan-nuoi/danh-sach" className="text-xs font-semibold text-[#5F81BC] hover:text-[#0D47A1] transition-colors">
              Xem tất cả →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#0D47A1]/20 border-t-[#0D47A1] rounded-full animate-spin"/>
            </div>
          ) : (
            <div className="divide-y divide-[#F0F5FC]">
              {list.slice(0, 5).map(item => {
                const m = STATUS_META[item.status] || STATUS_META[REQUEST_STATUS.PENDING];
                return (
                  <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#F5F9FE] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#EAF3FF] flex items-center justify-center font-bold text-[#0D47A1]">
                        {item.adopterName?.[0] || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-[15px] text-[#334155]">{item.adopterName}</p>
                        <p className="text-[12px] text-[#8FA0B8]">{item.childName}</p>
                      </div>
                    </div>
                    <span className="text-sm text-[#8FA0B8]">{formatDate(item.createdAt)}</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase ${m.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.dot}`}/>
                      {m.label}
                    </span>
                  </div>
                );
              })}
              {list.length === 0 && !loading && (
                <p className="text-sm text-[#8FA0B8] py-8 text-center">Không có hồ sơ nào.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
