import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import adoptionApi from '../../api/adoptionApi';
import Button from '../../components/common/Button';
import FileUpload from '../../components/common/FileUpload';

const fieldClass = 'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400';
const errClass   = 'text-red-500 text-xs mt-1';

export default function CreateAdoptionRequest() {
  const [searchParams] = useSearchParams();
  const [files, setFiles] = useState({ idCard: [], marriage: [], income: [], others: [] });
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { childId: searchParams.get('childId') || '' },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    [...files.idCard, ...files.marriage, ...files.income, ...files.others].forEach((f) =>
      formData.append('documents', f)
    );
    await adoptionApi.create(formData);
    navigate('/nhan-nuoi/trang-thai');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tạo đơn nhận nuôi</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mã trẻ muốn nhận nuôi</label>
          <input {...register('childId', { required: 'Bắt buộc' })} className={fieldClass} readOnly />
          {errors.childId && <p className={errClass}>{errors.childId.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên người nhận nuôi</label>
            <input {...register('adopterName', { required: 'Bắt buộc' })} className={fieldClass} />
            {errors.adopterName && <p className={errClass}>{errors.adopterName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CCCD/CMND</label>
            <input {...register('nationalId', { required: 'Bắt buộc' })} className={fieldClass} />
            {errors.nationalId && <p className={errClass}>{errors.nationalId.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input {...register('phone', { required: 'Bắt buộc' })} className={fieldClass} />
            {errors.phone && <p className={errClass}>{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nghề nghiệp</label>
            <input {...register('occupation')} className={fieldClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ thường trú</label>
          <input {...register('address', { required: 'Bắt buộc' })} className={fieldClass} />
          {errors.address && <p className={errClass}>{errors.address.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lý do nhận nuôi</label>
          <textarea {...register('motivation', { required: 'Bắt buộc' })} rows={3} className={fieldClass} />
          {errors.motivation && <p className={errClass}>{errors.motivation.message}</p>}
        </div>

        <div className="border-t pt-4 space-y-4">
          <p className="text-sm font-medium text-gray-700">Giấy tờ đính kèm</p>
          <FileUpload label="CCCD/CMND (cả 2 mặt)" accept=".pdf,.jpg,.jpeg,.png"
            files={files.idCard} onChange={(f) => setFiles(p => ({ ...p, idCard: f }))} />
          <FileUpload label="Giấy đăng ký kết hôn (nếu có)" accept=".pdf,.jpg,.jpeg,.png"
            files={files.marriage} onChange={(f) => setFiles(p => ({ ...p, marriage: f }))} />
          <FileUpload label="Giấy xác nhận thu nhập" accept=".pdf,.jpg,.jpeg,.png"
            files={files.income} onChange={(f) => setFiles(p => ({ ...p, income: f }))} />
          <FileUpload label="Giấy tờ khác" accept=".pdf,.jpg,.jpeg,.png" multiple
            files={files.others} onChange={(f) => setFiles(p => ({ ...p, others: f }))} />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isSubmitting}>Nộp đơn</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Hủy</Button>
        </div>
      </form>
    </div>
  );
}
