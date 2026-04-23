import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Download,
  Info,
  CalendarDays,
  UserCheck,
  UserRound,
  MapPin,
  FileText,
  Phone,
  IdCard,
  Briefcase,
} from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import adoptionApi from '../../api/adoptionApi';
import { REQUEST_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

const STATUS = {
  CREATED: 'created',
  PENDING: REQUEST_STATUS?.PENDING || 'PENDING',
  REVIEWING: REQUEST_STATUS?.REVIEWING || 'REVIEWING',
  MISSING_INFO: REQUEST_STATUS?.MISSING_INFO || 'MISSING_INFO',
  APPROVED: REQUEST_STATUS?.APPROVED || 'APPROVED',
  REJECTED: REQUEST_STATUS?.REJECTED || 'REJECTED',
};

const STEPS = [
  { key: 1, label: 'ĐÃ NỘP ĐƠN' },
  { key: 2, label: 'ĐANG XEM XÉT' },
  { key: 3, label: 'YÊU CẦU BỔ SUNG' },
  { key: 4, label: 'ĐÃ PHÊ DUYỆT' },
];

function getCurrentStep(status) {
  switch (status) {
    case STATUS.CREATED:
    case STATUS.PENDING:
      return 1;
    case STATUS.REVIEWING:
      return 2;
    case STATUS.MISSING_INFO:
    case STATUS.REJECTED:
      return 3;
    case STATUS.APPROVED:
      return 4;
    default:
      return 1;
  }
}

function getStatusText(status) {
  switch (status) {
    case STATUS.CREATED:
      return 'ĐANG XỬ LÝ';
    case STATUS.PENDING:
      return 'ĐÃ NỘP';
    case STATUS.REVIEWING:
      return 'ĐANG XEM XÉT';
    case STATUS.MISSING_INFO:
      return 'CẦN BỔ SUNG';
    case STATUS.APPROVED:
      return 'ĐÃ PHÊ DUYỆT';
    case STATUS.REJECTED:
      return 'ĐÃ TỪ CHỐI';
    default:
      return 'ĐANG XỬ LÝ';
  }
}

function getStatusPillClass(status) {
  switch (status) {
    case STATUS.APPROVED:
      return 'bg-[#E9F8EF] text-[#1D8F56] border border-[#CBEED7]';
    case STATUS.MISSING_INFO:
      return 'bg-[#FFF7E8] text-[#AD7200] border border-[#FFE4AE]';
    case STATUS.REJECTED:
      return 'bg-[#FDEEEF] text-[#C43D4B] border border-[#F7CDD2]';
    case STATUS.REVIEWING:
      return 'bg-[#EEF5FF] text-[#2F6FD6] border border-[#D7E6FF]';
    default:
      return 'bg-[#EEF5FF] text-[#4F6B9A] border border-[#DCE9FA]';
  }
}

function getProgressWidth(step) {
  if (step <= 1) return '0%';
  if (step === 2) return '33.33%';
  if (step === 3) return '66.66%';
  return '100%';
}

function getStoredRequest() {
  try {
    const raw = sessionStorage.getItem('adoption-request-status');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function mapSnapshotToDisplay(snapshot) {
  if (!snapshot) return null;

  const requestCode = snapshot.requestId
    ? `AD-${String(snapshot.requestId).padStart(6, '0')}`
    : 'AD-2024-001';

  return {
    id: snapshot.requestId || 'temp-request',
    code: requestCode,
    title: 'Hồ sơ nhận nuôi bé',
    createdAt: snapshot.createdAt || new Date().toISOString(),
    status: snapshot.status || STATUS.CREATED,
    applicantName: snapshot.adopterName || 'Chưa cập nhật',
    desiredChild: snapshot.expectedChild || 'Chưa cập nhật nguyện vọng',
    preferredArea: snapshot.address || 'Chưa cập nhật khu vực mong muốn',
    coordinatorName: 'Chưa phân công',
    coordinatorAvatar:
      'https://ui-avatars.com/api/?name=Staff&background=E8EEF9&color=5D7AB0',
    approverName: 'Chưa có',
    note:
      snapshot.status === STATUS.CREATED
        ? 'Hồ sơ của bạn đã được tạo thành công và đang chờ tiếp nhận. Chúng tôi sẽ kiểm tra và cập nhật trạng thái trong thời gian sớm nhất.'
        : 'Hồ sơ của bạn đang được xử lý. Chúng tôi sẽ thông báo khi có cập nhật mới.',
    formData: {
      fullName: snapshot.adopterName || '',
      spouseName: '',
      phone: snapshot.phone || '',
      email: '',
      nationalId: snapshot.nationalId || '',
      address: snapshot.address || '',
      occupation: snapshot.occupation || '',
      maritalStatus: '',
      income: snapshot.monthlyIncome || '',
      housing: '',
      reason: snapshot.motivation || '',
      birthDate: snapshot.birthDate || '',
      gender: snapshot.gender || '',
      documents: snapshot.documents || {},
    },
    isTemporary: true,
  };
}

function mapApiItemToDisplay(item) {
  if (!item) return null;

  return {
    id: item.id,
    code: item.code || `AD-${String(item.id).padStart(6, '0')}`,
    title: 'Hồ sơ nhận nuôi',
    createdAt: item.createdAt,
    status: item.status,
    applicantName: item.applicantName || item.adopterName || 'Chưa cập nhật',
    desiredChild: item.expectedChild || 'Chưa cập nhật',
    preferredArea: item.preferredArea || item.address || 'Chưa cập nhật',
    coordinatorName: item.coordinatorName || 'Chưa phân công',
    coordinatorAvatar:
      item.coordinatorAvatar ||
      'https://ui-avatars.com/api/?name=Staff&background=E8EEF9&color=5D7AB0',
    approverName: item.approverName || item.reviewerName || item.approvedBy || 'Chưa có',
    note:
      item.note ||
      item.reason ||
      'Hồ sơ của bạn đang được xử lý. Chúng tôi sẽ thông báo khi có cập nhật mới.',
    formData: {
      fullName: item.adopterName || item.applicantName || '',
      spouseName: item.spouseName || '',
      phone: item.phone || '',
      email: item.email || '',
      nationalId: item.nationalId || '',
      address: item.address || '',
      occupation: item.occupation || '',
      maritalStatus: item.maritalStatus || '',
      income: item.monthlyIncome || item.income || '',
      housing: item.housing || '',
      reason: item.motivation || item.reasonText || '',
      birthDate: item.birthDate || '',
      gender: item.gender || '',
      documents: item.documents || {},
    },
    isTemporary: false,
  };
}

function DetailField({ label, value, icon }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8]">
        {label}
      </p>
      <div className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-[#DCE8F7] bg-[#F7FBFF] px-4 py-3 text-[15px] text-[#334155]">
        {icon ? <span className="text-[#6C8FC7]">{icon}</span> : null}
        <span>{value || '-'}</span>
      </div>
    </div>
  );
}

function LargeField({ label, value }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8]">
        {label}
      </p>
      <div className="min-h-[112px] rounded-2xl border border-[#DCE8F7] bg-[#F7FBFF] px-4 py-4 text-[15px] leading-7 text-[#334155]">
        {value || '-'}
      </div>
    </div>
  );
}

function DocumentCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D6E3F5] bg-[#FAFCFF] p-4">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8FA0B8]">
        {title}
      </p>
      <div className="text-sm leading-6 text-[#4B5C73]">{value || '-'}</div>
    </div>
  );
}

export default function AdoptionStatus() {
  const { user } = useAuth();
  const location = useLocation();
  const { data, loading } = useFetch(adoptionApi.getAll, { adopterId: user?.id });

  const apiItems = data?.items || [];
  const tempRequestFromState = location.state?.request || null;
  const tempRequestFromStorage = getStoredRequest();

  const mergedItems = useMemo(() => {
    const mappedApiItems = apiItems.map(mapApiItemToDisplay);
    const tempSource = tempRequestFromState || tempRequestFromStorage;
    const mappedTemp = mapSnapshotToDisplay(tempSource);

    if (!mappedTemp) return mappedApiItems;

    const existed = mappedApiItems.some(
      (item) =>
        String(item.id) === String(mappedTemp.id) ||
        String(item.code) === String(mappedTemp.code)
    );

    return existed ? mappedApiItems : [mappedTemp, ...mappedApiItems];
  }, [apiItems, tempRequestFromState, tempRequestFromStorage]);

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (mergedItems.length > 0 && !selectedId) {
      setSelectedId(mergedItems[0].id);
    }
  }, [mergedItems, selectedId]);

  const selectedRequest =
    mergedItems.find((item) => String(item.id) === String(selectedId)) ||
    mergedItems[0] ||
    null;

  if (loading && mergedItems.length === 0) {
    return (
      <div className="px-4 py-6">
        <h1 className="mb-3 !text-[36px] font-bold !text-[#0D47A1]">Trạng thái đơn nhận nuôi</h1>
        <p className="text-sm text-slate-400">Đang tải...</p>
      </div>
    );
  }

  if (mergedItems.length === 0) {
    return (
      <div className="px-4 py-6">
        <h1 className="mb-3 !text-[36px] font-bold !text-[#0D47A1]">Trạng thái đơn nhận nuôi</h1>
        <div className="rounded-[28px] border border-[#E3ECF8] bg-white px-6 py-16 text-center shadow-[0_10px_30px_rgba(38,68,120,0.06)]">
          <p className="text-slate-400">Bạn chưa có đơn nhận nuôi nào.</p>
          <Link
            to="/nhan-nuoi/tao-don"
            className="mt-3 inline-block text-sm font-medium text-[#2F80ED] hover:underline"
          >
            Tạo đơn nhận nuôi mới
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F9FE]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="!text-[36px] font-bold !text-[#0D47A1]">
            Trạng thái đơn nhận nuôi
          </h1>
          <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#73839B]">
            Theo dõi tiến trình hồ sơ của bạn. Chúng tôi đang đồng hành cùng bạn
            trên hành trình tìm kiếm mái ấm cho các em.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div>
            <h2 className="mb-4 pl-1 text-sm font-bold uppercase tracking-[0.18em] text-[#708099]">
              Danh sách hồ sơ
            </h2>

            <div className="space-y-4">
              {mergedItems.map((r) => {
                const isActive = String(selectedRequest?.id) === String(r.id);

                return (
                  <button
                    key={`${r.id}-${r.code}`}
                    type="button"
                    onClick={() => setSelectedId(r.id)}
                    className={`w-full rounded-[24px] border p-5 text-left transition-all duration-200 ${isActive
                      ? 'border-[#CFE0F6] bg-gradient-to-br from-[#EAF3FF] to-[#F6FAFF] shadow-[0_14px_34px_rgba(62,108,177,0.14)]'
                      : 'border-[#E4EDF8] bg-white shadow-[0_6px_18px_rgba(40,72,120,0.04)] hover:border-[#D4E2F5] hover:shadow-[0_10px_24px_rgba(55,93,145,0.08)]'
                      }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <p className="text-sm font-bold text-[#5F7089]">#{r.code}</p>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${getStatusPillClass(
                          r.status
                        )}`}
                      >
                        {getStatusText(r.status)}
                      </span>
                    </div>

                    <p className="text-[20px] font-semibold leading-7 text-[#2B3C55]">
                      {r.title}
                    </p>

                    <div className="mt-4 space-y-1 text-sm text-[#7E8FA7]">
                      <p>Ngày nộp: {formatDate(r.createdAt)}</p>
                      <p>Người duyệt: {r.approverName || 'Chưa có'}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedRequest && (
            <div className="rounded-[28px] border border-[#E3ECF8] bg-white p-6 shadow-[0_14px_36px_rgba(42,74,122,0.08)] md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8EA0B8]">
                    Chi tiết hồ sơ
                  </p>
                  <h3 className="mt-2 text-[30px] font-bold text-[#27406B]">
                    Đơn đăng ký #{selectedRequest.code}
                  </h3>
                </div>

                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#DCE8F7] bg-[#F3F8FF] px-5 text-sm font-semibold text-[#5C7396] transition hover:bg-[#EAF3FF]"
                >
                  <Download size={16} />
                  Xuất PDF
                </button>
              </div>

              <div className="mt-10 rounded-[24px] border border-[#E7EEF9] bg-[#FBFDFF] px-4 py-6 md:px-8">
                <div className="relative px-1">
                  <div className="absolute left-[6%] right-[6%] top-4 h-[4px] rounded-full bg-[#E6EEF8]" />
                  <div
                    className="absolute left-[6%] top-4 h-[4px] rounded-full bg-[#6E8FC7] transition-all"
                    style={{
                      width: `calc(${getProgressWidth(
                        getCurrentStep(selectedRequest.status)
                      )} - 12%)`,
                    }}
                  />
                  <div className="relative grid grid-cols-4 gap-2">
                    {STEPS.map((step) => {
                      const currentStep = getCurrentStep(selectedRequest.status);
                      const isDone = step.key <= currentStep;
                      const isCurrent = step.key === currentStep;

                      return (
                        <div key={step.key} className="flex flex-col items-center text-center">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${isDone
                              ? isCurrent
                                ? 'bg-[#5F81BC] text-white ring-4 ring-[#DCE8F9]'
                                : 'bg-[#5F81BC] text-white'
                              : 'bg-[#E9EEF5] text-[#8190A3]'
                              }`}
                          >
                            {step.key}
                          </div>
                          <p className="mt-3 text-[11px] font-bold uppercase text-[#7C8DA4]">
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="w-full rounded-[24px] border border-[#E7EEF9] bg-[#FCFEFF] p-5">
                  <h4 className="mb-4 flex items-center gap-2 text-[15px] font-bold !text-[#0D47A1]">
                    <UserRound size={16} />
                    Thông tin hồ sơ
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <DetailField
                      label="Ngày tạo"
                      value={formatDate(selectedRequest.createdAt)}
                      icon={<CalendarDays size={16} />}
                    />
                    <DetailField
                      label="Người duyệt"
                      value={selectedRequest.approverName}
                      icon={<UserCheck size={16} />}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[24px] border border-[#E7EEF9] bg-white p-5">
                <h4 className="mb-5 text-[15px] font-bold !text-[#0D47A1]">
                  Phiếu đăng ký chi tiết
                </h4>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <DetailField
                    label="Họ và tên"
                    value={selectedRequest.formData?.fullName}
                    icon={<UserRound size={16} />}
                  />
                  <DetailField
                    label="Giới tính"
                    value={selectedRequest.formData?.gender}
                  />
                  <DetailField
                    label="Số điện thoại"
                    value={selectedRequest.formData?.phone}
                    icon={<Phone size={16} />}
                  />
                  <DetailField
                    label="Ngày sinh"
                    value={selectedRequest.formData?.birthDate}
                    icon={<CalendarDays size={16} />}
                  />
                  <DetailField
                    label="CCCD"
                    value={selectedRequest.formData?.nationalId}
                    icon={<IdCard size={16} />}
                  />
                  <DetailField
                    label="Nghề nghiệp"
                    value={selectedRequest.formData?.occupation}
                    icon={<Briefcase size={16} />}
                  />
                  <DetailField
                    label="Thu nhập hàng tháng"
                    value={selectedRequest.formData?.income}
                  />

                  <div className="md:col-span-2">
                    <DetailField
                      label="Địa chỉ thường trú"
                      value={selectedRequest.formData?.address}
                      icon={<MapPin size={16} />}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <LargeField
                      label="Lý do nhận nuôi"
                      value={selectedRequest.formData?.reason}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <LargeField
                      label="Mong muốn về trẻ"
                      value={selectedRequest.desiredChild}
                    />
                  </div>
                </div>
              </div>

              {selectedRequest.formData?.documents && (
                <div className="mt-8 rounded-[24px] border border-[#E7EEF9] bg-white p-5">
                  <h4 className="mb-5 text-[15px] font-bold !text-[#0D47A1]">
                    Tài liệu đã tải lên
                  </h4>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <DocumentCard
                      title="Ảnh CCCD"
                      value={selectedRequest.formData.documents.idCard?.join(', ') || '-'}
                    />
                    <DocumentCard
                      title="Giấy khám sức khỏe"
                      value={selectedRequest.formData.documents.health?.join(', ') || '-'}
                    />
                    <DocumentCard
                      title="Tình trạng hôn nhân"
                      value={selectedRequest.formData.documents.marriage?.join(', ') || '-'}
                    />
                    <DocumentCard
                      title="Minh chứng thu nhập"
                      value={selectedRequest.formData.documents.income?.join(', ') || '-'}
                    />
                  </div>
                </div>
              )}

              {[STATUS.CREATED, STATUS.PENDING, STATUS.MISSING_INFO].includes(
                selectedRequest.status
              ) && (
                  <div className="mt-8">
                    <Link
                      to={`/nhan-nuoi/cap-nhat/${selectedRequest.id}`}
                      className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#2F80ED] px-5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(47,128,237,0.22)] transition hover:brightness-105"
                    >
                      Cập nhật hồ sơ
                    </Link>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}