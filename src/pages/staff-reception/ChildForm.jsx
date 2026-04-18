import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import childApi from '../../api/childApi';
import Button from '../../components/common/Button';

const fieldClass = 'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
const errClass   = 'text-red-500 text-xs mt-1';

export default function ChildForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (isEdit) childApi.getById(id).then(reset).catch(console.error);
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
    if (isEdit) await childApi.update(id, data);
    else        await childApi.create(data);
    navigate('/can-bo-tiep-nhan/tre');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {isEdit ? 'Cập nhật thông tin trẻ' : 'Thêm trẻ mới'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
            <input {...register('fullName', { required: 'Bắt buộc' })} className={fieldClass} />
            {errors.fullName && <p className={errClass}>{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
            <input type="date" {...register('dob', { required: 'Bắt buộc' })} className={fieldClass} />
            {errors.dob && <p className={errClass}>{errors.dob.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
            <select {...register('gender')} className={fieldClass}>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dân tộc</label>
            <input {...register('ethnicity')} className={fieldClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quê quán</label>
          <input {...register('hometown')} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng sức khỏe</label>
          <textarea {...register('healthStatus')} rows={3} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tiếp nhận</label>
          <input type="date" {...register('admissionDate')} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
          <textarea {...register('notes')} rows={2} className={fieldClass} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isSubmitting}>{isEdit ? 'Lưu thay đổi' : 'Thêm trẻ'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Hủy</Button>
        </div>
      </form>
    </div>
  );
}
