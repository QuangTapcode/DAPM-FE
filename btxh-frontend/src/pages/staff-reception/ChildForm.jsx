import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { useBasePath } from '../../hooks/useBasePath';
import childApi from '../../api/childApi';

const avatarUrl = (seed = 'child', bg = 'b6e3f4') =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bg}&backgroundType=solid`;

const DEMO_CHILDREN = [
  {
    id: 1, code: 'TRE-001', fullName: 'Nguyễn Văn Bình', dob: '2016-08-15', gender: 'male',
    avatar: avatarUrl('Binh','b6e3f4'), ethnicity: 'Kinh', admissionDate: '2024-07-01', status: 'available',
    bloodType: 'O+', hometown: '123 Nguyễn Huệ, Phường 1, TP. Đông Hà, Quảng Trị',
    schoolLevel: 'Tiểu học', schoolClass: '3A', schoolName: 'Tiểu học Nguyễn Trãi', academicLevel: 'Khá',
  },
  {
    id: 2, code: 'TRE-002', fullName: 'Lê Minh Anh', dob: '2019-03-20', gender: 'female',
    avatar: avatarUrl('Anh','ffd5dc'), ethnicity: 'Kinh', admissionDate: '2024-06-15', status: 'processing',
    bloodType: 'A+', hometown: '45 Lê Lợi, Phường 2, TP. Huế, Thừa Thiên Huế',
    schoolLevel: 'Mầm non', schoolClass: 'Lớp Chồi', schoolName: 'Mầm non Hoa Sen', academicLevel: 'Tốt',
  },
  {
    id: 3, code: 'TRE-003', fullName: 'Trần Hoàng Long', dob: '2014-07-05', gender: 'male',
    avatar: avatarUrl('Long','c0aede'), ethnicity: 'Kinh', admissionDate: '2024-05-20', status: 'adopted',
    bloodType: 'B+', hometown: '78 Trần Phú, Phường 3, TP. Đà Nẵng',
    schoolLevel: 'Tiểu học', schoolClass: '5B', schoolName: 'Tiểu học Lý Tự Trọng', academicLevel: 'Giỏi',
  },
  {
    id: 4, code: 'TRE-004', fullName: 'Phạm Thị Mai', dob: '2017-12-03', gender: 'female',
    avatar: avatarUrl('Mai','fce4ec'), ethnicity: 'Kinh', admissionDate: '2024-04-28', status: 'available',
    bloodType: 'AB+', hometown: '56 Hùng Vương, Phường 4, TP. Tam Kỳ, Quảng Nam',
    schoolLevel: 'Tiểu học', schoolClass: '2B', schoolName: 'Tiểu học Trần Quốc Toản', academicLevel: 'Khá',
  },
  {
    id: 5, code: 'TRE-005', fullName: 'Võ Đức Huy', dob: '2015-06-22', gender: 'male',
    avatar: avatarUrl('Huy','c8e6c9'), ethnicity: 'Kinh', admissionDate: '2024-04-15', status: 'available',
    bloodType: 'O-', hometown: '12 Phan Bội Châu, Phường 5, TP. Quy Nhơn, Bình Định',
    schoolLevel: 'Tiểu học', schoolClass: '4A', schoolName: 'Tiểu học Quang Trung', academicLevel: 'Trung bình',
  },
  {
    id: 6, code: 'TRE-006', fullName: 'Đặng Ngọc Hân', dob: '2020-09-14', gender: 'female',
    avatar: avatarUrl('Han','fff9c4'), ethnicity: 'Kinh', admissionDate: '2024-03-20', status: 'processing',
    bloodType: 'A-', hometown: '89 Hai Bà Trưng, Phường 6, TP. Nha Trang, Khánh Hòa',
    schoolLevel: 'Mầm non', schoolClass: 'Lớp Mầm', schoolName: 'Mầm non Tuổi Thơ', academicLevel: 'Tốt',
  },
  {
    id: 7, code: 'TRE-007', fullName: 'Huỳnh Gia Bảo', dob: '2018-01-30', gender: 'male',
    avatar: avatarUrl('Bao','bbdefb'), ethnicity: 'Kinh', admissionDate: '2024-03-05', status: 'available',
    bloodType: 'B-', hometown: 'Không xác định',
    schoolLevel: 'Mầm non', schoolClass: 'Lớp Lá', schoolName: 'Mầm non Ánh Sao', academicLevel: 'Khá',
  },
  {
    id: 8, code: 'TRE-008', fullName: 'Ngô Khánh Linh', dob: '2016-04-18', gender: 'female',
    avatar: avatarUrl('Linh','f8bbd0'), ethnicity: 'Tày', admissionDate: '2024-02-10', status: 'available',
    bloodType: 'O+', hometown: '34 Phạm Ngũ Lão, Xã Tân Phú, Huyện Đồng Phú, Bình Phước',
    schoolLevel: 'Tiểu học', schoolClass: '3C', schoolName: 'Tiểu học Lê Hồng Phong', academicLevel: 'Giỏi',
  },
  {
    id: 9, code: 'TRE-009', fullName: 'Bùi Thanh Tùng', dob: '2013-11-25', gender: 'male',
    avatar: avatarUrl('Tung','b2dfdb'), ethnicity: 'Mường', admissionDate: '2024-01-18', status: 'adopted',
    bloodType: 'AB-', hometown: '67 Lý Thường Kiệt, TT. Hòa Bình, Hòa Bình',
    schoolLevel: 'THCS', schoolClass: '6A', schoolName: 'THCS Nguyễn Du', academicLevel: 'Giỏi',
  },
  {
    id: 10, code: 'TRE-010', fullName: 'Lý Thảo Nguyên', dob: '2019-07-08', gender: 'female',
    avatar: avatarUrl('Nguyen','e1bee7'), ethnicity: 'Kinh', admissionDate: '2024-01-05', status: 'available',
    bloodType: 'A+', hometown: '15 Nguyễn Trãi, Phường 8, TP. Cần Thơ',
    schoolLevel: 'Mầm non', schoolClass: 'Lớp Chồi', schoolName: 'Mầm non Sao Mai', academicLevel: 'Tốt',
  },
];

const inputClass = 'w-full bg-slate-50 border-none rounded-lg text-sm font-medium focus:ring-1 focus:ring-[#2c7a91] py-2.5 px-3 outline-none transition';
const errClass   = 'text-red-500 text-xs mt-1';

export default function ChildForm() {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const id = paramId || searchParams.get('id');
  const isEdit  = Boolean(id);
  const navigate = useNavigate();
  const basePath = useBasePath();

  /* Tìm đúng trẻ trong demo data theo id */
  const demoChild = DEMO_CHILDREN.find(c => c.id === Number(id)) || DEMO_CHILDREN[0];

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: isEdit ? demoChild : DEMO_CHILDREN[0],
  });

  const fullName = watch('fullName');
  const gender   = watch('gender') || 'male';

  useEffect(() => {
    if (isEdit) {
      childApi.getById(id).then(data => reset(data)).catch(() => reset(demoChild));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) await childApi.update(id, data);
      else        await childApi.create(data);
      navigate(`${basePath}/danh-sach-tre`);
    } catch (err) {
      console.error(err);
    }
  };

  const bgColor = gender === 'female' ? 'ffd5dc' : 'b6e3f4';
  return (
    <div className="p-6 text-slate-700">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link to={`${basePath}/danh-sach-tre`}
          className="text-slate-400 hover:text-[#2c7a91] text-sm transition-colors flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
          </svg>
          Quay lại danh sách trẻ
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-350 mx-auto grid grid-cols-12 gap-6">

          {/* ===== SIDEBAR TRÁI ===== */}
          <aside className="col-span-12 md:col-span-3">
            {/* Card student */}
            <div className="bg-white rounded-xl p-4 shadow-subtle flex items-center space-x-3 mb-6 border border-slate-100">
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-blue-50">
                <img
                  alt={fullName || 'Trẻ'}
                  className="w-full h-full object-cover"
                  src={avatarUrl(fullName || 'child', bgColor)}
                />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">{fullName || 'Nhập tên trẻ...'}</h2>
                <p className="text-[10px] text-slate-500 font-medium">{demoChild.code}</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              <span className="sidebar-active flex items-center space-x-3 px-4 py-2 text-sm font-semibold">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                </svg>
                <span>Thông tin cơ bản</span>
              </span>
              {id && (
                <Link to={`${basePath}/suc-khoe?childId=${id}`}
                  className="flex items-center space-x-3 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                  </svg>
                  <span>Sức khỏe</span>
                </Link>
              )}
              <Link to={`${basePath}/danh-sach-tre`}
                className="flex items-center space-x-3 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                </svg>
                <span>Danh sách trẻ</span>
              </Link>
              <Link to={`${basePath}`}
                className="flex items-center space-x-3 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                </svg>
                <span>Dashboard</span>
              </Link>
            </nav>
          </aside>

          {/* ===== KHU VỰC NỘI DUNG CHÍNH ===== */}
          <section className="col-span-12 md:col-span-9">
            {/* Tiêu đề trang */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#2c7a91] mb-1">
                  {isEdit ? 'Cập nhật hồ sơ' : 'Thêm trẻ mới'}
                </h2>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-slate-500">
                    Hồ sơ: <span className="text-slate-800 font-semibold">{fullName || '—'}</span>
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-bold uppercase tracking-wider">
                    {demoChild.code}
                  </span>
                </div>
              </div>
              <div className="flex space-x-3 w-full md:w-auto">
                <button type="button"
                  onClick={() => navigate(`${basePath}/danh-sach-tre`)}
                  className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                  </svg>
                  <span>Quay lại</span>
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2 bg-[#2c7a91] text-white rounded-lg text-sm font-semibold hover:bg-[#1e5a6b] transition-colors shadow-lg disabled:opacity-60">
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                  )}
                  <span>{isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* CỘT TRÁI */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                {/* Card thông tin cơ bản */}
                <div className="bg-white rounded-2xl p-6 shadow-subtle border border-slate-100">
                  {/* Ảnh đại diện */}
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative w-32 h-32 mb-4">
                      <img
                        alt={fullName || 'Avatar'}
                        className="w-full h-full object-cover rounded-2xl shadow-md bg-blue-50"
                        src={avatarUrl(fullName || 'child', bgColor)}
                      />
                      <button type="button"
                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#2c7a91] text-white rounded-lg flex items-center justify-center border-2 border-white shadow-lg hover:bg-[#1e5a6b]">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">Ảnh thay đổi theo tên</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Họ và tên</label>
                      <input {...register('fullName', { required: 'Bắt buộc' })} className={inputClass} placeholder="Nhập họ và tên..."/>
                      {errors.fullName && <p className={errClass}>{errors.fullName.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ngày sinh</label>
                        <input type="date" {...register('dob')} className={inputClass}/>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Giới tính</label>
                        <select {...register('gender')} className={inputClass}>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dân tộc</label>
                      <input {...register('ethnicity')} className={inputClass} placeholder="Kinh, Tày, Mường..."/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Địa chỉ thường trú</label>
                      <textarea {...register('hometown')} className={inputClass} rows="3" placeholder="Nhập địa chỉ..."/>
                    </div>
                  </div>
                </div>

                {/* Card đặc điểm & sở thích */}
                <div className="bg-white rounded-2xl p-6 shadow-subtle border border-slate-100">
                  <div className="flex items-center space-x-2 mb-4 text-[#2c7a91]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                    <h3 className="font-bold text-sm">Đặc điểm & Sở thích</h3>
                  </div>
                  <div className="mb-4">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Đặc điểm nổi bật</label>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-[#2c7a91] text-[10px] font-bold rounded-full border border-blue-100">Hướng ngoại</span>
                      <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-[#2c7a91] text-[10px] font-bold rounded-full border border-blue-100">Tự lập</span>
                      <button type="button" className="px-3 py-1 border border-dashed border-slate-300 text-slate-400 text-[10px] font-bold rounded-full hover:border-[#2c7a91] hover:text-[#2c7a91] transition-colors">
                        + Thêm
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sở thích cá nhân</label>
                    <textarea
                      {...register('notes')}
                      className={`${inputClass} leading-relaxed`}
                      rows="3"
                      placeholder="Mô tả sở thích của trẻ..."
                      defaultValue="Thích vẽ tranh phong cảnh, đá bóng cùng bạn bè vào cuối tuần."
                    />
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* Card thông tin học tập */}
                <div className="bg-white rounded-2xl p-8 shadow-subtle border border-slate-100">
                  <div className="flex items-center space-x-2 mb-6 text-[#2c7a91]">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                    <h3 className="font-bold text-lg">Thông tin học tập</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cấp học</label>
                      <select {...register('schoolLevel')} className={inputClass}>
                        <option>Mầm non</option>
                        <option>Tiểu học</option>
                        <option>Trung học cơ sở</option>
                        <option>Trung học phổ thông</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lớp</label>
                      <input {...register('schoolClass')} className={inputClass} placeholder="VD: 3A, 7B..."/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Trường đang học</label>
                      <input {...register('schoolName')} className={inputClass} placeholder="Tên trường..."/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Học lực</label>
                      <select {...register('academicLevel')} className={inputClass}>
                        <option>Xuất sắc</option>
                        <option>Giỏi</option>
                        <option>Khá</option>
                        <option>Trung bình</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ghi chú học tập</label>
                      <textarea {...register('studyNotes')} className={`${inputClass} rounded-xl`} rows="4"
                        placeholder="Nhận xét từ giáo viên hoặc kết quả nổi bật..."/>
                    </div>
                  </div>
                </div>

                {/* Card tài liệu hồ sơ */}
                <div className="bg-white rounded-2xl p-8 shadow-subtle border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2 text-[#2c7a91]">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                      </svg>
                      <h3 className="font-bold text-lg">Tài liệu hồ sơ</h3>
                    </div>
                    <button type="button" className="flex items-center space-x-1 text-xs font-bold text-[#2c7a91] hover:underline">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                      </svg>
                      <span>Tải lên tài liệu mới</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {[
                      { name: 'Giấy khai sinh', type: 'PDF • 2.4 MB • 15/01/2024', color: 'bg-blue-50 text-blue-600' },
                      { name: 'Ảnh chân dung', type: 'JPG • 1.1 MB • 15/01/2024', color: 'bg-purple-50 text-purple-600' },
                      { name: 'Sổ tiêm chủng', type: 'PDF • 3.2 MB • 15/01/2024', color: 'bg-teal-50 text-teal-600' },
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.color}`}>
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">{doc.name}</h4>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold">{doc.type}</p>
                          </div>
                        </div>
                        <span className="text-green-500">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"/>
                          </svg>
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-[#2c7a91] hover:bg-[#f0f7f9] transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                      </svg>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">
                      Kéo thả tập tin hoặc <span className="text-[#2c7a91] font-bold">chọn tệp</span>
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-medium">Hỗ trợ PDF, JPG, PNG | Tối đa 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}