import { useState } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';

// ─── Mock data ──────────────────────────────────────
const MOCK_STATS = { pending: 24, onTime: 8, received: 156, needMore: 2 };

const MOCK_LIST = [
  { id: 'HS001', childName: 'Nguyễn Văn Bình', childCode: '#VB-2024', senderName: 'Trần Thị Lan', date: '12/09/2024', status: 'pending',    age: '4 tuổi 1 tháng', gender: 'Nam', dob: '2020-08-15', health: 'Bình thường' },
  { id: 'HS002', childName: 'Lê Thị Mai',      childCode: '#LM-2024', senderName: 'Phạm Văn Dũng', date: '09/09/2024', status: 'approved',   age: '3 tuổi 5 tháng', gender: 'Nữ', dob: '2021-04-10', health: 'Tốt' },
  { id: 'HS003', childName: 'Phùng Thị Hoa',   childCode: '#PH-2024', senderName: 'Hoàng Văn Nam', date: '10/09/2024', status: 'missing_info', age: '5 tuổi',         gender: 'Nữ', dob: '2019-09-01', health: 'Cần theo dõi' },
];

const TABS = [
  { key: '',              label: 'Tất cả' },
  { key: 'pending',       label: 'Chờ duyệt' },
  { key: 'approved',      label: 'Đúng hạn' },
  { key: 'rejected',      label: 'Từ chối' },
];

function StatCard({ label, value, accent, icon }) {
  const colors = {
    blue:   'bg-blue-50   text-[#1d4ed8]   border-[#1d4ed8]',
    green:  'bg-green-50  text-green-700   border-green-500',
    orange: 'bg-orange-50 text-orange-600  border-orange-400',
    red:    'bg-red-50    text-red-600     border-red-400',
  }[accent] ?? 'bg-gray-50 text-gray-600 border-gray-400';
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 border-l-4 flex items-center gap-3 ${colors.split(' ')[2]}`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${colors.split(' ')[0]}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500 leading-none">{label}</p>
        <p className={`text-2xl font-bold mt-0.5 ${colors.split(' ')[1]}`}>{value}</p>
      </div>
    </div>
  );
}

function ChildDetailPanel({ child, onClose }) {
  if (!child) return (
    <div className="flex flex-col items-center justify-center h-full text-gray-300 py-16 text-center px-4">
      <svg className="w-14 h-14 mb-3" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
      <p className="text-sm">Chọn một hồ sơ để xem chi tiết</p>
    </div>
  );
  return (
    <div className="flex flex-col h-full">
      {/* Avatar + name */}
      <div className="flex flex-col items-center py-5 px-4 border-b border-gray-100">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-[#1d4ed8] mb-2">
          {child.childName[0]}
        </div>
        <p className="font-semibold text-gray-800">{child.childName}</p>
        <p className="text-xs text-gray-400 mt-0.5">{child.age}</p>
        <div className="mt-2"><Badge status={child.status} /></div>
      </div>

      {/* Info */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thông tin cá nhân</p>
        {[
          ['Mã hồ sơ',      child.id],
          ['Ngày sinh',      child.dob],
          ['Giới tính',      child.gender],
          ['Người giao',     child.senderName],
          ['Ngày nộp',       child.date],
          ['Tình trạng SK',  child.health],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between gap-2">
            <span className="text-gray-500 flex-shrink-0">{label}</span>
            <span className="text-gray-800 font-medium text-right">{val}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <Link to={`/can-bo-tiep-nhan/yeu-cau/${child.id}`}>
          <Button variant="primary" size="sm" fullWidth>Xem chi tiết & Duyệt</Button>
        </Link>
        <Link to={`/can-bo-tiep-nhan/tre/${child.id}/suc-khoe`}>
          <Button variant="outline" size="sm" fullWidth>Sức khỏe</Button>
        </Link>
      </div>
    </div>
=======
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
>>>>>>> f0cb740b190952d9a35f1e137c5b8ca177178763
  );
}

export default function ReceptionDashboard() {
<<<<<<< HEAD
  const [tab, setTab]         = useState('');
  const [selected, setSelected] = useState(MOCK_LIST[0]);

  const filtered = tab ? MOCK_LIST.filter(r => r.status === tab) : MOCK_LIST;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Đơn đang xử lý"      value={MOCK_STATS.pending}   accent="blue"   icon="📄" />
        <StatCard label="Đúng hạn"             value={MOCK_STATS.onTime}    accent="green"  icon="✅" />
        <StatCard label="Đã tiếp nhận"         value={MOCK_STATS.received}  accent="orange" icon="👶" />
        <StatCard label="Cần bổ sung hồ sơ"    value={MOCK_STATS.needMore}  accent="red"    icon="⚠️" />
      </div>

      {/* Main content: table + detail */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left: Table */}
        <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden flex flex-col min-w-0">
          {/* Card header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Quản lý tiếp nhận trẻ</h2>
            <Link to="/can-bo-tiep-nhan/tre/tao">
              <Button size="sm" variant="primary">+ Thêm hồ sơ</Button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-5">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`py-2.5 px-4 text-sm font-medium border-b-2 transition -mb-px ${
                  tab === t.key
                    ? 'border-[#1d4ed8] text-[#1d4ed8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {['Mã hồ sơ', 'Tên trẻ / Người giao', 'Ngày nộp', 'Trạng thái', 'Thao tác'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(row => (
                  <tr key={row.id}
                    onClick={() => setSelected(row)}
                    className={`cursor-pointer transition ${selected?.id === row.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{row.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{row.childName}</p>
                      <p className="text-xs text-gray-400">{row.senderName}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3"><Badge status={row.status} /></td>
                    <td className="px-4 py-3">
                      <Link to={`/can-bo-tiep-nhan/yeu-cau/${row.id}`}
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#1d4ed8] text-white text-xs rounded-lg hover:bg-[#1e40af] transition">
                        Tiếp nhận
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-sm">Không có hồ sơ nào</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination hint */}
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            Hiển thị {filtered.length} trong tổng số {MOCK_LIST.length} hồ sơ
          </div>
        </div>

        {/* Right: Detail panel */}
        <div className="w-64 flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
          <div className="bg-[#1d4ed8] px-4 py-3">
            <p className="text-white text-sm font-semibold">Chi tiết hồ sơ</p>
          </div>
          <ChildDetailPanel child={selected} />
=======
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
>>>>>>> f0cb740b190952d9a35f1e137c5b8ca177178763
        </div>
      </div>
    </div>
  );
}
