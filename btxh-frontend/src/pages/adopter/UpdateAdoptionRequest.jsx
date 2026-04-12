import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import adoptionApi from '../../api/adoptionApi';
import Button from '../../components/common/Button';

const fieldClass = 'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400';
const errClass   = 'text-red-500 text-xs mt-1';

export default function UpdateAdoptionRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    adoptionApi.getById(id).then(reset).catch(console.error);
  }, [id, reset]);

  const onSubmit = async (data) => {
    await adoptionApi.update(id, data);
    navigate('/nhan-nuoi/trang-thai');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Cập nhật đơn nhận nuôi</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên người nhận nuôi</label>
          <input {...register('adopterName', { required: 'Bắt buộc' })} className={fieldClass} />
          {errors.adopterName && <p className={errClass}>{errors.adopterName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input {...register('phone')} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ thường trú</label>
          <input {...register('address')} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lý do nhận nuôi</label>
          <textarea {...register('motivation')} rows={3} className={fieldClass} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isSubmitting}>Lưu thay đổi</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Hủy</Button>
        </div>
      </form>
    </div>
  );
}
