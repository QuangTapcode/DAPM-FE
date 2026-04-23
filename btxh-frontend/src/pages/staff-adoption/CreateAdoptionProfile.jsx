import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import adoptionApi from '../../api/adoptionApi';
import Button from '../../components/common/Button';

const fieldClass = 'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';

export default function CreateAdoptionProfile() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { adoptionDate: new Date().toISOString().split('T')[0] },
  });

  useEffect(() => {
    if (requestId) {
      adoptionApi.getById(requestId).then((req) => reset({
        adopterName: req.adopterName,
        childName:   req.childName,
        childId:     req.childId,
        adoptionDate: new Date().toISOString().split('T')[0],
      })).catch(console.error);
    }
  }, [requestId, reset]);

  const onSubmit = async (data) => {
    await adoptionApi.update(requestId, { ...data, type: 'profile', status: 'completed' });
    navigate('/can-bo-nhan-nuoi/danh-sach');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Lập hồ sơ nhận nuôi</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Người nhận nuôi</label>
            <input {...register('adopterName')} readOnly className={`${fieldClass} bg-gray-50`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên trẻ</label>
            <input {...register('childName')} readOnly className={`${fieldClass} bg-gray-50`} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày ký kết hồ sơ</label>
          <input type="date" {...register('adoptionDate', { required: 'Bắt buộc' })} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Điều kiện theo dõi sau nhận nuôi</label>
          <textarea {...register('followupConditions')} rows={3} className={fieldClass}
            placeholder="Ví dụ: Báo cáo định kỳ 3 tháng/lần trong 2 năm đầu..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú của cán bộ</label>
          <textarea {...register('staffNotes')} rows={2} className={fieldClass} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isSubmitting}>Hoàn tất hồ sơ</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Hủy</Button>
        </div>
      </form>
    </div>
);
}
