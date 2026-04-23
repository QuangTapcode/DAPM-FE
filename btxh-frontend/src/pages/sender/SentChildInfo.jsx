import { useParams, useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useFetch } from '../../hooks/useFetch';
import childApi from '../../api/childApi';
import { formatDate } from '../../utils/formatDate';

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 py-3.5 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-base flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm font-bold text-gray-800 break-words">{value || '—'}</p>
      </div>
    </div>
  );
}

const STATUS_MAP = {
  active:     { label: 'Đang nuôi dưỡng', color: 'text-green-700 bg-green-100 border-green-200', dot: 'bg-green-400' },
  adopted:    { label: 'Đã nhận nuôi',    color: 'text-blue-700  bg-blue-100  border-blue-200',  dot: 'bg-blue-400'  },
  returned:   { label: 'Đã trả về',       color: 'text-gray-700  bg-gray-100  border-gray-200',  dot: 'bg-gray-400'  },
  pending:    { label: 'Chờ tiếp nhận',   color: 'text-amber-700 bg-amber-100 border-amber-200', dot: 'bg-amber-400' },
};

export default function SentChildInfo() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { data: child, loading } = useFetch(() => childApi.getById(id));

  const heroRef = useScrollReveal({ threshold: 0.1 });
  const infoRef = useScrollReveal({ threshold: 0.1 });

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#1d4ed8]/20 border-t-[#1d4ed8] rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Đang tải thông tin...</p>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <p className="font-black text-gray-700 text-xl mb-2">Không tìm thấy</p>
        <p className="text-sm text-gray-400 mb-6">Thông tin trẻ không tồn tại hoặc bạn không có quyền truy cập.</p>
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-[#1d4ed8] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#1e40af] transition text-sm">
          ← Quay lại
        </button>
      </div>
    );
  }

  const statusMeta = STATUS_MAP[child.status] || STATUS_MAP.pending;
  const initials   = (child.fullName || '?').split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-5" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <button onClick={() => navigate('/gui-tre/dashboard')} className="hover:text-[#1d4ed8] font-medium transition-colors">Tổng quan</button>
        <span>/</span>
        <button onClick={() => navigate('/gui-tre/trang-thai')} className="hover:text-[#1d4ed8] font-medium transition-colors">Hồ sơ</button>
        <span>/</span>
        <span className="text-gray-600 font-semibold">Chi tiết trẻ</span>
      </div>

      {/* Profile card */}
      <div ref={heroRef} className="reveal reveal--left">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* top banner */}
          <div className="h-24 bg-gradient-to-r from-[#1e3a5f] to-[#1d4ed8]" />

          {/* avatar + name */}
          <div className="px-5 sm:px-6 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-5">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-md border-4 border-white flex items-center justify-center text-2xl font-black text-[#1d4ed8] flex-shrink-0">
                {initials}
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-black text-gray-900">{child.fullName}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusMeta.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                    {statusMeta.label}
                  </span>
                  {child.gender && (
                    <span className="text-xs text-gray-500 font-medium">
                      {child.gender === 'male' ? '♂ Nam' : '♀ Nữ'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info sections */}
      <div ref={infoRef} className="reveal grid sm:grid-cols-2 gap-5">
        {/* Personal info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-1 h-5 bg-[#1d4ed8] rounded-full" />
            <h2 className="font-black text-gray-800 text-sm">Thông tin cá nhân</h2>
          </div>
          <InfoRow icon="🎂" label="Ngày sinh"   value={fmt(child.dob)} />
          <InfoRow icon="👤" label="Giới tính"   value={child.gender === 'male' ? 'Nam' : child.gender === 'female' ? 'Nữ' : child.gender} />
          <InfoRow icon="🏷️" label="Dân tộc"     value={child.ethnicity} />
        </div>

        {/* Reception info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-1 h-5 bg-[#f97316] rounded-full" />
            <h2 className="font-black text-gray-800 text-sm">Thông tin tiếp nhận</h2>
          </div>
          <InfoRow icon="📅" label="Ngày tiếp nhận"   value={fmt(child.admissionDate)} />
          <InfoRow icon="👩‍💼" label="Cán bộ tiếp nhận" value={child.staffName} />
          <InfoRow icon="🏥" label="Tình trạng SK"     value={child.healthStatus} />
        </div>
      </div>

      {/* Health notes if any */}
      {child.healthStatus && (
        <div className="reveal bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-xl">🏥</span>
            <h2 className="font-black text-[#1d4ed8] text-sm">Ghi chú sức khoẻ</h2>
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">{child.healthStatus}</p>
        </div>
      )}

      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1d4ed8] transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" />
        </svg>
        Quay lại
      </button>
    </div>
  );
}
