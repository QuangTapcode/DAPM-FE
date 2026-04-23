import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import adoptionApi from '../../api/adoptionApi';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { REQUEST_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

/* COMPONENT ROW (VIEW + EDIT) */
function InfoRow({ label, value, editable, onChange }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 py-3 border-b last:border-0">
      <span className="md:w-52 text-sm text-gray-500">{label}</span>

      {editable ? (
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />
      ) : (
        <span className="text-sm text-gray-800">{value || '—'}</span>
      )}
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

  // 🔥 NEW
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (req) setFormData(req);
  }, [req]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
  if (!req) return <p className="text-gray-400">Không tìm thấy hồ sơ.</p>;

  const canAct = req.status === REQUEST_STATUS.PENDING;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết đơn nhận nuôi #{id}
          </h1>
          <p className="text-sm text-gray-500">Quản lý & xét duyệt hồ sơ</p>
        </div>
        <Badge status={req.status} />
      </div>

      {/* ACTION EDIT */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-blue-500 text-sm hover:underline"
        >
          {isEditing ? "Hủy chỉnh sửa" : "✏️ Chỉnh sửa"}
        </button>
      </div>

      {/* NGƯỜI NHẬN NUÔI */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-5 border">
        <h2 className="font-semibold text-gray-700 mb-4">
          👤 Thông tin người nhận nuôi
        </h2>

        <InfoRow label="Họ tên" value={formData.adopterName}
          editable={isEditing} onChange={(v) => updateField('adopterName', v)} />

        <InfoRow label="CCCD/CMND" value={formData.nationalId}
          editable={isEditing} onChange={(v) => updateField('nationalId', v)} />

        <InfoRow label="SĐT" value={formData.phone}
          editable={isEditing} onChange={(v) => updateField('phone', v)} />

        <InfoRow label="Nghề nghiệp" value={formData.occupation}
          editable={isEditing} onChange={(v) => updateField('occupation', v)} />

        <InfoRow label="Địa chỉ" value={formData.address}
          editable={isEditing} onChange={(v) => updateField('address', v)} />

        <InfoRow label="Lý do" value={formData.motivation}
          editable={isEditing} onChange={(v) => updateField('motivation', v)} />

        <InfoRow label="Ngày nộp đơn"
          value={formatDate(formData.createdAt)} />
      </div>

      {/* TRẺ */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-5 border">
        <h2 className="font-semibold text-gray-700 mb-4">
          🧒 Thông tin trẻ
        </h2>

        <InfoRow label="Tên trẻ" value={formData.childName}
          editable={isEditing} onChange={(v) => updateField('childName', v)} />

        <InfoRow label="Ngày sinh"
          value={formatDate(formData.childDob)} />

        <InfoRow label="Giới tính"
          value={formData.childGender === 'male' ? 'Nam' : 'Nữ'} />
      </div>

      {/* SAVE BUTTON */}
      {isEditing && (
        <div className="flex justify-end mb-4">
          <Button
            variant="primary"
            onClick={() => {
              console.log("DATA UPDATE:", formData);
              setIsEditing(false);
            }}
          >
            💾 Lưu thay đổi
          </Button>
        </div>
      )}

      {/* TIÊU CHÍ */}
      <div className="bg-blue-50 rounded-xl p-5 mb-4 text-sm text-blue-800">
        <p className="font-semibold mb-2">
          📋 Tiêu chí đánh giá điều kiện nhận nuôi
        </p>
        <ul className="list-disc pl-4 space-y-1 text-blue-700">
          <li>Người nhận nuôi đủ 20 tuổi trở lên</li>
          <li>Có thu nhập ổn định để nuôi dưỡng trẻ</li>
          <li>Không có tiền án, tiền sự liên quan đến trẻ em</li>
          <li>Có chỗ ở ổn định</li>
        </ul>
      </div>

      {/* ACTION */}
      {canAct && (
        <div className="flex gap-3">
          <Button onClick={handleApprove} loading={saving} variant="success">
            ✔ Duyệt & Lập hồ sơ
          </Button>
          <Button onClick={() => setRejectModal(true)} variant="danger">
            ✖ Từ chối
          </Button>
        </div>
      )}

      {/* MODAL */}
      <Modal
        isOpen={rejectModal}
        onClose={() => setRejectModal(false)}
        title="Từ chối đơn nhận nuôi"
      >
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Lý do từ chối
          </label>

          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Nhập lý do..."
          />

          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setRejectModal(false)}>
              Hủy
            </Button>
            <Button
              variant="danger"
              loading={saving}
              onClick={handleReject}
              disabled={!reason.trim()}
            >
              Xác nhận từ chối
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
