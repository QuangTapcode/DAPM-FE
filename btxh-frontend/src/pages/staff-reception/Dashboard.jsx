import { Outlet, useLocation, Link } from 'react-router-dom';

/* ╔══════════════════════════════════════════════════════════════╗
   ║  CẤU HÌNH MENU — Chỉ cần sửa ở đây để thay đổi sidebar    ║
   ╚══════════════════════════════════════════════════════════════╝ */

// ── Base path: thay đổi khi deploy chính thức ──
const BASE = '/preview';

// ── Thông tin ứng dụng ──
const APP = {
  name: 'DAPM',
  subtitle: 'Trung tâm bảo trợ trẻ em',
};

// ── Thông tin người dùng (sau này lấy từ auth context) ──
const USER = {
  name: 'Nguyễn Thị Hoa',
  role: 'Cán bộ tiếp nhận',
  roleLabel: 'Cán bộ tiếp nhận trẻ',
};

// ── Icon SVG paths — dễ thêm/sửa icon mới ──
const ICONS = {
  dashboard:  'M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z',
  clipboard:  'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h4',
  users:      'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0',
  heart:      'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  person:     'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  group:      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  chevron:    'M9 5l7 7-7 7',
};

// ── Cấu trúc menu sidebar ──
// Mỗi section có: group (tên nhóm, null = không có tiêu đề) và items[]
// Mỗi item: id, path (đường dẫn), label (tên hiển thị), icon (key trong ICONS), subPaths (trang con cùng highlight)
const NAV = [
  {
    group: null,
    items: [
      { id: 'dashboard', path: `${BASE}`, label: 'Tổng quan', icon: 'dashboard' },
    ],
  },
  {
    group: 'Quản lý yêu cầu',
    items: [
      {
        id: 'yeu-cau', path: `${BASE}/yeu-cau`, label: 'Danh sách yêu cầu', icon: 'clipboard',
        subPaths: [`${BASE}/chi-tiet`, `${BASE}/tiep-nhan`],
      },
    ],
  },
  {
    group: 'Quản lý trẻ',
    items: [
      {
        id: 'danh-sach-tre', path: `${BASE}/danh-sach-tre`, label: 'Danh sách trẻ', icon: 'users',
        subPaths: [`${BASE}/ho-so`, `${BASE}/suc-khoe`, `${BASE}/kham-moi`],
      },
    ],
  },
];

// ── Tiêu đề breadcrumb cho mỗi trang (path → tên hiển thị) ──
const PAGE_TITLES = {
  [`${BASE}`]:              'Tổng quan',
  [`${BASE}/yeu-cau`]:      'Danh sách yêu cầu gửi trẻ',
  [`${BASE}/chi-tiet`]:     'Duyệt yêu cầu',
  [`${BASE}/tiep-nhan`]:    'Lập hồ sơ tiếp nhận',
  [`${BASE}/danh-sach-tre`]:'Danh sách trẻ trong trung tâm',
  [`${BASE}/ho-so`]:        'Tạo / Cập nhật hồ sơ trẻ',
  [`${BASE}/suc-khoe`]:     'Theo dõi tình trạng sức khỏe',
  [`${BASE}/kham-moi`]:     'Tạo / Cập nhật chỉ số sức khỏe',
};

/* ╔══════════════════════════════════════════════════════════════╗
   ║  THEME — Đổi màu toàn bộ sidebar/topbar tại đây            ║
   ╚══════════════════════════════════════════════════════════════╝ */
const THEME = {
  sidebar: {
    bg: '#0f172a',
    width: 244,
    brandGradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    brandShadow: '0 4px 10px rgba(59,130,246,0.35)',
    roleBoxBg: 'rgba(59,130,246,0.1)',
    roleBoxBorder: '1px solid rgba(59,130,246,0.15)',
    roleLabelColor: '#60a5fa',
    roleValueColor: '#e2e8f0',
    groupColor: '#475569',
    itemColor: '#94a3b8',
    itemActiveColor: '#93c5fd',
    itemActiveBg: 'rgba(59,130,246,0.15)',
    accentBar: '#3b82f6',
  },
  topbar: {
    bg: '#fff',
    border: '1px solid #e2e8f0',
    height: 52,
    breadcrumbColor: '#94a3b8',
    breadcrumbActiveColor: '#0f172a',
    userAvatarGradient: 'linear-gradient(135deg, #2c7a91, #1e5a6b)',
  },
  page: {
    bg: '#f1f5f9',
    font: "'Inter', sans-serif",
  },
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Không cần sửa gì bên dưới trừ khi thay đổi layout
   ═══════════════════════════════════════════════════════════════ */

/** SVG icon nhỏ 17×17, nhận path string từ ICONS map */
const NavIcon = ({ name }) => (
  <svg style={{ width: 17, height: 17, flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d={ICONS[name] || ICONS.dashboard} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"/>
  </svg>
);

export default function Dashboard() {
  const { pathname: rawPath } = useLocation();
  const pathname  = rawPath.replace(/\/$/, '') || BASE;
  const pageTitle = PAGE_TITLES[pathname] || 'Trang';

  const isActive = (item) =>
    pathname === item.path || item.subPaths?.some(sp => pathname === sp);

  const t = THEME;

  return (
    <div style={{ fontFamily: t.page.font, display: 'flex', height: '100vh', overflow: 'hidden', background: t.page.bg }}>

      {/* ══ SIDEBAR ══ */}
      <aside style={{
        width: t.sidebar.width, flexShrink: 0, background: t.sidebar.bg,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
      }}>
        {/* Brand */}
        <div style={{ padding: '18px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: t.sidebar.brandGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: t.sidebar.brandShadow }}>
            <svg style={{ width: 17, height: 17 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={ICONS.group}/>
            </svg>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.3px' }}>{APP.name}</p>
            <p style={{ margin: 0, fontSize: 9.5, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{APP.subtitle}</p>
          </div>
        </div>

        {/* Role badge */}
        <div style={{ margin: '12px 12px 4px', padding: '8px 12px', background: t.sidebar.roleBoxBg, borderRadius: 8, border: t.sidebar.roleBoxBorder }}>
          <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: t.sidebar.roleLabelColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Đăng nhập với vai trò</p>
          <p style={{ margin: '2px 0 0', fontSize: 11.5, fontWeight: 600, color: t.sidebar.roleValueColor }}>{USER.roleLabel}</p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 8px' }}>
          {NAV.map((section, si) => (
            <div key={si} style={{ marginBottom: 2 }}>
              {section.group && (
                <p style={{ margin: '14px 8px 4px', fontSize: 9.5, fontWeight: 700, color: t.sidebar.groupColor, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  {section.group}
                </p>
              )}
              {section.items.map(item => {
                const active = isActive(item);
                return (
                  <Link key={item.id} to={item.path}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px', borderRadius: 8, marginBottom: 1,
                      textDecoration: 'none', position: 'relative',
                      background: active ? t.sidebar.itemActiveBg : 'transparent',
                      color: active ? t.sidebar.itemActiveColor : t.sidebar.itemColor,
                      fontWeight: active ? 600 : 400, fontSize: 13,
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    {active && (
                      <span style={{ position: 'absolute', left: 0, top: '18%', bottom: '18%', width: 3, borderRadius: '0 3px 3px 0', background: t.sidebar.accentBar }}/>
                    )}
                    <NavIcon name={item.icon}/>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* ══ MAIN AREA ══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{ height: t.topbar.height, background: t.topbar.bg, borderBottom: t.topbar.border, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12, flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5 }}>
            <span style={{ color: t.topbar.breadcrumbColor, fontWeight: 500 }}>{USER.role}</span>
            <svg style={{ width: 12, height: 12, color: '#cbd5e1' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={ICONS.chevron}/>
            </svg>
            <span style={{ color: t.topbar.breadcrumbActiveColor, fontWeight: 700 }}>{pageTitle}</span>
          </nav>

          <div style={{ flex: 1 }}/>

          {/* User chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '5px 12px 5px 5px', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fafafa', cursor: 'pointer' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: t.topbar.userAvatarGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={ICONS.person}/>
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11.5, fontWeight: 700, color: '#0f172a' }}>{USER.name}</p>
              <p style={{ margin: 0, fontSize: 9.5, color: '#94a3b8', fontWeight: 500 }}>{USER.role}</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
