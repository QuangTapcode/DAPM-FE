import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBasePath } from '../../hooks/useBasePath';
import { useFetch } from '../../hooks/useFetch';
import childApi from '../../api/childApi';
import { formatDate } from '../../utils/formatDate';

const avatarUrl = (seed = 'child', bg = 'b6e3f4') =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bg}&backgroundType=solid`;

const DEMO_CHILDREN = [
  { id: 1,  code: 'TRE-001', fullName: 'Nguyễn Văn Bình',   dob: '2016-08-15', gender: 'male',   avatar: avatarUrl('Binh','b6e3f4'),   admissionDate: '2024-07-01', status: 'available'  },
  { id: 2,  code: 'TRE-002', fullName: 'Lê Minh Anh',        dob: '2019-03-20', gender: 'female', avatar: avatarUrl('Anh','ffd5dc'),    admissionDate: '2024-06-15', status: 'processing' },
  { id: 3,  code: 'TRE-003', fullName: 'Trần Hoàng Long',    dob: '2014-07-05', gender: 'male',   avatar: avatarUrl('Long','c0aede'),   admissionDate: '2024-05-20', status: 'adopted'    },
  { id: 4,  code: 'TRE-004', fullName: 'Phạm Thị Mai',       dob: '2017-12-03', gender: 'female', avatar: avatarUrl('Mai','fce4ec'),    admissionDate: '2024-04-28', status: 'available'  },
  { id: 5,  code: 'TRE-005', fullName: 'Võ Đức Huy',         dob: '2015-06-22', gender: 'male',   avatar: avatarUrl('Huy','c8e6c9'),    admissionDate: '2024-04-15', status: 'available'  },
  { id: 6,  code: 'TRE-006', fullName: 'Đặng Ngọc Hân',      dob: '2020-09-14', gender: 'female', avatar: avatarUrl('Han','fff9c4'),    admissionDate: '2024-03-20', status: 'processing' },
  { id: 7,  code: 'TRE-007', fullName: 'Huỳnh Gia Bảo',      dob: '2018-01-30', gender: 'male',   avatar: avatarUrl('Bao','bbdefb'),    admissionDate: '2024-03-05', status: 'available'  },
  { id: 8,  code: 'TRE-008', fullName: 'Ngô Khánh Linh',     dob: '2016-04-18', gender: 'female', avatar: avatarUrl('Linh','f8bbd0'),   admissionDate: '2024-02-10', status: 'available'  },
  { id: 9,  code: 'TRE-009', fullName: 'Bùi Thanh Tùng',     dob: '2013-11-25', gender: 'male',   avatar: avatarUrl('Tung','b2dfdb'),   admissionDate: '2024-01-18', status: 'adopted'    },
  { id: 10, code: 'TRE-010', fullName: 'Lý Thảo Nguyên',     dob: '2019-07-08', gender: 'female', avatar: avatarUrl('Nguyen','e1bee7'), admissionDate: '2024-01-05', status: 'available'  },
];

const CHILD_STATUS_LABEL = { available: 'Sẵn sàng', processing: 'Đang xử lý', adopted: 'Đã nhận nuôi' };
const CHILD_STATUS_PILL  = {
  available:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  processing: 'bg-amber-50 text-amber-700 border border-amber-200',
  adopted:    'bg-[#EAF3FF] text-[#0D47A1] border border-[#DCE8F7]',
};
const CHILD_STATUS_DOT = { available: 'bg-emerald-400', processing: 'bg-amber-400', adopted: 'bg-[#0D47A1]' };

const card28 = 'rounded-[28px] border border-[#E3ECF8] bg-white shadow-[0_14px_36px_rgba(42,74,122,0.08)]';

export default function ChildList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const basePath = useBasePath();
  const { data, loading } = useFetch(() => childApi.getAll({ page, search }), [page, search]);

  const raw   = data?.items?.length > 0 ? data.items : DEMO_CHILDREN;
  const items = search
    ? raw.filter(c => c.fullName?.toLowerCase().includes(search.toLowerCase()) || c.code?.includes(search))
    : raw;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-[#F5F9FE]">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 space-y-5">

        {/* Tiêu đề */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-[36px] font-bold text-[#0D47A1] leading-none">Danh sách trẻ trong trung tâm</h1>
            <p className="text-sm text-[#8FA0B8] mt-2">
              Tổng <span className="font-bold text-[#334155]">{items.length}</span> trẻ
            </p>
          </div>
          <Link to={`${basePath}/ho-so`}
            className="flex items-center gap-2 px-6 py-3 bg-[#0D47A1] text-white rounded-2xl text-sm font-semibold hover:bg-[#1565C0] transition-colors shadow-md">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            </svg>
            Thêm trẻ mới
          </Link>
        </div>

        <div className={`${card28} overflow-hidden`}>
          {/* Search */}
          <div className="px-6 pt-5 pb-4 border-b border-[#E3ECF8]">
            <div className="relative max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8FA0B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
              <input type="text" placeholder="Tìm theo tên hoặc mã trẻ..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-[#F7FBFF] border border-[#DCE8F7] rounded-2xl text-sm pl-9 pr-3 py-2.5 text-[#334155] focus:border-[#2F80ED] focus:ring-4 focus:ring-blue-100 outline-none transition"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-[#0D47A1]/20 border-t-[#0D47A1] rounded-full animate-spin"/>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-[#8FA0B8]">
              <svg className="h-12 w-12 mx-auto mb-3 text-[#E3ECF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
              <p className="text-sm font-medium">Không tìm thấy trẻ nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F0F5FC]">
                    {['Mã trẻ', 'Họ và tên', 'Ngày sinh', 'GT', 'Ngày tiếp nhận', 'Trạng thái', 'Thao tác'].map(h => (
                      <th key={h} className="px-6 pb-3 pt-4 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F5FC]">
                  {items.map(child => {
                    const pillCls = CHILD_STATUS_PILL[child.status] || 'bg-slate-50 text-slate-500 border border-slate-200';
                    const dotCls  = CHILD_STATUS_DOT[child.status]  || 'bg-slate-400';
                    const txt     = CHILD_STATUS_LABEL[child.status] || child.status;
                    return (
                      <tr key={child.id} className="hover:bg-[#F5F9FE] transition-colors">
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-[#EAF3FF] text-[#0D47A1] rounded-lg text-[11px] font-bold">{child.code}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <img src={child.avatar || avatarUrl(child.fullName)} alt={child.fullName}
                              className="w-9 h-9 rounded-full object-cover bg-[#EAF3FF] shrink-0"/>
                            <span className="font-semibold text-[15px] text-[#334155]">{child.fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#8FA0B8] text-sm">{formatDate(child.dob)}</td>
                        <td className="px-6 py-4 text-[#334155] text-sm">{child.gender === 'male' ? 'Nam' : 'Nữ'}</td>
                        <td className="px-6 py-4 text-[#8FA0B8] text-sm">{formatDate(child.admissionDate)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase whitespace-nowrap ${pillCls}`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotCls}`}/>
                            {txt}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link to={`${basePath}/ho-so?id=${child.id}`}
                              className="text-[#5F81BC] text-xs font-semibold hover:text-[#0D47A1] transition-colors">Sửa</Link>
                            <span className="text-[#E3ECF8]">|</span>
                            <Link to={`${basePath}/suc-khoe?childId=${child.id}`}
                              className="text-emerald-600 text-xs font-semibold hover:text-emerald-800 transition-colors">Sức khỏe</Link>
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
            <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-[#E3ECF8]">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                className="px-3 py-1.5 rounded-2xl text-xs font-semibold border border-[#DCE8F7] text-[#5F81BC] hover:bg-[#EAF3FF] disabled:opacity-40 transition-colors">← Trước</button>
              {Array.from({length: totalPages}, (_, i) => i+1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-2xl text-xs font-bold transition-colors ${page===p ? 'bg-[#0D47A1] text-white' : 'border border-[#DCE8F7] text-[#5F81BC] hover:bg-[#EAF3FF]'}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                className="px-3 py-1.5 rounded-2xl text-xs font-semibold border border-[#DCE8F7] text-[#5F81BC] hover:bg-[#EAF3FF] disabled:opacity-40 transition-colors">Sau →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
