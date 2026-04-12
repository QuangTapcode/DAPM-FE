import { NavLink } from 'react-router-dom';

/**
 * Sidebar — BTXH Design System
 *
 * @param {Array}  menuItems  — [{ path, label, icon? }]
 * @param {string} [title]    — override section title
 */
export default function Sidebar({ menuItems, title }) {
  return (
    <aside className="w-56 flex-shrink-0 bg-[#1e3a5f] text-blue-100 flex flex-col min-h-full">
      {title && (
        <div className="px-5 py-4 border-b border-white/10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">{title}</p>
        </div>
      )}

      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-[#f97316] text-white font-semibold shadow-sm'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {item.icon && (
              <span className="flex-shrink-0 w-4 h-4 opacity-80">{item.icon}</span>
            )}
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
