import { Link } from 'react-router-dom';

const STEPS_SENDER = [
  { step: 1, title: 'Đăng ký tài khoản', desc: 'Tạo tài khoản với vai trò Người gửi trẻ.' },
  { step: 2, title: 'Điền thông tin trẻ', desc: 'Cung cấp đầy đủ thông tin và giấy tờ liên quan.' },
  { step: 3, title: 'Nộp hồ sơ', desc: 'Gửi hồ sơ để cán bộ xem xét tiếp nhận.' },
  { step: 4, title: 'Theo dõi trạng thái', desc: 'Theo dõi quá trình xét duyệt hồ sơ trực tuyến.' },
];

const STEPS_ADOPTER = [
  { step: 1, title: 'Đăng ký tài khoản', desc: 'Tạo tài khoản với vai trò Người nhận nuôi.' },
  { step: 2, title: 'Tìm hiểu hồ sơ trẻ', desc: 'Xem danh sách trẻ đang chờ được nhận nuôi.' },
  { step: 3, title: 'Nộp đơn nhận nuôi', desc: 'Điền đơn và upload các giấy tờ cần thiết.' },
  { step: 4, title: 'Chờ xét duyệt', desc: 'Cán bộ sẽ đánh giá điều kiện và liên hệ bạn.' },
];

function StepCard({ step, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
        {step}
      </div>
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Hướng dẫn sử dụng</h1>
      <p className="text-center text-gray-500 mb-10">Tìm hiểu quy trình gửi trẻ và nhận nuôi tại Trung tâm Bảo Trợ Xã Hội.</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Gửi trẻ */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-blue-700 mb-5">Quy trình gửi trẻ</h2>
          <div className="space-y-5">
            {STEPS_SENDER.map((s) => <StepCard key={s.step} {...s} />)}
          </div>
          <Link
            to="/dang-ky"
            className="mt-6 block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
          >
            Bắt đầu gửi trẻ
          </Link>
        </div>

        {/* Nhận nuôi */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-green-700 mb-5">Quy trình nhận nuôi</h2>
          <div className="space-y-5">
            {STEPS_ADOPTER.map((s) => <StepCard key={s.step} {...s} />)}
          </div>
          <Link
            to="/dang-ky"
            className="mt-6 block text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-sm font-medium"
          >
            Bắt đầu nhận nuôi
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        Cần hỗ trợ? Liên hệ hotline: <span className="text-blue-600 font-medium">1800 xxxx</span>
      </div>
    </div>
  );
}
