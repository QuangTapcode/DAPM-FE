import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBasePath } from '../../hooks/useBasePath';
import { useFetch } from '../../hooks/useFetch';
import childApi from '../../api/childApi';
import { formatDate } from '../../utils/formatDate';

const avatarUrl = (seed = 'child', bg = 'b6e3f4') =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bg}&backgroundType=solid`;

const DEMO_CHILDREN = [
  { id: 1, code: 'TRE-001', fullName: 'Nguyễn Văn Bình', dob: '2016-08-15', gender: 'male', avatar: avatarUrl('Binh','b6e3f4'), admissionDate: '2024-07-01', status: 'available' },
  { id: 2, code: 'TRE-002', fullName: 'Lê Minh Anh', dob: '2019-03-20', gender: 'female', avatar: avatarUrl('Anh','ffd5dc'), admissionDate: '2024-06-15', status: 'processing' },
  { id: 3, code: 'TRE-003', fullName: 'Trần Hoàng Long', dob: '2014-07-05', gender: 'male', avatar: avatarUrl('Long','c0aede'), admissionDate: '2024-05-20', status: 'adopted' },
  { id: 4, code: 'TRE-004', fullName: 'Phạm Thị Mai', dob: '2017-12-03', gender: 'female', avatar: avatarUrl('Mai','fce4ec'), admissionDate: '2024-04-28', status: 'available' },
  { id: 5, code: 'TRE-005', fullName: 'Võ Đức Huy', dob: '2015-06-22', gender: 'male', avatar: avatarUrl('Huy','c8e6c9'), admissionDate: '2024-04-15', status: 'available' },
  { id: 6, code: 'TRE-006', fullName: 'Đặng Ngọc Hân', dob: '2020-09-14', gender: 'female', avatar: avatarUrl('Han','fff9c4'), admissionDate: '2024-03-20', status: 'processing' },
  { id: 7, code: 'TRE-007', fullName: 'Huỳnh Gia Bảo', dob: '2018-01-30', gender: 'male', avatar: avatarUrl('Bao','bbdefb'), admissionDate: '2024-03-05', status: 'available' },
  { id: 8, code: 'TRE-008', fullName: 'Ngô Khánh Linh', dob: '2016-04-18', gender: 'female', avatar: avatarUrl('Linh','f8bbd0'), admissionDate: '2024-02-10', status: 'available' },
  { id: 9, code: 'TRE-009', fullName: 'Bùi Thanh Tùng', dob: '2013-11-25', gender: 'male', avatar: avatarUrl('Tung','b2dfdb'), admissionDate: '2024-01-18', status: 'adopted' },
  { id: 10, code: 'TRE-010', fullName: 'Lý Thảo Nguyên', dob: '2019-07-08', gender: 'female', avatar: avatarUrl('Nguyen','e1bee7'), admissionDate: '2024-01-05', status: 'available' },
];

const CHILD_STATUS_LABEL = { available: 'Sẵn sàng', processing: 'Đang xử lý', adopted: 'Đã nhận nuôi' };
const CHILD_STATUS_STYLE = { available: 'bg-green-100 text-green-700', processing: 'bg-yellow-100 text-yellow-700', adopted: 'bg-blue-100 text-blue-700' };

export default function ChildList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const basePath = useBasePath();
  const { data, loading } = useFetch(() => childApi.getAll({ page, search }), [page, search]);

  const raw = data?.items?.length > 0 ? data.items : DEMO_CHILDREN;
  const items = search
    ? raw.filter(c => c.fullName?.toLowerCase().includes(search.toLowerCase()) || c.code?.includes(search))
    : raw;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-[#f3f7f9] p-6">
      {/* Tiêu đề */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2c7a91]">Danh sách trẻ trong trung tâm</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tổng <span className="font-bold text-slate-700">{items.length}</span> trẻ
          </p>
        </div>
        <Link to={`${basePath}/ho-so`}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2c7a91] text-white rounded-lg text-sm font-semibold hover:bg-[#1e5a6b] transition-colors shadow-sm">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
          </svg>
          Thêm trẻ mới
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            </svg>
            <input type="text" placeholder="Tìm theo tên hoặc mã trẻ..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border-none rounded-lg text-sm pl-9 pr-3 py-2.5 font-medium focus:ring-1 focus:ring-[#2c7a91] outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#2c7a91] border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <svg className="h-12 w-12 mx-auto mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            </svg>
            <p className="text-sm font-medium">Không tìm thấy trẻ nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Mã trẻ', 'Họ và tên', 'Ngày sinh', 'GT', 'Ngày tiếp nhận', 'Trạng thái', 'Thao tác'].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map(child => {
                  const badgeCls = CHILD_STATUS_STYLE[child.status] || 'bg-slate-100 text-slate-500';
                  const badgeTxt = CHILD_STATUS_LABEL[child.status] || child.status;
                  return (
                    <tr key={child.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 bg-blue-50 text-[#2c7a91] rounded text-[10px] font-bold">{child.code}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={child.avatar || avatarUrl(child.fullName)}
                            alt={child.fullName}
                            className="w-9 h-9 rounded-full object-cover bg-blue-50 shrink-0"
                          />
                          <span className="font-semibold text-slate-800">{child.fullName}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-slate-500">{formatDate(child.dob)}</td>
                      <td className="py-3 pr-4 text-slate-600">{child.gender === 'male' ? 'Nam' : 'Nữ'}</td>
                      <td className="py-3 pr-4 text-slate-500">{formatDate(child.admissionDate)}</td>
                      <td className="py-3 pr-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${badgeCls}`}>{badgeTxt}</span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <Link to={`${basePath}/ho-so?id=${child.id}`}
                            className="text-[#2c7a91] text-xs font-bold hover:underline">Sửa</Link>
                          <span className="text-slate-200">|</span>
                          <Link to={`${basePath}/suc-khoe?childId=${child.id}`}
                            className="text-emerald-600 text-xs font-bold hover:underline">Sức khỏe</Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-slate-100">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40">← Trước</button>
            {Array.from({length: totalPages}, (_, i) => i+1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${page===p ? 'bg-[#2c7a91] text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40">Sau →</button>
          </div>
        )}
      </div>
    </div>
  );
}
