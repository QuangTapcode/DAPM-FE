import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
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

export default function AdoptionRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: req, loading, refetch } = useFetch(() => adoptionApi.getById(id));
  const [rejectModal, setRejectModal] = useState(false);
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  const handleApprove = async () => {
    setSaving(true);
    await adoptionApi.approve(id);
    await refetch();
    setSaving(false);
    navigate('/can-bo-nhan-nuoi/tao-ho-so/' + id);
  };

  const handleReject = async () => {
    setSaving(true);
    await adoptionApi.reject(id, reason);
    await refetch();
    setSaving(false);
    setRejectModal(false);
  };

  if (loading) return <p className="text-gray-400">Đang tải...</p>;
  if (!req)    return <p className="text-gray-400">Không tìm thấy hồ sơ.</p>;

  const canAct = req.status === REQUEST_STATUS.PENDING;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Chi tiết đơn nhận nuôi #{id}</h1>
        <Badge status={req.status} />
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-4">
        <h2 className="font-semibold text-gray-700 mb-3">Thông tin người nhận nuôi</h2>
        <InfoRow label="Họ tên"         value={req.adopterName} />
        <InfoRow label="CCCD/CMND"      value={req.nationalId} />
        <InfoRow label="Số điện thoại"  value={req.phone} />
        <InfoRow label="Nghề nghiệp"    value={req.occupation} />
        <InfoRow label="Địa chỉ"        value={req.address} />
        <InfoRow label="Lý do nhận nuôi" value={req.motivation} />
        <InfoRow label="Ngày nộp đơn"   value={formatDate(req.createdAt)} />
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-4">
        <h2 className="font-semibold text-gray-700 mb-3">Thông tin trẻ đăng ký</h2>
        <InfoRow label="Tên trẻ"      value={req.childName} />
        <InfoRow label="Ngày sinh"    value={formatDate(req.childDob)} />
        <InfoRow label="Giới tính"    value={req.childGender === 'male' ? 'Nam' : 'Nữ'} />
      </div>

      {/* Đánh giá điều kiện */}
      <div className="bg-blue-50 rounded-xl p-5 mb-4 text-sm text-blue-800">
        <p className="font-semibold mb-2">Tiêu chí đánh giá điều kiện nhận nuôi</p>
        <ul className="list-disc pl-4 space-y-1 text-blue-700">
          <li>Người nhận nuôi đủ 20 tuổi trở lên</li>
          <li>Có thu nhập ổn định để nuôi dưỡng trẻ</li>
          <li>Không có tiền án, tiền sự liên quan đến trẻ em</li>
          <li>Có chỗ ở ổn định</li>
        </ul>
      </div>

      {canAct && (
        <div className="flex gap-3">
          <Button onClick={handleApprove} loading={saving} variant="success">Duyệt &amp; Lập hồ sơ</Button>
          <Button onClick={() => setRejectModal(true)} variant="danger">Từ chối</Button>
        </div>
      )}

      <Modal isOpen={rejectModal} onClose={() => setRejectModal(false)} title="Từ chối đơn nhận nuôi">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Lý do từ chối</label>
          <textarea rows={4} value={reason} onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm" placeholder="Nhập lý do..." />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setRejectModal(false)}>Hủy</Button>
            <Button variant="danger" loading={saving} onClick={handleReject} disabled={!reason.trim()}>
              Xác nhận từ chối
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
