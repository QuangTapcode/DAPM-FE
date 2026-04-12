import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import receptionApi from '../../api/receptionApi';
import adoptionApi from '../../api/adoptionApi';
import Badge from '../../components/common/Badge';
import { REQUEST_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

function ProfileRow({ item, type }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${type === 'reception' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
            {type === 'reception' ? 'Gửi trẻ' : 'Nhận nuôi'}
          </span>
          <p className="text-sm font-medium text-gray-800">
            {type === 'reception' ? item.childName : item.adopterName} — {item.childName}
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(item.createdAt)}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge status={item.status} />
        <Link
          to={`/truong-phong/duyet/${type}/${item.id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          Xét duyệt
        </Link>
      </div>
    </div>
  );
}

export default function PendingProfileList() {
  const [tab, setTab] = useState('all');
  const { data: recData } = useFetch(() => receptionApi.getAll({ status: REQUEST_STATUS.PENDING }));
  const { data: adpData } = useFetch(() => adoptionApi.getAll({ status: REQUEST_STATUS.PENDING }));

  const receptions = recData?.items || [];
  const adoptions  = adpData?.items || [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Hồ sơ chờ duyệt</h1>

      <div className="flex gap-2 mb-4">
        {[
          { value: 'all',       label: `Tất cả (${receptions.length + adoptions.length})` },
          { value: 'reception', label: `Gửi trẻ (${receptions.length})` },
          { value: 'adoption',  label: `Nhận nuôi (${adoptions.length})` },
        ].map((t) => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`px-3 py-1.5 rounded text-xs border transition
              ${tab === t.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        {(tab === 'all' || tab === 'reception') && receptions.map((r) => (
          <ProfileRow key={`rec-${r.id}`} item={r} type="reception" />
        ))}
        {(tab === 'all' || tab === 'adoption') && adoptions.map((a) => (
          <ProfileRow key={`adp-${a.id}`} item={a} type="adoption" />
        ))}
        {receptions.length === 0 && adoptions.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">Không có hồ sơ nào chờ duyệt.</p>
        )}
      </div>
    </div>
  );
}
