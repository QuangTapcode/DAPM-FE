import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import receptionApi from '../../api/receptionApi';
import { REQUEST_STATUS } from '../../utils/constants';

const STATUS_META = {
  [REQUEST_STATUS.PENDING]:      { label: 'Đang chờ duyệt', pill: 'bg-amber-50 text-amber-700 border border-amber-200',   dot: 'bg-amber-400',   icon: '⏳' },
  [REQUEST_STATUS.MISSING_INFO]: { label: 'Thiếu thông tin', pill: 'bg-orange-50 text-orange-700 border border-orange-200', dot: 'bg-orange-400',  icon: '⚠️' },
  [REQUEST_STATUS.APPROVED]:     { label: 'Đã duyệt',        pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-400', icon: '✅' },
  [REQUEST_STATUS.REJECTED]:     { label: 'Từ chối',         pill: 'bg-red-50 text-red-700 border border-red-200',         dot: 'bg-red-400',     icon: '❌' },
  [REQUEST_STATUS.INVALID]:      { label: 'Không hợp lệ',    pill: 'bg-slate-50 text-slate-600 border border-slate-200',   dot: 'bg-slate-400',   icon: '🚫' },
};

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: REQUEST_STATUS.PENDING,      label: 'Đang chờ' },
  { key: REQUEST_STATUS.MISSING_INFO, label: 'Thiếu TT' },
  { key: REQUEST_STATUS.APPROVED,     label: 'Đã duyệt' },
  { key: REQUEST_STATUS.REJECTED,     label: 'Từ chối'  },
];

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const card28 = 'rounded-[28px] border border-[#E3ECF8] bg-white shadow-[0_14px_36px_rgba(42,74,122,0.08)]';

function StatusPill({ status }) {
  const m = STATUS_META[status] || STATUS_META[REQUEST_STATUS.PENDING];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase whitespace-nowrap ${m.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.dot}`} />
      {m.label}
    </span>
  );
}

function RequestCard({ item }) {
  const meta = STATUS_META[item.status] || STATUS_META[REQUEST_STATUS.PENDING];
  const canEdit = [REQUEST_STATUS.PENDING, REQUEST_STATUS.MISSING_INFO].includes(item.status);

  return (
    <div className={`${card28} overflow-hidden`}>
      {/* header */}
      <div className="flex items-start sm:items-center justify-between gap-3 px-6 py-5">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] flex items-center justify-center text-xl flex-shrink-0">
            👶
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[15px] text-[#334155] truncate">
              {item.childName || `Hồ sơ #${item.id}`}
            </p>
            <p className="text-[11px] text-[#8FA0B8] mt-0.5">Gửi ngày {fmt(item.createdAt)}</p>
          </div>
        </div>
        <StatusPill status={item.status} />
      </div>

      {/* status messages */}
      {item.status === REQUEST_STATUS.MISSING_INFO && item.note && (
        <div className="mx-6 mb-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex gap-3">
          <span className="text-base flex-shrink-0 mt-0.5">⚠️</span>
          <div>
            <p className="text-xs font-bold text-orange-800 mb-1">Yêu cầu bổ sung thông tin</p>
            <p className="text-xs text-orange-700 leading-relaxed">{item.note}</p>
          </div>
        </div>
      )}
      {item.status === REQUEST_STATUS.REJECTED && item.reason && (
        <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3">
          <span className="text-base flex-shrink-0 mt-0.5">❌</span>
          <div>
            <p className="text-xs font-bold text-red-800 mb-1">Lý do từ chối</p>
            <p className="text-xs text-red-700 leading-relaxed">{item.reason}</p>
          </div>
        </div>
      )}
      {item.status === REQUEST_STATUS.APPROVED && (
        <div className="mx-6 mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex gap-3">
          <span className="text-base flex-shrink-0 mt-0.5">✅</span>
          <div>
            <p className="text-xs font-bold text-emerald-800 mb-1">Hồ sơ đã được tiếp nhận</p>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Trẻ đã được tiếp nhận vào trung tâm. Cảm ơn bạn đã tin tưởng chúng tôi.
            </p>
          </div>
        </div>
      )}

      {/* footer */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-[#F5F9FE] border-t border-[#E3ECF8]">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8FA0B8]">
          Cập nhật: {fmt(item.updatedAt || item.createdAt)}
        </p>
        <div className="flex items-center gap-3">
          {item.childId && (
            <Link to={`/gui-tre/tre/${item.childId}`}
              className="text-xs font-semibold text-[#5F81BC] hover:text-[#0D47A1] transition-colors">
              Xem trẻ →
            </Link>
          )}
          {canEdit && (
            <Link to={`/gui-tre/cap-nhat/${item.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#0D47A1] hover:bg-[#1565C0] text-white px-4 py-1.5 rounded-2xl transition shadow-sm">
              Cập nhật
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RequestStatus() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const { data: raw = [], loading } = useFetch(receptionApi.getAll);
  const requests = Array.isArray(raw) ? raw : [];

  const counts = TABS.reduce((acc, t) => {
    acc[t.key] = t.key === 'all' ? requests.length : requests.filter(r => r.status === t.key).length;
    return acc;
  }, {});

  const filtered = (filter === 'all' ? requests : requests.filter(r => r.status === filter))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="min-h-screen bg-[#F5F9FE]">
      <div className="mx-auto max-w-[1000px] px-4 py-6 sm:px-6 lg:px-8 space-y-5">

        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#8FA0B8] mb-2">
              <button onClick={() => navigate('/gui-tre/dashboard')} className="hover:text-[#0D47A1] transition-colors">Tổng quan</button>
              <span>/</span>
              <span className="text-[#334155]">Trạng thái hồ sơ</span>
            </div>
            <h1 className="text-[36px] font-bold text-[#0D47A1] leading-none">Trạng thái hồ sơ</h1>
            <p className="text-sm text-[#8FA0B8] mt-2">{requests.length} yêu cầu đã gửi</p>
          </div>
          <Link to="/gui-tre/tao-yeu-cau"
            className="self-start sm:self-auto flex-shrink-0 inline-flex items-center gap-2 bg-[#0D47A1] hover:bg-[#1565C0] text-white font-bold px-6 py-3 rounded-2xl transition shadow-md text-sm">
            + Tạo yêu cầu mới
          </Link>
        </div>

        {/* filter tabs */}
        <div className={`${card28} p-1.5 flex gap-1 overflow-x-auto scrollbar-none`}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-[20px] text-sm font-semibold transition-all duration-200
                ${filter === tab.key
                  ? 'bg-[#0D47A1] text-white shadow-sm'
                  : 'text-[#8FA0B8] hover:text-[#334155] hover:bg-[#F5F9FE]'}`}>
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                  ${filter === tab.key ? 'bg-white/20 text-white' : 'bg-[#EAF3FF] text-[#5F81BC]'}`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#0D47A1]/20 border-t-[#0D47A1] rounded-full animate-spin" />
            <p className="text-sm text-[#8FA0B8]">Đang tải danh sách...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`${card28} py-20 text-center px-6`}>
            <div className="text-6xl mb-4">{filter === 'all' ? '📭' : (STATUS_META[filter]?.icon || '🔍')}</div>
            <p className="font-bold text-[#334155] text-lg mb-2">
              {filter === 'all' ? 'Chưa có yêu cầu nào' : 'Không có hồ sơ phù hợp'}
            </p>
            <p className="text-sm text-[#8FA0B8] mb-6 max-w-xs mx-auto">
              {filter === 'all' ? 'Tạo yêu cầu giao trẻ đầu tiên để bắt đầu quy trình.' : 'Không có hồ sơ nào phù hợp với bộ lọc này.'}
            </p>
            {filter === 'all' && (
              <Link to="/gui-tre/tao-yeu-cau"
                className="inline-flex items-center gap-2 bg-[#0D47A1] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[#1565C0] transition text-sm">
                + Tạo yêu cầu đầu tiên
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(item => <RequestCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  );
}
