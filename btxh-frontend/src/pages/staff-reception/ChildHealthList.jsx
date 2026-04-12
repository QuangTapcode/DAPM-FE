import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import childApi from '../../api/childApi';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';

const COLUMNS = [
  { key: 'checkDate',   title: 'Ngày khám', render: formatDate },
  { key: 'weight',      title: 'Cân nặng (kg)' },
  { key: 'height',      title: 'Chiều cao (cm)' },
  { key: 'diagnosis',   title: 'Chẩn đoán' },
  { key: 'treatment',   title: 'Điều trị' },
  { key: 'staffName',   title: 'Cán bộ ghi nhận' },
  {
    key: 'id', title: 'Thao tác',
    render: (id, row) => (
      <Link to={`/can-bo-tiep-nhan/tre/${row.childId}/suc-khoe/${id}/sua`}
        className="text-blue-600 hover:underline text-xs">Sửa</Link>
    ),
  },
];

export default function ChildHealthList() {
  const { childId } = useParams();
  const { data, loading } = useFetch(() => childApi.getAll({ childId, type: 'health' }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Theo dõi sức khỏe trẻ #{childId}</h1>
        <Link to={`/can-bo-tiep-nhan/tre/${childId}/suc-khoe/tao`}>
          <Button size="sm">+ Thêm lần khám</Button>
        </Link>
      </div>
      <Table columns={COLUMNS} data={data?.items} loading={loading} emptyText="Chưa có lần khám nào." />
    </div>
  );
}
