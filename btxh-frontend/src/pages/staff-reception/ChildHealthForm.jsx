import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useBasePath } from '../../hooks/useBasePath';
import childApi from '../../api/childApi';
import { formatDate } from '../../utils/formatDate';

const avatarUrl = (seed = 'child', bg = 'b6e3f4') =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bg}&backgroundType=solid`;

const DEMO_CHILDREN = [
  { id: 1, code: 'TRE-001', fullName: 'Nguyễn Văn Bình', avatar: avatarUrl('Binh','b6e3f4') },
  { id: 2, code: 'TRE-002', fullName: 'Lê Minh Anh', avatar: avatarUrl('Anh','ffd5dc') },
  { id: 3, code: 'TRE-003', fullName: 'Trần Hoàng Long', avatar: avatarUrl('Long','c0aede') },
  { id: 4, code: 'TRE-004', fullName: 'Phạm Thị Mai', avatar: avatarUrl('Mai','fce4ec') },
  { id: 5, code: 'TRE-005', fullName: 'Võ Đức Huy', avatar: avatarUrl('Huy','c8e6c9') },
  { id: 6, code: 'TRE-006', fullName: 'Đặng Ngọc Hân', avatar: avatarUrl('Han','fff9c4') },
  { id: 7, code: 'TRE-007', fullName: 'Huỳnh Gia Bảo', avatar: avatarUrl('Bao','bbdefb') },
  { id: 8, code: 'TRE-008', fullName: 'Ngô Khánh Linh', avatar: avatarUrl('Linh','f8bbd0') },
  { id: 9, code: 'TRE-009', fullName: 'Bùi Thanh Tùng', avatar: avatarUrl('Tung','b2dfdb') },
  { id: 10, code: 'TRE-010', fullName: 'Lý Thảo Nguyên', avatar: avatarUrl('Nguyen','e1bee7') },
];

const DEMO_HEALTH_RECORDS = [
  { id: 1, childId: 1, checkDate: '2024-10-12', height: 112, weight: 19.5, diagnosis: 'Viêm gan B (Hepatitis B)', treatment: 'Tiêm vaccine phòng ngừa. Hoàn thành chuỗi 3 mũi.', notes: 'Trẻ hợp tác tốt, không có phản ứng phụ.', staffName: 'BS. Nguyễn Thị Mai' },
  { id: 2, childId: 1, checkDate: '2024-03-02', height: 109, weight: 18.8, diagnosis: 'Bại liệt (Polio)', treatment: 'Uống vaccine liều nhắc.', notes: '', staffName: 'BS. Trần Văn Khoa' },
  { id: 3, childId: 1, checkDate: '2023-11-20', height: 106, weight: 17.5, diagnosis: 'Kiểm tra sức khỏe định kỳ', treatment: 'Không cần điều trị đặc biệt.', notes: 'Cân nặng tăng tốt so với tháng trước.', staffName: 'BS. Lê Thị Hồng' },
];

const DEMO_VACCINES = [
  { name: 'Viêm gan B (Hepatitis B)', date: '2024-10-12', done: true },
  { name: 'Bại liệt (Polio)', date: '2024-03-02', done: true },
  { name: 'Sởi - Quai bị - Rubella (MMR)', date: '2024-11-20', done: false },
];

const inputClass = 'w-full bg-slate-50 border-none rounded-lg text-sm font-medium focus:ring-1 focus:ring-[#2c7a91] py-2.5 px-3 outline-none transition';
const errClass   = 'text-red-500 text-xs mt-1';

export default function ChildHealthForm() {
  const { childId: paramChildId, id } = useParams();
  const [searchParams] = useSearchParams();
  const childId = paramChildId || searchParams.get('childId');
  const isEdit  = Boolean(id);
  const navigate = useNavigate();
  const basePath = useBasePath();
  const child = DEMO_CHILDREN.find(c => c.id === Number(childId)) || DEMO_CHILDREN[0];
  const demoRecord = isEdit ? DEMO_HEALTH_RECORDS.find(r => r.id === Number(id)) : null;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: demoRecord || { checkDate: new Date().toISOString().split('T')[0] },
  });

  useEffect(() => {
    if (isEdit) {
      childApi.getById(id).then(reset).catch(() => { if (demoRecord) reset(demoRecord); });
    }
  }, [id, isEdit, reset, demoRecord]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) await childApi.update(id, { ...data, childId });
      else        await childApi.create({ ...data, childId, type: 'health' });
      navigate(`${basePath}/suc-khoe?childId=${childId}`);
    } catch {
      navigate(`${basePath}/suc-khoe?childId=${childId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7f9] p-6">
      {/* Tiêu đề */}
      <div className="mb-6">
        <Link to={`${basePath}/suc-khoe?childId=${childId}`}
          className="text-slate-400 hover:text-[#2c7a91] text-sm transition-colors flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
          </svg>
          Quay lại lịch sử sức khỏe
        </Link>

        {/* Child info strip */}
        <div className="flex items-center gap-3 mt-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
          <img src={child.avatar || avatarUrl(child.fullName)}
            alt={child.fullName} className="w-12 h-12 rounded-xl object-cover bg-blue-50 shrink-0"/>
          <div>
            <h1 className="text-lg font-bold text-[#2c7a91]">
              {isEdit ? 'Cập nhật lần khám' : 'Thêm lần khám mới'}
            </h1>
            <p className="text-xs text-slate-500">{child.fullName} · {child.code}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-6">
          {/* Form chính */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Chỉ số cơ thể */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-2 mb-5 text-[#2c7a91]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                </svg>
                <h2 className="font-bold text-base">Chỉ số cơ thể</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Ngày khám <span className="text-red-500">*</span>
                  </label>
                  <input type="date" {...register('checkDate', { required: 'Bắt buộc' })} className={inputClass}/>
                  {errors.checkDate && <p className={errClass}>{errors.checkDate.message}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cân nặng (kg)</label>
                  <div className="relative">
                    <input type="number" step="0.1" min="0" {...register('weight')} className={inputClass} placeholder="19.5"/>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">kg</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chiều cao (cm)</label>
                  <div className="relative">
                    <input type="number" step="0.1" min="0" {...register('height')} className={inputClass} placeholder="112"/>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">cm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kết quả khám */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-2 mb-5 text-[#2c7a91]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                </svg>
                <h2 className="font-bold text-base">Kết quả khám</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cán bộ y tế</label>
                  <input {...register('staffName')} className={inputClass} placeholder="Tên bác sĩ / y tá..."/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chẩn đoán</label>
                  <textarea {...register('diagnosis')} rows={3} className={inputClass} placeholder="Kết quả chẩn đoán..."/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phương pháp điều trị</label>
                  <textarea {...register('treatment')} rows={3} className={inputClass} placeholder="Mô tả phương pháp điều trị..."/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ghi chú thêm</label>
                  <textarea {...register('notes')} rows={2} className={inputClass} placeholder="Ghi chú bổ sung..."/>
                </div>
              </div>
            </div>
          </div>

          {/* Panel thao tác */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Thao tác</p>
              <div className="space-y-3">
                <button type="submit" disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2c7a91] text-white rounded-lg text-sm font-semibold hover:bg-[#1e5a6b] transition-colors disabled:opacity-60">
                  {isSubmitting
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    : <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                  }
                  {isSubmitting ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Lưu lần khám'}
                </button>
                <button type="button" onClick={() => navigate(-1)}
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  Hủy
                </button>
              </div>
            </div>

            {/* Lần khám gần nhất */}
            {DEMO_HEALTH_RECORDS.slice(0, 2).map((r, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {i === 0 ? 'Lần khám gần nhất' : 'Lần khám trước'}
                </p>
                <p className="text-sm font-bold text-slate-700">{formatDate(r.checkDate)}</p>
                <p className="text-xs text-slate-500 mt-1">{r.diagnosis}</p>
                <div className="flex gap-3 mt-2 text-xs text-slate-400">
                  {r.weight && <span>⚖ {r.weight} kg</span>}
                  {r.height && <span>↕ {r.height} cm</span>}
                </div>
              </div>
            ))}

            {/* Ghi chú */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-[10px] font-bold text-[#2c7a91] uppercase tracking-wider mb-2">Lưu ý</p>
              <ul className="text-xs text-[#2c7a91] space-y-1.5">
                <li>• Ngày khám là bắt buộc phải điền</li>
                <li>• Đơn vị: kg cho cân nặng, cm cho chiều cao</li>
                <li>• Ghi chẩn đoán rõ để tiện tra cứu</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
