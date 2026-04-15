import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { FormField, inputCls, selectCls } from '../../components/common/FormField';

const MOCK_USER = {
  fullName:    'Nguyễn Thị Lan',
  phone:       '0901 234 567',
  nationality: 'Việt Nam',
  dob:         '1990-05-14',
  email:       'lan.nguyen@gmail.com',
  address:     '12 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. HCM',
  province:    'TP. Hồ Chí Minh',
  district:    'Quận 1',
  ward:        'Phường Bến Nghé',
};

const COMPLETION = [
  { label: 'Họ và tên',     done: true  },
  { label: 'Số điện thoại', done: true  },
  { label: 'Ngày sinh',     done: true  },
  { label: 'Email',         done: true  },
  { label: 'Địa chỉ đầy đủ', done: false },
];

export default function SenderProfile() {
  const fileRef = useRef();
  const [avatar, setAvatar]     = useState(null);
  const [saved,  setSaved]      = useState(false);
  const sideRef  = useScrollReveal({ threshold: 0.1 });
  const formRef  = useScrollReveal({ threshold: 0.1 });

  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm({
    defaultValues: MOCK_USER,
  });

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 700));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const completedCount = COMPLETION.filter(c => c.done).length;
  const pct            = Math.round((completedCount / COMPLETION.length) * 100);
  const initials       = MOCK_USER.fullName.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();

  return (
    <div className="max-w-5xl mx-auto" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Hồ sơ cá nhân</h1>
        <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin để hồ sơ luôn chính xác</p>
      </div>

      {/* success toast */}
      <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${saved ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
        <div className="bg-green-600 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Đã lưu thành công!
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Sidebar ─────────────────────────────────── */}
        <div ref={sideRef} className="reveal reveal--left space-y-5">

          {/* avatar card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl font-black text-[#1d4ed8] overflow-hidden shadow-md">
                {avatar
                  ? <img src={avatar} alt="" className="w-full h-full object-cover" />
                  : initials}
              </div>
              <button type="button" onClick={() => fileRef.current.click()}
                className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-[#1d4ed8] rounded-xl flex items-center justify-center text-white shadow-lg hover:bg-[#1e40af] transition">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
                </svg>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files[0]; if (f) setAvatar(URL.createObjectURL(f)); }} />
            </div>
            <p className="font-black text-gray-800 text-base">{MOCK_USER.fullName}</p>
            <p className="text-xs text-gray-400 mt-0.5 mb-3">{MOCK_USER.email}</p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Đã xác minh
            </span>
          </div>

          {/* completion */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-1 h-5 bg-purple-500 rounded-full" />
              <h2 className="font-black text-gray-800 text-sm">Độ hoàn thiện hồ sơ</h2>
            </div>
            <div className="flex items-end justify-between mb-2">
              <span className="text-xs text-gray-500">{completedCount}/{COMPLETION.length} mục</span>
              <span className="text-xl font-black text-[#1d4ed8]">{pct}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="h-full rounded-full bg-gradient-to-r from-[#1d4ed8] to-blue-400 transition-all duration-700"
                style={{ width: `${pct}%` }} />
            </div>
            <div className="space-y-2.5">
              {COMPLETION.map(item => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0
                    ${item.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {item.done ? '✓' : '○'}
                  </div>
                  <span className={`text-xs font-semibold ${item.done ? 'text-gray-700' : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* security notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <span className="text-lg flex-shrink-0">🔒</span>
            <div>
              <p className="text-xs font-black text-amber-800 mb-1">Bảo mật thông tin</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Thông tin cá nhân được mã hóa và bảo vệ. Không chia sẻ tài khoản với người khác.
              </p>
            </div>
          </div>
        </div>

        {/* ── Form ────────────────────────────────────── */}
        <div ref={formRef} className="reveal reveal--right lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* personal info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 sm:px-6 py-4 border-b border-gray-100">
                <div className="w-1 h-5 bg-[#1d4ed8] rounded-full" />
                <h2 className="font-black text-gray-800">Thông tin cá nhân</h2>
              </div>
              <div className="p-5 sm:p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Họ và tên" required error={errors.fullName?.message}>
                    <input {...register('fullName', { required: 'Bắt buộc' })} className={inputCls} />
                  </FormField>
                  <FormField label="Số điện thoại" required error={errors.phone?.message}>
                    <input {...register('phone', { required: 'Bắt buộc' })} className={inputCls} placeholder="0901 234 567" />
                  </FormField>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Quốc tịch">
                    <select {...register('nationality')} className={selectCls}>
                      <option>Việt Nam</option>
                      <option>Khác</option>
                    </select>
                  </FormField>
                  <FormField label="Ngày sinh">
                    <input type="date" {...register('dob')} className={inputCls} />
                  </FormField>
                </div>
                <FormField label="Email" required error={errors.email?.message}>
                  <input type="email" {...register('email', { required: 'Bắt buộc' })} className={inputCls} />
                </FormField>
              </div>
            </div>

            {/* address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 sm:px-6 py-4 border-b border-gray-100">
                <div className="w-1 h-5 bg-[#f97316] rounded-full" />
                <h2 className="font-black text-gray-800">Địa chỉ liên hệ</h2>
              </div>
              <div className="p-5 sm:p-6 space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField label="Tỉnh / Thành phố">
                    <select {...register('province')} className={selectCls}>
                      <option>TP. Hồ Chí Minh</option>
                      <option>Hà Nội</option>
                      <option>Đà Nẵng</option>
                    </select>
                  </FormField>
                  <FormField label="Quận / Huyện">
                    <select {...register('district')} className={selectCls}>
                      <option>Quận 1</option>
                      <option>Quận 3</option>
                      <option>Bình Thạnh</option>
                    </select>
                  </FormField>
                  <FormField label="Phường / Xã">
                    <select {...register('ward')} className={selectCls}>
                      <option>Phường Bến Nghé</option>
                      <option>Phường Bến Thành</option>
                    </select>
                  </FormField>
                </div>
                <FormField label="Địa chỉ cụ thể">
                  <input {...register('address')} className={inputCls} placeholder="Số nhà, tên đường..." />
                </FormField>
              </div>
            </div>

            {/* actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button type="button"
                className="sm:order-1 py-3 px-6 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-gray-300 transition">
                Hủy thay đổi
              </button>
              <button type="submit" disabled={isSubmitting || !isDirty}
                className="flex items-center justify-center gap-2 bg-[#1d4ed8] hover:bg-[#1e40af] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-7 rounded-xl transition shadow-md shadow-blue-200 text-sm">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
