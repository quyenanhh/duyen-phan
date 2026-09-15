import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Sidebar({ brand = 'Duyên Phần', subtitle = 'Quản trị chuỗi', items = [], active, onSelect, footer, style }) {
  return (
    <nav style={{
      width: 'var(--sidebar-w)', flex: '0 0 var(--sidebar-w)', minHeight: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--surface-card)', borderRight: '1px solid var(--border)', ...style
    }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border-soft)', display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-control)', background: 'var(--surface-brand-soft)', color: 'var(--brand)', display: 'grid', placeItems: 'center' }}><Icon name="leaf" size={18} /></span>
        <span>
          <span style={{ display: 'block', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-tight)' }}>{brand}</span>
          <span style={{ display: 'block', fontSize: 'var(--fs-caption)', color: 'var(--text-muted)' }}>{subtitle}</span>
        </span>
      </div>
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflowY: 'auto' }}>
        {items.map(it => it.section ? (
          <span key={it.section} style={{ padding: '16px 12px 6px', fontSize: 'var(--fs-caption)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-subtle)', fontWeight: 'var(--fw-semibold)' }}>{it.section}</span>
        ) : (
          <SideItem key={it.id} item={it} active={active === it.id} onSelect={onSelect} />
        ))}
      </div>
      {footer ? <div style={{ padding: 12, borderTop: '1px solid var(--border-soft)' }}>{footer}</div> : null}
    </nav>
  );
}
function SideItem({ item, active, onSelect }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={() => onSelect && onSelect(item.id)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '9px 12px',
        border: 0, cursor: 'pointer', borderRadius: 'var(--radius-control)', fontSize: 'var(--fs-body-sm)',
        fontWeight: active ? 'var(--fw-semibold)' : 'var(--fw-regular)',
        background: active ? 'var(--surface-brand-soft)' : hover ? 'var(--surface-sunken)' : 'transparent',
        color: active ? 'var(--success-text)' : 'var(--text-body)',
        transition: 'background var(--dur-fast) var(--ease-out)'
      }}>
      <Icon name={item.icon} size={18} color={active ? 'var(--brand)' : 'var(--text-muted)'} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge ? <span style={{ fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-medium)', background: 'var(--clay-100)', color: 'var(--text-accent)', borderRadius: 999, padding: '1px 8px' }}>{item.badge}</span> : null}
    </button>
  );
}
