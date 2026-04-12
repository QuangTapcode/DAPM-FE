import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';

const fieldClass = 'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-50';

export default function AdopterProfile() {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => { if (user) reset(user); }, [user, reset]);

  const onSubmit = async (data) => {
    // await authApi.updateProfile(data);
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Thông tin cá nhân</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
          <input {...register('fullName')} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input disabled {...register('email')} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input {...register('phone')} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CCCD/CMND</label>
          <input {...register('nationalId')} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nghề nghiệp</label>
          <input {...register('occupation')} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
          <input {...register('address')} className={fieldClass} />
        </div>
        <Button type="submit" loading={isSubmitting}>Lưu thay đổi</Button>
      </form>
    </div>
  );
}
