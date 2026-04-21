import { useRef, useState } from 'react';
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

const card28 = 'rounded-[28px] border border-[#E3ECF8] bg-white shadow-[0_14px_36px_rgba(42,74,122,0.08)]';

const adoptInputCls = [
  'w-full rounded-2xl border border-[#D8E6F5] bg-white px-4 py-3 text-[15px] text-slate-800',
  'outline-none transition focus:border-[#2F80ED] focus:ring-4 focus:ring-blue-100',
].join(' ');

const adoptSelectCls = adoptInputCls + ' cursor-pointer';
const adoptTextareaCls = adoptInputCls;

/* ─── Shared UI ───────────────────────────────────────── */
function SectionTitle({ icon, children }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-[18px] font-bold text-[#0D47A1]">{children}</h2>
    </div>
  );
}

function FieldLabel({ label, required }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8] mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function DocRow({ doc, file, onChange }) {
  const ref = useRef();
  return (
    <div className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200
      ${file ? 'border-emerald-200 bg-emerald-50' : doc.required ? 'border-[#DCE8F7] bg-[#F7FBFF] hover:border-[#2F80ED]' : 'border-dashed border-[#DCE8F7] bg-[#F7FBFF] hover:border-[#2F80ED]'}`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0
        ${file ? 'bg-emerald-100' : 'bg-[#EAF3FF]'}`}>
        {file ? '✅' : '📄'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-[#334155]">{doc.label}</p>
          {doc.required && <span className="text-[10px] bg-red-50 text-red-500 font-bold px-1.5 py-0.5 rounded border border-red-200">Bắt buộc</span>}
        </div>
        {file
          ? <p className="text-xs text-emerald-600 font-semibold mt-0.5 truncate">{file.name}</p>
          : <p className="text-xs text-[#8FA0B8] mt-0.5">{doc.hint}</p>
        }
      </div>
      <button type="button" onClick={() => ref.current.click()}
        className={`flex-shrink-0 text-xs font-bold px-4 py-1.5 rounded-2xl transition
          ${file ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200' : 'text-[#0D47A1] bg-[#EAF3FF] hover:bg-[#D8EAF9]'}`}>
        {file ? 'Đổi file' : 'Tải lên'}
      </button>
      <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
        onChange={e => onChange(e.target.files[0] || null)} />
    </div>
  );
}

/* ─── Step Indicator ──────────────────────────────────── */
function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, i) => {
        const done   = step.id < current;
        const active = step.id === current;
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                ${done   ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' :
                  active ? 'bg-[#0D47A1] text-white ring-4 ring-[#DCE8F9]' :
                           'bg-[#EAF3FF] text-[#8FA0B8]'}`}>
                {done ? '✓' : step.icon}
              </div>
              <p className={`text-[11px] font-bold mt-1.5 hidden sm:block tracking-wide transition-colors
                ${active ? 'text-[#0D47A1]' : done ? 'text-emerald-500' : 'text-[#8FA0B8]'}`}>
                {step.label}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${step.id < current ? 'bg-emerald-300' : 'bg-[#E3ECF8]'}`} />
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
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel label="Họ và tên người giao" required />
          <input {...register('senderName', { required: 'Vui lòng nhập họ tên' })} className={adoptInputCls} placeholder="Nguyễn Văn A" />
          {errors.senderName && <p className="text-xs text-red-500 mt-1">{errors.senderName.message}</p>}
        </div>
        <div>
          <FieldLabel label="Quan hệ với trẻ" required />
          <select {...register('relationship', { required: 'Vui lòng chọn' })} className={adoptSelectCls}>
            <option value="">-- Chọn quan hệ --</option>
            <option value="cha_me">Cha / Mẹ</option>
            <option value="ong_ba">Ông / Bà</option>
            <option value="anh_chi">Anh / Chị</option>
            <option value="nguoi_than">Người thân khác</option>
            <option value="khac">Khác</option>
          </select>
          {errors.relationship && <p className="text-xs text-red-500 mt-1">{errors.relationship.message}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel label="CCCD / CMND" required />
          <input {...register('senderNationalId', {
            required: 'Vui lòng nhập số CCCD',
            pattern: { value: /^\d{9,12}$/, message: 'Số CCCD không hợp lệ' }
          })} className={adoptInputCls} placeholder="012345678901" maxLength={12} />
          {errors.senderNationalId && <p className="text-xs text-red-500 mt-1">{errors.senderNationalId.message}</p>}
        </div>
        <div>
          <FieldLabel label="Số điện thoại" required />
          <input {...register('senderPhone', {
            required: 'Vui lòng nhập số điện thoại',
            pattern: { value: /^0\d{9}$/, message: 'Số điện thoại không hợp lệ' }
          })} className={adoptInputCls} placeholder="0901 234 567" maxLength={10} />
          {errors.senderPhone && <p className="text-xs text-red-500 mt-1">{errors.senderPhone.message}</p>}
        </div>
      </div>
      <div>
        <FieldLabel label="Địa chỉ thường trú" required />
        <input {...register('senderAddress', { required: 'Vui lòng nhập địa chỉ' })}
          className={adoptInputCls} placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành" />
        {errors.senderAddress && <p className="text-xs text-red-500 mt-1">{errors.senderAddress.message}</p>}
      </div>
    </div>
  );
}

function Step2({ register, errors }) {
  return (
    <div className="space-y-5">
      <SectionTitle icon="👶">Thông tin trẻ em</SectionTitle>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel label="Họ và tên trẻ" required />
          <input {...register('childName', { required: 'Vui lòng nhập tên trẻ' })} className={adoptInputCls} placeholder="Nguyễn Thị B" />
          {errors.childName && <p className="text-xs text-red-500 mt-1">{errors.childName.message}</p>}
        </div>
        <div>
          <FieldLabel label="Ngày sinh" required />
          <input type="date" {...register('childDob', { required: 'Vui lòng chọn ngày sinh' })} className={adoptInputCls} />
          {errors.childDob && <p className="text-xs text-red-500 mt-1">{errors.childDob.message}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel label="Giới tính" />
          <select {...register('childGender')} className={adoptSelectCls}>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>
        <div>
          <FieldLabel label="Dân tộc" />
          <input {...register('ethnicity')} className={adoptInputCls} placeholder="Kinh, Tày, Nùng..." />
        </div>
      </div>
      <div>
        <FieldLabel label="Địa chỉ thường trú của trẻ" />
        <input {...register('childAddress')} className={adoptInputCls} placeholder="Nếu khác với người giao" />
      </div>
      <div>
        <FieldLabel label="Tình trạng sức khoẻ hiện tại" />
        <textarea {...register('healthStatus')} rows={3} className={adoptTextareaCls}
          placeholder="Mô tả tình trạng sức khoẻ, bệnh lý nếu có..." />
      </div>
    </div>
  );
}

function Step3({ register, errors }) {
  return (
    <div className="space-y-5">
      <SectionTitle icon="📝">Lý do giao trẻ</SectionTitle>
      <div>
        <FieldLabel label="Lý do chính" required />
        <select {...register('reason', { required: 'Vui lòng chọn lý do' })} className={adoptSelectCls}>
          <option value="">-- Chọn lý do chính --</option>
          <option value="mo_coi">Trẻ mồ côi (cha mẹ qua đời)</option>
          <option value="kinh_te">Hoàn cảnh kinh tế khó khăn</option>
          <option value="suc_khoe">Cha / Mẹ bệnh nặng, không thể chăm sóc</option>
          <option value="xa_hoi">Hoàn cảnh xã hội đặc biệt</option>
          <option value="khac">Lý do khác</option>
        </select>
        {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>}
      </div>
      <div>
        <FieldLabel label="Mô tả chi tiết hoàn cảnh" required />
        <textarea {...register('reasonDetail', { required: 'Vui lòng mô tả chi tiết', minLength: { value: 30, message: 'Tối thiểu 30 ký tự' } })}
          rows={6} className={adoptTextareaCls}
          placeholder="Mô tả chi tiết hoàn cảnh gia đình và lý do cần gửi trẻ vào trung tâm bảo trợ..." />
        {errors.reasonDetail && <p className="text-xs text-red-500 mt-1">{errors.reasonDetail.message}</p>}
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
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

      <div className="bg-[#F7FBFF] rounded-2xl p-4 border border-[#DCE8F7]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8]">Tiến độ tải lên</p>
          <p className="text-sm font-bold text-[#0D47A1]">{uploaded}/{REQUIRED_DOCS.length} tài liệu</p>
        </div>
        <div className="h-2.5 bg-[#E3ECF8] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#0D47A1] to-[#2196F3] rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-[#8FA0B8] mt-1.5">PDF, JPG, PNG — Tối đa 5MB mỗi file</p>
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
  const [dir, setDir]     = useState('forward');
  const [visible, setVisible] = useState(true);

  const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm({ mode: 'onChange' });

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
    setTimeout(() => { setStep(target); setVisible(true); }, 220);
  };

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 1000));
    navigate('/gui-tre/trang-thai');
  };

  const requiredMissing = REQUIRED_DOCS.filter(d => d.required && !docs[d.key]).length;

  return (
    <div className="min-h-screen bg-[#F5F9FE]">
      <div className="mx-auto max-w-[860px] px-4 py-6 sm:px-6 lg:px-8 space-y-5">

        {/* ── Page header ─────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#8FA0B8] mb-2">
            <button onClick={() => navigate('/gui-tre/dashboard')} className="hover:text-[#0D47A1] transition-colors">Tổng quan</button>
            <span>/</span>
            <span className="text-[#334155]">Tạo yêu cầu giao trẻ</span>
          </div>
          <h1 className="text-[36px] font-bold text-[#0D47A1] leading-none">Tạo yêu cầu giao trẻ</h1>
          <p className="text-sm text-[#8FA0B8] mt-2">Điền đầy đủ thông tin để hồ sơ được xét duyệt nhanh chóng</p>
        </div>

        {/* ── Step form ──────────────────────────────────── */}
        <div className={`${card28} p-6 sm:p-8`}>
          <StepIndicator current={step} />

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

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E3ECF8]">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={step === 1}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl border-2 border-[#DCE8F7] text-[#5F81BC] font-semibold text-sm hover:border-[#0D47A1] hover:text-[#0D47A1] disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  ← Quay lại
                </button>

                <div className="flex items-center gap-1.5">
                  {STEPS.map(s => (
                    <div key={s.id} className={`h-1.5 rounded-full transition-all duration-300
                      ${s.id === step ? 'w-6 bg-[#0D47A1]' : s.id < step ? 'w-3 bg-emerald-400' : 'w-3 bg-[#E3ECF8]'}`} />
                  ))}
                </div>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#0D47A1] hover:bg-[#1565C0] text-white font-semibold text-sm transition shadow-md shadow-blue-200"
                  >
                    Tiếp theo →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || requiredMissing > 0}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#0D47A1] hover:bg-[#1565C0] disabled:bg-[#8FA0B8] disabled:cursor-not-allowed text-white font-semibold text-sm transition shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Đang gửi...
                      </>
                    ) : '📤 Gửi hồ sơ'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Info strips */}
        {step === 4 && requiredMissing > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-bold text-red-700">Còn thiếu tài liệu bắt buộc</p>
              <p className="text-xs text-red-600 mt-0.5">Vui lòng tải lên {requiredMissing} tài liệu bắt buộc trước khi gửi hồ sơ.</p>
            </div>
          </div>
        )}

        <div className="bg-[#EAF3FF] border border-[#DCE8F7] rounded-2xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">📞</span>
          <div>
            <p className="text-sm font-bold text-[#0D47A1]">Đường dây hỗ trợ</p>
            <p className="text-xs text-[#5F81BC] mt-0.5">
              <strong>1800 599 920</strong> — Miễn phí · 7:00–17:00 (Thứ 2 – Thứ 6)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
