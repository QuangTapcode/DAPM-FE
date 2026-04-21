import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBasePath } from '../../hooks/useBasePath';
import { useFetch } from '../../hooks/useFetch';
import receptionApi from '../../api/receptionApi';
import { formatDate } from '../../utils/formatDate';

const avatarUrl = (seed = 'child', bg = 'b6e3f4') =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bg}&backgroundType=solid`;

const DEMO_REQUESTS = [
  { id: 1, code: 'HS-9022', childName: 'Nguyễn Văn Bình', childAge: 8, childGender: 'male', childDob: '2016-08-15', avatar: avatarUrl('Binh','b6e3f4'), senderName: 'Trần Thị Lan', relationship: 'Mẹ đẻ', senderPhone: '0901 234 567', createdAt: '2024-06-12', status: 'PENDING' },
  { id: 2, code: 'HS-9021', childName: 'Lê Minh Anh', childAge: 5, childGender: 'female', childDob: '2019-03-20', avatar: avatarUrl('Anh','ffd5dc'), senderName: 'Lê Quang Hùng', senderPhone: '0912 345 678', createdAt: '2024-05-11', status: 'APPROVED' },
  { id: 3, code: 'HS-9020', childName: 'Trần Hoàng Long', childAge: 10, childGender: 'male', childDob: '2014-07-05', avatar: avatarUrl('Long','c0aede'), senderName: 'Phạm Văn Đức', senderPhone: '0978 456 789', createdAt: '2024-05-10', status: 'REJECTED' },
  { id: 4, code: 'HS-9019', childName: 'Phạm Thị Mai', childAge: 7, childGender: 'female', childDob: '2017-12-03', avatar: avatarUrl('Mai','fce4ec'), senderName: 'Nguyễn Văn Toàn', senderPhone: '0935 111 222', createdAt: '2024-04-28', status: 'PENDING' },
  { id: 5, code: 'HS-9018', childName: 'Võ Đức Huy', childAge: 9, childGender: 'male', childDob: '2015-06-22', avatar: avatarUrl('Huy','c8e6c9'), senderName: 'Võ Thị Hồng', senderPhone: '0987 654 321', createdAt: '2024-04-15', status: 'APPROVED' },
  { id: 6, code: 'HS-9017', childName: 'Đặng Ngọc Hân', childAge: 4, childGender: 'female', childDob: '2020-09-14', avatar: avatarUrl('Han','fff9c4'), senderName: 'Đặng Văn Khoa', senderPhone: '0911 222 333', createdAt: '2024-03-20', status: 'PENDING' },
  { id: 7, code: 'HS-9016', childName: 'Huỳnh Gia Bảo', childAge: 6, childGender: 'male', childDob: '2018-01-30', avatar: avatarUrl('Bao','bbdefb'), senderName: 'Trần Thị Nga', senderPhone: '0966 777 888', createdAt: '2024-03-05', status: 'APPROVED' },
];

const STATUS_LABEL = { PENDING: 'Chờ duyệt', APPROVED: 'Đã tiếp nhận', REJECTED: 'Cần bổ sung' };
const STATUS_PILL  = {
  PENDING:  'bg-amber-50 text-amber-700 border border-amber-200',
  APPROVED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  REJECTED: 'bg-red-50 text-red-700 border border-red-200',
};
const STATUS_DOT = { PENDING: 'bg-amber-400', APPROVED: 'bg-emerald-400', REJECTED: 'bg-red-400' };

const TABS = [
  { label: 'Tất cả',      value: '' },
  { label: 'Chờ duyệt',   value: 'PENDING' },
  { label: 'Đã duyệt',    value: 'APPROVED' },
  { label: 'Cần bổ sung', value: 'REJECTED' },
];

const card28 = 'rounded-[28px] border border-[#E3ECF8] bg-white shadow-[0_14px_36px_rgba(42,74,122,0.08)]';

export default function ChildRequestList() {
  const [tab, setTab] = useState('');
  const { data, loading } = useFetch(receptionApi.getAll);
  const basePath = useBasePath();

  const items    = (data?.items?.length > 0) ? data.items : DEMO_REQUESTS;
  const filtered = tab ? items.filter(r => r.status === tab) : items;

  return (
    <div className="min-h-screen bg-[#F5F9FE]">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 space-y-5">

        {/* Tiêu đề */}
        <div>
          <h1 className="text-[36px] font-bold text-[#0D47A1] leading-none">Danh sách yêu cầu gửi trẻ</h1>
          <p className="text-sm text-[#8FA0B8] mt-2">
            Tổng <span className="font-bold text-[#334155]">{items.length}</span> yêu cầu —{' '}
            Chờ duyệt: <span className="font-bold text-[#0D47A1]">{items.filter(r => r.status === 'PENDING').length}</span>
          </p>
        </div>

        <div className={`${card28} overflow-hidden`}>
          {/* Tabs */}
          <div className="flex items-center gap-2 px-6 pt-5 pb-4 border-b border-[#E3ECF8]">
            {TABS.map(t => (
              <button key={t.value} onClick={() => setTab(t.value)}
                className={`px-4 py-1.5 rounded-[20px] text-xs font-semibold transition-all ${
                  tab === t.value
                    ? 'bg-[#0D47A1] text-white shadow-sm'
                    : 'bg-[#F5F9FE] text-[#8FA0B8] hover:text-[#334155]'
                }`}
              >{t.label}</button>
            ))}
            <span className="ml-auto text-[11px] font-bold uppercase tracking-[0.1em] text-[#8FA0B8]">{filtered.length} kết quả</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-[#0D47A1]/20 border-t-[#0D47A1] rounded-full animate-spin"/>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F0F5FC]">
                    {['Mã hồ sơ','Trẻ','Người giao','SĐT','Ngày gửi','Trạng thái','Thao tác'].map(h => (
                      <th key={h} className="px-6 pb-3 pt-4 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F5FC]">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="py-12 text-center text-[#8FA0B8] text-sm">Không có yêu cầu nào.</td></tr>
                  ) : filtered.map(r => (
                    <tr key={r.id} className="hover:bg-[#F5F9FE] transition-colors group">
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-[#EAF3FF] text-[#0D47A1] rounded-lg text-[11px] font-bold">#{r.code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <img src={r.avatar} alt={r.childName} className="w-9 h-9 rounded-full object-cover bg-[#EAF3FF] shrink-0"/>
                          <div>
                            <p className="font-semibold text-[15px] text-[#334155]">{r.childName}</p>
                            <p className="text-[11px] text-[#8FA0B8]">{r.childAge} tuổi · {r.childGender === 'male' ? 'Nam' : 'Nữ'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#334155] text-sm">{r.senderName}</td>
                      <td className="px-6 py-4 text-[#8FA0B8] text-xs">{r.senderPhone || '—'}</td>
                      <td className="px-6 py-4 text-[#8FA0B8] text-xs">{formatDate(r.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase whitespace-nowrap ${STATUS_PILL[r.status] || 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[r.status] || 'bg-slate-400'}`}/>
                          {STATUS_LABEL[r.status] || r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`${basePath}/chi-tiet?id=${r.id}`}
                          className="text-[#5F81BC] text-xs font-semibold hover:text-[#0D47A1] transition-colors">Chi tiết →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
