import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField, inputCls, selectCls } from '../../components/common/FormField';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';

const MOCK_USER = {
  fullName: 'Nguyễn Thị Lan',
  phone: '0901 234 567',
  nationality: 'Việt Nam',
  dob: '1990-05-14',
  email: 'lan.nguyen@gmail.com',
  address: '12 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. HCM',
  province: 'TP. Hồ Chí Minh',
  district: 'Quận 1',
  ward: 'Phường Bến Nghé',
};

const COMPLETION = [
  { label: 'Họ và tên',    done: true },
  { label: 'Số điện thoại', done: true },
  { label: 'Ngày sinh',    done: true },
  { label: 'Email',        done: true },
  { label: 'Địa chỉ',     done: false },
];

export default function SenderProfile() {
  const fileRef = useRef();
  const [avatar, setAvatar] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: MOCK_USER,
  });

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 600));
    alert('Đã lưu thông tin!');
  };

  const completedCount = COMPLETION.filter(c => c.done).length;
  const completionPct  = Math.round((completedCount / COMPLETION.length) * 100);

  return (
    <div>
      <PageHeader
        title="Thông tin cá nhân"
        breadcrumbs={[
          { label: 'Trang chủ', to: '/gui-tre/dashboard' },
          { label: 'Hồ sơ cá nhân' },
        ]}
      />

      <div className="grid grid-cols-3 gap-5">
        {/* Left: avatar + completion + security */}
        <div className="space-y-4">
          {/* Avatar card */}
          <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-[#1d4ed8] overflow-hidden">
                {avatar
                  ? <img src={avatar} alt="" className="w-full h-full object-cover" />
                  : MOCK_USER.fullName[0]
                }
              </div>
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#1d4ed8] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#1e40af] transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
                </svg>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files[0]; if (f) setAvatar(URL.createObjectURL(f)); }} />
            </div>
            <p className="font-bold text-gray-800 text-base">{MOCK_USER.fullName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{MOCK_USER.email}</p>
            <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />Đã xác minh
            </span>
          </div>

          {/* Profile completion */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Độ hoàn thiện hồ sơ</p>
              <span className="text-sm font-bold text-[#1d4ed8]">{completionPct}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
              <div
                className="h-2 rounded-full bg-[#1d4ed8] transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <div className="space-y-2">
              {COMPLETION.map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${
                    item.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {item.done ? '✓' : '○'}
                  </div>
                  <span className={`text-xs ${item.done ? 'text-gray-700' : 'text-gray-400'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-xs font-semibold text-amber-700 mb-1">Bảo mật thông tin</p>
                <p className="text-xs text-amber-600 leading-relaxed">Thông tin cá nhân của bạn được mã hóa và bảo vệ theo quy định pháp luật. Không chia sẻ tài khoản với người khác.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="col-span-2 space-y-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Personal info section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
              <div className="bg-[#1d4ed8] px-5 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                </svg>
                <p className="text-white font-semibold text-sm">Thông tin của bạn</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Họ và tên" required error={errors.fullName?.message}>
                    <input {...register('fullName', { required: 'Bắt buộc' })} className={inputCls} />
                  </FormField>
                  <FormField label="Số điện thoại" required error={errors.phone?.message}>
                    <input {...register('phone', { required: 'Bắt buộc' })} className={inputCls} placeholder="0901 234 567" />
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
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

            {/* Address section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
              <div className="bg-[#1d4ed8] px-5 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
                </svg>
                <p className="text-white font-semibold text-sm">Địa chỉ liên hệ</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-4">
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

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" size="sm">Hủy thay đổi</Button>
              <Button type="submit" variant="primary" size="sm" loading={isSubmitting}
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>}>
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
