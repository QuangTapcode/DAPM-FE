import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { inputCls, selectCls, textareaCls, FormField } from '../../components/common/FormField';

/* ─── Constants ───────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Người giao', icon: '👤' },
  { id: 2, label: 'Trẻ em',    icon: '👶' },
  { id: 3, label: 'Lý do',     icon: '📝' },
  { id: 4, label: 'Tài liệu',  icon: '📎' },
];

const REQUIRED_DOCS = [
  { key: 'birthCert',  label: 'Giấy khai sinh của trẻ',            required: true,  hint: 'PDF, JPG — tối đa 5MB' },
  { key: 'senderID',   label: 'CCCD/CMND người giao',               required: true,  hint: 'PDF, JPG — tối đa 5MB' },
  { key: 'healthCert', label: 'Giấy xác nhận tình trạng sức khỏe',  required: false, hint: 'PDF, JPG — tối đa 5MB' },
  { key: 'otherDocs',  label: 'Giấy tờ khác (nếu có)',              required: false, hint: 'PDF, JPG — tối đa 5MB' },
];

/* ─── Shared UI ───────────────────────────────────────── */
function SectionTitle({ icon, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-6">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-lg font-black text-gray-800">{children}</h2>
    </div>
  );
}

function DocRow({ doc, file, onChange }) {
  const ref = useRef();
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200
      ${file ? 'border-green-200 bg-green-50' : doc.required ? 'border-gray-200 bg-white hover:border-blue-200' : 'border-dashed border-gray-200 bg-gray-50 hover:border-blue-200'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0
        ${file ? 'bg-green-100' : 'bg-gray-100'}`}>
        {file ? '✅' : '📄'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-gray-800">{doc.label}</p>
          {doc.required && <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">Bắt buộc</span>}
        </div>
        {file
          ? <p className="text-xs text-green-600 font-semibold mt-0.5 truncate">{file.name}</p>
          : <p className="text-xs text-gray-400 mt-0.5">{doc.hint}</p>
        }
      </div>
      <button type="button" onClick={() => ref.current.click()}
        className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition
          ${file ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-[#1d4ed8] bg-blue-50 hover:bg-blue-100'}`}>
        {file ? 'Đổi file' : 'Tải lên'}
      </button>
      <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
        onChange={e => onChange(e.target.files[0] || null)} />
    </div>
  );
}

/* ─── Steps ───────────────────────────────────────────── */
function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, i) => {
        const done    = step.id < current;
        const active  = step.id === current;
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300
                ${done   ? 'bg-green-500 text-white shadow-md shadow-green-200' :
                  active ? 'bg-[#1d4ed8] text-white shadow-md shadow-blue-200 scale-110' :
                           'bg-gray-100 text-gray-400'}`}>
                {done ? '✓' : step.icon}
              </div>
              <p className={`text-[11px] font-bold mt-1.5 hidden sm:block transition-colors
                ${active ? 'text-[#1d4ed8]' : done ? 'text-green-500' : 'text-gray-400'}`}>
                {step.label}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${step.id < current ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Step panels ─────────────────────────────────────── */
function Step1({ register, errors }) {
  return (
    <div className="space-y-5">
      <SectionTitle icon="👤">Thông tin người giao trẻ</SectionTitle>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Họ và tên người giao" required error={errors.senderName?.message}>
          <input {...register('senderName', { required: 'Vui lòng nhập họ tên' })} className={inputCls} placeholder="Nguyễn Văn A" />
        </FormField>
        <FormField label="Quan hệ với trẻ" required error={errors.relationship?.message}>
          <select {...register('relationship', { required: 'Vui lòng chọn' })} className={selectCls}>
            <option value="">-- Chọn quan hệ --</option>
            <option value="cha_me">Cha / Mẹ</option>
            <option value="ong_ba">Ông / Bà</option>
            <option value="anh_chi">Anh / Chị</option>
            <option value="nguoi_than">Người thân khác</option>
            <option value="khac">Khác</option>
          </select>
        </FormField>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="CCCD / CMND" required error={errors.senderNationalId?.message}>
          <input {...register('senderNationalId', {
            required: 'Vui lòng nhập số CCCD',
            pattern: { value: /^\d{9,12}$/, message: 'Số CCCD không hợp lệ' }
          })} className={inputCls} placeholder="012345678901" maxLength={12} />
        </FormField>
        <FormField label="Số điện thoại" required error={errors.senderPhone?.message}>
          <input {...register('senderPhone', {
            required: 'Vui lòng nhập số điện thoại',
            pattern: { value: /^0\d{9}$/, message: 'Số điện thoại không hợp lệ' }
          })} className={inputCls} placeholder="0901 234 567" maxLength={10} />
        </FormField>
      </div>
      <FormField label="Địa chỉ thường trú" required error={errors.senderAddress?.message}>
        <input {...register('senderAddress', { required: 'Vui lòng nhập địa chỉ' })}
          className={inputCls} placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành" />
      </FormField>
    </div>
  );
}

function Step2({ register, errors }) {
  return (
    <div className="space-y-5">
      <SectionTitle icon="👶">Thông tin trẻ em</SectionTitle>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Họ và tên trẻ" required error={errors.childName?.message}>
          <input {...register('childName', { required: 'Vui lòng nhập tên trẻ' })} className={inputCls} placeholder="Nguyễn Thị B" />
        </FormField>
        <FormField label="Ngày sinh" required error={errors.childDob?.message}>
          <input type="date" {...register('childDob', { required: 'Vui lòng chọn ngày sinh' })} className={inputCls} />
        </FormField>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
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
        <input {...register('childAddress')} className={inputCls} placeholder="Nếu khác với người giao" />
      </FormField>
      <FormField label="Tình trạng sức khoẻ hiện tại">
        <textarea {...register('healthStatus')} rows={3} className={textareaCls}
          placeholder="Mô tả tình trạng sức khoẻ, bệnh lý nếu có..." />
      </FormField>
    </div>
  );
}

function Step3({ register, errors }) {
  return (
    <div className="space-y-5">
      <SectionTitle icon="📝">Lý do giao trẻ</SectionTitle>
      <FormField label="Lý do chính" required error={errors.reason?.message}>
        <select {...register('reason', { required: 'Vui lòng chọn lý do' })} className={selectCls}>
          <option value="">-- Chọn lý do chính --</option>
          <option value="mo_coi">Trẻ mồ côi (cha mẹ qua đời)</option>
          <option value="kinh_te">Hoàn cảnh kinh tế khó khăn</option>
          <option value="suc_khoe">Cha / Mẹ bệnh nặng, không thể chăm sóc</option>
          <option value="xa_hoi">Hoàn cảnh xã hội đặc biệt</option>
          <option value="khac">Lý do khác</option>
        </select>
      </FormField>
      <FormField label="Mô tả chi tiết hoàn cảnh" required error={errors.reasonDetail?.message}>
        <textarea {...register('reasonDetail', { required: 'Vui lòng mô tả chi tiết', minLength: { value: 30, message: 'Tối thiểu 30 ký tự' } })}
          rows={6} className={textareaCls}
          placeholder="Mô tả chi tiết hoàn cảnh gia đình và lý do cần gửi trẻ vào trung tâm bảo trợ. Vui lòng cung cấp thông tin đầy đủ để hồ sơ được xét duyệt nhanh chóng..." />
      </FormField>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <span className="text-lg flex-shrink-0">💡</span>
        <div>
          <p className="text-sm font-bold text-amber-800 mb-1">Lưu ý</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            Thông tin bạn cung cấp sẽ được cán bộ tiếp nhận xem xét. Hãy mô tả trung thực và đầy đủ để hồ sơ được xử lý nhanh nhất.
          </p>
        </div>
      </div>
    </div>
  );
}

function Step4({ docs, setDocs }) {
  const uploaded = Object.values(docs).filter(Boolean).length;
  const pct      = Math.round((uploaded / REQUIRED_DOCS.length) * 100);
  return (
    <div className="space-y-5">
      <SectionTitle icon="📎">Tài liệu đính kèm</SectionTitle>

      {/* Progress */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-gray-700">Tiến độ tải lên</p>
          <p className="text-sm font-black text-[#1d4ed8]">{uploaded}/{REQUIRED_DOCS.length} tài liệu</p>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#1d4ed8] to-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">PDF, JPG, PNG — Tối đa 5MB mỗi file</p>
      </div>

      <div className="space-y-3">
        {REQUIRED_DOCS.map(doc => (
          <DocRow key={doc.key} doc={doc} file={docs[doc.key]}
            onChange={f => setDocs(prev => ({ ...prev, [doc.key]: f }))} />
        ))}
      </div>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────── */
export default function CreateChildRequest() {
  const navigate = useNavigate();
  const [step, setStep]   = useState(1);
  const [docs, setDocs]   = useState({});
  const [dir, setDir]     = useState('forward'); // for animation direction
  const [visible, setVisible] = useState(true);

  const { register, handleSubmit, trigger, getValues, formState: { errors, isSubmitting } } = useForm({ mode: 'onChange' });

  /* Step field mapping */
  const STEP_FIELDS = {
    1: ['senderName', 'relationship', 'senderNationalId', 'senderPhone', 'senderAddress'],
    2: ['childName', 'childDob'],
    3: ['reason', 'reasonDetail'],
  };

  const goNext = async () => {
    if (step < 4) {
      const fields = STEP_FIELDS[step];
      const ok = fields ? await trigger(fields) : true;
      if (!ok) return;
    }
    animateTo(step + 1, 'forward');
  };

  const goPrev = () => animateTo(step - 1, 'back');

  const animateTo = (target, direction) => {
    setDir(direction);
    setVisible(false);
    setTimeout(() => {
      setStep(target);
      setVisible(true);
    }, 220);
  };

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 1000));
    navigate('/gui-tre/trang-thai');
  };

  const uploadedCount   = Object.values(docs).filter(Boolean).length;
  const requiredMissing = REQUIRED_DOCS.filter(d => d.required && !docs[d.key]).length;

  return (
    <div className="max-w-3xl mx-auto" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ── Page header ─────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <button onClick={() => navigate('/gui-tre/dashboard')} className="hover:text-[#1d4ed8] transition-colors font-medium">Tổng quan</button>
          <span>/</span>
          <span className="text-gray-600 font-semibold">Tạo yêu cầu giao trẻ</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900">Tạo yêu cầu giao trẻ</h1>
        <p className="text-sm text-gray-500 mt-1">Điền đầy đủ thông tin để hồ sơ được xét duyệt nhanh chóng</p>
      </div>

      {/* ── Step indicator ──────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">
        <StepIndicator current={step} total={STEPS.length} />

        {/* Step content with transition */}
        <div
          className="transition-all duration-200"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : dir === 'forward' ? 'translateX(20px)' : 'translateX(-20px)',
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && <Step1 register={register} errors={errors} />}
            {step === 2 && <Step2 register={register} errors={errors} />}
            {step === 3 && <Step3 register={register} errors={errors} />}
            {step === 4 && <Step4 docs={docs} setDocs={setDocs} />}

            {/* ── Navigation buttons ── */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={goPrev}
                disabled={step === 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" />
                </svg>
                Quay lại
              </button>

              <div className="flex items-center gap-1">
                {STEPS.map(s => (
                  <div key={s.id} className={`h-1.5 rounded-full transition-all duration-300
                    ${s.id === step ? 'w-6 bg-[#1d4ed8]' : s.id < step ? 'w-3 bg-green-400' : 'w-3 bg-gray-200'}`} />
                ))}
              </div>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-sm transition shadow-md shadow-blue-200"
                >
                  Tiếp theo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || requiredMissing > 0}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm transition shadow-md shadow-orange-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                      </svg>
                      Gửi hồ sơ
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ── Info strip ──────────────────────────────────── */}
      {step === 4 && requiredMissing > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">⚠️</span>
          <div>
            <p className="text-sm font-bold text-red-700">Còn thiếu tài liệu bắt buộc</p>
            <p className="text-xs text-red-600 mt-0.5">
              Vui lòng tải lên {requiredMissing} tài liệu bắt buộc trước khi gửi hồ sơ.
            </p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 mt-4">
        <span className="text-lg flex-shrink-0">📞</span>
        <div>
          <p className="text-sm font-bold text-[#1d4ed8]">Đường dây hỗ trợ</p>
          <p className="text-xs text-blue-700 mt-0.5">
            <strong>1800 599 920</strong> — Miễn phí · 7:00–17:00 (Thứ 2 – Thứ 6)
          </p>
        </div>
      </div>
    </div>
  );
}
