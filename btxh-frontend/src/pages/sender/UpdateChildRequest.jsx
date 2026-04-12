import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import receptionApi from '../../api/receptionApi';
import Button from '../../components/common/Button';

const fieldClass = 'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
const errClass   = 'text-red-500 text-xs mt-1';

export default function UpdateChildRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    receptionApi.getById(id).then(reset).catch(console.error);
  }, [id, reset]);

  const onSubmit = async (data) => {
    await receptionApi.update(id, data);
    navigate('/gui-tre/trang-thai');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Cập nhật yêu cầu gửi trẻ</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên trẻ</label>
            <input {...register('childName', { required: 'Bắt buộc' })} className={fieldClass} />
            {errors.childName && <p className={errClass}>{errors.childName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
            <input type="date" {...register('childDob')} className={fieldClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng sức khỏe</label>
          <textarea {...register('healthStatus')} rows={3} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lý do gửi trẻ</label>
          <textarea {...register('reason', { required: 'Bắt buộc' })} rows={3} className={fieldClass} />
          {errors.reason && <p className={errClass}>{errors.reason.message}</p>}
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isSubmitting}>Lưu thay đổi</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Hủy</Button>
        </div>
      </form>
    </div>
  );
}
