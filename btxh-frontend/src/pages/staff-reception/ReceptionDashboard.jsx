import { useState } from 'react';
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
  );
}

export default function ReceptionDashboard() {
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
        </div>
      </div>
    </div>
  );
}
