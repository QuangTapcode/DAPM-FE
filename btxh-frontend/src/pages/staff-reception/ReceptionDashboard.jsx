import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBasePath } from '../../hooks/useBasePath';
import { useFetch } from '../../hooks/useFetch';
import receptionApi from '../../api/receptionApi';
import childApi from '../../api/childApi';
import { REQUEST_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

/* ── Avatar cute cho trẻ (DiceBear) ── */
const avatar = (seed, bg = 'b6e3f4') =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bg}&backgroundType=solid`;

const DEMO_REQUESTS = [
  {
    id: 1, code: 'HS-9022',
    childName: 'Nguyễn Văn Bình', childAge: 8, childGender: 'male', childDob: '2016-08-15',
    avatar: avatar('Binh', 'b6e3f4'),
    senderName: 'Trần Thị Lan', relationship: 'Mẹ đẻ',
    createdAt: '2024-06-12', status: REQUEST_STATUS.PENDING,
    reason: 'Gia đình khó khăn, không đủ điều kiện chăm sóc trẻ đi học.',
    healthStatus: 'Ổn định, không bệnh nền.',
  },
  {
    id: 2, code: 'HS-9021',
    childName: 'Lê Minh Anh', childAge: 5, childGender: 'female', childDob: '2019-03-20',
    avatar: avatar('Anh', 'ffd5dc'),
    senderName: 'Lê Quang Hùng', relationship: 'Cha',
    createdAt: '2024-05-11', status: REQUEST_STATUS.APPROVED,
    reason: 'Hoàn cảnh đặc biệt khó khăn.',
    healthStatus: 'Sức khỏe bình thường.',
  },
  {
    id: 3, code: 'HS-9020',
    childName: 'Trần Hoàng Long', childAge: 10, childGender: 'male', childDob: '2014-07-05',
    avatar: avatar('Long', 'c0aede'),
    senderName: 'Phạm Văn Đức', relationship: 'Chú',
    createdAt: '2024-05-10', status: REQUEST_STATUS.REJECTED,
    reason: 'Mất mát cha mẹ, không có người chăm sóc.',
    healthStatus: 'Cần bổ sung hồ sơ y tế.',
  },
];

const TABS = [
  { label: 'Tất cả',      value: '' },
  { label: 'Chờ duyệt',   value: REQUEST_STATUS.PENDING },
  { label: 'Đang xử lý',  value: REQUEST_STATUS.APPROVED },
  { label: 'Đã duyệt',    value: 'done' },
];

const STATUS_STYLE = {
  [REQUEST_STATUS.PENDING]:  { text: 'Đang xử lý',  cls: 'bg-blue-100 text-blue-800' },
  [REQUEST_STATUS.APPROVED]: { text: 'Đã tiếp nhận', cls: 'bg-green-100 text-green-800' },
  [REQUEST_STATUS.REJECTED]: { text: 'Cần bổ sung',  cls: 'bg-red-100 text-red-800' },
};

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
    <div className="min-h-screen bg-[#f3f6f9]">
      <div className="p-6">
        {/* ── STATS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Đơn chờ duyệt',    value: pending,  color: 'bg-blue-50 text-blue-500',    link: `${basePath}/yeu-cau`,
              icon: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/> },
            { label: 'Đang xem xét',     value: approved, color: 'bg-orange-50 text-orange-500', link: null,
              icon: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/> },
            { label: 'Đã tiếp nhận',     value: total,    color: 'bg-emerald-50 text-emerald-500', link: `${basePath}/danh-sach-tre`,
              icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/> },
            { label: 'Cần bổ sung hồ sơ', value: rejected, color: 'bg-rose-50 text-rose-500', link: null,
              icon: <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/> },
          ].map((s, i) => {
            const inner = (
              <div className={`bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 ${s.link ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}`}>
                <div className={`p-3 rounded-lg ${s.color}`}>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 leading-tight">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                </div>
              </div>
            );
            return s.link ? <Link key={i} to={s.link}>{inner}</Link> : <div key={i}>{inner}</div>;
          })}
        </div>

        {/* ── TABLE + RIGHT SIDEBAR ── */}
        <div className="flex gap-6">
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-w-0">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Quản lý tiếp nhận trẻ</h3>
              <div className="flex bg-gray-100 p-1 rounded-lg gap-0.5">
                {TABS.map(t => (
                  <button key={t.value} onClick={() => setTab(t.value)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === t.value ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >{t.label}</button>
                ))}
              </div>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-slate-100">
                  {['Mã hồ sơ', 'Trẻ cần hỗ trợ', 'Người giao', 'Ngày gửi', 'Trạng thái', 'Thao tác'].map(h => (
                    <th key={h} className="pb-4 font-bold pr-4 last:text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-400">Không có hồ sơ nào.</td></tr>
                ) : filtered.map(r => {
                  const badge = STATUS_STYLE[r.status] || { text: r.status, cls: 'bg-slate-100 text-slate-500' };
                  const isSelected = selectedReq?.id === r.id;
                  return (
                    <tr key={r.id} onClick={() => setSelectedReq(r)}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                    >
                      <td className="py-4 pr-4 font-bold text-blue-600">#{r.code || r.id}</td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <img src={r.avatar || avatar(r.childName || 'child')} alt={r.childName}
                            className="w-10 h-10 rounded-full object-cover bg-blue-50 shrink-0"/>
                          <div>
                            <p className="font-bold text-gray-800">{r.childName || '—'}</p>
                            <p className="text-[10px] text-gray-400">{r.childAge ? `${r.childAge} tuổi` : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-gray-600">{r.senderName || '—'}</td>
                      <td className="py-4 pr-4 text-gray-500">{formatDate(r.createdAt)}</td>
                      <td className="py-4 pr-4 text-center">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${badge.cls}`}>{badge.text}</span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={e => { e.stopPropagation(); navigate(`${basePath}/chi-tiet?id=${r.id}`); }}
                            className="text-blue-500 font-medium text-xs hover:underline">Xem chi tiết</button>
                          <button onClick={e => { e.stopPropagation(); navigate(`${basePath}/tiep-nhan?requestId=${r.id}`); }}
                            className="bg-[#2d5885] text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 hover:bg-[#1e3d5e] transition-colors">
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

            <div className="mt-6 flex justify-between items-center text-xs text-gray-400 pt-4 border-t border-slate-100">
              <p>Hiển thị {filtered.length} trong số {requests.length} hồ sơ</p>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                </button>
                <button className="w-6 h-6 bg-[#2c7a91] text-white rounded text-xs">1</button>
                <button className="w-6 h-6 hover:bg-gray-100 rounded text-xs">2</button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right profile sidebar */}
          {selectedReq && (
            <aside className="w-72 shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 text-center text-white" style={{ background: 'linear-gradient(180deg, #305e91 0%, #3b82f6 100%)' }}>
                  <div className="relative inline-block mb-3">
                    <img
                      src={selectedReq.avatar || avatar(selectedReq.childName || 'child')}
                      alt={selectedReq.childName}
                      className="w-20 h-20 rounded-full border-4 border-white/20 object-cover bg-blue-100"
                    />
                  </div>
                  <h4 className="font-bold text-lg">{selectedReq.childName}</h4>
                  <p className="text-xs text-white/70 mt-0.5">
                    {selectedReq.childAge ? `${selectedReq.childAge} tuổi` : ''}
                    {selectedReq.childGender ? ` • ${selectedReq.childGender === 'male' ? 'Nam' : 'Nữ'}` : ''}
                  </p>
                </div>

                <div className="p-5 space-y-4 text-xs">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Thông tin cá nhân</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-gray-400 mb-0.5">Ngày sinh</p><p className="font-bold text-gray-700">{formatDate(selectedReq.childDob) || '—'}</p></div>
                    <div><p className="text-gray-400 mb-0.5">Ngày gửi hồ sơ</p><p className="font-bold text-gray-700">{formatDate(selectedReq.createdAt) || '—'}</p></div>
                    <div><p className="text-gray-400 mb-0.5">Người bảo hộ</p><p className="font-bold text-gray-700">{selectedReq.senderName || '—'}</p></div>
                    <div><p className="text-gray-400 mb-0.5">Quan hệ</p><p className="font-bold text-gray-700">{selectedReq.relationship || '—'}</p></div>
                  </div>
                  {selectedReq.reason && (
                    <div><p className="text-gray-400 mb-0.5">Ghi chú</p>
                    <p className="text-gray-700 leading-relaxed italic">"{selectedReq.reason}"</p></div>
                  )}
                  {selectedReq.healthStatus && (
                    <div><p className="text-gray-400 mb-0.5">Bệnh lý nền</p><p className="text-gray-700">{selectedReq.healthStatus}</p></div>
                  )}

                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2 mt-2">Chỉ số sức khỏe</p>
                  <div className="space-y-3 pt-1">
                    {[
                      { label: 'Cân nặng', value: '24.5 kg', pct: 70, color: 'bg-blue-500' },
                      { label: 'Chiều cao', value: '128 cm', pct: 85, color: 'bg-blue-400' },
                      { label: 'Hoàn thành vắc-xin', value: '90%', pct: 90, color: 'bg-emerald-500' },
                    ].map(bar => (
                      <div key={bar.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-500">{bar.label}</span>
                          <span className={`font-bold ${bar.color === 'bg-emerald-500' ? 'text-emerald-500' : ''}`}>{bar.value}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full">
                          <div className={`h-1.5 rounded-full ${bar.color}`} style={{ width: `${bar.pct}%` }}/>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`${basePath}/tiep-nhan?requestId=${selectedReq.id}`)}
                        className="flex-1 bg-[#2d5885] text-white py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-[#1e3d5e] transition-colors">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                        Tiếp nhận
                      </button>
                      <button onClick={() => navigate(`${basePath}/chi-tiet?id=${selectedReq.id}`)}
                        className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                        Lập hồ sơ
                      </button>
                    </div>
                    <button className="w-full text-rose-500 border border-rose-200 py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-rose-50 transition-colors">
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
