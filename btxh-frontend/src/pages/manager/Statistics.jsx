import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useFetch } from '../../hooks/useFetch';
import adminApi from '../../api/adminApi';

// Dữ liệu mẫu khi chưa có API
const SAMPLE_DATA = [
  { month: 'T1', reception: 4, adoption: 2 },
  { month: 'T2', reception: 6, adoption: 3 },
  { month: 'T3', reception: 3, adoption: 5 },
  { month: 'T4', reception: 8, adoption: 4 },
  { month: 'T5', reception: 5, adoption: 6 },
  { month: 'T6', reception: 7, adoption: 3 },
];

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="font-semibold text-gray-700 mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function Statistics() {
  const { data: stats } = useFetch(adminApi.getStats);
  const chartData = stats?.monthlyData || SAMPLE_DATA;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Thống kê báo cáo</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Tổng trẻ trong năm',   value: stats?.yearlyChildren   ?? 0, color: 'text-blue-600' },
          { label: 'Tiếp nhận trong năm',   value: stats?.yearlyReceptions ?? 0, color: 'text-green-600' },
          { label: 'Nhận nuôi thành công',  value: stats?.yearlyAdoptions  ?? 0, color: 'text-purple-600' },
          { label: 'Tỉ lệ nhận nuôi',       value: `${stats?.adoptionRate  ?? 0}%`, color: 'text-orange-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Tiếp nhận & Nhận nuôi theo tháng">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="reception" name="Tiếp nhận" fill="#3b82f6" radius={[4,4,0,0]} />
              <Bar dataKey="adoption"  name="Nhận nuôi" fill="#22c55e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Xu hướng trẻ trong trung tâm">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reception" name="Tiếp nhận" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="adoption"  name="Nhận nuôi" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
