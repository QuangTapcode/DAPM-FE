/**
 * Badge — BTXH Design System
 * Dùng cho REQUEST_STATUS (lowercase) lẫn STATUS (uppercase cũ).
 */
const CONFIG = {
  // REQUEST_STATUS (lowercase)
  pending:      { label: 'Đang chờ',        cls: 'bg-amber-100  text-amber-800  border-amber-200'  },
  missing_info: { label: 'Thiếu thông tin', cls: 'bg-orange-100 text-orange-800 border-orange-200' },
  invalid:      { label: 'Không hợp lệ',   cls: 'bg-red-100    text-red-700    border-red-200'    },
  approved:     { label: 'Đã duyệt',        cls: 'bg-green-100  text-green-800  border-green-200'  },
  rejected:     { label: 'Từ chối',         cls: 'bg-red-100    text-red-700    border-red-200'    },
  completed:    { label: 'Hoàn thành',      cls: 'bg-blue-100   text-blue-800   border-blue-200'   },
  processing:   { label: 'Đang xử lý',      cls: 'bg-sky-100    text-sky-800    border-sky-200'    },

  // STATUS (uppercase — backward compat)
  PENDING:      { label: 'Đang chờ',        cls: 'bg-amber-100  text-amber-800  border-amber-200'  },
  PROCESSING:   { label: 'Đang xử lý',      cls: 'bg-sky-100    text-sky-800    border-sky-200'    },
  APPROVED:     { label: 'Đã duyệt',        cls: 'bg-green-100  text-green-800  border-green-200'  },
  REJECTED:     { label: 'Từ chối',         cls: 'bg-red-100    text-red-700    border-red-200'    },
  COMPLETED:    { label: 'Hoàn thành',      cls: 'bg-blue-100   text-blue-800   border-blue-200'   },
};

const FALLBACK = { label: '—', cls: 'bg-gray-100 text-gray-600 border-gray-200' };

/**
 * @param {string}  status   — REQUEST_STATUS / STATUS value
 * @param {string}  [label]  — override label (tùy chọn)
 * @param {'sm'|'md'} [size]
 */
export default function Badge({ status, label, size = 'sm' }) {
  const cfg = CONFIG[status] ?? FALLBACK;
  const text = label ?? cfg.label;
  const sizeClass = size === 'md'
    ? 'px-3 py-1 text-xs'
    : 'px-2 py-0.5 text-[11px]';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeClass} ${cfg.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 flex-shrink-0" />
      {text}
    </span>
  );
}
