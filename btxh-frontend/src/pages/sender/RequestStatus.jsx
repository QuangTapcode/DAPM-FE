import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useFetch } from '../../hooks/useFetch';
import receptionApi from '../../api/receptionApi';
import { REQUEST_STATUS } from '../../utils/constants';

const STATUS_META = {
  [REQUEST_STATUS.PENDING]:      { label: 'Đang chờ duyệt', color: 'text-amber-700  bg-amber-50  border-amber-200',  dot: 'bg-amber-400',  icon: '⏳' },
  [REQUEST_STATUS.MISSING_INFO]: { label: 'Thiếu thông tin', color: 'text-orange-700 bg-orange-50 border-orange-200', dot: 'bg-orange-400', icon: '⚠️' },
  [REQUEST_STATUS.APPROVED]:     { label: 'Đã duyệt',        color: 'text-green-700  bg-green-50  border-green-200',  dot: 'bg-green-400',  icon: '✅' },
  [REQUEST_STATUS.REJECTED]:     { label: 'Từ chối',         color: 'text-red-700    bg-red-50    border-red-200',    dot: 'bg-red-400',    icon: '❌' },
  [REQUEST_STATUS.INVALID]:      { label: 'Không hợp lệ',    color: 'text-gray-700   bg-gray-50   border-gray-200',   dot: 'bg-gray-400',   icon: '🚫' },
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

function RequestCard({ item, idx }) {
  const ref  = useScrollReveal({ threshold: 0.08 });
  const meta = STATUS_META[item.status] || STATUS_META[REQUEST_STATUS.PENDING];
  const canEdit = [REQUEST_STATUS.PENDING, REQUEST_STATUS.MISSING_INFO].includes(item.status);

  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${Math.min(idx * 60, 300)}ms` }}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
        {/* header row */}
        <div className="flex items-start sm:items-center justify-between gap-3 p-4 sm:p-5">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
              👶
            </div>
            <div className="min-w-0">
              <p className="font-black text-gray-800 text-sm sm:text-base truncate">
                {item.childName || `Hồ sơ #${item.id}`}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5" />
                </svg>
                Gửi ngày {fmt(item.createdAt)}
              </p>
            </div>
          </div>
          <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${meta.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${meta.dot}`} />
            {meta.label}
          </span>
        </div>

        {/* status messages */}
        {item.status === REQUEST_STATUS.MISSING_INFO && item.note && (
          <div className="mx-4 sm:mx-5 mb-4 p-3.5 bg-orange-50 border border-orange-200 rounded-xl flex gap-3">
            <span className="text-base flex-shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="text-xs font-black text-orange-800 mb-1">Yêu cầu bổ sung thông tin</p>
              <p className="text-xs text-orange-700 leading-relaxed">{item.note}</p>
            </div>
          </div>
        )}
        {item.status === REQUEST_STATUS.REJECTED && item.reason && (
          <div className="mx-4 sm:mx-5 mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex gap-3">
            <span className="text-base flex-shrink-0 mt-0.5">❌</span>
            <div>
              <p className="text-xs font-black text-red-800 mb-1">Lý do từ chối</p>
              <p className="text-xs text-red-700 leading-relaxed">{item.reason}</p>
            </div>
          </div>
        )}
        {item.status === REQUEST_STATUS.APPROVED && (
          <div className="mx-4 sm:mx-5 mb-4 p-3.5 bg-green-50 border border-green-200 rounded-xl flex gap-3">
            <span className="text-base flex-shrink-0 mt-0.5">✅</span>
            <div>
              <p className="text-xs font-black text-green-800 mb-1">Hồ sơ đã được tiếp nhận</p>
              <p className="text-xs text-green-700 leading-relaxed">
                Trẻ đã được tiếp nhận vào trung tâm. Cảm ơn bạn đã tin tưởng chúng tôi.
              </p>
            </div>
          </div>
        )}

        {/* footer */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-gray-50/70 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Cập nhật: {fmt(item.updatedAt || item.createdAt)}
          </p>
          <div className="flex items-center gap-2">
            {item.childId && (
              <Link to={`/gui-tre/tre/${item.childId}`}
                className="text-xs font-bold text-[#1d4ed8] hover:text-[#f97316] transition-colors">
                Xem trẻ →
              </Link>
            )}
            {canEdit && (
              <Link to={`/gui-tre/cap-nhat/${item.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-3 py-1.5 rounded-lg transition shadow-sm">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                </svg>
                Cập nhật
              </Link>
            )}
          </div>
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

  const headerRef = useScrollReveal({ threshold: 0.1 });

  const counts = TABS.reduce((acc, t) => {
    acc[t.key] = t.key === 'all' ? requests.length : requests.filter(r => r.status === t.key).length;
    return acc;
  }, {});

  const filtered = (filter === 'all' ? requests : requests.filter(r => r.status === filter))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="max-w-3xl mx-auto space-y-5" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* header */}
      <div ref={headerRef} className="reveal reveal--left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5">
            <button onClick={() => navigate('/gui-tre/dashboard')} className="hover:text-[#1d4ed8] font-medium transition-colors">Tổng quan</button>
            <span>/</span>
            <span className="text-gray-600 font-semibold">Trạng thái hồ sơ</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Trạng thái hồ sơ</h1>
          <p className="text-sm text-gray-500 mt-0.5">{requests.length} yêu cầu đã gửi</p>
        </div>
        <Link to="/gui-tre/tao-yeu-cau"
          className="self-start sm:self-auto flex-shrink-0 inline-flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-200 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Tạo yêu cầu mới
        </Link>
      </div>

      {/* filter tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1 overflow-x-auto scrollbar-none">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
              ${filter === tab.key ? 'bg-[#1d4ed8] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
            {tab.label}
            {counts[tab.key] > 0 && (
              <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                ${filter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#1d4ed8]/20 border-t-[#1d4ed8] rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Đang tải danh sách...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center px-6">
          <div className="text-6xl mb-4">{filter === 'all' ? '📭' : (STATUS_META[filter]?.icon || '🔍')}</div>
          <p className="font-black text-gray-700 text-lg mb-2">
            {filter === 'all' ? 'Chưa có yêu cầu nào' : 'Không có hồ sơ phù hợp'}
          </p>
          <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
            {filter === 'all' ? 'Tạo yêu cầu giao trẻ đầu tiên để bắt đầu quy trình.' : 'Không có hồ sơ nào phù hợp với bộ lọc này.'}
          </p>
          {filter === 'all' && (
            <Link to="/gui-tre/tao-yeu-cau"
              className="inline-flex items-center gap-2 bg-[#1d4ed8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1e40af] transition text-sm">
              + Tạo yêu cầu đầu tiên
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item, i) => <RequestCard key={item.id} item={item} idx={i} />)}
        </div>
      )}
    </div>
  );
}
