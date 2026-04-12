import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import receptionApi from '../../api/receptionApi';
import adoptionApi from '../../api/adoptionApi';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { REQUEST_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

function InfoRow({ label, value }) {
  return (
    <div className="flex py-2 border-b last:border-0">
      <span className="w-52 text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-800">{value || '—'}</span>
    </div>
  );
}

export default function ProfileApproval() {
  const { type, id } = useParams(); // type = 'reception' | 'adoption'
  const navigate = useNavigate();
  const api = type === 'reception' ? receptionApi : adoptionApi;
  const { data: profile, loading, refetch } = useFetch(() => api.getById(id));
  const [rejectModal, setRejectModal] = useState(false);
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  const handleApprove = async () => {
    setSaving(true);
    await api.approve(id);
    await refetch();
    setSaving(false);
    navigate('/truong-phong/cho-duyet');
  };

  const handleReject = async () => {
    setSaving(true);
    await api.reject(id, reason);
    await refetch();
    setSaving(false);
    setRejectModal(false);
    navigate('/truong-phong/cho-duyet');
  };

  if (loading)  return <p className="text-gray-400">Đang tải...</p>;
  if (!profile) return <p className="text-gray-400">Không tìm thấy hồ sơ.</p>;

  const canAct = profile.status === REQUEST_STATUS.PENDING;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Xét duyệt hồ sơ — {type === 'reception' ? 'Gửi trẻ' : 'Nhận nuôi'}
        </h1>
        <Badge status={profile.status} />
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-4">
        {type === 'reception' ? (
          <>
            <h2 className="font-semibold text-gray-700 mb-3">Thông tin gửi trẻ</h2>
            <InfoRow label="Tên trẻ"          value={profile.childName} />
            <InfoRow label="Ngày sinh"         value={formatDate(profile.childDob)} />
            <InfoRow label="Người giao"        value={profile.senderName} />
            <InfoRow label="Lý do"             value={profile.reason} />
            <InfoRow label="Ngày nộp hồ sơ"   value={formatDate(profile.createdAt)} />
          </>
        ) : (
          <>
            <h2 className="font-semibold text-gray-700 mb-3">Thông tin nhận nuôi</h2>
            <InfoRow label="Người nhận nuôi"  value={profile.adopterName} />
            <InfoRow label="Trẻ đăng ký"      value={profile.childName} />
            <InfoRow label="CCCD/CMND"         value={profile.nationalId} />
            <InfoRow label="Nghề nghiệp"       value={profile.occupation} />
            <InfoRow label="Lý do nhận nuôi"   value={profile.motivation} />
            <InfoRow label="Ngày nộp đơn"      value={formatDate(profile.createdAt)} />
          </>
        )}
      </div>

      {canAct && (
        <div className="flex gap-3">
          <Button onClick={handleApprove} loading={saving} variant="success">Phê duyệt</Button>
          <Button onClick={() => setRejectModal(true)} variant="danger">Từ chối</Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      )}

      <Modal isOpen={rejectModal} onClose={() => setRejectModal(false)} title="Từ chối hồ sơ">
        <div className="space-y-3">
          <textarea rows={4} value={reason} onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm" placeholder="Nhập lý do từ chối..." />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setRejectModal(false)}>Hủy</Button>
            <Button variant="danger" loading={saving} onClick={handleReject} disabled={!reason.trim()}>
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
