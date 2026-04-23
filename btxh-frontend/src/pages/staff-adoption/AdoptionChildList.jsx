import { useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatDate';
import { REQUEST_STATUS } from '../../utils/constants';

const STATUS_META = {
  [REQUEST_STATUS.PENDING]:  { label: 'Chờ xử lý', pill: 'bg-amber-50 text-amber-700 border border-amber-200',     dot: 'bg-amber-400' },
  [REQUEST_STATUS.APPROVED]: { label: 'Đã duyệt',   pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-400' },
  [REQUEST_STATUS.REJECTED]: { label: 'Từ chối',    pill: 'bg-red-50 text-red-700 border border-red-200',           dot: 'bg-red-400' },
};

const card28 = 'rounded-[28px] border border-[#E3ECF8] bg-white shadow-[0_14px_36px_rgba(42,74,122,0.08)]';

const ITEMS = [
  { id: 1,  code: 'T001', fullName: 'Nguyễn Văn A',   dob: new Date(), gender: 'male',   status: REQUEST_STATUS.PENDING  },
  { id: 2,  code: 'T002', fullName: 'Trần Thị B',     dob: new Date(), gender: 'female', status: REQUEST_STATUS.APPROVED },
  { id: 3,  code: 'T003', fullName: 'Lê Văn C',       dob: new Date(), gender: 'male',   status: REQUEST_STATUS.REJECTED },
  { id: 4,  code: 'T004', fullName: 'Phạm Văn D',     dob: new Date(), gender: 'male',   status: REQUEST_STATUS.APPROVED },
  { id: 5,  code: 'T005', fullName: 'Hoàng Thị E',    dob: new Date(), gender: 'female', status: REQUEST_STATUS.PENDING  },
  { id: 6,  code: 'T006', fullName: 'Đỗ Văn F',       dob: new Date(), gender: 'male',   status: REQUEST_STATUS.APPROVED },
  { id: 7,  code: 'T007', fullName: 'Ngô Thị G',      dob: new Date(), gender: 'female', status: REQUEST_STATUS.REJECTED },
  { id: 8,  code: 'T008', fullName: 'Bùi Văn H',      dob: new Date(), gender: 'male',   status: REQUEST_STATUS.PENDING  },
  { id: 9,  code: 'T009', fullName: 'Vũ Thị I',       dob: new Date(), gender: 'female', status: REQUEST_STATUS.APPROVED },
  { id: 10, code: 'T010', fullName: 'Lý Văn K',       dob: new Date(), gender: 'male',   status: REQUEST_STATUS.PENDING  },
];

const TABS = [
  { label: 'Tất cả',     value: 'ALL' },
  { label: 'Chờ xử lý', value: REQUEST_STATUS.PENDING },
  { label: 'Đã duyệt',  value: REQUEST_STATUS.APPROVED },
  { label: 'Từ chối',   value: REQUEST_STATUS.REJECTED },
];

export default function AdoptionChildList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const searched = ITEMS.filter(i =>
    i.fullName.toLowerCase().includes(search.toLowerCase()) ||
    i.code.toLowerCase().includes(search.toLowerCase())
  );
  const filtered = filter === 'ALL' ? searched : searched.filter(i => i.status === filter);

  return (
    <div className="min-h-screen bg-[#F5F9FE]">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-[36px] font-bold text-[#0D47A1] leading-none">Danh sách trẻ trong trung tâm</h1>
          <p className="text-sm text-[#8FA0B8] mt-2">
            Tổng <span className="font-bold text-[#334155]">{filtered.length}</span> trẻ
          </p>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8FA0B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            </svg>
            <input type="text" placeholder="Tìm theo tên, mã trẻ..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="bg-white border border-[#DCE8F7] rounded-2xl text-sm pl-9 pr-3 py-2.5 text-[#334155] focus:border-[#2F80ED] focus:ring-4 focus:ring-blue-100 outline-none transition w-64"
            />
          </div>
          {TABS.map(tab => (
            <button key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-5 py-2 rounded-2xl text-sm font-semibold transition-colors ${
                filter === tab.value
                  ? 'bg-[#0D47A1] text-white shadow-md'
                  : 'bg-white border border-[#E3ECF8] text-[#5F81BC] hover:bg-[#EAF3FF]'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className={`${card28} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F0F5FC]">
                  {['Mã trẻ', 'Họ và tên', 'Ngày sinh', 'GT', 'Trạng thái', 'Chi tiết'].map(h => (
                    <th key={h} className="px-6 pb-3 pt-4 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FC]">
                {filtered.map(item => {
                  const m = STATUS_META[item.status] || STATUS_META[REQUEST_STATUS.PENDING];
                  return (
                    <tr key={item.id} className="hover:bg-[#F5F9FE] transition-colors">
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-[#EAF3FF] text-[#0D47A1] rounded-lg text-[11px] font-bold">{item.code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#EAF3FF] flex items-center justify-center font-bold text-[#0D47A1] text-sm shrink-0">
                            {item.fullName[0]}
                          </div>
                          <span className="font-semibold text-[15px] text-[#334155]">{item.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#8FA0B8]">{formatDate(item.dob)}</td>
                      <td className="px-6 py-4 text-[#334155]">{item.gender === 'male' ? 'Nam' : 'Nữ'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase ${m.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.dot}`}/>
                          {m.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/can-bo-nhan-nuoi/tre/${item.id}`}
                          className="text-[#5F81BC] text-xs font-semibold hover:text-[#0D47A1] transition-colors">
                          Xem
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-[#8FA0B8] text-sm">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination page={page} totalPages={1} onPageChange={setPage}/>
      </div>
    </div>
  );
}
