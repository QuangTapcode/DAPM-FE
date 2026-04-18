import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import childApi from '../../api/childApi';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/formatDate';
import { useState, useEffect } from 'react';

/* ROW VIEW + EDIT */
function InfoRow({ label, value, editable, onChange }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 py-3 border-b last:border-0">
      <span className="md:w-48 text-sm text-gray-500">{label}</span>

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

export default function AdoptionChildDetail() {
  const { id } = useParams();
  const { data: child, loading } = useFetch(() => childApi.getById(id));

  // 🔥 STATE EDIT
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (child) setFormData(child);
  }, [child]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // LOADING
  if (loading) return <p className="text-gray-400">Đang tải...</p>;

  // NOT FOUND
  if (!child) return <p className="text-gray-400">Không tìm thấy thông tin trẻ.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            🧒 Thông tin trẻ
          </h1>
          <p className="text-sm text-gray-400">
            Dữ liệu tham khảo khi xét duyệt hồ sơ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
            Read-only
          </span>
          <Badge status={child.status} />
        </div>
      </div>

      {/* EDIT BUTTON */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-blue-500 text-sm hover:underline"
        >
          {isEditing ? "Hủy chỉnh sửa" : "✏️ Chỉnh sửa"}
        </button>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border">

        {/* AVATAR */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-xl font-bold">
              {formData.fullName?.[0] || '?'}
            </div>

            <div>
              <p className="font-semibold text-lg text-gray-800">
                {formData.fullName || 'Chưa có tên'}
              </p>
              <p className="text-sm text-gray-400">
                Mã: {formData.code || '—'}
              </p>
            </div>
          </div>

          <Badge status={child.status} />
        </div>

        {/* INFO */}
        <InfoRow
          label="Ngày sinh"
          value={formatDate(formData.dob)}
        />

        <InfoRow
          label="Giới tính"
          value={formData.gender === 'male' ? 'Nam' : 'Nữ'}
        />

        <InfoRow
          label="Dân tộc"
          value={formData.ethnicity}
          editable={isEditing}
          onChange={(v) => updateField('ethnicity', v)}
        />

        <InfoRow
          label="Tình trạng sức khỏe"
          value={formData.healthStatus}
          editable={isEditing}
          onChange={(v) => updateField('healthStatus', v)}
        />

        <InfoRow
          label="Ngày tiếp nhận"
          value={formatDate(formData.admissionDate)}
        />

        <InfoRow
          label="Ghi chú"
          value={formData.notes}
          editable={isEditing}
          onChange={(v) => updateField('notes', v)}
        />
      </div>

      {/* SAVE BUTTON */}
      {isEditing && (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              console.log("DATA UPDATE:", formData);
              setIsEditing(false);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            💾 Lưu thay đổi
          </button>
        </div>
      )}
    </div>
  );
}