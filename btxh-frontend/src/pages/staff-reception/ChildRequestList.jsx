import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBasePath } from '../../hooks/useBasePath';
import { useFetch } from '../../hooks/useFetch';
import receptionApi from '../../api/receptionApi';
import { formatDate } from '../../utils/formatDate';

const avatarUrl = (seed = 'child', bg = 'b6e3f4') =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bg}&backgroundType=solid`;

const DEMO_REQUESTS = [
  {
    id: 1, code: 'HS-9022',
    childName: 'Nguyễn Văn Bình', childAge: 8, childGender: 'male', childDob: '2016-08-15',
    avatar: avatarUrl('Binh', 'b6e3f4'),
    senderName: 'Trần Thị Lan', relationship: 'Mẹ đẻ',
    senderPhone: '0901 234 567', senderEmail: 'lan.tran@email.com',
    createdAt: '2024-06-12', status: 'PENDING',
    reason: 'Gia đình khó khăn, không đủ điều kiện nuôi dưỡng và lo cho trẻ đi học.',
    healthStatus: 'Ổn định, không bệnh nền.',
    documents: ['Giấy khai sinh', 'Chứng nhận hộ khẩu', 'Đơn xin gửi trẻ'],
  },
  {
    id: 2, code: 'HS-9021',
    childName: 'Lê Minh Anh', childAge: 5, childGender: 'female', childDob: '2019-03-20',
    avatar: avatarUrl('Anh', 'ffd5dc'),
    senderName: 'Lê Quang Hùng', relationship: 'Cha',
    senderPhone: '0912 345 678', senderEmail: 'hung.le@email.com',
    createdAt: '2024-05-11', status: 'APPROVED',
    reason: 'Mẹ mất sớm, cha đi làm xa không có người chăm sóc trẻ.',
    healthStatus: 'Sức khỏe bình thường, đã tiêm đủ vaccine cơ bản.',
    documents: ['Giấy khai sinh', 'Giấy chứng tử (mẹ)', 'Xác nhận hoàn cảnh'],
  },
  {
    id: 3, code: 'HS-9020',
    childName: 'Trần Hoàng Long', childAge: 10, childGender: 'male', childDob: '2014-07-05',
    avatar: avatarUrl('Long', 'c0aede'),
    senderName: 'Phạm Văn Đức', relationship: 'Chú ruột',
    senderPhone: '0978 456 789', senderEmail: 'duc.pham@email.com',
    createdAt: '2024-05-10', status: 'REJECTED',
    reason: 'Cha mẹ mất trong tai nạn, không có người thân ở gần.',
    healthStatus: 'Cần bổ sung hồ sơ khám sức khỏe định kỳ.',
    documents: ['Giấy khai sinh', 'Giấy chứng tử (cha mẹ)'],
  },
  {
    id: 4, code: 'HS-9019',
    childName: 'Phạm Thị Mai', childAge: 7, childGender: 'female', childDob: '2017-12-03',
    avatar: avatarUrl('Mai', 'fce4ec'),
    senderName: 'Nguyễn Văn Toàn', relationship: 'Bác ruột',
    senderPhone: '0935 111 222', createdAt: '2024-04-28', status: 'PENDING',
    reason: 'Mẹ đi lao động nước ngoài, bố mất năm 2023.',
    healthStatus: 'Sức khỏe tốt, cận thị nhẹ.',
  },
  {
    id: 5, code: 'HS-9018',
    childName: 'Võ Đức Huy', childAge: 9, childGender: 'male', childDob: '2015-06-22',
    avatar: avatarUrl('Huy', 'c8e6c9'),
    senderName: 'Võ Thị Hồng', relationship: 'Dì ruột',
    senderPhone: '0987 654 321', createdAt: '2024-04-15', status: 'APPROVED',
    reason: 'Cha mẹ đều mất do tai nạn giao thông.',
    healthStatus: 'Viêm xoang mãn tính, cần theo dõi.',
  },
  {
    id: 6, code: 'HS-9017',
    childName: 'Đặng Ngọc Hân', childAge: 4, childGender: 'female', childDob: '2020-09-14',
    avatar: avatarUrl('Han', 'fff9c4'),
    senderName: 'Đặng Văn Khoa', relationship: 'Cha',
    senderPhone: '0911 222 333', createdAt: '2024-03-20', status: 'PENDING',
    reason: 'Cha đơn thân, công việc không ổn định.',
    healthStatus: 'Bình thường, đã tiêm vaccine đầy đủ.',
  },
  {
    id: 7, code: 'HS-9016',
    childName: 'Huỳnh Gia Bảo', childAge: 6, childGender: 'male', childDob: '2018-01-30',
    avatar: avatarUrl('Bao', 'bbdefb'),
    senderName: 'Trần Thị Nga', relationship: 'Cô giáo chủ nhiệm',
    senderPhone: '0966 777 888', createdAt: '2024-03-05', status: 'APPROVED',
    reason: 'Trẻ bị bỏ rơi, không xác định được cha mẹ.',
    healthStatus: 'Suy dinh dưỡng nhẹ, cần chế độ ăn đặc biệt.',
  },
];

const STATUS_LABEL = { PENDING: 'Chờ duyệt', APPROVED: 'Đã tiếp nhận', REJECTED: 'Cần bổ sung' };
const STATUS_STYLE = { PENDING: 'bg-blue-100 text-blue-800', APPROVED: 'bg-green-100 text-green-800', REJECTED: 'bg-red-100 text-red-800' };

const TABS = [
  { label: 'Tất cả',      value: '' },
  { label: 'Chờ duyệt',   value: 'PENDING' },
  { label: 'Đã duyệt',    value: 'APPROVED' },
  { label: 'Cần bổ sung', value: 'REJECTED' },
];

export default function ChildRequestList() {
  const [tab, setTab] = useState('');
  const { data, loading } = useFetch(receptionApi.getAll);
  const basePath = useBasePath();

  const items  = (data?.items?.length > 0) ? data.items : DEMO_REQUESTS;
  const filtered = tab ? items.filter(r => r.status === tab) : items;

  return (
    <div className="min-h-screen bg-[#f3f7f9] p-6">
      {/* Tiêu đề */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2c7a91]">Danh sách yêu cầu gửi trẻ</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tổng <span className="font-bold text-slate-700">{items.length}</span> yêu cầu —{' '}
          Chờ duyệt: <span className="font-bold text-blue-600">{items.filter(r => r.status === 'PENDING').length}</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          {TABS.map(t => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                tab === t.value ? 'bg-[#2c7a91] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >{t.label}</button>
          ))}
          <span className="ml-auto text-xs text-slate-400 font-medium">{filtered.length} kết quả</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#2c7a91] border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Mã hồ sơ','Trẻ','Người giao','SĐT','Ngày gửi','Trạng thái','Thao tác'].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-slate-400 text-sm">Không có yêu cầu nào.</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-3 pr-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-[#2c7a91] rounded text-[10px] font-bold">#{r.code}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <img src={r.avatar} alt={r.childName} className="w-9 h-9 rounded-full object-cover bg-blue-50 shrink-0"/>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{r.childName}</p>
                          <p className="text-[10px] text-slate-400">{r.childAge} tuổi · {r.childGender === 'male' ? 'Nam' : 'Nữ'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-600 text-sm">{r.senderName}</td>
                    <td className="py-3 pr-4 text-slate-500 text-xs">{r.senderPhone || '—'}</td>
                    <td className="py-3 pr-4 text-slate-500 text-xs">{formatDate(r.createdAt)}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_STYLE[r.status] || 'bg-slate-100 text-slate-500'}`}>
                        {STATUS_LABEL[r.status] || r.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`${basePath}/chi-tiet?id=${r.id}`}
                          className="text-[#2c7a91] text-xs font-bold hover:underline">Chi tiết →</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
