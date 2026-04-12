import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import receptionApi from '../../api/receptionApi';
import Button from '../../components/common/Button';
import FileUpload from '../../components/common/FileUpload';

const STEPS = ['Thông tin trẻ', 'Thông tin người giao', 'Giấy tờ'];

const fieldClass = 'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
const errClass   = 'text-red-500 text-xs mt-1';

function Step1({ register, errors }) {
  return (
    <div className="space-y-4">
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
          <select {...register('childGender', { required: 'Bắt buộc' })} className={fieldClass}>
            <option value="">-- Chọn --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
          {errors.childGender && <p className={errClass}>{errors.childGender.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dân tộc</label>
          <input {...register('ethnicity')} className={fieldClass} placeholder="Kinh, Tày, ..." />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng sức khỏe</label>
        <textarea {...register('healthStatus')} rows={3} className={fieldClass} placeholder="Mô tả tình trạng sức khỏe..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Lý do gửi trẻ</label>
        <textarea {...register('reason', { required: 'Bắt buộc' })} rows={3} className={fieldClass} />
        {errors.reason && <p className={errClass}>{errors.reason.message}</p>}
      </div>
    </div>
  );
}

function Step2({ register, errors }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên người giao</label>
          <input {...register('senderName', { required: 'Bắt buộc' })} className={fieldClass} />
          {errors.senderName && <p className={errClass}>{errors.senderName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quan hệ với trẻ</label>
          <input {...register('relationship', { required: 'Bắt buộc' })} className={fieldClass} placeholder="Cha/mẹ, người thân..." />
          {errors.relationship && <p className={errClass}>{errors.relationship.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CCCD/CMND</label>
          <input {...register('senderNationalId', { required: 'Bắt buộc' })} className={fieldClass} />
          {errors.senderNationalId && <p className={errClass}>{errors.senderNationalId.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input {...register('senderPhone', { required: 'Bắt buộc' })} className={fieldClass} />
          {errors.senderPhone && <p className={errClass}>{errors.senderPhone.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ thường trú</label>
        <input {...register('senderAddress', { required: 'Bắt buộc' })} className={fieldClass} />
        {errors.senderAddress && <p className={errClass}>{errors.senderAddress.message}</p>}
      </div>
    </div>
  );
}

function Step3({ files, setFiles }) {
  return (
    <div className="space-y-5">
      <FileUpload
        label="Giấy khai sinh trẻ"
        accept=".pdf,.jpg,.jpeg,.png"
        files={files.birthCert}
        onChange={(f) => setFiles((prev) => ({ ...prev, birthCert: f }))}
      />
      <FileUpload
        label="CCCD/CMND người giao"
        accept=".pdf,.jpg,.jpeg,.png"
        files={files.senderID}
        onChange={(f) => setFiles((prev) => ({ ...prev, senderID: f }))}
      />
      <FileUpload
        label="Giấy tờ khác (nếu có)"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        files={files.others}
        onChange={(f) => setFiles((prev) => ({ ...prev, others: f }))}
      />
    </div>
  );
}

export default function CreateChildRequest() {
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState({ birthCert: [], senderID: [], others: [] });
  const navigate = useNavigate();
  const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm();

  const nextStep = async () => {
    const valid = await trigger();
    if (valid) setCurrentStep((s) => s + 1);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    [...files.birthCert, ...files.senderID, ...files.others].forEach((f) =>
      formData.append('documents', f)
    );
    await receptionApi.create(formData);
    navigate('/gui-tre/trang-thai');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tạo yêu cầu gửi trẻ</h1>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${i <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i + 1}
            </div>
            <span className={`ml-2 text-sm ${i === currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="mx-4 flex-1 h-px bg-gray-200 w-8" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 0 && <Step1 register={register} errors={errors} />}
          {currentStep === 1 && <Step2 register={register} errors={errors} />}
          {currentStep === 2 && <Step3 files={files} setFiles={setFiles} />}

          <div className="flex justify-between mt-6">
            <Button type="button" variant="secondary" onClick={() => currentStep > 0 ? setCurrentStep(s => s - 1) : navigate(-1)}>
              {currentStep === 0 ? 'Hủy' : 'Quay lại'}
            </Button>
            {currentStep < STEPS.length - 1 ? (
              <Button type="button" onClick={nextStep}>Tiếp theo</Button>
            ) : (
              <Button type="submit" loading={isSubmitting}>Gửi yêu cầu</Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
