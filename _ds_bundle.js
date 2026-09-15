/* @ds-bundle: {"format":4,"namespace":"DuyNPhNDesignSystem_e06890","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"STATUS_MAP","sourcePath":"components/data/StatusChip.jsx"},{"name":"StatusChip","sourcePath":"components/data/StatusChip.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Pagination","sourcePath":"components/navigation/Pagination.jsx"},{"name":"Sidebar","sourcePath":"components/navigation/Sidebar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"1d762a6a8f0e","components/core/Button.jsx":"d194560fced9","components/core/Card.jsx":"5303b518ade0","components/core/Icon.jsx":"21c642d8c390","components/core/IconButton.jsx":"fc8a07621138","components/core/Tag.jsx":"96c4d8475381","components/data/DataTable.jsx":"df2e0363e78b","components/data/StatCard.jsx":"a620f188c0f6","components/data/StatusChip.jsx":"d127c6129b3d","components/feedback/Dialog.jsx":"bd987af2b80e","components/feedback/EmptyState.jsx":"4caf602a6c9d","components/feedback/Toast.jsx":"bb0c9ee4b954","components/feedback/Tooltip.jsx":"f430cafa7ecb","components/forms/Checkbox.jsx":"2992b17f7516","components/forms/Input.jsx":"998a76ecc5d4","components/forms/Radio.jsx":"01550218db14","components/forms/Select.jsx":"76fbacf367b8","components/forms/Switch.jsx":"dd3a8aecab14","components/forms/Textarea.jsx":"65e228bb24e8","components/navigation/Pagination.jsx":"ceba3652901a","components/navigation/Sidebar.jsx":"63e8b7a9d08d","components/navigation/Tabs.jsx":"3f0c1a92f40b","image-slot.js":"fff26d081c8d","ui_kits/admin/Views.jsx":"594a53845a70","ui_kits/landing/Sections.jsx":"d3a25d5d2cda"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DuyNPhNDesignSystem_e06890 = window.DuyNPhNDesignSystem_e06890 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  children,
  title,
  subtitle,
  actions,
  padding = 24,
  tone = 'card',
  hoverable,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("section", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: tone === 'sunken' ? 'var(--surface-sunken)' : tone === 'soft' ? 'var(--surface-accent-soft)' : 'var(--surface-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-card)',
      boxShadow: hoverable && hover ? 'var(--shadow-raised)' : 'var(--shadow-card)',
      transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
      transform: hoverable && hover ? 'translateY(-2px)' : 'none',
      overflow: 'hidden',
      ...style
    }
  }, rest), title || actions ? /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
      padding: '20px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("div", null, title ? /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--fs-h3)'
    }
  }, title) : null, subtitle ? /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 4,
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-muted)'
    }
  }, subtitle) : null), actions) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: title || actions ? padding ? '16px ' + padding + 'px ' + padding + 'px' : '16px 0 0' : padding + 'px'
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
/* Lucide (outline, 1.5px) is the brand icon set. The UMD build is loaded from CDN by the
   host page (see readme ICONOGRAPHY); this wrapper turns a lucide icon node into an SVG. */
const pascal = n => String(n).replace(/(^|[-_ ])(\w)/g, (_, __, c) => c.toUpperCase());
function Icon({
  name,
  size = 20,
  strokeWidth = 1.5,
  color = 'currentColor',
  title,
  style,
  ...rest
}) {
  const lib = typeof window !== 'undefined' && window.lucide && window.lucide.icons;
  let node = lib ? lib[pascal(name)] : null;
  if (node && node[0] === 'svg') node = node[2] || [];
  const kids = Array.isArray(node) ? node.filter(Array.isArray).map(([tag, attrs], i) => React.createElement(tag, {
    ...attrs,
    key: i
  })) : null;
  return React.createElement('svg', {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': title ? undefined : true,
    role: title ? 'img' : undefined,
    style: {
      display: 'block',
      flex: '0 0 auto',
      ...style
    },
    ...rest
  }, title ? [React.createElement('title', {
    key: 't'
  }, title), kids] : kids);
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const TONES = {
  neutral: {
    bg: 'var(--surface-sunken)',
    fg: 'var(--text-muted)'
  },
  brand: {
    bg: 'var(--surface-brand-soft)',
    fg: 'var(--success-text)'
  },
  accent: {
    bg: 'var(--clay-100)',
    fg: 'var(--text-accent)'
  },
  success: {
    bg: 'var(--success-soft)',
    fg: 'var(--success-text)'
  },
  warning: {
    bg: 'var(--warning-soft)',
    fg: 'var(--warning-text)'
  },
  danger: {
    bg: 'var(--danger-soft)',
    fg: 'var(--danger-text)'
  },
  info: {
    bg: 'var(--info-soft)',
    fg: 'var(--info-text)'
  }
};
function Badge({
  children,
  tone = 'neutral',
  icon,
  dot,
  style
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 'var(--radius-pill)',
      background: t.bg,
      color: t.fg,
      fontSize: 'var(--fs-caption)',
      fontWeight: 'var(--fw-medium)',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
      ...style
    }
  }, dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: 'currentColor'
    }
  }) : null, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 13
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const H = {
  sm: 'var(--control-h-sm)',
  md: 'var(--control-h-md)',
  lg: 'var(--control-h-lg)'
};
const PAD = {
  sm: '0 12px',
  md: '0 16px',
  lg: '0 24px'
};
const FS = {
  sm: 'var(--fs-label)',
  md: 'var(--fs-body-sm)',
  lg: 'var(--fs-body)'
};
const VARIANTS = {
  primary: {
    background: 'var(--brand)',
    color: 'var(--text-on-brand)',
    border: '1px solid var(--brand)'
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-body)',
    border: '1px solid var(--border-strong)'
  },
  accent: {
    background: 'var(--accent)',
    color: '#FFF9F0',
    border: '1px solid var(--accent)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-brand)',
    border: '1px solid transparent'
  },
  danger: {
    background: 'var(--danger)',
    color: '#FFF5F2',
    border: '1px solid var(--danger)'
  }
};
const HOVER = {
  primary: {
    background: 'var(--brand-hover)',
    borderColor: 'var(--brand-hover)'
  },
  secondary: {
    background: 'var(--surface-sunken)'
  },
  accent: {
    background: 'var(--accent-hover)',
    borderColor: 'var(--accent-hover)'
  },
  ghost: {
    background: 'var(--surface-brand-soft)'
  },
  danger: {
    background: '#9C3C28',
    borderColor: '#9C3C28'
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth,
  disabled,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setDown(false);
    },
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: H[size],
      padding: PAD[size],
      fontSize: FS[size],
      fontWeight: 'var(--fw-medium)',
      fontFamily: 'var(--font-ui)',
      borderRadius: 'var(--radius-control)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
      opacity: disabled ? 0.45 : 1,
      transform: down && !disabled ? 'translateY(1px)' : 'none',
      ...VARIANTS[variant],
      ...(hover && !disabled ? HOVER[variant] : null),
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'lg' ? 20 : 16
  }) : null, children, iconRight ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: size === 'lg' ? 20 : 16
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const S = {
  sm: 32,
  md: 40,
  lg: 48
};
function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  disabled,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const base = variant === 'solid' ? {
    background: 'var(--brand)',
    color: 'var(--text-on-brand)',
    border: '1px solid var(--brand)'
  } : variant === 'outline' ? {
    background: 'var(--surface-card)',
    color: 'var(--text-body)',
    border: '1px solid var(--border-strong)'
  } : {
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid transparent'
  };
  const hov = variant === 'solid' ? {
    background: 'var(--brand-hover)'
  } : {
    background: 'var(--surface-sunken)',
    color: 'var(--text-body)'
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: S[size],
      height: S[size],
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-control)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
      ...base,
      ...(hover && !disabled ? hov : null),
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'sm' ? 16 : 20
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function Tag({
  children,
  onRemove,
  selected,
  onClick,
  style
}) {
  const interactive = !!onClick;
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 12px',
      borderRadius: 'var(--radius-pill)',
      fontSize: 'var(--fs-label)',
      fontWeight: 'var(--fw-medium)',
      cursor: interactive ? 'pointer' : 'default',
      background: selected ? 'var(--brand)' : 'var(--surface-accent-soft)',
      color: selected ? 'var(--text-on-brand)' : 'var(--text-accent)',
      border: '1px solid ' + (selected ? 'var(--brand)' : 'var(--clay-100)'),
      transition: 'background var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, children, onRemove ? /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      display: 'flex',
      cursor: 'pointer',
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 13
  })) : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
function DataTable({
  columns = [],
  rows = [],
  onRowClick,
  emptyText = 'Chưa có dữ liệu',
  style
}) {
  const [hover, setHover] = React.useState(-1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      ...style
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      fontSize: 'var(--fs-body-sm)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      textAlign: c.align || 'left',
      padding: '10px 16px',
      whiteSpace: 'nowrap',
      fontSize: 'var(--fs-caption)',
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-muted)',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface-sunken)',
      width: c.width
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, c.label, c.sortable ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevrons-up-down",
    size: 12
  }) : null))))), /*#__PURE__*/React.createElement("tbody", null, rows.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: columns.length,
    style: {
      padding: '32px 16px',
      textAlign: 'center',
      color: 'var(--text-muted)'
    }
  }, emptyText)) : rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: r.id || i,
    onClick: () => onRowClick && onRowClick(r),
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(-1),
    style: {
      cursor: onRowClick ? 'pointer' : 'default',
      background: hover === i ? 'var(--cream-100)' : 'transparent',
      transition: 'background var(--dur-fast) var(--ease-out)'
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      padding: '0 16px',
      height: 'var(--row-h)',
      textAlign: c.align || 'left',
      borderBottom: '1px solid var(--border-soft)',
      color: c.muted ? 'var(--text-muted)' : 'var(--text-body)',
      fontVariantNumeric: c.align === 'right' ? 'tabular-nums' : undefined
    }
  }, c.render ? c.render(r) : r[c.key])))))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
function StatCard({
  label,
  value,
  delta,
  deltaTone = 'success',
  icon,
  style
}) {
  const tone = deltaTone === 'danger' ? 'var(--danger-text)' : deltaTone === 'warning' ? 'var(--warning-text)' : 'var(--success-text)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      padding: 20,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: 'var(--text-muted)'
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-caption)',
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      fontWeight: 'var(--fw-semibold)'
    }
  }, label)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 26,
      fontWeight: 'var(--fw-semibold)',
      letterSpacing: 'var(--ls-tight)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), delta ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 'var(--fs-label)',
      color: tone
    }
  }, delta) : null);
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/data/StatusChip.jsx
try { (() => {
const STATUS_MAP = {
  completed: {
    tone: 'success',
    label: 'Hoàn tất'
  },
  paid: {
    tone: 'success',
    label: 'Đã thanh toán'
  },
  open: {
    tone: 'success',
    label: 'Đang mở'
  },
  processing: {
    tone: 'warning',
    label: 'Đang xử lý'
  },
  pending: {
    tone: 'warning',
    label: 'Chờ xác nhận'
  },
  delivering: {
    tone: 'info',
    label: 'Đang giao'
  },
  scheduled: {
    tone: 'info',
    label: 'Đã đặt trước'
  },
  cancelled: {
    tone: 'danger',
    label: 'Đã huỷ'
  },
  late: {
    tone: 'danger',
    label: 'Trễ'
  },
  draft: {
    tone: 'neutral',
    label: 'Nháp'
  }
};
function StatusChip({
  status,
  label,
  style
}) {
  const s = STATUS_MAP[status] || STATUS_MAP.draft;
  return /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: s.tone,
    dot: true,
    style: style
  }, label || s.label);
}
Object.assign(__ds_scope, { STATUS_MAP, StatusChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatusChip.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  title,
  description,
  children,
  footer,
  width = 480,
  onClose
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(46,42,34,.38)',
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true",
    style: {
      width: '100%',
      maxWidth: width,
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-modal)',
      boxShadow: 'var(--shadow-modal)',
      border: '1px solid var(--border)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      padding: '24px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--fs-h3)'
    }
  }, title), description ? /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 6,
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-muted)'
    }
  }, description) : null), onClose ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "\u0110\xF3ng",
    size: "sm",
    onClick: onClose
  }) : null), children ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px 0'
    }
  }, children) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      padding: 24
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function EmptyState({
  icon = 'soup',
  title,
  description,
  action,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 8,
      padding: '48px 24px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 999,
      background: 'var(--surface-accent-soft)',
      color: 'var(--accent)',
      display: 'grid',
      placeItems: 'center',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-body-lg)',
      fontWeight: 'var(--fw-semibold)'
    }
  }, title), description ? /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: 380,
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-muted)',
      textWrap: 'pretty'
    }
  }, description) : null, action ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, action) : null);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const TONE = {
  success: {
    icon: 'circle-check',
    color: 'var(--success)'
  },
  warning: {
    icon: 'triangle-alert',
    color: 'var(--warning)'
  },
  danger: {
    icon: 'circle-x',
    color: 'var(--danger)'
  },
  info: {
    icon: 'info',
    color: 'var(--info)'
  }
};
function Toast({
  tone = 'success',
  title,
  description,
  onClose,
  style
}) {
  const t = TONE[tone] || TONE.info;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      width: 360,
      padding: 16,
      background: 'var(--surface-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-raised)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: t.icon,
    size: 20,
    color: t.color
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-body-sm)',
      fontWeight: 'var(--fw-semibold)'
    }
  }, title), description ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontSize: 'var(--fs-label)',
      color: 'var(--text-muted)'
    }
  }, description) : null), onClose ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "\u0110\xF3ng",
    size: "sm",
    onClick: onClose
  }) : null);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  label,
  children,
  placement = 'top',
  style
}) {
  const [show, setShow] = React.useState(false);
  const pos = placement === 'bottom' ? {
    top: 'calc(100% + 6px)',
    left: '50%',
    transform: 'translateX(-50%)'
  } : {
    bottom: 'calc(100% + 6px)',
    left: '50%',
    transform: 'translateX(-50%)'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, show ? /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      ...pos,
      zIndex: 40,
      whiteSpace: 'nowrap',
      background: 'var(--surface-inverse)',
      color: 'var(--cream-50)',
      padding: '5px 10px',
      borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--fs-caption)',
      boxShadow: 'var(--shadow-card)',
      ...style
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  indeterminate,
  disabled,
  onChange,
  style
}) {
  const on = checked || indeterminate;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      fontSize: 'var(--fs-body-sm)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      flex: '0 0 auto',
      display: 'grid',
      placeItems: 'center',
      borderRadius: 'var(--radius-sm)',
      background: on ? 'var(--brand)' : 'var(--surface-card)',
      border: '1px solid ' + (on ? 'var(--brand)' : 'var(--border-strong)'),
      color: 'var(--text-on-brand)',
      transition: 'background var(--dur-fast) var(--ease-out)'
    }
  }, indeterminate ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "minus",
    size: 13,
    strokeWidth: 2.5
  }) : checked ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 13,
    strokeWidth: 2.5
  }) : null), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  icon,
  suffix,
  size = 'md',
  disabled,
  style,
  wrapperStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'sm' ? 'var(--control-h-sm)' : size === 'lg' ? 'var(--control-h-lg)' : 'var(--control-h-md)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      ...wrapperStyle
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginBottom: 6,
      fontSize: 'var(--fs-label)',
      fontWeight: 'var(--fw-medium)',
      color: 'var(--text-body)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: h,
      padding: '0 12px',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      border: '1px solid ' + (error ? 'var(--danger)' : focus ? 'var(--brand)' : 'var(--border-strong)'),
      boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
      borderRadius: 'var(--radius-control)',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)'
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16,
    color: "var(--text-subtle)"
  }) : null, /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 0,
      outline: 'none',
      background: 'transparent',
      fontSize: 'var(--fs-body-sm)',
      ...style
    }
  }, rest)), suffix ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-label)',
      color: 'var(--text-subtle)'
    }
  }, suffix) : null), hint || error ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 6,
      fontSize: 'var(--fs-caption)',
      color: error ? 'var(--danger-text)' : 'var(--text-muted)'
    }
  }, error || hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  label,
  checked,
  disabled,
  name,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      fontSize: 'var(--fs-body-sm)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    checked: !!checked,
    disabled: disabled,
    onChange: () => onChange && onChange(true),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      flex: '0 0 auto',
      borderRadius: 999,
      display: 'grid',
      placeItems: 'center',
      background: 'var(--surface-card)',
      border: '1px solid ' + (checked ? 'var(--brand)' : 'var(--border-strong)'),
      transition: 'border-color var(--dur-fast) var(--ease-out)'
    }
  }, checked ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 999,
      background: 'var(--brand)'
    }
  }) : null), label);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  hint,
  error,
  options = [],
  size = 'md',
  disabled,
  style,
  wrapperStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'sm' ? 'var(--control-h-sm)' : size === 'lg' ? 'var(--control-h-lg)' : 'var(--control-h-md)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      ...wrapperStyle
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginBottom: 6,
      fontSize: 'var(--fs-label)',
      fontWeight: 'var(--fw-medium)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      height: h,
      padding: '0 10px 0 12px',
      position: 'relative',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      border: '1px solid ' + (error ? 'var(--danger)' : focus ? 'var(--brand)' : 'var(--border-strong)'),
      boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
      borderRadius: 'var(--radius-control)'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      appearance: 'none',
      border: 0,
      outline: 'none',
      background: 'transparent',
      fontSize: 'var(--fs-body-sm)',
      cursor: 'pointer',
      ...style
    }
  }, rest), options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    color: "var(--text-subtle)"
  })), hint || error ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 6,
      fontSize: 'var(--fs-caption)',
      color: error ? 'var(--danger-text)' : 'var(--text-muted)'
    }
  }, error || hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  disabled,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      fontSize: 'var(--fs-body-sm)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 22,
      flex: '0 0 auto',
      borderRadius: 999,
      padding: 2,
      display: 'flex',
      background: checked ? 'var(--brand)' : 'var(--line-200)',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 999,
      background: 'var(--white)',
      boxShadow: '0 1px 3px rgba(46,42,34,.18)',
      transform: checked ? 'translateX(18px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Textarea({
  label,
  hint,
  error,
  rows = 4,
  disabled,
  style,
  wrapperStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      ...wrapperStyle
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginBottom: 6,
      fontSize: 'var(--fs-label)',
      fontWeight: 'var(--fw-medium)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      display: 'block',
      width: '100%',
      padding: '10px 12px',
      resize: 'vertical',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      fontSize: 'var(--fs-body-sm)',
      lineHeight: 'var(--lh-dense)',
      border: '1px solid ' + (error ? 'var(--danger)' : focus ? 'var(--brand)' : 'var(--border-strong)'),
      boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
      borderRadius: 'var(--radius-control)',
      outline: 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, rest)), hint || error ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 6,
      fontSize: 'var(--fs-caption)',
      color: error ? 'var(--danger-text)' : 'var(--text-muted)'
    }
  }, error || hint) : null);
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Pagination.jsx
try { (() => {
function Pagination({
  page = 1,
  pageCount = 1,
  total,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '12px 16px',
      borderTop: '1px solid var(--border-soft)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-label)',
      color: 'var(--text-muted)'
    }
  }, total != null ? 'Tổng ' + total + ' bản ghi · ' : '', "Trang ", page, "/", pageCount), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "chevron-left",
    label: "Trang tr\u01B0\u1EDBc",
    size: "sm",
    variant: "outline",
    disabled: page <= 1,
    onClick: () => onChange && onChange(page - 1)
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "chevron-right",
    label: "Trang sau",
    size: "sm",
    variant: "outline",
    disabled: page >= pageCount,
    onClick: () => onChange && onChange(page + 1)
  })));
}
Object.assign(__ds_scope, { Pagination });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Pagination.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Sidebar.jsx
try { (() => {
function Sidebar({
  brand = 'Duyên Phần',
  subtitle = 'Quản trị chuỗi',
  items = [],
  active,
  onSelect,
  footer,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      width: 'var(--sidebar-w)',
      flex: '0 0 var(--sidebar-w)',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-card)',
      borderRight: '1px solid var(--border)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 20px 16px',
      borderBottom: '1px solid var(--border-soft)',
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-control)',
      background: 'var(--surface-brand-soft)',
      color: 'var(--brand)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "leaf",
    size: 18
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontWeight: 'var(--fw-semibold)',
      letterSpacing: 'var(--ls-tight)'
    }
  }, brand), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-muted)'
    }
  }, subtitle))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      flex: 1,
      overflowY: 'auto'
    }
  }, items.map(it => it.section ? /*#__PURE__*/React.createElement("span", {
    key: it.section,
    style: {
      padding: '16px 12px 6px',
      fontSize: 'var(--fs-caption)',
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-subtle)',
      fontWeight: 'var(--fw-semibold)'
    }
  }, it.section) : /*#__PURE__*/React.createElement(SideItem, {
    key: it.id,
    item: it,
    active: active === it.id,
    onSelect: onSelect
  }))), footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      borderTop: '1px solid var(--border-soft)'
    }
  }, footer) : null);
}
function SideItem({
  item,
  active,
  onSelect
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => onSelect && onSelect(item.id),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      width: '100%',
      textAlign: 'left',
      padding: '9px 12px',
      border: 0,
      cursor: 'pointer',
      borderRadius: 'var(--radius-control)',
      fontSize: 'var(--fs-body-sm)',
      fontWeight: active ? 'var(--fw-semibold)' : 'var(--fw-regular)',
      background: active ? 'var(--surface-brand-soft)' : hover ? 'var(--surface-sunken)' : 'transparent',
      color: active ? 'var(--success-text)' : 'var(--text-body)',
      transition: 'background var(--dur-fast) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: item.icon,
    size: 18,
    color: active ? 'var(--brand)' : 'var(--text-muted)'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, item.label), item.badge ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-caption)',
      fontWeight: 'var(--fw-medium)',
      background: 'var(--clay-100)',
      color: 'var(--text-accent)',
      borderRadius: 999,
      padding: '1px 8px'
    }
  }, item.badge) : null);
}
Object.assign(__ds_scope, { Sidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Sidebar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 24,
      borderBottom: '1px solid var(--border)',
      ...style
    }
  }, items.map(it => {
    const id = it.id || it;
    const label = it.label || it;
    const on = value === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      role: "tab",
      "aria-selected": on,
      onClick: () => onChange && onChange(id),
      style: {
        border: 0,
        background: 'transparent',
        cursor: 'pointer',
        padding: '0 0 12px',
        fontSize: 'var(--fs-body-sm)',
        fontWeight: on ? 'var(--fw-semibold)' : 'var(--fw-regular)',
        color: on ? 'var(--text-brand)' : 'var(--text-muted)',
        boxShadow: on ? 'inset 0 -2px 0 var(--brand)' : 'none',
        transition: 'color var(--dur-fast) var(--ease-out)'
      }
    }, label, it.count != null ? /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 6,
        color: 'var(--text-subtle)'
      }
    }, it.count) : null);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  // color:inherit (not a fixed near-black): the placeholder chrome —
  // empty-state icon/caption (currentColor) and the dashed ring — must
  // read on dark decks too, and the slide's own text color is the one
  // color guaranteed to contrast with the slide background. The soft
  // look comes from opacity on those parts, not from a baked-in alpha.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.empty .cap,.empty .sub{opacity:.75}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.08)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px}' + '.empty:hover .sub{opacity:1}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;' + '  opacity:.35;transition:border-color .12s,opacity .12s}' + ':host([data-over]) .ring{border-color:#c96442;opacity:1}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(127,127,127,.25);border-top-color:currentColor;' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // Print must ship just the image too: the hover-gated controls can be
  // mid-hover when print() fires, and the credit chip is screen chrome —
  // the same rule the capture window gets, keyed on print media instead
  // of the host's data-om-exporting mark (the print path sets no mark).
  '@media print{.ctl,.credit{display:none !important}}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }

    // A src write is a newer intent for this slot's content — the host
    // pick path (setImageSlotImage) or an agent edit — so it must win
    // over any encode still in flight from an earlier drop: left live,
    // that encode lands later, passes _ingest's gen guard, and its
    // setSlot silently overwrites the pick (the stored value shadows
    // src in _render). Bumping _gen kills the encode before its own
    // _swapGen clear runs, so clear the dead claim here too — otherwise
    // _releaseMask (gated on !_swapGen) never fires and the pick's
    // spinner is stranded. src ONLY: the pick sets credit/credit-href
    // in the same task, and clearing _swapGen on those would let the
    // same-src branch unmask the old image mid-encode.
    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'src' && oldVal !== newVal) {
        this._gen++;
        this._swapGen = 0;
      }
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "image-slot.js", error: String((e && e.message) || e) }); }

// ui_kits/admin/Views.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  IconButton,
  Badge,
  Tag,
  Card,
  Icon,
  Input,
  Select,
  Checkbox,
  Switch,
  Textarea,
  Tabs,
  Pagination,
  DataTable,
  StatusChip,
  StatCard,
  Sidebar,
  Dialog,
  Toast,
  Tooltip,
  EmptyState
} = window.DuyNPhNDesignSystem_e06890;
const NAV = [{
  id: 'dash',
  label: 'Tổng quan',
  icon: 'layout-dashboard'
}, {
  section: 'Vận hành'
}, {
  id: 'orders',
  label: 'Đơn hàng',
  icon: 'receipt-text',
  badge: 12
}, {
  id: 'menu',
  label: 'Thực đơn',
  icon: 'utensils'
}, {
  id: 'branches',
  label: 'Chi nhánh',
  icon: 'store'
}, {
  section: 'Nội bộ'
}, {
  id: 'staff',
  label: 'Nhân sự',
  icon: 'users'
}, {
  id: 'finance',
  label: 'Tài chính',
  icon: 'wallet'
}, {
  id: 'settings',
  label: 'Cài đặt',
  icon: 'settings'
}];
function TopBar({
  title,
  subtitle,
  actions
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      padding: '0 32px',
      height: 'var(--topbar-h)',
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--fs-h3)'
    }
  }, title), subtitle ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-muted)'
    }
  }, subtitle) : null), /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    icon: "search",
    placeholder: "T\xECm \u0111\u01A1n, m\xF3n, nh\xE2n vi\xEAn\u2026",
    wrapperStyle: {
      width: 260
    }
  }), /*#__PURE__*/React.createElement(Tooltip, {
    label: "Th\xF4ng b\xE1o"
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "bell",
    label: "Th\xF4ng b\xE1o"
  })), actions, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      paddingLeft: 16,
      borderLeft: '1px solid var(--border-soft)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 999,
      background: 'var(--clay-100)',
      color: 'var(--text-accent)',
      display: 'grid',
      placeItems: 'center',
      fontWeight: 600,
      fontSize: 12
    }
  }, "AN"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-label)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontWeight: 600
    }
  }, "An Nguy\u1EC5n"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Qu\u1EA3n l\xFD chu\u1ED7i"))));
}
const PAGE = {
  padding: 32,
  display: 'flex',
  flexDirection: 'column',
  gap: 24
};
function Dashboard() {
  const rows = [{
    id: 1,
    code: 'DP-1042',
    br: 'Quận 3',
    t: '14:20',
    total: '385.000₫',
    st: 'delivering'
  }, {
    id: 2,
    code: 'DP-1041',
    br: 'Quận 1',
    t: '13:52',
    total: '1.250.000₫',
    st: 'completed'
  }, {
    id: 3,
    code: 'DP-1040',
    br: 'Tân Bình',
    t: '13:41',
    total: '96.000₫',
    st: 'processing'
  }, {
    id: 4,
    code: 'DP-1039',
    br: 'Quận 1',
    t: '13:02',
    total: '210.000₫',
    st: 'cancelled'
  }, {
    id: 5,
    code: 'DP-1038',
    br: 'Thủ Đức',
    t: '12:47',
    total: '540.000₫',
    st: 'completed'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: PAGE
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "wallet",
    label: "Doanh thu h\xF4m nay",
    value: "18.420.000\u20AB",
    delta: "+8,2% so v\u1EDBi h\xF4m qua"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "receipt-text",
    label: "\u0110\u01A1n h\xE0ng",
    value: "264",
    delta: "+12 \u0111\u01A1n"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "utensils",
    label: "Ph\u1EA7n c\u01A1m \u0111\xE3 b\xE1n",
    value: "1.086",
    delta: "+3,4%"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "clock",
    label: "\u0110\u01A1n tr\u1EC5",
    value: "3",
    delta: "+2 so v\u1EDBi h\xF4m qua",
    deltaTone: "danger"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Doanh thu 7 ng\xE0y",
    subtitle: "T\u1EA5t c\u1EA3 chi nh\xE1nh \xB7 25/08 \u2013 31/08/2026",
    actions: /*#__PURE__*/React.createElement(Select, {
      size: "sm",
      options: ['7 ngày', '30 ngày']
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 16,
      height: 180,
      paddingTop: 8
    }
  }, [[62, '25/08'], [71, '26/08'], [58, '27/08'], [80, '28/08'], [96, '29/08'], [88, '30/08'], [74, '31/08']].map(([h, d], i) => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: h + '%',
      borderRadius: '8px 8px 4px 4px',
      background: i === 6 ? 'var(--brand)' : 'var(--green-300)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-muted)'
    }
  }, d))))), /*#__PURE__*/React.createElement(Card, {
    title: "Chi nh\xE1nh h\xF4m nay",
    subtitle: "Theo doanh thu"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, [['Quận 3 — Võ Văn Tần', '5.240.000₫', 92], ['Quận 1 — Lê Lợi', '4.180.000₫', 74], ['Tân Bình — Hoàng Việt', '3.020.000₫', 54], ['Thủ Đức — Kha Vạn Cân', '2.480.000₫', 44]].map(([n, v, p]) => /*#__PURE__*/React.createElement("div", {
    key: n
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--fs-body-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", null, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums'
    }
  }, v)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      height: 6,
      borderRadius: 999,
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: p + '%',
      height: '100%',
      borderRadius: 999,
      background: 'var(--accent)'
    }
  }))))))), /*#__PURE__*/React.createElement(Card, {
    title: "\u0110\u01A1n h\xE0ng g\u1EA7n \u0111\xE2y",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      iconRight: "arrow-right"
    }, "Xem t\u1EA5t c\u1EA3"),
    padding: 0,
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    onRowClick: () => {},
    columns: [{
      key: 'code',
      label: 'Mã đơn'
    }, {
      key: 'br',
      label: 'Chi nhánh'
    }, {
      key: 't',
      label: 'Giờ',
      muted: true
    }, {
      key: 'total',
      label: 'Tổng tiền',
      align: 'right'
    }, {
      key: 'st',
      label: 'Trạng thái',
      render: r => /*#__PURE__*/React.createElement(StatusChip, {
        status: r.st
      })
    }],
    rows: rows
  })));
}
const ORDERS = [{
  id: 1,
  code: 'DP-1042',
  cus: 'Trần Mỹ Linh',
  br: 'Quận 3',
  items: '3 phần cơm, 1 canh',
  t: '14:20 31/08/2026',
  total: '385.000₫',
  st: 'delivering'
}, {
  id: 2,
  code: 'DP-1041',
  cus: 'Công ty Lá Xanh',
  br: 'Quận 1',
  items: '25 phần cơm hộp',
  t: '13:52 31/08/2026',
  total: '1.250.000₫',
  st: 'completed'
}, {
  id: 3,
  code: 'DP-1040',
  cus: 'Nguyễn Văn Hải',
  br: 'Tân Bình',
  items: '1 cơm sen, 1 chè',
  t: '13:41 31/08/2026',
  total: '96.000₫',
  st: 'processing'
}, {
  id: 4,
  code: 'DP-1039',
  cus: 'Lê Thu Hà',
  br: 'Quận 1',
  items: '2 phần cơm phần',
  t: '13:02 31/08/2026',
  total: '210.000₫',
  st: 'cancelled'
}, {
  id: 5,
  code: 'DP-1038',
  cus: 'Phạm Quốc Anh',
  br: 'Thủ Đức',
  items: '8 phần cơm chay',
  t: '12:47 31/08/2026',
  total: '540.000₫',
  st: 'completed'
}, {
  id: 6,
  code: 'DP-1037',
  cus: 'Đặng Bảo Châu',
  br: 'Quận 3',
  items: '1 gỏi cuốn, 1 canh',
  t: '12:20 31/08/2026',
  total: '87.000₫',
  st: 'late'
}];
function Orders({
  onToast
}) {
  const [tab, setTab] = React.useState('all');
  const [sel, setSel] = React.useState([]);
  const [cancel, setCancel] = React.useState(null);
  const rows = tab === 'all' ? ORDERS : ORDERS.filter(o => tab === 'proc' ? ['processing', 'pending'].includes(o.st) : tab === 'deliv' ? o.st === 'delivering' : o.st === 'late');
  const toggle = id => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  return /*#__PURE__*/React.createElement("div", {
    style: PAGE
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 0
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px 0',
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    options: ['Tất cả chi nhánh', 'Quận 1 — Lê Lợi', 'Quận 3 — Võ Văn Tần', 'Tân Bình', 'Thủ Đức'],
    wrapperStyle: {
      width: 220
    }
  }), /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    icon: "calendar-days",
    defaultValue: "31/08/2026",
    wrapperStyle: {
      width: 160
    }
  }), /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    icon: "search",
    placeholder: "M\xE3 \u0111\u01A1n ho\u1EB7c t\xEAn kh\xE1ch",
    wrapperStyle: {
      width: 240
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), sel.length ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-label)',
      color: 'var(--text-muted)'
    }
  }, "\u0110\xE3 ch\u1ECDn ", sel.length), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    icon: "printer"
  }, "In ho\xE1 \u0111\u01A1n")) : null, /*#__PURE__*/React.createElement(Tooltip, {
    label: "Xu\u1EA5t Excel"
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "download",
    label: "Xu\u1EA5t Excel",
    size: "sm",
    variant: "outline"
  })), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    icon: "plus"
  }, "T\u1EA1o \u0111\u01A1n")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 24px 0'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      id: 'all',
      label: 'Tất cả',
      count: 264
    }, {
      id: 'proc',
      label: 'Đang xử lý',
      count: 9
    }, {
      id: 'deliv',
      label: 'Đang giao',
      count: 4
    }, {
      id: 'late',
      label: 'Trễ',
      count: 3
    }]
  })), rows.length ? /*#__PURE__*/React.createElement(DataTable, {
    onRowClick: () => {},
    rows: rows,
    columns: [{
      key: 'sel',
      label: /*#__PURE__*/React.createElement(Checkbox, {
        indeterminate: sel.length > 0 && sel.length < rows.length,
        checked: sel.length === rows.length,
        onChange: v => setSel(v ? rows.map(r => r.id) : [])
      }),
      width: 44,
      render: r => /*#__PURE__*/React.createElement(Checkbox, {
        checked: sel.includes(r.id),
        onChange: () => toggle(r.id)
      })
    }, {
      key: 'code',
      label: 'Mã đơn',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 600
        }
      }, r.code)
    }, {
      key: 'cus',
      label: 'Khách hàng',
      render: r => /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'block'
        }
      }, r.cus), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 'var(--fs-caption)',
          color: 'var(--text-muted)'
        }
      }, r.items))
    }, {
      key: 'br',
      label: 'Chi nhánh',
      sortable: true
    }, {
      key: 't',
      label: 'Thời gian',
      muted: true
    }, {
      key: 'total',
      label: 'Tổng tiền',
      align: 'right'
    }, {
      key: 'st',
      label: 'Trạng thái',
      render: r => /*#__PURE__*/React.createElement(StatusChip, {
        status: r.st
      })
    }, {
      key: 'act',
      label: '',
      align: 'right',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'flex',
          gap: 4,
          justifyContent: 'flex-end'
        }
      }, /*#__PURE__*/React.createElement(IconButton, {
        icon: "pencil",
        label: "S\u1EEDa \u0111\u01A1n",
        size: "sm"
      }), /*#__PURE__*/React.createElement(IconButton, {
        icon: "x",
        label: "Hu\u1EF7 \u0111\u01A1n",
        size: "sm",
        onClick: e => {
          e.stopPropagation();
          setCancel(r);
        }
      }))
    }]
  }) : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "receipt-text",
    title: "Kh\xF4ng c\xF3 \u0111\u01A1n n\xE0o \u1EDF tr\u1EA1ng th\xE1i n\xE0y",
    description: "Th\u1EED \u0111\u1ED5i b\u1ED9 l\u1ECDc ho\u1EB7c ch\u1ECDn ng\xE0y kh\xE1c.",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => setTab('all')
    }, "Xem t\u1EA5t c\u1EA3 \u0111\u01A1n")
  }), /*#__PURE__*/React.createElement(Pagination, {
    page: 1,
    pageCount: 12,
    total: 264,
    onChange: () => {}
  })), cancel ? /*#__PURE__*/React.createElement(Dialog, {
    title: 'Huỷ đơn ' + cancel.code + '?',
    description: "\u0110\u01A1n \u0111\xE3 hu\u1EF7 kh\xF4ng th\u1EC3 ho\xE0n t\xE1c. Kh\xE1ch s\u1EBD nh\u1EADn th\xF4ng b\xE1o qua SMS.",
    onClose: () => setCancel(null),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => setCancel(null)
    }, "Gi\u1EEF \u0111\u01A1n"), /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      onClick: () => {
        setCancel(null);
        onToast({
          tone: 'danger',
          title: 'Đã huỷ đơn ' + cancel.code,
          description: 'Chi nhánh ' + cancel.br + ' · 14:32 31/08/2026'
        });
      }
    }, "Hu\u1EF7 \u0111\u01A1n"))
  }, /*#__PURE__*/React.createElement(Textarea, {
    label: "L\xFD do hu\u1EF7",
    rows: 2,
    placeholder: "Kh\xE1ch \u0111\u1ED5i \xFD, h\u1EBFt m\xF3n\u2026"
  })) : null);
}
function MenuAdmin({
  onToast
}) {
  const [dishes, setDishes] = React.useState([{
    id: 1,
    n: 'Cơm chay thập cẩm',
    c: 'Cơm phần',
    p: '65.000₫',
    on: true,
    st: 'open'
  }, {
    id: 2,
    n: 'Cơm sen hạt dẻ',
    c: 'Cơm phần',
    p: '78.000₫',
    on: true,
    st: 'open'
  }, {
    id: 3,
    n: 'Canh nấm rong biển',
    c: 'Canh & rau',
    p: '45.000₫',
    on: true,
    st: 'open'
  }, {
    id: 4,
    n: 'Đậu hũ sốt tiêu xanh',
    c: 'Món chính',
    p: '58.000₫',
    on: false,
    st: 'draft'
  }, {
    id: 5,
    n: 'Gỏi cuốn chay',
    c: 'Món cuốn',
    p: '42.000₫',
    on: true,
    st: 'open'
  }, {
    id: 6,
    n: 'Chè hạt sen long nhãn',
    c: 'Tráng miệng',
    p: '32.000₫',
    on: true,
    st: 'open'
  }]);
  const [cat, setCat] = React.useState('Tất cả');
  const toggle = id => {
    setDishes(d => d.map(x => x.id === id ? {
      ...x,
      on: !x.on
    } : x));
    onToast({
      tone: 'success',
      title: 'Đã cập nhật thực đơn',
      description: 'Chi nhánh Quận 3 · 14:20 31/08/2026'
    });
  };
  const cats = ['Tất cả', 'Cơm phần', 'Món chính', 'Canh & rau', 'Món cuốn', 'Tráng miệng'];
  const rows = cat === 'Tất cả' ? dishes : dishes.filter(d => d.c === cat);
  return /*#__PURE__*/React.createElement("div", {
    style: PAGE
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 320px',
      gap: 24,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 0
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px 0',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, cats.map(c => /*#__PURE__*/React.createElement(Tag, {
    key: c,
    selected: cat === c,
    onClick: () => setCat(c)
  }, c)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    icon: "plus"
  }, "Th\xEAm m\xF3n")), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 16
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    rows: rows,
    columns: [{
      key: 'n',
      label: 'Món',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 36,
          height: 36,
          borderRadius: 8,
          background: 'var(--surface-accent-soft)',
          color: 'var(--accent)',
          display: 'grid',
          placeItems: 'center'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "utensils",
        size: 16
      })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'block',
          fontWeight: 600
        }
      }, r.n), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 'var(--fs-caption)',
          color: 'var(--text-muted)'
        }
      }, r.c)))
    }, {
      key: 'p',
      label: 'Giá bán',
      align: 'right'
    }, {
      key: 'st',
      label: 'Trạng thái',
      render: r => /*#__PURE__*/React.createElement(StatusChip, {
        status: r.on ? 'open' : 'draft',
        label: r.on ? 'Đang bán' : 'Nháp'
      })
    }, {
      key: 'on',
      label: 'Hiển thị',
      align: 'right',
      render: r => /*#__PURE__*/React.createElement(Switch, {
        checked: r.on,
        onChange: () => toggle(r.id)
      })
    }]
  })), /*#__PURE__*/React.createElement(Pagination, {
    page: 1,
    pageCount: 4,
    total: 48
  })), /*#__PURE__*/React.createElement(Card, {
    title: "M\xF3n trong ng\xE0y",
    subtitle: "31/08/2026 \xB7 Qu\u1EADn 3"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "T\xEAn m\xF3n",
    defaultValue: "C\u01A1m chay th\u1EADp c\u1EA9m",
    icon: "utensils"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Nh\xF3m m\xF3n",
    options: cats.slice(1)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Gi\xE1 b\xE1n",
    defaultValue: "65.000",
    suffix: "\u20AB"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "S\u1ED1 ph\u1EA7n n\u1EA5u h\xF4m nay",
    defaultValue: "120",
    hint: "N\u1EA5u v\u1EEBa \u0111\u1EE7, h\u1EA1n ch\u1EBF d\u01B0."
  }), /*#__PURE__*/React.createElement(Textarea, {
    label: "M\xF4 t\u1EA3",
    rows: 3,
    defaultValue: "G\u1EA1o l\u1EE9t, \u0111\u1EADu h\u0169 \xE1p ch\u1EA3o, rau c\u1EE7 h\u1EA5p theo m\xF9a."
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Cho ph\xE9p giao h\xE0ng",
    checked: true,
    onChange: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: () => onToast({
      tone: 'success',
      title: 'Đã lưu món',
      description: 'Cơm chay thập cẩm · 65.000₫'
    })
  }, "L\u01B0u m\xF3n"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "Hu\u1EF7"))))));
}
function Staff() {
  const rows = [{
    id: 1,
    n: 'An Nguyễn',
    r: 'Quản lý chuỗi',
    br: 'Trụ sở',
    sh: 'Hành chính',
    st: 'open',
    p: '0901 234 567'
  }, {
    id: 2,
    n: 'Trần Văn Bình',
    r: 'Bếp trưởng',
    br: 'Quận 3',
    sh: 'Sáng 06:00–14:00',
    st: 'open',
    p: '0902 345 678'
  }, {
    id: 3,
    n: 'Lê Thị Cúc',
    r: 'Phục vụ',
    br: 'Quận 1',
    sh: 'Chiều 14:00–22:00',
    st: 'processing',
    p: '0903 456 789'
  }, {
    id: 4,
    n: 'Phạm Minh Dũng',
    r: 'Giao hàng',
    br: 'Tân Bình',
    sh: 'Sáng 09:00–17:00',
    st: 'delivering',
    p: '0904 567 890'
  }, {
    id: 5,
    n: 'Võ Thu Hằng',
    r: 'Thu ngân',
    br: 'Thủ Đức',
    sh: 'Nghỉ phép',
    st: 'draft',
    p: '0905 678 901'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: PAGE
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "users",
    label: "Nh\xE2n s\u1EF1 \u0111ang l\xE0m",
    value: "186",
    delta: "+4 th\xE1ng n\xE0y"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "calendar-days",
    label: "Ca h\xF4m nay",
    value: "42/45",
    delta: "3 ca ch\u01B0a x\u1EBFp",
    deltaTone: "warning"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "wallet",
    label: "Qu\u1EF9 l\u01B0\u01A1ng th\xE1ng 8",
    value: "1.284.000.000\u20AB"
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Danh s\xE1ch nh\xE2n vi\xEAn",
    subtitle: "T\u1EA5t c\u1EA3 chi nh\xE1nh",
    actions: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      icon: "upload"
    }, "Nh\u1EADp CSV"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      icon: "user-plus"
    }, "Th\xEAm nh\xE2n vi\xEAn")),
    padding: 0,
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    rows: rows,
    onRowClick: () => {},
    columns: [{
      key: 'n',
      label: 'Nhân viên',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 32,
          height: 32,
          borderRadius: 999,
          background: 'var(--surface-brand-soft)',
          color: 'var(--success-text)',
          display: 'grid',
          placeItems: 'center',
          fontWeight: 600,
          fontSize: 12
        }
      }, r.n.split(' ').map(w => w[0]).slice(0, 2).join('')), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'block',
          fontWeight: 600
        }
      }, r.n), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 'var(--fs-caption)',
          color: 'var(--text-muted)'
        }
      }, r.p)))
    }, {
      key: 'r',
      label: 'Vai trò'
    }, {
      key: 'br',
      label: 'Chi nhánh',
      sortable: true
    }, {
      key: 'sh',
      label: 'Ca làm',
      muted: true
    }, {
      key: 'st',
      label: 'Trạng thái',
      render: r => /*#__PURE__*/React.createElement(StatusChip, {
        status: r.st,
        label: {
          open: 'Đang làm',
          processing: 'Đang ca',
          delivering: 'Trên đường',
          draft: 'Nghỉ phép'
        }[r.st]
      })
    }, {
      key: 'act',
      label: '',
      align: 'right',
      render: () => /*#__PURE__*/React.createElement(IconButton, {
        icon: "ellipsis",
        label: "Tu\u1EF3 ch\u1ECDn",
        size: "sm"
      })
    }]
  }), /*#__PURE__*/React.createElement(Pagination, {
    page: 1,
    pageCount: 19,
    total: 186
  })));
}
function Placeholder({
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: PAGE
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 0
  }, /*#__PURE__*/React.createElement(EmptyState, {
    icon: "hard-hat",
    title: title + ' — chưa có thiết kế',
    description: "Ph\u1EA7n n\xE0y ch\u01B0a \u0111\u01B0\u1EE3c cung c\u1EA5p trong t\xE0i li\u1EC7u th\u01B0\u01A1ng hi\u1EC7u, n\xEAn UI kit \u0111\u1EC3 tr\u1ED1ng thay v\xEC t\u1EF1 ngh\u0129 ra."
  })));
}
function AdminApp() {
  const [logged, setLogged] = React.useState(false);
  const [view, setView] = React.useState('dash');
  const [toast, setToast] = React.useState(null);
  const onToast = t => {
    setToast(t);
    setTimeout(() => setToast(null), 3200);
  };
  if (!logged) return /*#__PURE__*/React.createElement(LoginScreen, {
    onLogin: () => setLogged(true)
  });
  const titles = {
    dash: ['Tổng quan', 'Cập nhật 14:32 · 31/08/2026'],
    orders: ['Đơn hàng', '264 đơn hôm nay · 12 chi nhánh'],
    menu: ['Thực đơn', '48 món · 6 nhóm'],
    staff: ['Nhân sự', '186 nhân viên'],
    branches: ['Chi nhánh', '12 chi nhánh'],
    finance: ['Tài chính', 'Kỳ 08/2026'],
    settings: ['Cài đặt', '']
  };
  const [t, s] = titles[view] || ['', ''];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    items: NAV,
    active: view,
    onSelect: setView,
    style: {
      position: 'sticky',
      top: 0,
      height: '100vh'
    },
    footer: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 28,
        height: 28,
        borderRadius: 999,
        background: 'var(--clay-100)',
        color: 'var(--text-accent)',
        display: 'grid',
        placeItems: 'center',
        fontWeight: 600,
        fontSize: 11
      }
    }, "AN"), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 'var(--fs-label)'
      }
    }, "An Nguy\u1EC5n"), /*#__PURE__*/React.createElement(IconButton, {
      icon: "log-out",
      label: "\u0110\u0103ng xu\u1EA5t",
      size: "sm",
      onClick: () => setLogged(false)
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    title: t,
    subtitle: s,
    actions: view === 'orders' ? /*#__PURE__*/React.createElement(Button, {
      icon: "plus"
    }, "T\u1EA1o \u0111\u01A1n") : null
  }), view === 'dash' ? /*#__PURE__*/React.createElement(Dashboard, null) : view === 'orders' ? /*#__PURE__*/React.createElement(Orders, {
    onToast: onToast
  }) : view === 'menu' ? /*#__PURE__*/React.createElement(MenuAdmin, {
    onToast: onToast
  }) : view === 'staff' ? /*#__PURE__*/React.createElement(Staff, null) : /*#__PURE__*/React.createElement(Placeholder, {
    title: t
  })), toast ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      right: 24,
      bottom: 24,
      zIndex: 60
    }
  }, /*#__PURE__*/React.createElement(Toast, _extends({}, toast, {
    onClose: () => setToast(null)
  }))) : null);
}
function LoginScreen({
  onLogin
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-inverse)',
      color: 'var(--cream-50)',
      padding: '56px 64px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: 'var(--ls-tight)'
    }
  }, "Duy\xEAn Ph\u1EA7n"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-caption)',
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      color: 'var(--clay-300)',
      fontWeight: 600
    }
  }, "H\u1EC7 th\u1ED1ng qu\u1EA3n tr\u1ECB chu\u1ED7i"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 38,
      marginTop: 14,
      color: 'var(--cream-50)',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: 'var(--ls-tight)'
    }
  }, "\u0110i\u1EC1u h\xE0nh 12 chi nh\xE1nh", /*#__PURE__*/React.createElement("br", null), "tr\xEAn m\u1ED9t m\xE0n h\xECnh"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 14,
      color: 'var(--green-300)',
      maxWidth: 380
    }
  }, "Th\u1EF1c \u0111\u01A1n, \u0111\u01A1n h\xE0ng, nh\xE2n s\u1EF1 v\xE0 t\xE0i ch\xEDnh \u2014 c\u1EADp nh\u1EADt theo th\u1EDDi gian th\u1EF1c.")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-caption)',
      color: 'var(--green-300)'
    }
  }, "N\u1ED9i b\u1ED9 \xB7 v2.4 \xB7 H\u1ED7 tr\u1EE3 IT: 1900 6088 ext. 2")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      placeItems: 'center',
      padding: 32
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      width: '100%',
      maxWidth: 400
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--fs-h2)'
    }
  }, "\u0110\u0103ng nh\u1EADp"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 6,
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-muted)'
    }
  }, "D\xF9ng email n\u1ED9i b\u1ED9 @duyenphan.vn"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    defaultValue: "an.nguyen@duyenphan.vn",
    icon: "mail"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "M\u1EADt kh\u1EA9u",
    type: "password",
    defaultValue: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    icon: "lock"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Ghi nh\u1EDB \u0111\u0103ng nh\u1EADp",
    checked: true,
    onChange: () => {}
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontSize: 'var(--fs-label)'
    }
  }, "Qu\xEAn m\u1EADt kh\u1EA9u?")), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    size: "lg",
    onClick: onLogin
  }, "\u0110\u0103ng nh\u1EADp")))));
}
Object.assign(window, {
  AdminApp,
  LoginScreen,
  Dashboard,
  Orders,
  MenuAdmin,
  Staff,
  TopBar,
  NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/Views.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Sections.jsx
try { (() => {
const {
  Button,
  Badge,
  Tag,
  Card,
  Icon,
  Input
} = window.DuyNPhNDesignSystem_e06890;
const WRAP = {
  maxWidth: 'var(--page-max)',
  margin: '0 auto',
  padding: '0 32px'
};
const CAPS = {
  fontSize: 'var(--fs-caption)',
  letterSpacing: 'var(--ls-caps)',
  textTransform: 'uppercase',
  fontWeight: 'var(--fw-semibold)',
  color: 'var(--text-accent)'
};
function Photo({
  label,
  h = 240,
  tone = 'clay',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: h,
      borderRadius: 'var(--radius-card)',
      background: tone === 'green' ? 'var(--surface-brand-soft)' : 'var(--surface-accent-soft)',
      border: '1px dashed var(--clay-300)',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--text-accent)',
      fontSize: 'var(--fs-label)',
      gap: 6,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "image",
    size: 20
  }), label));
}
function Nav({
  page,
  onNav
}) {
  const links = [['menu', 'Thực đơn'], ['story', 'Câu chuyện'], ['branch', 'Chi nhánh'], ['contact', 'Liên hệ']];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'rgba(250,247,242,.88)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...WRAP,
      height: 72,
      display: 'flex',
      alignItems: 'center',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('home');
    },
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 22,
      fontWeight: 600,
      color: 'var(--text-brand)',
      textDecoration: 'none'
    }
  }, "Duy\xEAn Ph\u1EA7n"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 28,
      flex: 1,
      fontSize: 'var(--fs-body-sm)'
    }
  }, links.map(([id, l]) => /*#__PURE__*/React.createElement("a", {
    key: id,
    href: '#' + id,
    onClick: e => {
      e.preventDefault();
      onNav(id);
    },
    style: {
      color: page === id ? 'var(--text-brand)' : 'var(--text-muted)',
      fontWeight: page === id ? 600 : 400,
      textDecoration: 'none'
    }
  }, l))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 'var(--fs-label)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone",
    size: 15
  }), "1900 6088"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    icon: "calendar-days"
  }, "\u0110\u1EB7t b\xE0n"))));
}
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...WRAP,
      paddingTop: 72,
      paddingBottom: 72,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: CAPS
  }, "C\u01A1m chay thu\u1EA7n Vi\u1EC7t \xB7 t\u1EEB 2016"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 52,
      lineHeight: 1.15,
      marginTop: 16,
      fontWeight: 600
    }
  }, "M\u1ED9t b\u1EEFa c\u01A1m l\xE0nh,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      color: 'var(--text-accent)'
    }
  }, "n\u1EA5u b\u1EB1ng s\u1EF1 t\u1EED t\u1EBF")), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 20,
      fontSize: 'var(--fs-body-lg)',
      color: 'var(--text-muted)',
      maxWidth: 460,
      textWrap: 'pretty'
    }
  }, "Rau c\u1EE7 theo m\xF9a, g\u1EA1o l\u1EE9t v\xE0 \u0111\u1EADu h\u0169 l\xE0m m\u1ED7i s\xE1ng. Ch\xFAng t\xF4i n\u1EA5u v\u1EEBa \u0111\u1EE7 cho m\u1ED9t ng\xE0y, kh\xF4ng ph\xF4 tr\u01B0\u01A1ng, kh\xF4ng d\u01B0 th\u1EEBa."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    icon: "utensils"
  }, "Xem th\u1EF1c \u0111\u01A1n h\xF4m nay"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    icon: "map-pin"
  }, "T\xECm chi nh\xE1nh")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      marginTop: 40,
      paddingTop: 24,
      borderTop: '1px solid var(--border)'
    }
  }, [['12', 'chi nhánh'], ['48', 'món theo mùa'], ['9 năm', 'nấu chay mỗi ngày']].map(([n, l]) => /*#__PURE__*/React.createElement("span", {
    key: l
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 24,
      fontWeight: 600
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-label)',
      color: 'var(--text-muted)'
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    label: "\u1EA2nh m\xE2m c\u01A1m chay",
    h: 300,
    style: {
      gridColumn: '1 / -1'
    }
  }), /*#__PURE__*/React.createElement(Photo, {
    label: "\u1EA2nh b\u1EBFp",
    h: 160,
    tone: "green"
  }), /*#__PURE__*/React.createElement(Photo, {
    label: "\u1EA2nh rau c\u1EE7",
    h: 160
  })));
}
function MenuSection() {
  const cats = ['Tất cả', 'Cơm phần', 'Món chính', 'Canh & rau', 'Món cuốn', 'Tráng miệng'];
  const [cat, setCat] = React.useState('Tất cả');
  const dishes = [{
    n: 'Cơm chay thập cẩm',
    d: 'Gạo lứt, đậu hũ áp chảo, rau củ hấp',
    p: '65.000₫',
    tag: 'Món ngày'
  }, {
    n: 'Canh nấm rong biển',
    d: 'Nấm hương, rong biển, cà rốt',
    p: '45.000₫'
  }, {
    n: 'Đậu hũ sốt tiêu xanh',
    d: 'Đậu hũ non, tiêu xanh Phú Quốc',
    p: '58.000₫',
    tag: 'Món mới'
  }, {
    n: 'Gỏi cuốn chay',
    d: 'Bún tươi, nấm, rau thơm · 4 cuốn',
    p: '42.000₫'
  }, {
    n: 'Cơm sen hạt dẻ',
    d: 'Gạo sen, hạt dẻ rang, lá sen hấp',
    p: '78.000₫'
  }, {
    n: 'Chè hạt sen long nhãn',
    d: 'Sen Đồng Tháp, long nhãn Hưng Yên',
    p: '32.000₫'
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "menu",
    style: {
      background: 'var(--surface-card)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '80px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: WRAP
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: CAPS
  }, "Th\u1EF1c \u0111\u01A1n"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 36,
      marginTop: 12,
      fontWeight: 600
    }
  }, "N\u1EA5u theo m\xF9a, \u0111\u1ED5i theo ng\xE0y")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontSize: 'var(--fs-body-sm)',
      fontWeight: 500
    }
  }, "T\u1EA3i th\u1EF1c \u0111\u01A1n tu\u1EA7n (PDF)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 28,
      flexWrap: 'wrap'
    }
  }, cats.map(c => /*#__PURE__*/React.createElement(Tag, {
    key: c,
    selected: cat === c,
    onClick: () => setCat(c)
  }, c))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 24,
      marginTop: 28
    }
  }, dishes.map(d => /*#__PURE__*/React.createElement(Card, {
    key: d.n,
    hoverable: true,
    padding: 0
  }, /*#__PURE__*/React.createElement(Photo, {
    label: "\u1EA2nh m\xF3n",
    h: 168
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--fs-h3)'
    }
  }, d.n), d.tag ? /*#__PURE__*/React.createElement(Badge, {
    tone: "accent"
  }, d.tag) : null), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 6,
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-muted)'
    }
  }, d.d), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums'
    }
  }, d.p), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    iconRight: "arrow-right"
  }, "Chi ti\u1EBFt"))))))));
}
function StorySection() {
  return /*#__PURE__*/React.createElement("section", {
    id: "story",
    style: {
      ...WRAP,
      padding: '80px 32px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    label: "\u1EA2nh ng\u01B0\u1EDDi n\u1EA5u",
    h: 380,
    tone: "green"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: CAPS
  }, "C\xE2u chuy\u1EC7n"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 36,
      marginTop: 12,
      fontWeight: 600
    }
  }, "Duy\xEAn ph\u1EA7n \u2014 c\xE1i duy\xEAn c\u1EE7a m\u1ED9t b\u1EEFa c\u01A1m"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      fontSize: 'var(--fs-body-lg)',
      color: 'var(--text-muted)',
      textWrap: 'pretty'
    }
  }, "B\u1EAFt \u0111\u1EA7u t\u1EEB m\u1ED9t qu\xE1n nh\u1ECF \u1EDF Qu\u1EADn 3 n\u0103m 2016, ch\xFAng t\xF4i v\u1EABn gi\u1EEF m\u1ED9t nguy\xEAn t\u1EAFc: n\u1EA5u \u0111\u1EE7 \u0103n trong ng\xE0y, kh\xF4ng \u0111\u1EC3 th\u1EEBa."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 20,
      marginTop: 32
    }
  }, [['sprout', 'Rau củ theo mùa', 'Đặt hàng trực tiếp từ nông trại Đà Lạt và Long Khánh.'], ['soup', 'Nấu vừa đủ', 'Mỗi bếp nấu theo số phần đã đặt, hạn chế thức ăn dư.'], ['heart-handshake', 'Giá phải chăng', 'Cơm phần từ 45.000₫, phần chay miễn phí mỗi rằm.']].map(([i, t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-control)',
      background: 'var(--surface-brand-soft)',
      color: 'var(--brand)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: i,
    size: 20
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontWeight: 600
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-muted)'
    }
  }, d)))))));
}
function BranchSection() {
  const br = [{
    n: 'Quận 3 — Võ Văn Tần',
    h: '10:00 – 21:00',
    s: 'Đang mở'
  }, {
    n: 'Quận 1 — Lê Lợi',
    h: '10:00 – 22:00',
    s: 'Đang mở'
  }, {
    n: 'Tân Bình — Hoàng Việt',
    h: '10:00 – 20:30',
    s: 'Sắp đóng'
  }, {
    n: 'Thủ Đức — Kha Vạn Cân',
    h: '10:00 – 21:00',
    s: 'Đang mở'
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "branch",
    style: {
      background: 'var(--surface-inverse)',
      color: 'var(--cream-50)',
      padding: '80px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: WRAP
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      ...CAPS,
      color: 'var(--clay-300)'
    }
  }, "Chi nh\xE1nh"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 36,
      marginTop: 12,
      color: 'var(--cream-50)',
      fontWeight: 600
    }
  }, "12 chi nh\xE1nh t\u1EA1i TP.HCM v\xE0 H\xE0 N\u1ED9i"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      color: 'var(--green-300)',
      fontSize: 'var(--fs-body-lg)'
    }
  }, "Giao trong b\xE1n k\xEDnh 5km. \u0110\u1EB7t tr\u01B0\u1EDBc 11:00 \u0111\u1EC3 nh\u1EADn c\u01A1m tr\u01B0a \u0111\xFAng gi\u1EDD."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 28,
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Nh\u1EADp \u0111\u1ECBa ch\u1EC9 c\u1EE7a b\u1EA1n",
    icon: "map-pin",
    wrapperStyle: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "accent"
  }, "T\xECm"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12
    }
  }, br.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.n,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '16px 20px',
      borderRadius: 'var(--radius-card)',
      background: 'rgba(255,253,250,.06)',
      border: '1px solid rgba(255,253,250,.12)'
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontWeight: 600
    }
  }, b.n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-label)',
      color: 'var(--green-300)'
    }
  }, b.h)), /*#__PURE__*/React.createElement(Badge, {
    tone: b.s === 'Đang mở' ? 'brand' : 'warning',
    dot: true
  }, b.s)))))));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    id: "contact",
    style: {
      borderTop: '1px solid var(--border)',
      padding: '56px 0 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...WRAP,
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1.4fr',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 22,
      fontWeight: 600,
      color: 'var(--text-brand)'
    }
  }, "Duy\xEAn Ph\u1EA7n"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 10,
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-muted)',
      maxWidth: 260
    }
  }, "Chu\u1ED7i nh\xE0 h\xE0ng c\u01A1m chay thu\u1EA7n Vi\u1EC7t. N\u1EA5u v\u1EEBa \u0111\u1EE7, \u0103n v\u1EEBa l\xE0nh.")), [['Thực đơn', ['Cơm phần', 'Món chính', 'Canh & rau', 'Tráng miệng']], ['Về chúng tôi', ['Câu chuyện', 'Tuyển dụng', 'Nhượng quyền', 'Liên hệ']]].map(([t, ls]) => /*#__PURE__*/React.createElement("div", {
    key: t
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-label)',
      fontWeight: 600,
      marginBottom: 12
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontSize: 'var(--fs-body-sm)'
    }
  }, ls.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: 'var(--text-muted)'
    }
  }, l))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-label)',
      fontWeight: 600,
      marginBottom: 12
    }
  }, "Nh\u1EADn th\u1EF1c \u0111\u01A1n tu\u1EA7n"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Email c\u1EE7a b\u1EA1n",
    wrapperStyle: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, null, "G\u1EEDi")), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 10,
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-subtle)'
    }
  }, "M\u1ED7i th\u1EE9 Hai, m\u1ED9t email. Hu\u1EF7 b\u1EA5t c\u1EE9 l\xFAc n\xE0o."))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...WRAP,
      marginTop: 40,
      paddingTop: 20,
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Duy\xEAn Ph\u1EA7n. Gi\u1EA5y ph\xE9p \u0110KKD 0312xxxxxx."), /*#__PURE__*/React.createElement("span", null, "1900 6088 \xB7 xinchao@duyenphan.vn")));
}
function LandingPage() {
  const [page, setPage] = React.useState('home');
  const onNav = id => {
    setPage(id);
    const el = document.getElementById(id);
    if (el) window.scrollTo({
      top: el.offsetTop - 72,
      behavior: 'smooth'
    });
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Nav, {
    page: page,
    onNav: onNav
  }), /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(MenuSection, null), /*#__PURE__*/React.createElement(StorySection, null), /*#__PURE__*/React.createElement(BranchSection, null), /*#__PURE__*/React.createElement(Footer, null));
}
Object.assign(window, {
  LandingPage,
  Nav,
  Hero,
  MenuSection,
  StorySection,
  BranchSection,
  Footer,
  Photo
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.STATUS_MAP = __ds_scope.STATUS_MAP;

__ds_ns.StatusChip = __ds_scope.StatusChip;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Pagination = __ds_scope.Pagination;

__ds_ns.Sidebar = __ds_scope.Sidebar;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
