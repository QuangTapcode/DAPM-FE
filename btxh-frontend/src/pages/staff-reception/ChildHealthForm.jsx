import { useState } from 'react';
import { useParams, Link, NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/common/Button';
import { inputCls, textareaCls, FormField } from '../../components/common/FormField';

// ─── Mock data ──────────────────────────────────────
const MOCK_CHILD = {
  id: 'HS002',
  fullName: 'Lê Văn Tuấn',
  code: 'MS HS: 43-2024-009',
  status: 'Tiếp Nhận',
  lastUpdate: 'Lần cập nhật: 12/06/2024',
  avatar: 'T',
  height: 112,
  weight: 19.5,
  bmi: 15.5,
  bloodType: 'O+',
};

const MOCK_VACCINES = [
  { id: 1, name: 'Viêm gan B (Hepatitis B)', date: '15/01/2024', done: true },
  { id: 2, name: 'Bại liệt (Polio)',          date: '02/03/2024', done: true },
  { id: 3, name: 'Sởi – Quai bị – Rubella (MMR)', date: '20/11/2024', done: false },
];

const MOCK_HISTORY = [
  { date: '06/09/2024', note: 'Cảm cúm nhẹ tháng 9',          tags: [] },
  { date: '21/08/2024', note: 'Cập nhật chiều cao, cân nặng định kỳ', tags: ['Chiều cao', 'Cân nặng'] },
  { date: '10/08/2024', note: 'Yêu cầu bổ sung',               tags: ['Thiếu hồ sơ'] },
  { date: '01/08/2024', note: 'Cần chú ý dinh dưỡng hàng tháng', tags: [] },
];

const SIDEBAR_MENU = [
  { to: '', label: 'Chỉ số mỡ cấu', exact: true },
  { to: 'vaccine',  label: 'Tiêm chủng' },
  { to: 'lich-su',  label: 'Lịch sử tạy' },
];

function MetricCard({ label, value, unit, accent, sub }) {
  const colors = {
    blue:  'text-[#1d4ed8]  bg-blue-50',
    green: 'text-green-700 bg-green-50',
    orange:'text-orange-600 bg-orange-50',
    red:   'text-red-600   bg-red-50',
  }[accent] ?? 'text-gray-700 bg-gray-50';
  return (
    <div className={`rounded-xl px-5 py-4 ${colors.split(' ')[1]}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-black ${colors.split(' ')[0]}`}>
        {value}<span className="text-sm font-normal ml-1">{unit}</span>
      </p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function ChildHealthPage() {
  const { childId } = useParams();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { checkDate: new Date().toISOString().split('T')[0] },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    reset({ checkDate: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="flex gap-5 min-h-full">
      {/* Left sidebar: child nav */}
      <div className="w-52 flex-shrink-0 space-y-2">
        {/* Child info card */}
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-[#1d4ed8] mx-auto mb-2">
            {MOCK_CHILD.avatar}
          </div>
          <p className="font-semibold text-gray-800 text-sm">{MOCK_CHILD.fullName}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{MOCK_CHILD.code}</p>
        </div>
        {/* Nav */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {SIDEBAR_MENU.map(item => (
            <button key={item.label}
              className="w-full text-left px-4 py-3 text-sm border-b border-gray-50 last:border-0 hover:bg-blue-50 hover:text-[#1d4ed8] transition text-gray-600">
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Child header */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-[#1d4ed8] flex-shrink-0">
            {MOCK_CHILD.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-gray-800">{MOCK_CHILD.fullName}</h1>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                {MOCK_CHILD.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{MOCK_CHILD.code}</p>
            <p className="text-xs text-blue-500 mt-0.5">{MOCK_CHILD.lastUpdate}</p>
          </div>
          <Link to={`/can-bo-tiep-nhan/tre/${childId}/sua`}>
            <Button size="sm" variant="outline">Cập nhật hồ sơ</Button>
          </Link>
        </div>

        {/* Health metrics */}
        <div className="grid grid-cols-4 gap-3">
          <MetricCard label="Chiều cao" value={MOCK_CHILD.height} unit="cm"  accent="blue"  sub="Đạt chuẩn" />
          <MetricCard label="Cân nặng"  value={MOCK_CHILD.weight} unit="kg"  accent="green" sub="Bình thường" />
          <MetricCard label="BMI"       value={MOCK_CHILD.bmi}    unit=""    accent="orange" sub="Thiếu cân nhẹ" />
          <MetricCard label="Nhóm máu"  value={MOCK_CHILD.bloodType} unit="" accent="red"  sub="Rh dương" />
        </div>

        {/* Update form + vaccines */}
        <div className="grid grid-cols-5 gap-4">
          {/* Update form */}
          <div className="col-span-3 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-[#1d4ed8] px-5 py-3">
              <p className="text-white font-semibold text-sm">Cập nhật tình trạng sức khỏe</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <FormField label="Chiều cao (cm)">
                  <input {...register('height')} placeholder="Vd: 113" className={inputCls} />
                </FormField>
                <FormField label="Cân nặng (kg)">
                  <input {...register('weight')} placeholder="Vd: 20.0" className={inputCls} />
                </FormField>
                <FormField label="Ngày đo">
                  <input type="date" {...register('checkDate')} className={inputCls} />
                </FormField>
              </div>
              <FormField label="Ghi chú (Thầy thuốc)">
                <textarea {...register('notes')} rows={3} placeholder="Nhập tình trạng sức khỏe, lưu ý điều trị..." className={textareaCls} />
              </FormField>
              <div className="flex gap-2 mt-4">
                <Button type="submit" variant="primary" size="sm" loading={saving}>Lưu cập nhật</Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => reset()}>Hủy</Button>
              </div>
            </form>
          </div>

          {/* Vaccine list */}
          <div className="col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-[#1d4ed8] px-5 py-3 flex items-center justify-between">
              <p className="text-white font-semibold text-sm">Danh sách Vaccine tiêm chủng</p>
              <button className="text-blue-200 hover:text-white text-xs">Xem tất cả</button>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_VACCINES.map(v => (
                <div key={v.id} className="px-4 py-3 flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    v.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {v.done ? '✓' : '○'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{v.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{v.done ? 'Đã tiêm' : 'Chưa tiêm'} &bull; {v.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: History panel */}
      <div className="w-56 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-4">
          <div className="bg-[#1d4ed8] px-4 py-3">
            <p className="text-white font-semibold text-sm">Lịch sử tạy & Ghi chú</p>
          </div>
          <div className="divide-y divide-gray-50">
            {MOCK_HISTORY.map((h, i) => (
              <div key={i} className="px-4 py-3">
                <p className="text-[11px] text-gray-400 mb-1">{h.date}</p>
                <p className="text-xs text-gray-700">{h.note}</p>
                {h.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {h.tags.map(t => (
                      <span key={t} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
