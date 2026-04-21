import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

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

const card28 = 'rounded-[28px] border border-[#E3ECF8] bg-white shadow-[0_14px_36px_rgba(42,74,122,0.08)]';

const inputCls = (disabled) => [
  'w-full rounded-2xl border px-4 py-3 text-[15px] outline-none transition',
  disabled
    ? 'border-[#E6EEF8] bg-[#F7FBFF] text-slate-700 cursor-not-allowed'
    : 'border-[#D8E6F5] bg-white text-slate-800 focus:border-[#2F80ED] focus:ring-4 focus:ring-blue-100',
].join(' ');

const selectCls = inputCls(false) + ' cursor-pointer';

function FieldLabel({ children, required }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8] mb-1.5">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

export default function SenderProfile() {
  const fileRef = useRef();
  const [avatar, setAvatar] = useState(null);
  const [saved,  setSaved]  = useState(false);

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
    <div className="min-h-screen bg-[#F5F9FE]">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">

        {/* page header */}
        <div className="mb-6">
          <h1 className="text-[36px] font-bold text-[#0D47A1] leading-none">Hồ sơ cá nhân</h1>
          <p className="text-sm text-[#8FA0B8] mt-2">Cập nhật thông tin để hồ sơ luôn chính xác</p>
        </div>

        {/* success toast */}
        <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${saved ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          <div className="bg-emerald-600 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2">
            ✓ Đã lưu thành công!
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Sidebar ─────────────────────────────────── */}
          <div className="space-y-5">

            {/* avatar card */}
            <div className={`${card28} p-6 flex flex-col items-center text-center`}>
              <div className="relative mb-5">
                <div className="w-24 h-24 rounded-[20px] bg-gradient-to-br from-[#EAF3FF] to-[#DCE8F7] flex items-center justify-center text-3xl font-bold text-[#0D47A1] overflow-hidden shadow-md">
                  {avatar
                    ? <img src={avatar} alt="" className="w-full h-full object-cover" />
                    : initials}
                </div>
                <button type="button" onClick={() => fileRef.current.click()}
                  className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-[#0D47A1] rounded-xl flex items-center justify-center text-white shadow-lg hover:bg-[#1565C0] transition text-sm">
                  ✏️
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files[0]; if (f) setAvatar(URL.createObjectURL(f)); }} />
              </div>
              <p className="font-bold text-[#334155] text-[17px]">{MOCK_USER.fullName}</p>
              <p className="text-[12px] text-[#8FA0B8] mt-0.5 mb-4">{MOCK_USER.email}</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase tracking-wide rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Đã xác minh
              </span>
            </div>

            {/* completion */}
            <div className={`${card28} p-6`}>
              <h2 className="text-[15px] font-bold text-[#0D47A1] mb-4">Độ hoàn thiện hồ sơ</h2>
              <div className="flex items-end justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8FA0B8]">{completedCount}/{COMPLETION.length} mục</span>
                <span className="text-[28px] font-bold text-[#0D47A1]">{pct}%</span>
              </div>
              <div className="h-2.5 bg-[#E3ECF8] rounded-full overflow-hidden mb-5">
                <div className="h-full rounded-full bg-gradient-to-r from-[#0D47A1] to-[#2196F3] transition-all duration-700"
                  style={{ width: `${pct}%` }} />
              </div>
              <div className="space-y-2.5">
                {COMPLETION.map(item => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0
                      ${item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-[#EAF3FF] text-[#8FA0B8]'}`}>
                      {item.done ? '✓' : '○'}
                    </div>
                    <span className={`text-[13px] font-semibold ${item.done ? 'text-[#334155]' : 'text-[#8FA0B8]'}`}>
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
                <p className="text-xs font-bold text-amber-800 mb-1">Bảo mật thông tin</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Thông tin cá nhân được mã hóa và bảo vệ. Không chia sẻ tài khoản với người khác.
                </p>
              </div>
            </div>
          </div>

          {/* ── Form ────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* personal info */}
              <div className={`${card28} overflow-hidden`}>
                <div className="px-6 py-5 border-b border-[#E3ECF8]">
                  <h2 className="text-[15px] font-bold text-[#0D47A1]">Thông tin cá nhân</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <FieldLabel required>Họ và tên</FieldLabel>
                      <input {...register('fullName', { required: 'Bắt buộc' })} className={inputCls(false)} />
                      {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <FieldLabel required>Số điện thoại</FieldLabel>
                      <input {...register('phone', { required: 'Bắt buộc' })} className={inputCls(false)} placeholder="0901 234 567" />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <FieldLabel>Quốc tịch</FieldLabel>
                      <select {...register('nationality')} className={selectCls}>
                        <option>Việt Nam</option>
                        <option>Khác</option>
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Ngày sinh</FieldLabel>
                      <input type="date" {...register('dob')} className={inputCls(false)} />
                    </div>
                  </div>
                  <div>
                    <FieldLabel required>Email</FieldLabel>
                    <input type="email" {...register('email', { required: 'Bắt buộc' })} className={inputCls(false)} />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                </div>
              </div>

              {/* address */}
              <div className={`${card28} overflow-hidden`}>
                <div className="px-6 py-5 border-b border-[#E3ECF8]">
                  <h2 className="text-[15px] font-bold text-[#0D47A1]">Địa chỉ liên hệ</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid sm:grid-cols-3 gap-5">
                    <div>
                      <FieldLabel>Tỉnh / Thành phố</FieldLabel>
                      <select {...register('province')} className={selectCls}>
                        <option>TP. Hồ Chí Minh</option>
                        <option>Hà Nội</option>
                        <option>Đà Nẵng</option>
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Quận / Huyện</FieldLabel>
                      <select {...register('district')} className={selectCls}>
                        <option>Quận 1</option>
                        <option>Quận 3</option>
                        <option>Bình Thạnh</option>
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Phường / Xã</FieldLabel>
                      <select {...register('ward')} className={selectCls}>
                        <option>Phường Bến Nghé</option>
                        <option>Phường Bến Thành</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Địa chỉ cụ thể</FieldLabel>
                    <input {...register('address')} className={inputCls(false)} placeholder="Số nhà, tên đường..." />
                  </div>
                </div>
              </div>

              {/* actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button type="button"
                  className="sm:order-1 py-3 px-6 rounded-2xl border-2 border-[#DCE8F7] text-[#8FA0B8] font-semibold text-sm hover:border-[#0D47A1] hover:text-[#0D47A1] transition">
                  Hủy thay đổi
                </button>
                <button type="submit" disabled={isSubmitting || !isDirty}
                  className="flex items-center justify-center gap-2 bg-[#0D47A1] hover:bg-[#1565C0] disabled:bg-[#8FA0B8] disabled:cursor-not-allowed text-white font-bold py-3 px-7 rounded-2xl transition shadow-md text-sm">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang lưu...
                    </>
                  ) : '✓ Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
