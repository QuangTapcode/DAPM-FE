import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import { FormField, inputCls, selectCls, textareaCls } from '../../components/common/FormField';

// ─── Document checklist ──────────────────────────────
const REQUIRED_DOCS = [
  { key: 'birthCert',    label: 'Giấy khai sinh của trẻ',           required: true  },
  { key: 'senderID',     label: 'CCCD/CMND người giao',              required: true  },
  { key: 'healthCert',   label: 'Giấy xác nhận tình trạng sức khỏe', required: false },
  { key: 'otherDocs',    label: 'Giấy tờ khác (nếu có)',             required: false },
];

function DocRow({ doc, file, onChange }) {
  const ref = useRef();
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
          file ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
        }`}>
          {file ? '✓' : '○'}
        </div>
        <div className="min-w-0">
          <span className="text-sm text-gray-700 truncate block">{doc.label}</span>
          {doc.required && <span className="text-[10px] text-red-400">* Bắt buộc</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        {file && <span className="text-xs text-gray-400 max-w-[80px] truncate">{file.name}</span>}
        <button type="button" onClick={() => ref.current.click()}
          className="text-xs text-[#1d4ed8] hover:underline font-medium">
          {file ? 'Đổi file' : 'Tải lên'}
        </button>
        <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
          onChange={e => onChange(e.target.files[0] || null)} />
      </div>
    </div>
  );
}

export default function CreateChildRequest() {
  const navigate  = useNavigate();
  const [docs, setDocs] = useState({});
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 800));
    navigate('/gui-tre/trang-thai');
  };

  const uploadedCount  = Object.values(docs).filter(Boolean).length;
  const requiredMissing = REQUIRED_DOCS.filter(d => d.required && !docs[d.key]).length;

  return (
    <div>
      <PageHeader
        title="Tạo yêu cầu gửi trẻ"
        breadcrumbs={[
          { label: 'Trang chủ',     to: '/gui-tre/dashboard' },
          { label: 'Yêu cầu của tôi', to: '/gui-tre/trang-thai' },
          { label: 'Tạo yêu cầu mới' },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-5">
          {/* ── Left: form sections ── */}
          <div className="col-span-2 space-y-4">

            {/* 1. Người gửi trẻ */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#1d4ed8] px-5 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                </svg>
                <p className="text-white font-semibold text-sm">Thông tin người gửi trẻ</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Họ và tên người giao" required error={errors.senderName?.message}>
                    <input {...register('senderName', { required: 'Bắt buộc' })} className={inputCls} />
                  </FormField>
                  <FormField label="Quan hệ với trẻ" required error={errors.relationship?.message}>
                    <select {...register('relationship', { required: 'Bắt buộc' })} className={selectCls}>
                      <option value="">-- Chọn --</option>
                      <option value="cha_me">Cha/Mẹ</option>
                      <option value="ong_ba">Ông/Bà</option>
                      <option value="anh_chi">Anh/Chị</option>
                      <option value="nguoi_than">Người thân khác</option>
                      <option value="khac">Khác</option>
                    </select>
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="CCCD / CMND" required error={errors.senderNationalId?.message}>
                    <input {...register('senderNationalId', { required: 'Bắt buộc' })} className={inputCls} placeholder="012345678901" />
                  </FormField>
                  <FormField label="Số điện thoại" required error={errors.senderPhone?.message}>
                    <input {...register('senderPhone', { required: 'Bắt buộc' })} className={inputCls} placeholder="0901 234 567" />
                  </FormField>
                </div>
                <FormField label="Địa chỉ thường trú" required error={errors.senderAddress?.message}>
                  <input {...register('senderAddress', { required: 'Bắt buộc' })} className={inputCls} placeholder="Số nhà, Tên đường, Phường/Xã..." />
                </FormField>
              </div>
            </div>

            {/* 2. Thông tin trẻ */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#1d4ed8] px-5 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
                <p className="text-white font-semibold text-sm">Thông tin trẻ</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Họ và tên trẻ" required error={errors.childName?.message}>
                    <input {...register('childName', { required: 'Bắt buộc' })} className={inputCls} />
                  </FormField>
                  <FormField label="Ngày sinh" required error={errors.childDob?.message}>
                    <input type="date" {...register('childDob', { required: 'Bắt buộc' })} className={inputCls} />
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Giới tính">
                    <select {...register('childGender')} className={selectCls}>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </FormField>
                  <FormField label="Dân tộc">
                    <input {...register('ethnicity')} className={inputCls} placeholder="Kinh, Tày, Nùng..." />
                  </FormField>
                </div>
                <FormField label="Địa chỉ thường trú của trẻ">
                  <input {...register('childAddress')} className={inputCls} placeholder="Số nhà, Tên đường, Phường/Xã..." />
                </FormField>
                <FormField label="Tình trạng sức khỏe">
                  <textarea {...register('healthStatus')} rows={2} className={textareaCls}
                    placeholder="Mô tả tình trạng sức khỏe hiện tại của trẻ..." />
                </FormField>
              </div>
            </div>

            {/* 3. Lý do gửi trẻ */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#1d4ed8] px-5 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <p className="text-white font-semibold text-sm">Lý do gửi trẻ</p>
              </div>
              <div className="p-5 space-y-4">
                <FormField label="Lý do chính" required error={errors.reason?.message}>
                  <select {...register('reason', { required: 'Bắt buộc' })} className={selectCls}>
                    <option value="">-- Chọn lý do --</option>
                    <option value="mo_coi">Trẻ mồ côi (cha mẹ mất)</option>
                    <option value="kinh_te">Hoàn cảnh kinh tế khó khăn</option>
                    <option value="suc_khoe">Cha/mẹ bệnh nặng, không thể chăm sóc</option>
                    <option value="xa_hoi">Hoàn cảnh xã hội đặc biệt</option>
                    <option value="khac">Lý do khác</option>
                  </select>
                </FormField>
                <FormField label="Mô tả chi tiết" required error={errors.reasonDetail?.message}>
                  <textarea {...register('reasonDetail', { required: 'Bắt buộc' })} rows={4} className={textareaCls}
                    placeholder="Mô tả chi tiết hoàn cảnh gia đình và lý do cần gửi trẻ vào trung tâm..." />
                </FormField>
              </div>
            </div>

            {/* 4. Tài liệu đính kèm */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#1d4ed8] px-5 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                </svg>
                <p className="text-white font-semibold text-sm">Tài liệu đính kèm</p>
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Đã tải lên {uploadedCount}/{REQUIRED_DOCS.length} tài liệu
                    {requiredMissing > 0 && <span className="text-red-400 ml-1">({requiredMissing} bắt buộc còn thiếu)</span>}
                  </p>
                  <span className="text-xs text-gray-400">PDF, JPG, PNG • Tối đa 5MB</span>
                </div>
                <div>
                  {REQUIRED_DOCS.map(doc => (
                    <DocRow
                      key={doc.key}
                      doc={doc}
                      file={docs[doc.key]}
                      onChange={f => setDocs(prev => ({ ...prev, [doc.key]: f }))}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: status sidebar ── */}
          <div className="space-y-4">
            {/* Submit card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#1d4ed8] px-5 py-3">
                <p className="text-white font-semibold text-sm">Gửi đơn đăng ký</p>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Sau khi gửi, hồ sơ sẽ được cán bộ tiếp nhận xem xét trong vòng <strong>3–5 ngày làm việc</strong>.
                </p>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Tài liệu</span>
                    <span>{uploadedCount}/{REQUIRED_DOCS.length}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-[#1d4ed8] transition-all"
                      style={{ width: `${(uploadedCount / REQUIRED_DOCS.length) * 100}%` }} />
                  </div>
                </div>

                <Button type="submit" variant="accent" fullWidth loading={isSubmitting}
                  icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>}>
                  Gửi Đơn Đăng Ký
                </Button>
                <Button type="button" variant="secondary" fullWidth onClick={() => navigate('/gui-tre/dashboard')}>
                  Hủy
                </Button>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-700">Danh sách kiểm tra</p>
              </div>
              <div className="p-4 space-y-2.5">
                {[
                  'Điền đầy đủ thông tin người giao',
                  'Điền đầy đủ thông tin trẻ',
                  'Chọn lý do gửi trẻ',
                  'Tải lên giấy khai sinh',
                  'Tải lên CCCD người giao',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">○</div>
                    <p className="text-xs text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotline */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-[#1d4ed8] mb-1">Cần hỗ trợ?</p>
              <p className="text-xs text-gray-500 mb-2">Liên hệ đường dây hỗ trợ</p>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#1d4ed8] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold text-[#1d4ed8]">1800 599 920</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Miễn phí • 7:00 – 17:00 (T2–T6)</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
