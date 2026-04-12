import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import childApi from '../../api/childApi';
import Button from '../../components/common/Button';

const fieldClass = 'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';

export default function ChildHealthForm() {
  const { childId, id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { checkDate: new Date().toISOString().split('T')[0] },
  });

  useEffect(() => {
    if (isEdit) {
      childApi.getById(id).then(reset).catch(console.error);
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
    if (isEdit) await childApi.update(id, { ...data, childId });
    else        await childApi.create({ ...data, childId, type: 'health' });
    navigate(`/can-bo-tiep-nhan/tre/${childId}/suc-khoe`);
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {isEdit ? 'Cập nhật theo dõi sức khỏe' : 'Thêm lần khám mới'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khám</label>
          <input type="date" {...register('checkDate', { required: 'Bắt buộc' })} className={fieldClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cân nặng (kg)</label>
            <input type="number" step="0.1" {...register('weight')} className={fieldClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chiều cao (cm)</label>
            <input type="number" step="0.1" {...register('height')} className={fieldClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chẩn đoán</label>
          <textarea {...register('diagnosis')} rows={2} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phương pháp điều trị</label>
          <textarea {...register('treatment')} rows={2} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
          <textarea {...register('notes')} rows={2} className={fieldClass} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isSubmitting}>{isEdit ? 'Lưu thay đổi' : 'Lưu lần khám'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Hủy</Button>
        </div>
      </form>
    </div>
  );
}
