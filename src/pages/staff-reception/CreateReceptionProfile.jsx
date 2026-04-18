import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import receptionApi from '../../api/receptionApi';
import childApi from '../../api/childApi';
import Button from '../../components/common/Button';

const fieldClass = 'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
const errClass   = 'text-red-500 text-xs mt-1';

export default function CreateReceptionProfile() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (requestId) {
      receptionApi.getById(requestId).then((req) => reset({
        childName:    req.childName,
        childDob:     req.childDob,
        childGender:  req.childGender,
        healthStatus: req.healthStatus,
      })).catch(console.error);
    }
  }, [requestId, reset]);

  const onSubmit = async (data) => {
    await childApi.create({ ...data, requestId });
    navigate('/can-bo-tiep-nhan/tre');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Lập hồ sơ tiếp nhận trẻ</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên trẻ</label>
            <input {...register('childName', { required: 'Bắt buộc' })} className={fieldClass} />
            {errors.childName && <p className={errClass}>{errors.childName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
            <input type="date" {...register('childDob', { required: 'Bắt buộc' })} className={fieldClass} />
            {errors.childDob && <p className={errClass}>{errors.childDob.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
            <select {...register('childGender')} className={fieldClass}>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng sức khỏe khi tiếp nhận</label>
          <textarea {...register('healthStatus')} rows={3} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tiếp nhận</label>
          <input type="date" {...register('admissionDate', { required: 'Bắt buộc' })} className={fieldClass} />
          {errors.admissionDate && <p className={errClass}>{errors.admissionDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
          <textarea {...register('notes')} rows={2} className={fieldClass} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isSubmitting}>Lưu hồ sơ</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Hủy</Button>
        </div>
      </form>
    </div>
  );
}
