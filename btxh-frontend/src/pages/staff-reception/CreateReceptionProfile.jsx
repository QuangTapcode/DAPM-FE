import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useBasePath } from '../../hooks/useBasePath';
import receptionApi from '../../api/receptionApi';
import childApi from '../../api/childApi';
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

const inputClass = 'w-full bg-slate-50 border-none rounded-lg text-sm font-medium focus:ring-1 focus:ring-[#2c7a91] py-2.5 px-3 outline-none transition';

export default function CreateReceptionProfile() {
  const { requestId: paramReqId } = useParams();
  const [searchParams] = useSearchParams();
  const requestId = paramReqId || searchParams.get('requestId');
  const navigate = useNavigate();
  const basePath = useBasePath();
  const req = DEMO_REQUESTS.find(r => r.id === Number(requestId)) || DEMO_REQUESTS[0];

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      childName: req.childName,
      childDob: req.childDob,
      childGender: req.childGender,
      senderName: req.senderName,
      relationship: req.relationship,
      admissionDate: new Date().toISOString().split('T')[0],
      assignedRoom: 'Phòng A2',
    },
  });

  const onSubmit = async (data) => {
    try {
      await childApi.create({ ...data, requestId });
      navigate(`${basePath}/danh-sach-tre`);
    } catch {
      navigate(`${basePath}/danh-sach-tre`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7f9] p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to={`${basePath}/chi-tiet?id=${requestId}`}
          className="text-slate-400 hover:text-[#2c7a91] text-sm transition-colors flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
          </svg>
          Chi tiết yêu cầu #{req.code}
        </Link>
        <h1 className="text-2xl font-bold text-[#2c7a91] mt-2">Tạo hồ sơ tiếp nhận trẻ</h1>
        <p className="text-sm text-slate-500 mt-0.5">Xác nhận thông tin và tiếp nhận trẻ vào trung tâm</p>
      </div>

      {/* Preview card trẻ */}
      <div className="bg-gradient-to-r from-[#2c7a91] to-[#1e5a6b] text-white rounded-2xl p-5 mb-6 flex items-center gap-5 shadow">
        <img src={req.avatar} alt={req.childName}
          className="w-16 h-16 rounded-xl object-cover border-2 border-white/30 bg-white/10 shrink-0"/>
        <div>
          <p className="text-xs text-white/70 font-medium uppercase tracking-wider mb-0.5">Đang tiếp nhận</p>
          <h2 className="text-xl font-bold">{req.childName}</h2>
          <p className="text-sm text-white/70 mt-0.5">
            {req.childAge} tuổi · {req.childGender === 'male' ? 'Nam' : 'Nữ'} · Ngày sinh: {formatDate(req.childDob)}
          </p>
        </div>
        <div className="ml-auto hidden md:block">
          <p className="text-xs text-white/70">Người giao</p>
          <p className="font-bold">{req.senderName}</p>
          <p className="text-sm text-white/70">{req.relationship} · {req.senderPhone}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Thông tin trẻ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-2 mb-5 text-[#2c7a91]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                </svg>
                <h2 className="font-bold text-base">Thông tin trẻ</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Họ và tên</label>
                  <input {...register('childName')} className={inputClass}/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ngày sinh</label>
                  <input type="date" {...register('childDob')} className={inputClass}/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Giới tính</label>
                  <select {...register('childGender')} className={inputClass}>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Dân tộc</label>
                  <input {...register('ethnicity')} className={inputClass} placeholder="Kinh, Tày..."/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nhóm máu</label>
                  <select {...register('bloodType')} className={inputClass}>
                    {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Địa chỉ thường trú</label>
                  <input {...register('hometown')} className={inputClass} placeholder="Địa chỉ..."/>
                </div>
              </div>
            </div>

            {/* Thông tin tiếp nhận */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-2 mb-5 text-[#2c7a91]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                </svg>
                <h2 className="font-bold text-base">Thông tin tiếp nhận tại trung tâm</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ngày tiếp nhận</label>
                  <input type="date" {...register('admissionDate')} className={inputClass}/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phòng được phân</label>
                  <input {...register('assignedRoom')} className={inputClass} placeholder="VD: Phòng A2"/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Số giường</label>
                  <input {...register('assignedBed')} className={inputClass} placeholder="VD: 03"/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tình trạng sức khỏe ban đầu</label>
                  <select {...register('initialHealthStatus')} className={inputClass}>
                    <option>Bình thường</option>
                    <option>Cần theo dõi</option>
                    <option>Cần điều trị</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ghi chú của cán bộ</label>
                  <textarea {...register('staffNote')} rows={3} className={inputClass} placeholder="Ghi chú đặc biệt về trẻ..."/>
                </div>
              </div>
            </div>
          </div>

          {/* Panel thao tác */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Xác nhận tiếp nhận</p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium">
                ⚠ Sau khi xác nhận, trẻ sẽ được đưa vào danh sách chính thức của trung tâm.
              </div>
              <button type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2c7a91] text-white rounded-xl text-sm font-bold hover:bg-[#1e5a6b] transition-colors disabled:opacity-60 shadow-sm">
                {isSubmitting
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  : <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                }
                {isSubmitting ? 'Đang lưu...' : 'Xác nhận tiếp nhận'}
              </button>
              <Link to={`${basePath}/chi-tiet?id=${requestId}`}
                className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                Hủy
              </Link>
            </div>

            {/* Tài liệu hồ sơ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Tài liệu đính kèm</p>
              <div className="space-y-2">
                {(req.documents || ['Giấy khai sinh', 'Đơn xin gửi trẻ']).map((doc, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <svg className="h-4 w-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"/>
                    </svg>
                    <span className="text-slate-600 font-medium">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
