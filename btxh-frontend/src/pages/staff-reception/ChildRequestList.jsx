import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import receptionApi from '../../api/receptionApi';
import { formatDate } from '../../utils/formatDate';

const TABS = [
  { label: 'Tất cả', value: '' },
  { label: 'Chờ duyệt', value: 'pending' },
  { label: 'Đã tiếp nhận', value: 'approved' },
  { label: 'Cần bổ sung', value: 'rejected' },
];

const STATUS_LABEL = {
  pending: 'Chờ duyệt',
  approved: 'Đã tiếp nhận',
  rejected: 'Cần bổ sung',
};

const STATUS_PILL = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
};

function normalizeStatus(status) {
  return String(status || 'pending').toLowerCase();
}

function calculateAge(dateString) {
  if (!dateString) return '—';
  const dob = new Date(dateString);
  if (Number.isNaN(dob.getTime())) return '—';

  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age >= 0 ? age : '—';
}

function mapRequest(item) {
  return {
    ...item,
    status: normalizeStatus(item.status),
    code: item.code || `HS-${String(item.id).padStart(4, '0')}`,
    childAge: calculateAge(item.childBirthDate),
    childGender: item.childGender || 'unknown',
    senderPhone: item.senderPhone || '—',
    relationship: item.relationship || '—',
  };
}

function ActionButton({ request, onOpenDetail, onCreateProfile }) {
  if (request.status === 'pending') {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenDetail(request.id);
        }}
        className="inline-flex items-center rounded-xl bg-[#0D47A1] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0b3d89]"
      >
        Duyệt hồ sơ
      </button>
    );
  }

  if (request.status === 'approved') {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onCreateProfile(request.id);
        }}
        className="inline-flex items-center rounded-xl border border-[#D8E6F5] bg-white px-3 py-2 text-xs font-semibold text-[#0D47A1] transition hover:border-[#0D47A1] hover:bg-[#F8FBFF]"
      >
        Tạo hồ sơ
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpenDetail(request.id);
      }}
      className="inline-flex items-center rounded-xl border border-[#F3D0D0] bg-white px-3 py-2 text-xs font-semibold text-[#C24141] transition hover:bg-red-50"
    >
      Xem chi tiết
    </button>
  );
}

export default function ChildRequestList() {
  const navigate = useNavigate();

  const [tab, setTab] = useState('');
  const [keyword, setKeyword] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function fetchRequests() {
      try {
        setLoading(true);
        setError('');

        const response = await receptionApi.getAll({
          page: 1,
          limit: 999,
          status: tab || undefined,
        });

        if (ignore) return;
        setItems(response.items || []);
      } catch (err) {
        if (ignore) return;
        setError(err.message || 'Không thể tải danh sách yêu cầu.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchRequests();

    return () => {
      ignore = true;
    };
  }, [tab]);

  const filteredItems = useMemo(() => {
    const normalized = (items || []).map(mapRequest);
    const q = keyword.trim().toLowerCase();

    if (!q) return normalized;

    return normalized.filter((item) =>
      [
        item.code,
        item.childName,
        item.senderName,
        item.senderPhone,
        item.relationship,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [items, keyword]);

  const openDetail = (id) => {
    navigate(`/can-bo-tiep-nhan/yeu-cau/${id}`);
  };

  const createProfile = (id) => {
    navigate(`/can-bo-tiep-nhan/tao-ho-so/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FE]">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 space-y-5">
        <div>
          <h1 className="text-[36px] font-bold text-[#0D47A1] leading-none">
            Danh sách yêu cầu gửi trẻ
          </h1>
        </div>

        <div className="rounded-[28px] border border-[#E3ECF8] bg-white shadow-[0_14px_36px_rgba(42,74,122,0.08)] overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-[#E3ECF8] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {TABS.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setTab(item.value)}
                  className={`px-4 py-2 rounded-[20px] text-xs font-semibold transition-all ${tab === item.value
                    ? 'bg-[#0D47A1] text-white shadow-sm'
                    : 'bg-[#F5F9FE] text-[#8FA0B8] hover:text-[#334155]'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="w-full max-w-[360px]">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm theo mã hồ sơ, tên trẻ, người giao..."
                className="w-full rounded-2xl border border-[#D8E6F5] bg-white px-4 py-3 text-sm text-[#334155] outline-none transition focus:border-[#0D47A1] focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-[#0D47A1]/20 border-t-[#0D47A1] rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-red-600 font-semibold">
              {error}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-[#8FA0B8]">
              Không có yêu cầu nào phù hợp.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1240px] text-sm">
                <thead>
                  <tr className="border-b border-[#F0F5FC] bg-[#FBFDFF]">
                    {[
                      'Mã hồ sơ',
                      'Tên trẻ',
                      'Tuổi',
                      'Giới tính',
                      'Người giao',
                      'Quan hệ',
                      'SĐT',
                      'Ngày gửi',
                      'Trạng thái',
                      'Thao tác',
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8]"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0F5FC]">
                  {filteredItems.map((request) => (
                    <tr
                      key={request.id}
                      onClick={() => openDetail(request.id)}
                      className="cursor-pointer transition-colors hover:bg-[#F8FBFF]"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-lg bg-[#EAF3FF] px-2.5 py-1 text-[11px] font-bold text-[#0D47A1]">
                          #{request.code}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-semibold text-[#334155]">
                        {request.childName}
                      </td>

                      <td className="px-6 py-4 text-[#64748B]">
                        {request.childAge}
                      </td>

                      <td className="px-6 py-4 text-[#64748B]">
                        {request.childGender === 'female'
                          ? 'Nữ'
                          : request.childGender === 'male'
                            ? 'Nam'
                            : '—'}
                      </td>

                      <td className="px-6 py-4 text-[#334155]">
                        {request.senderName}
                      </td>

                      <td className="px-6 py-4 text-[#64748B]">
                        {request.relationship}
                      </td>

                      <td className="px-6 py-4 text-[#64748B]">
                        {request.senderPhone}
                      </td>

                      <td className="px-6 py-4 text-[#64748B]">
                        {formatDate(request.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap ${STATUS_PILL[request.status] ||
                            'bg-slate-50 text-slate-700 border border-slate-200'
                            }`}
                        >
                          {STATUS_LABEL[request.status] || request.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <ActionButton
                          request={request}
                          onOpenDetail={openDetail}
                          onCreateProfile={createProfile}
                        />
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