import React from 'react';
import { Icon } from './Icon.jsx';
const S = { sm: 32, md: 40, lg: 48 };
export function IconButton({ icon, label, size = 'md', variant = 'ghost', disabled, onClick, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const base = variant === 'solid'
    ? { background: 'var(--brand)', color: 'var(--text-on-brand)', border: '1px solid var(--brand)' }
    : variant === 'outline'
      ? { background: 'var(--surface-card)', color: 'var(--text-body)', border: '1px solid var(--border-strong)' }
      : { background: 'transparent', color: 'var(--text-muted)', border: '1px solid transparent' };
  const hov = variant === 'solid' ? { background: 'var(--brand-hover)' }
    : { background: 'var(--surface-sunken)', color: 'var(--text-body)' };
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: S[size], height: S[size], display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-control)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1,
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
        ...base, ...(hover && !disabled ? hov : null), ...style
      }} {...rest}>
      <Icon name={icon} size={size === 'sm' ? 16 : 20} />
    </button>
  );
}
