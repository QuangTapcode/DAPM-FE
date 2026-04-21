import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import { FormField, inputCls, selectCls, textareaCls } from '../../components/common/FormField';

// ─── Mock data ──────────────────────────────────────
const MOCK_CHILD = {
  id: 'HS002',
  fullName: 'Lê Văn Tuấn',
  code: 'MS HS: 43-2024-009',
  status: 'Đang Tiếp Nhận',
  lastUpdate: 'Lần cập nhật: 12/06/2024',
  avatar: 'T',
  dob: '2009-09-23',
  gender: 'male',
  ethnicity: 'Kinh',
  address: '123 Đường Hoàng Hải, Phường 2, Tp. Đà Nẵng, Đường Tây',
  hometown: 'Quảng Nam',
  school: 'Trung học cơ sở',
  grade: '7A3',
  schoolName: 'Trường THCS Nguyễn Du',
  healthStatus: 'Bình thường, đang theo dõi định kỳ.',
  notes: '',
};

const MOCK_DOCS = [
  { name: 'Giấy khai sinh', done: true  },
  { name: 'Ảnh chân dung',  done: false },
  { name: 'Sổ tiêm chủng',  done: false },
];

// ─── Shared child sidebar ────────────────────────────
function ChildSidebar({ childId, child }) {
  const base = `/can-bo-tiep-nhan/tre/${childId}`;
  const NAV = [
    { to: `${base}/sua`,       label: 'Tổng quan' },
    { to: `${base}/suc-khoe`,  label: 'Chỉ số sức khỏe' },
    { to: `${base}/suc-khoe`,  label: 'Tiêm chủng' },
    { to: `${base}/suc-khoe`,  label: 'Lịch sử tây' },
  ];
  return (
    <div className="w-48 flex-shrink-0 space-y-2">
      <div className="bg-white rounded-xl shadow-md p-4 text-center">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-[#1d4ed8] mx-auto mb-2 overflow-hidden">
          {child.avatar}
        </div>
        <p className="font-semibold text-gray-800 text-sm leading-snug">{child.fullName}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{child.code}</p>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {NAV.map((item, i) => (
          <NavLink key={i} to={item.to}
            className={({ isActive }) =>
              `w-full flex px-4 py-3 text-sm border-b border-gray-50 last:border-0 transition ${
                isActive && i === 0
                  ? 'bg-blue-50 text-[#1d4ed8] font-semibold border-l-2 border-l-[#1d4ed8]'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-[#1d4ed8]'
              }`
            }>
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function ChildForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const avatarFileRef = useRef();
  const [avatar, setAvatar] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (isEdit) reset(MOCK_CHILD);
  }, [isEdit, reset]);

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 600));
    navigate('/can-bo-tiep-nhan/tre');
  };

  const child = MOCK_CHILD;

  return (
    <div className="flex gap-4 min-h-full">
      {/* ── Left sidebar ── */}
      {isEdit && <ChildSidebar childId={id} child={child} />}

      {/* ── Main ── */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Child header card */}
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-[#1d4ed8] overflow-hidden ring-2 ring-blue-200">
              {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : child.avatar}
            </div>
            <button type="button" onClick={() => avatarFileRef.current.click()}
              className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-[#1d4ed8] rounded-full flex items-center justify-center text-white shadow">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
              </svg>
            </button>
            <input ref={avatarFileRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files[0]; if (f) setAvatar(URL.createObjectURL(f)); }} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-gray-800">{child.fullName}</h1>
              <span className="text-xs text-gray-400">{child.code}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{child.status}
              </span>
              <span className="text-xs text-blue-500">{child.lastUpdate}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="secondary" size="sm"
              icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>}>
              Xuất báo cáo sức khỏe
            </Button>
            <Button variant="secondary" size="sm"
              icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2m2 4h6a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2zm1-4h4v6H10v-6z" /></svg>}>
              In hồ sơ
            </Button>
            <Button variant="accent" size="sm"
              icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>}
              onClick={handleSubmit(onSubmit)}
              loading={isSubmitting}>
              Lưu Phiếu Mới
            </Button>
          </div>
        </div>

        {/* Content grid */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-4">
            {/* ── Left col (2/3): personal info + địa điểm ── */}
            <div className="col-span-2 space-y-4">
              {/* Personal info */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-[#1d4ed8] px-5 py-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                  </svg>
                  <p className="text-white font-semibold text-sm">Thông tin cá nhân</p>
                </div>
                <div className="p-4 space-y-3">
                  <FormField label="Họ và tên" required error={errors.fullName?.message}>
                    <input {...register('fullName', { required: 'Bắt buộc' })} className={inputCls} />
                  </FormField>
                  <div className="grid grid-cols-3 gap-3">
                    <FormField label="Ngày sinh">
                      <input type="date" {...register('dob')} className={inputCls} />
                    </FormField>
                    <FormField label="Giới tính">
                      <select {...register('gender')} className={selectCls}>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                      </select>
                    </FormField>
                    <FormField label="Dân tộc">
                      <input {...register('ethnicity')} className={inputCls} />
                    </FormField>
                  </div>
                  <FormField label="Địa chỉ thường trú">
                    <input {...register('address')} placeholder="Số nhà, Tên đường, Phường/Xã..." className={inputCls} />
                  </FormField>
                </div>
              </div>

              {/* Địa điểm & Ghi thêm */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-[#1d4ed8] px-5 py-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white font-semibold text-sm">Địa điểm & Ghi thêm</p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Quê hương">
                      <input {...register('hometown')} className={inputCls} />
                    </FormField>
                    <div />
                  </div>
                  <FormField label="Ghi chú của cán bộ">
                    <textarea {...register('notes')} rows={3}
                      placeholder="Thêm thông tin đặc biệt cần chú ý, hoàn cảnh gia đình..."
                      className={textareaCls} />
                  </FormField>
                </div>
              </div>
            </div>

            {/* ── Right col (1/3): học tập + tài liệu ── */}
            <div className="space-y-4">
              {/* Thông tin học tập */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-[#1d4ed8] px-5 py-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 0 0-.788 0l-7 3a1 1 0 0 0 0 1.84L5.25 8.051a.999.999 0 0 1 .356-.257l4-1.714a1 1 0 1 1 .788 1.838L7.667 9.088l1.94.831a1 1 0 0 0 .787 0l7-3a1 1 0 0 0 0-1.838l-7-3z" />
                  </svg>
                  <p className="text-white font-semibold text-sm">Thông tin học tập</p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Trình độ cơ sở</p>
                      <select {...register('school')} className={selectCls + ' text-xs'}>
                        <option value="thcs">Trung học cơ sở</option>
                        <option value="tieuhoc">Tiểu học</option>
                        <option value="thpt">THPT</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Lớp</p>
                      <input {...register('grade')} className={inputCls + ' text-xs'} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Trường học</p>
                    <div className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                      <span className="text-xs text-gray-700 truncate">{child.schoolName}</span>
                      <span className="text-xs text-[#1d4ed8] font-semibold ml-2 flex-shrink-0">7A › 7.8</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tài liệu hồ sơ */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-[#1d4ed8] px-5 py-2.5 flex items-center justify-between">
                  <p className="text-white font-semibold text-sm">Tài liệu hồ sơ</p>
                  <button type="button" className="text-blue-200 hover:text-white text-xs transition">+ Tải lên</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {MOCK_DOCS.map(doc => (
                    <div key={doc.name} className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                          doc.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {doc.done ? '✓' : '○'}
                        </div>
                        <span className="text-sm text-gray-700">{doc.name}</span>
                      </div>
                      {doc.done
                        ? <button type="button" className="text-xs text-blue-500 hover:underline">Xem</button>
                        : <button type="button" className="text-xs text-orange-500 hover:underline">Upload</button>
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* Link to health */}
              {isEdit && (
                <Link to={`/can-bo-tiep-nhan/tre/${id}/suc-khoe`}
                  className="flex items-center gap-3 bg-white rounded-xl shadow-md p-4 hover:bg-blue-50 transition group">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition">
                    <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Sức khỏe & Tiêm chủng</p>
                    <p className="text-xs text-gray-400">Cập nhật chỉ số sức khỏe</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
