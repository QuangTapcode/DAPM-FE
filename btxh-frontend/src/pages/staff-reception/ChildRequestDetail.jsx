import { useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
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

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    <p className="text-sm font-semibold text-slate-700">{value || '—'}</p>
  </div>
);

export default function ChildRequestDetail() {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const id = paramId || searchParams.get('id');
  const navigate = useNavigate();
  const basePath = useBasePath();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState('');

  const { data: raw } = useFetch(() => id ? receptionApi.getById(id) : null, [id]);
  const req = raw || DEMO_REQUESTS.find(r => r.id === Number(id)) || DEMO_REQUESTS[0];

  const badge = STATUS_STYLE[req.status] || 'bg-slate-100 text-slate-500';
  const label = STATUS_LABEL[req.status] || req.status;

  return (
    <div className="min-h-screen bg-[#f3f7f9] p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to={`${basePath}/yeu-cau`}
          className="text-slate-400 hover:text-[#2c7a91] text-sm transition-colors flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
          </svg>
          Danh sách yêu cầu
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-2xl font-bold text-[#2c7a91]">Chi tiết yêu cầu #{req.code}</h1>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${badge}`}>{label}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Cột thông tin chính */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Card trẻ */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-5 text-[#2c7a91]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
              <h2 className="font-bold text-base">Thông tin trẻ</h2>
            </div>
            <div className="flex items-start gap-6">
              <img src={req.avatar} alt={req.childName}
                className="w-20 h-20 rounded-2xl object-cover bg-blue-50 shrink-0 shadow-sm"/>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 flex-1">
                <InfoRow label="Họ và tên"  value={req.childName}/>
                <InfoRow label="Ngày sinh"  value={formatDate(req.childDob)}/>
                <InfoRow label="Giới tính"  value={req.childGender === 'male' ? 'Nam' : 'Nữ'}/>
                <InfoRow label="Tuổi"       value={req.childAge ? `${req.childAge} tuổi` : null}/>
                <InfoRow label="Tình trạng sức khỏe" value={req.healthStatus}/>
              </div>
            </div>
          </div>

          {/* Card người giao */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-5 text-[#2c7a91]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
              <h2 className="font-bold text-base">Người giao trẻ</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
              <InfoRow label="Họ tên"       value={req.senderName}/>
              <InfoRow label="Quan hệ"      value={req.relationship}/>
              <InfoRow label="Số điện thoại" value={req.senderPhone}/>
              <InfoRow label="Email"         value={req.senderEmail}/>
              <InfoRow label="Ngày gửi hồ sơ" value={formatDate(req.createdAt)}/>
            </div>
          </div>

          {/* Card lý do */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4 text-[#2c7a91]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
              <h2 className="font-bold text-base">Lý do gửi trẻ</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed italic bg-slate-50 rounded-xl p-4">
              "{req.reason}"
            </p>
          </div>

          {/* Tài liệu */}
          {req.documents?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-2 mb-4 text-[#2c7a91]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                </svg>
                <h2 className="font-bold text-base">Tài liệu đính kèm</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {req.documents.map((doc, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-blue-50 text-[#2c7a91] text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-100">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cột thao tác */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Thao tác</p>
            <button onClick={() => navigate(`${basePath}/tiep-nhan?requestId=${req.id}`)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2c7a91] text-white rounded-lg text-sm font-semibold hover:bg-[#1e5a6b] transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
              Tiếp nhận & Lập hồ sơ
            </button>
            <button onClick={() => setShowRejectModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-rose-300 text-rose-600 rounded-lg text-sm font-semibold hover:bg-rose-50 transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
              Từ chối yêu cầu
            </button>
            <Link to={`${basePath}/yeu-cau`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
              ← Quay lại danh sách
            </Link>
          </div>

          {/* Trạng thái card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Trạng thái hiện tại</p>
            <div className={`px-4 py-3 rounded-xl text-sm font-bold text-center ${badge}`}>{label}</div>
            <p className="text-xs text-slate-400 mt-2 text-center">Ngày tiếp nhận: {formatDate(req.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Modal từ chối */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl shadow-xl p-7 max-w-md w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Từ chối yêu cầu</h3>
            <p className="text-sm text-slate-500 mb-4">Hồ sơ: <strong>{req.childName}</strong> — #{req.code}</p>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lý do từ chối</label>
            <textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)} rows={4}
              className="w-full bg-slate-50 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-rose-300 resize-none"
              placeholder="Nêu rõ lý do để người gửi bổ sung hồ sơ..."/>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">
                Hủy
              </button>
              <button onClick={() => { setShowRejectModal(false); navigate(`${basePath}/yeu-cau`); }}
                className="flex-1 py-2.5 bg-rose-500 text-white rounded-lg text-sm font-bold hover:bg-rose-600">
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
