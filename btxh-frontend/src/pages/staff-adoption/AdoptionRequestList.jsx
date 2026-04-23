import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import adoptionApi from '../../api/adoptionApi';
import Pagination from '../../components/common/Pagination';
import { REQUEST_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

const STATUS_META = {
  [REQUEST_STATUS.PENDING]:  { label: 'Chờ xử lý', pill: 'bg-amber-50 text-amber-700 border border-amber-200',     dot: 'bg-amber-400' },
  [REQUEST_STATUS.APPROVED]: { label: 'Đã duyệt',   pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-400' },
  [REQUEST_STATUS.REJECTED]: { label: 'Từ chối',    pill: 'bg-red-50 text-red-700 border border-red-200',           dot: 'bg-red-400' },
};

const card28 = 'rounded-[28px] border border-[#E3ECF8] bg-white shadow-[0_14px_36px_rgba(42,74,122,0.08)]';

const FALLBACK = [
  { id: 1, adopterName: 'Nguyễn Văn A', childName: 'Bé An',    status: REQUEST_STATUS.PENDING,  createdAt: new Date() },
  { id: 2, adopterName: 'Trần Thị B',   childName: 'Bé Bình',  status: REQUEST_STATUS.APPROVED, createdAt: new Date() },
  { id: 3, adopterName: 'Lê Văn C',     childName: 'Bé Cường', status: REQUEST_STATUS.REJECTED, createdAt: new Date() },
  { id: 4, adopterName: 'Phạm Văn D',   childName: 'Bé Duy',   status: REQUEST_STATUS.PENDING,  createdAt: new Date() },
  { id: 5, adopterName: 'Hoàng Văn E',  childName: 'Bé Hải',   status: REQUEST_STATUS.PENDING,  createdAt: new Date() },
];

const TABS = [
  { label: 'Tất cả',     value: '' },
  { label: 'Chờ xử lý', value: REQUEST_STATUS.PENDING },
  { label: 'Đã duyệt',  value: REQUEST_STATUS.APPROVED },
  { label: 'Từ chối',   value: REQUEST_STATUS.REJECTED },
];

export default function AdoptionRequestList() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, loading } = useFetch(
    () => adoptionApi.getAll({ page, status: statusFilter }),
    [page, statusFilter]
  );

  const items = data?.items?.length ? data.items : FALLBACK;
  const filtered = statusFilter ? items.filter(i => i.status === statusFilter) : items;

  return (
    <div className="min-h-screen bg-[#F5F9FE]">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-[36px] font-bold text-[#0D47A1] leading-none">Danh sách đơn nhận nuôi</h1>
          <p className="text-sm text-[#8FA0B8] mt-2">Xin chào, {user?.fullName || 'Cán bộ'}</p>
        </div>

        {/* TABS */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(tab => (
            <button key={tab.value}
              onClick={() => { setStatusFilter(tab.value); setPage(1); }}
              className={`px-5 py-2 rounded-2xl text-sm font-semibold transition-colors ${
                statusFilter === tab.value
                  ? 'bg-[#0D47A1] text-white shadow-md'
                  : 'bg-white border border-[#E3ECF8] text-[#5F81BC] hover:bg-[#EAF3FF]'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* TABLE CARD */}
        <div className={`${card28} overflow-hidden`}>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-[#0D47A1]/20 border-t-[#0D47A1] rounded-full animate-spin"/>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F0F5FC]">
                    {['Người nhận nuôi', 'Trẻ đăng ký', 'Ngày nộp', 'Trạng thái', 'Thao tác'].map(h => (
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
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#EAF3FF] flex items-center justify-center font-bold text-[#0D47A1] text-sm shrink-0">
                              {item.adopterName?.[0] || '?'}
                            </div>
                            <span className="font-semibold text-[15px] text-[#334155]">{item.adopterName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#334155]">{item.childName}</td>
                        <td className="px-6 py-4 text-[#8FA0B8]">{formatDate(item.createdAt)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase ${m.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.dot}`}/>
                            {m.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {item.status === REQUEST_STATUS.PENDING && (
                              <>
                                <button className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-semibold hover:bg-emerald-600 transition-colors">Duyệt</button>
                                <button className="px-3 py-1.5 bg-red-500 text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition-colors">Từ chối</button>
                              </>
                            )}
                            <Link to={`/can-bo-nhan-nuoi/chi-tiet/${item.id}`}
                              className="px-3 py-1.5 border border-[#DCE8F7] text-[#5F81BC] rounded-xl text-xs font-semibold hover:bg-[#EAF3FF] transition-colors">
                              Xem
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-[#8FA0B8] text-sm">Không có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <Pagination page={page} totalPages={data?.totalPages || 1} onPageChange={setPage}/>
      </div>
    </div>
  );
}
