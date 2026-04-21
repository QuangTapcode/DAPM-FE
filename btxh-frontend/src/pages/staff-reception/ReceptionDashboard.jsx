import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBasePath } from '../../hooks/useBasePath';
import { useFetch } from '../../hooks/useFetch';
import receptionApi from '../../api/receptionApi';
import childApi from '../../api/childApi';
import { REQUEST_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

const avatar = (seed, bg = 'b6e3f4') =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bg}&backgroundType=solid`;

const DEMO_REQUESTS = [
  { id: 1, code: 'HS-9022', childName: 'Nguyễn Văn Bình', childAge: 8, childGender: 'male', childDob: '2016-08-15', avatar: avatar('Binh','b6e3f4'), senderName: 'Trần Thị Lan', relationship: 'Mẹ đẻ', createdAt: '2024-06-12', status: REQUEST_STATUS.PENDING, reason: 'Gia đình khó khăn, không đủ điều kiện chăm sóc trẻ đi học.', healthStatus: 'Ổn định, không bệnh nền.' },
  { id: 2, code: 'HS-9021', childName: 'Lê Minh Anh', childAge: 5, childGender: 'female', childDob: '2019-03-20', avatar: avatar('Anh','ffd5dc'), senderName: 'Lê Quang Hùng', relationship: 'Cha', createdAt: '2024-05-11', status: REQUEST_STATUS.APPROVED, reason: 'Hoàn cảnh đặc biệt khó khăn.', healthStatus: 'Sức khỏe bình thường.' },
  { id: 3, code: 'HS-9020', childName: 'Trần Hoàng Long', childAge: 10, childGender: 'male', childDob: '2014-07-05', avatar: avatar('Long','c0aede'), senderName: 'Phạm Văn Đức', relationship: 'Chú', createdAt: '2024-05-10', status: REQUEST_STATUS.REJECTED, reason: 'Mất mát cha mẹ, không có người chăm sóc.', healthStatus: 'Cần bổ sung hồ sơ y tế.' },
];

const TABS = [
  { label: 'Tất cả',     value: '' },
  { label: 'Chờ duyệt',  value: REQUEST_STATUS.PENDING },
  { label: 'Đang xử lý', value: REQUEST_STATUS.APPROVED },
  { label: 'Đã duyệt',   value: 'done' },
];

const STATUS_META = {
  [REQUEST_STATUS.PENDING]:  { text: 'Đang xử lý',  pill: 'bg-amber-50 text-amber-700 border border-amber-200',   dot: 'bg-amber-400' },
  [REQUEST_STATUS.APPROVED]: { text: 'Đã tiếp nhận', pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-400' },
  [REQUEST_STATUS.REJECTED]: { text: 'Cần bổ sung',  pill: 'bg-red-50 text-red-700 border border-red-200',         dot: 'bg-red-400' },
};

const card28 = 'rounded-[28px] border border-[#E3ECF8] bg-white shadow-[0_14px_36px_rgba(42,74,122,0.08)]';

function StatusPill({ status }) {
  const m = STATUS_META[status] || { text: status, pill: 'bg-slate-50 text-slate-500 border border-slate-200', dot: 'bg-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase whitespace-nowrap ${m.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.dot}`} />
      {m.text}
    </span>
  );
}

export default function ReceptionDashboard() {
  const navigate = useNavigate();
  const basePath = useBasePath();
  const [tab, setTab] = useState('');
  const [selectedReq, setSelectedReq] = useState(DEMO_REQUESTS[0]);

  const { data: reqData }   = useFetch(receptionApi.getAll);
  const { data: childData } = useFetch(childApi.getAll);

  const requests = (reqData?.items?.length > 0) ? reqData.items : DEMO_REQUESTS;
  const pending  = requests.filter(r => r.status === REQUEST_STATUS.PENDING).length;
  const approved = requests.filter(r => r.status === REQUEST_STATUS.APPROVED).length;
  const rejected = requests.filter(r => r.status === REQUEST_STATUS.REJECTED).length;
  const total    = childData?.total || approved;
  const filtered = tab ? requests.filter(r => r.status === tab) : requests;

  return (
    <div className="min-h-screen bg-[#F5F9FE]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 space-y-6">

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Đơn chờ duyệt',     value: pending,  colorBox: 'bg-[#EAF3FF] text-[#0D47A1]', link: `${basePath}/yeu-cau`,
              icon: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/> },
            { label: 'Đang xem xét',       value: approved, colorBox: 'bg-amber-50 text-amber-600',   link: null,
              icon: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/> },
            { label: 'Đã tiếp nhận',       value: total,    colorBox: 'bg-emerald-50 text-emerald-600', link: `${basePath}/tre`,
              icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/> },
            { label: 'Cần bổ sung hồ sơ',  value: rejected, colorBox: 'bg-red-50 text-red-500',        link: null,
              icon: <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/> },
          ].map((s, i) => {
            const inner = (
              <div className={`${card28} p-5 flex items-center gap-4 ${s.link ? 'hover:brightness-[0.97] transition cursor-pointer' : ''}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${s.colorBox}`}>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8]">{s.label}</p>
                  <p className="text-[32px] font-bold text-[#0D47A1] leading-none mt-0.5">{s.value}</p>
                </div>
              </div>
            );
            return s.link ? <Link key={i} to={s.link}>{inner}</Link> : <div key={i}>{inner}</div>;
          })}
        </div>

        {/* ── TABLE + RIGHT SIDEBAR ── */}
        <div className="flex gap-6">
          {/* Main table */}
          <div className={`${card28} flex-1 min-w-0 overflow-hidden`}>
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-[#E3ECF8]">
              <h3 className="text-[15px] font-bold text-[#0D47A1]">Quản lý tiếp nhận trẻ</h3>
              <div className="flex bg-[#F5F9FE] p-1 rounded-2xl gap-0.5">
                {TABS.map(t => (
                  <button key={t.value} onClick={() => setTab(t.value)}
                    className={`px-3 py-1.5 rounded-[16px] text-xs font-semibold transition-all ${
                      tab === t.value
                        ? 'bg-[#0D47A1] text-white shadow-sm'
                        : 'text-[#8FA0B8] hover:text-[#334155]'
                    }`}
                  >{t.label}</button>
                ))}
              </div>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#F0F5FC]">
                  {['Mã hồ sơ', 'Trẻ cần hỗ trợ', 'Người giao', 'Ngày gửi', 'Trạng thái', 'Thao tác'].map(h => (
                    <th key={h} className="px-6 pb-3 pt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8] last:text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FC]">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-[#8FA0B8] text-sm">Không có hồ sơ nào.</td></tr>
                ) : filtered.map(r => {
                  const isSelected = selectedReq?.id === r.id;
                  return (
                    <tr key={r.id} onClick={() => setSelectedReq(r)}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-[#EAF3FF]' : 'hover:bg-[#F5F9FE]'}`}
                    >
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-[#EAF3FF] text-[#0D47A1] rounded-lg text-[11px] font-bold">#{r.code || r.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={r.avatar || avatar(r.childName || 'child')} alt={r.childName}
                            className="w-10 h-10 rounded-full object-cover bg-[#EAF3FF] shrink-0"/>
                          <div>
                            <p className="font-semibold text-[15px] text-[#334155]">{r.childName || '—'}</p>
                            <p className="text-[11px] text-[#8FA0B8]">{r.childAge ? `${r.childAge} tuổi` : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#334155] text-sm">{r.senderName || '—'}</td>
                      <td className="px-6 py-4 text-[#8FA0B8] text-sm">{formatDate(r.createdAt)}</td>
                      <td className="px-6 py-4"><StatusPill status={r.status} /></td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={e => { e.stopPropagation(); navigate(`${basePath}/chi-tiet?id=${r.id}`); }}
                            className="text-[#5F81BC] font-semibold text-xs hover:text-[#0D47A1] transition-colors">Xem chi tiết</button>
                          <button onClick={e => { e.stopPropagation(); navigate(`${basePath}/tiep-nhan?requestId=${r.id}`); }}
                            className="bg-[#0D47A1] text-white px-3 py-1.5 rounded-2xl text-xs font-semibold flex items-center gap-1 hover:bg-[#1565C0] transition-colors">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                            </svg>
                            Tiếp nhận
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-between items-center px-6 py-4 border-t border-[#E3ECF8]">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8FA0B8]">Hiển thị {filtered.length} / {requests.length} hồ sơ</p>
              <div className="flex items-center gap-1.5">
                <button className="p-1.5 hover:bg-[#EAF3FF] rounded-xl transition-colors">
                  <svg className="h-3.5 w-3.5 text-[#8FA0B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                </button>
                <button className="w-7 h-7 bg-[#0D47A1] text-white rounded-xl text-xs font-bold">1</button>
                <button className="w-7 h-7 text-[#8FA0B8] hover:bg-[#EAF3FF] rounded-xl text-xs transition-colors">2</button>
                <button className="p-1.5 hover:bg-[#EAF3FF] rounded-xl transition-colors">
                  <svg className="h-3.5 w-3.5 text-[#8FA0B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right profile sidebar */}
          {selectedReq && (
            <aside className="w-72 shrink-0">
              <div className={`${card28} overflow-hidden`}>
                {/* Avatar header */}
                <div className="p-6 text-center text-white bg-gradient-to-br from-[#0D47A1] to-[#1976D2]">
                  <div className="relative inline-block mb-3">
                    <img src={selectedReq.avatar || avatar(selectedReq.childName || 'child')} alt={selectedReq.childName}
                      className="w-20 h-20 rounded-full border-4 border-white/20 object-cover bg-[#EAF3FF]"/>
                  </div>
                  <h4 className="font-bold text-lg">{selectedReq.childName}</h4>
                  <p className="text-xs text-white/70 mt-0.5">
                    {selectedReq.childAge ? `${selectedReq.childAge} tuổi` : ''}
                    {selectedReq.childGender ? ` • ${selectedReq.childGender === 'male' ? 'Nam' : 'Nữ'}` : ''}
                  </p>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8] border-b border-[#E3ECF8] pb-2">Thông tin cá nhân</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8FA0B8] mb-1">Ngày sinh</p>
                      <p className="font-semibold text-[#334155]">{formatDate(selectedReq.childDob) || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8FA0B8] mb-1">Ngày gửi hồ sơ</p>
                      <p className="font-semibold text-[#334155]">{formatDate(selectedReq.createdAt) || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8FA0B8] mb-1">Người bảo hộ</p>
                      <p className="font-semibold text-[#334155]">{selectedReq.senderName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8FA0B8] mb-1">Quan hệ</p>
                      <p className="font-semibold text-[#334155]">{selectedReq.relationship || '—'}</p>
                    </div>
                  </div>
                  {selectedReq.reason && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8FA0B8] mb-1">Ghi chú</p>
                      <p className="text-xs text-[#334155] leading-relaxed italic">"{selectedReq.reason}"</p>
                    </div>
                  )}
                  {selectedReq.healthStatus && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8FA0B8] mb-1">Bệnh lý nền</p>
                      <p className="text-xs text-[#334155]">{selectedReq.healthStatus}</p>
                    </div>
                  )}

                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8] border-b border-[#E3ECF8] pb-2">Chỉ số sức khỏe</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Cân nặng',        value: '24.5 kg', pct: 70, color: 'bg-[#0D47A1]' },
                      { label: 'Chiều cao',        value: '128 cm',  pct: 85, color: 'bg-[#2196F3]' },
                      { label: 'Hoàn thành vắc-xin', value: '90%',  pct: 90, color: 'bg-emerald-500' },
                    ].map(bar => (
                      <div key={bar.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8FA0B8]">{bar.label}</span>
                          <span className="text-xs font-bold text-[#334155]">{bar.value}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#E3ECF8] rounded-full">
                          <div className={`h-1.5 rounded-full ${bar.color}`} style={{ width: `${bar.pct}%` }}/>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`${basePath}/tiep-nhan?requestId=${selectedReq.id}`)}
                        className="flex-1 bg-[#0D47A1] text-white py-2.5 rounded-2xl font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#1565C0] transition-colors">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                        Tiếp nhận
                      </button>
                      <button onClick={() => navigate(`${basePath}/chi-tiet?id=${selectedReq.id}`)}
                        className="flex-1 bg-[#EAF3FF] text-[#0D47A1] py-2.5 rounded-2xl font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#DCE8F7] transition-colors">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                        Lập hồ sơ
                      </button>
                    </div>
                    <button className="w-full text-red-500 border border-[#E3ECF8] bg-[#F5F9FE] hover:bg-red-50 hover:border-red-200 py-2.5 rounded-2xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                      Từ chối
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
