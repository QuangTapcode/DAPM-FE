import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';

/* ─── Data ─────────────────────────────────────────────── */
const STATS = [
  { value: '1.240+', label: 'Trẻ được chăm sóc',      icon: '👶', color: 'text-blue-600' },
  { value: '380+',   label: 'Trẻ được nhận nuôi',      icon: '🏠', color: 'text-green-600' },
  { value: '30+',    label: 'Năm hoạt động',            icon: '📅', color: 'text-purple-600' },
  { value: '98%',    label: 'Hồ sơ xử lý đúng hạn',   icon: '✅', color: 'text-orange-500' },
];

const PROGRAMS = [
  {
    id: 1,
    title: 'Tiếp nhận trẻ em',
    desc: 'Tiếp nhận và chăm sóc trẻ mồ côi, trẻ bị bỏ rơi, trẻ có hoàn cảnh đặc biệt khó khăn vào trung tâm bảo trợ.',
    img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80',
    gradient: 'from-blue-400 to-blue-600',
    icon: '🤝',
    to: '/dang-ky',
    tag: 'Chương trình',
  },
  {
    id: 2,
    title: 'Nhận nuôi trẻ em',
    desc: 'Kết nối trẻ em với các gia đình yêu thương, tạo điều kiện để trẻ có mái ấm và được phát triển toàn diện.',
    img: 'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=600&q=80',
    gradient: 'from-emerald-400 to-green-600',
    icon: '❤️',
    to: '/dang-ky',
    tag: 'Chương trình',
  },
  {
    id: 3,
    title: 'Hỗ trợ giáo dục',
    desc: 'Cung cấp học bổng, dụng cụ học tập và các khoá kỹ năng sống giúp trẻ phát triển toàn diện về trí tuệ.',
    img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80',
    gradient: 'from-violet-400 to-purple-600',
    icon: '📚',
    to: '/huong-dan',
    tag: 'Giáo dục',
  },
  {
    id: 4,
    title: 'Chăm sóc sức khoẻ',
    desc: 'Theo dõi sức khoẻ định kỳ, tiêm chủng và điều trị bệnh cho tất cả trẻ em đang được nuôi dưỡng tại trung tâm.',
    img: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=600&q=80',
    gradient: 'from-orange-400 to-red-500',
    icon: '🏥',
    to: '/huong-dan',
    tag: 'Y tế',
  },
];

const NEWS = [
  {
    id: 1,
    date: '08 tháng 04, 2026',
    title: 'Lễ trao học bổng cho 120 trẻ em có hoàn cảnh khó khăn',
    excerpt: 'Trung tâm tổ chức lễ trao học bổng thường niên, hỗ trợ học phí và đồ dùng học tập cho 120 trẻ em trong và ngoài trung tâm năm học 2025–2026.',
    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
    gradient: 'from-sky-400 to-blue-500',
    category: 'Sự kiện',
  },
  {
    id: 2,
    date: '01 tháng 04, 2026',
    title: 'Diễn đàn lắng nghe tiếng nói trẻ em – Quý I/2026',
    excerpt: 'Hơn 200 trẻ em tham gia diễn đàn chia sẻ nguyện vọng, góp phần xây dựng môi trường sống lành mạnh và bình đẳng tại trung tâm.',
    img: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80',
    gradient: 'from-violet-400 to-purple-500',
    category: 'Hoạt động',
  },
  {
    id: 3,
    date: '20 tháng 03, 2026',
    title: 'Khánh thành khu vui chơi mới dành cho trẻ dưới 6 tuổi',
    excerpt: 'Khu vui chơi hiện đại được xây dựng từ nguồn tài trợ của các mạnh thường quân, tạo không gian phát triển thể chất và tinh thần cho trẻ nhỏ.',
    img: 'https://images.unsplash.com/photo-1576037728058-fe7f5a759b64?w=600&q=80',
    gradient: 'from-teal-400 to-green-500',
    category: 'Cơ sở vật chất',
  },
];

const QUICK_ACCESS = [
  { label: 'Gửi trẻ vào trung tâm', desc: 'Dành cho gia đình cần giao trẻ', to: '/dang-ky', color: 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100', icon: '📋', iconBg: 'bg-blue-100 text-blue-600' },
  { label: 'Nhận nuôi trẻ em',      desc: 'Dành cho gia đình muốn nhận nuôi', to: '/dang-ky', color: 'bg-green-50 border-green-200 hover:border-green-400 hover:bg-green-100', icon: '🏡', iconBg: 'bg-green-100 text-green-600' },
  { label: 'Hướng dẫn sử dụng',    desc: 'Xem quy trình và thủ tục chi tiết', to: '/huong-dan', color: 'bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100', icon: '📖', iconBg: 'bg-purple-100 text-purple-600' },
  { label: 'Cán bộ / Nhân viên',   desc: 'Truy cập hệ thống quản lý nội bộ', to: '/dang-nhap', color: 'bg-orange-50 border-orange-200 hover:border-orange-400 hover:bg-orange-100', icon: '🏛️', iconBg: 'bg-orange-100 text-orange-600' },
];

/* ─── Animated wrappers ─────────────────────────────────── */
function RevealSection({ children, className = '', variant = '' }) {
  const ref = useScrollReveal({ threshold: 0.1 });
  return (
    <div ref={ref} className={`reveal ${variant} ${className}`}>
      {children}
    </div>
  );
}

function QuickAccessCard({ item, delay }) {
  const ref = useScrollReveal({ threshold: 0.1 });
  return (
    <Link
      to={item.to}
      ref={ref}
      className={`reveal reveal--scale ${delay} flex items-start gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 group ${item.color}`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${item.iconBg}`}>
        {item.icon}
      </div>
      <div>
        <p className="font-bold text-gray-800 text-sm sm:text-base leading-snug">{item.label}</p>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{item.desc}</p>
      </div>
    </Link>
  );
}

/* ─── Sub-components ────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <span className="inline-block bg-[#f97316]/10 text-[#f97316] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
      {children}
    </span>
  );
}

function ProgramCard({ program, delay = '' }) {
  const ref = useScrollReveal({ threshold: 0.1 });
  return (
    <div ref={ref} className={`reveal reveal--scale ${delay} bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col`}>
      <div className={`relative h-44 sm:h-48 bg-gradient-to-br ${program.gradient} flex-shrink-0`}>
        <img
          src={program.img}
          alt={program.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20" />
        <span className="absolute top-3 left-3 bg-white/90 text-gray-700 text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide">
          {program.tag}
        </span>
        <div className="absolute bottom-3 right-3 text-2xl">{program.icon}</div>
      </div>
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <h3 className="text-base sm:text-lg font-bold text-[#1e3a5f] mb-2 leading-snug">{program.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed flex-1">{program.desc}</p>
        <Link
          to={program.to}
          className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#1d4ed8] hover:text-[#f97316] transition-colors group"
        >
          Tìm hiểu thêm
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function NewsCard({ article, delay = '' }) {
  const ref = useScrollReveal({ threshold: 0.1 });
  return (
    <div ref={ref} className={`reveal ${delay} bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col border border-gray-100`}>
      <div className={`relative h-44 sm:h-48 bg-gradient-to-br ${article.gradient} flex-shrink-0`}>
        <img
          src={article.img}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/25" />
        <span className="absolute top-3 left-3 bg-white text-[#1d4ed8] text-[11px] font-bold px-2.5 py-1 rounded-full">
          {article.category}
        </span>
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-1 h-4 bg-[#f97316] rounded-full flex-shrink-0" />
          <p className="text-xs text-gray-400 font-medium">{article.date}</p>
        </div>
        <h4 className="text-sm sm:text-base font-bold text-gray-800 mb-2 leading-snug">{article.title}</h4>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">{article.excerpt}</p>
        <button className="mt-4 text-sm font-bold text-[#1d4ed8] hover:text-[#f97316] transition-colors text-left inline-flex items-center gap-1 group">
          Đọc tiếp
          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function HomePage() {
  const statsRef = useScrollReveal({ threshold: 0.2 });
  const aboutImgRef = useScrollReveal({ threshold: 0.15 });
  const visionRef = useScrollReveal({ threshold: 0.2 });
  const partnersRef = useScrollReveal({ threshold: 0.15 });
  const ctaRef = useScrollReveal({ threshold: 0.2 });
  const contactRef = useScrollReveal({ threshold: 0.15 });

  return (
    <div className="bg-white" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[560px] sm:min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f38] via-[#1e3a5f] to-[#1d4ed8]" />

        {/* Photo overlay */}
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&q=80')" }}
        />

        {/* Decorative blobs */}
        <div className="float-anim absolute top-[-60px] right-[-60px] w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] rounded-full bg-white/5" />
        <div className="float-anim-slow absolute bottom-[-80px] left-[-40px] w-[200px] sm:w-[280px] h-[200px] sm:h-[280px] rounded-full bg-[#f97316]/10" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center text-white py-20 sm:py-28">
          {/* Badge */}
          <div className="hero-text inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 text-xs sm:text-sm">
            <span className="w-2 h-2 bg-[#f97316] rounded-full animate-pulse flex-shrink-0" />
            <span className="text-blue-100 font-medium">Trung tâm Bảo trợ Xã hội TP.HCM</span>
          </div>

          {/* Heading */}
          <h1 className="hero-text hero-text-delay-1 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 tracking-tight">
            Giúp đỡ người khác<br className="hidden sm:block" />
            {' '}bằng cách cho{' '}
            <span className="text-[#f97316]">ĐI</span>
          </h1>

          <p className="hero-text hero-text-delay-2 text-base sm:text-lg text-blue-100 mb-2 font-semibold">
            Hội Bảo trợ Trẻ em Thành phố Hồ Chí Minh
          </p>
          <p className="hero-text hero-text-delay-3 text-sm sm:text-base text-blue-200 mb-10 leading-relaxed max-w-xl mx-auto">
            Kết nối những trái tim yêu thương — xây dựng xã hội nơi mọi trẻ em đều được
            bảo vệ, chăm sóc, giáo dục và được lắng nghe.
          </p>

          {/* CTA buttons */}
          <div className="hero-text hero-text-delay-4 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              to="/dang-ky"
              className="px-7 sm:px-8 py-3.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/30 hover:-translate-y-0.5 hover:shadow-orange-500/50 text-sm sm:text-base"
            >
              Đăng ký ngay
            </Link>
            <Link
              to="/huong-dan"
              className="px-7 sm:px-8 py-3.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl transition border border-white/30 backdrop-blur-sm text-sm sm:text-base"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 64" fill="white" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10 sm:h-16">
            <path d="M0,32 C480,64 960,0 1440,32 L1440,64 L0,64 Z" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section className="bg-white shadow-md relative z-10">
        <div
          ref={statsRef}
          className="reveal-stagger max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100"
        >
          {STATS.map((s) => (
            <div key={s.label} className="py-6 sm:py-8 text-center px-3 sm:px-4">
              <div className="text-xl sm:text-2xl mb-1.5">{s.icon}</div>
              <p className={`text-2xl sm:text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUICK ACCESS
      ══════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <RevealSection className="text-center mb-10">
          <SectionLabel>Bắt đầu ngay</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1e3a5f] mt-1 mb-2">Bạn cần làm gì?</h2>
          <p className="text-sm sm:text-base text-gray-500">Chọn mục phù hợp để bắt đầu sử dụng hệ thống</p>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACCESS.map((item, i) => {
            const delays = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4'];
            return <QuickAccessCard key={item.label} item={item} delay={delays[i]} />;
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════ */}
      <section className="bg-[#f8fafd] py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 sm:gap-14 items-center">
          {/* Text */}
          <RevealSection variant="reveal--left">
            <SectionLabel>Về chúng tôi</SectionLabel>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1e3a5f] mt-1 mb-5 leading-snug">
              Hội Bảo trợ Trẻ em<br />
              <span className="text-[#1d4ed8]">TP. Hồ Chí Minh</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              Với hơn <strong className="text-[#1e3a5f]">30 năm hoạt động</strong>, chúng tôi đã hỗ trợ hơn{' '}
              <strong className="text-[#1e3a5f]">300.000 trẻ em và thanh thiếu niên</strong> có hoàn cảnh khó
              khăn — mồ côi, bị bỏ rơi, bị xâm hại hoặc sống trong nghèo đói.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8">
              Sứ mệnh của chúng tôi là xây dựng một xã hội nơi mọi trẻ em đều được bảo vệ,
              chăm sóc, giáo dục và có tiếng nói.
            </p>

            <div className="space-y-3 mb-8">
              {[
                'Tiếp nhận và chăm sóc toàn diện',
                'Kết nối nhận nuôi hợp pháp',
                'Hỗ trợ giáo dục và y tế miễn phí',
              ].map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#1d4ed8] flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{point}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/huong-dan" className="px-5 sm:px-6 py-3 bg-[#1e3a5f] hover:bg-[#1d4ed8] text-white font-bold rounded-xl transition text-sm sm:text-base">
                Tìm hiểu thêm
              </Link>
              <Link to="/dang-nhap" className="px-5 sm:px-6 py-3 border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white font-bold rounded-xl transition text-sm sm:text-base">
                Đăng nhập hệ thống
              </Link>
            </div>
          </RevealSection>

          {/* Image collage */}
          <div ref={aboutImgRef} className="reveal reveal--right grid grid-cols-2 gap-3 sm:gap-4 h-72 sm:h-96 md:h-[420px]">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-300 to-blue-500 row-span-2">
              <img
                src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80"
                alt="Trẻ em" className="w-full h-full object-cover" loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/60 to-transparent" />
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-sky-300 to-sky-500">
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80"
                alt="Học tập" className="w-full h-full object-cover" loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] flex flex-col items-center justify-center text-white text-center p-3">
              <p className="text-3xl sm:text-4xl font-black">30+</p>
              <p className="text-xs sm:text-sm font-semibold mt-1 text-orange-100 leading-tight">Năm đồng hành<br />cùng trẻ em</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROGRAMS
      ══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <RevealSection className="text-center mb-10 sm:mb-12">
            <SectionLabel>Dự án &amp; Chương trình</SectionLabel>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1e3a5f] mt-1 mb-3">Những gì chúng tôi làm</h2>
            <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
              Các chương trình toàn diện nhằm bảo vệ, chăm sóc và phát triển trẻ em có hoàn cảnh khó khăn
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {PROGRAMS.map((p, i) => {
              const delays = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3'];
              return <ProgramCard key={p.id} program={p} delay={delays[i]} />;
            })}
          </div>

          <RevealSection className="text-center mt-10">
            <Link
              to="/huong-dan"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#1d4ed8] text-[#1d4ed8] hover:bg-[#1d4ed8] hover:text-white font-bold rounded-xl transition text-sm sm:text-base"
            >
              Xem tất cả chương trình
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VISION BANNER
      ══════════════════════════════════════════ */}
      <section className="bg-[#1e3a5f] py-14 sm:py-16 px-4 sm:px-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />
        <div ref={visionRef} className="reveal relative z-10 max-w-2xl mx-auto">
          <div className="w-10 h-1 bg-[#f97316] mx-auto mb-6 rounded-full" />
          <blockquote className="text-lg sm:text-xl md:text-2xl font-bold leading-relaxed mb-5 text-blue-50 italic">
            "Xây dựng một xã hội nơi mọi trẻ em đều là thành viên chính thức được bảo vệ,
            chăm sóc, giáo dục và được lắng nghe, tôn trọng."
          </blockquote>
          <p className="text-blue-400 text-sm font-semibold">— Tầm nhìn của Trung tâm Bảo trợ Xã hội TP.HCM</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NEWS
      ══════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <RevealSection className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8 sm:mb-10">
          <div>
            <SectionLabel>Tin tức</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1e3a5f] mt-1">Tin mới nhất</h2>
          </div>
          <button className="self-start sm:self-auto text-sm font-bold text-[#1d4ed8] hover:text-[#f97316] transition inline-flex items-center gap-1 group">
            Xem tất cả
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {NEWS.map((a, i) => {
            const delays = ['', 'reveal-delay-2', 'reveal-delay-3'];
            return <NewsCard key={a.id} article={a} delay={delays[i]} />;
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PARTNERS
      ══════════════════════════════════════════ */}
      <section className="bg-gray-50 border-y border-gray-100 py-10 sm:py-12 px-4 sm:px-6">
        <div ref={partnersRef} className="reveal max-w-5xl mx-auto">
          <p className="text-center text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6 sm:mb-8">
            Đối tác &amp; Nhà tài trợ
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              { name: 'Hội Chữ thập đỏ VN', abbr: 'CTĐ' },
              { name: 'UNICEF Việt Nam',     abbr: 'UN' },
              { name: 'Sở Lao động TPHCM',  abbr: 'SLĐ' },
              { name: 'Quỹ Bảo trợ Trẻ em', abbr: 'QBT' },
              { name: 'Hội Phụ nữ VN',      abbr: 'HPN' },
            ].map((p) => (
              <div key={p.name} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-2.5 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-[#1d4ed8]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-black text-[#1d4ed8]">{p.abbr}</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 sm:py-20 px-4 sm:px-6 text-white text-center bg-gradient-to-r from-[#f97316] to-[#ea580c]">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}
        />
        <div ref={ctaRef} className="reveal reveal--scale relative z-10 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black mb-4 leading-snug">
            Bạn muốn đồng hành<br className="hidden sm:block" /> cùng chúng tôi?
          </h2>
          <p className="text-orange-100 mb-8 text-sm sm:text-base leading-relaxed">
            Dù là gửi trẻ vào chăm sóc hay nhận nuôi một đứa trẻ —<br className="hidden sm:block" />
            mỗi hành động của bạn đều tạo nên sự thay đổi.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link to="/dang-ky" className="px-7 sm:px-8 py-3.5 bg-white text-[#f97316] font-black rounded-xl hover:bg-orange-50 transition shadow-lg text-sm sm:text-base">
              Đăng ký tham gia
            </Link>
            <Link to="/dang-nhap" className="px-7 sm:px-8 py-3.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition border border-white/40 text-sm sm:text-base">
              Đăng nhập
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTACT BAR
      ══════════════════════════════════════════ */}
      <section className="bg-[#f9fafb] border-t border-gray-200 py-10 sm:py-12 px-4 sm:px-6">
        <div ref={contactRef} className="reveal max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>,
              label: 'Địa chỉ',
              value: '85/65 Phạm Viết Chánh, P. Thạnh Mỹ Tây, TP.HCM',
            },
            {
              icon: <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>,
              label: 'Điện thoại',
              value: '(+84) (28) 3840 1406',
            },
            {
              icon: <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>,
              label: 'Email',
              value: 'btxh.hcm@gmail.com',
            },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1d4ed8]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                {icon}
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm sm:text-base text-gray-700 font-semibold leading-snug">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
