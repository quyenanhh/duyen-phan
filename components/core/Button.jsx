import React from 'react';
import { Icon } from './Icon.jsx';

const H = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };
const PAD = { sm: '0 12px', md: '0 16px', lg: '0 24px' };
const FS = { sm: 'var(--fs-label)', md: 'var(--fs-body-sm)', lg: 'var(--fs-body)' };

const VARIANTS = {
  primary: { background: 'var(--brand)', color: 'var(--text-on-brand)', border: '1px solid var(--brand)' },
  secondary: { background: 'var(--surface-card)', color: 'var(--text-body)', border: '1px solid var(--border-strong)' },
  accent: { background: 'var(--accent)', color: '#FFF9F0', border: '1px solid var(--accent)' },
  ghost: { background: 'transparent', color: 'var(--text-brand)', border: '1px solid transparent' },
  danger: { background: 'var(--danger)', color: '#FFF5F2', border: '1px solid var(--danger)' }
};
const HOVER = {
  primary: { background: 'var(--brand-hover)', borderColor: 'var(--brand-hover)' },
  secondary: { background: 'var(--surface-sunken)' },
  accent: { background: 'var(--accent-hover)', borderColor: 'var(--accent-hover)' },
  ghost: { background: 'var(--surface-brand-soft)' },
  danger: { background: '#9C3C28', borderColor: '#9C3C28' }
};

export function Button({ children, variant = 'primary', size = 'md', icon, iconRight, fullWidth, disabled, type = 'button', onClick, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setDown(false); }}
      onMouseDown={() => setDown(true)} onMouseUp={() => setDown(false)}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : undefined,
        alignItems: 'center', justifyContent: 'center', gap: 8,
        height: H[size], padding: PAD[size], fontSize: FS[size], fontWeight: 'var(--fw-medium)',
        fontFamily: 'var(--font-ui)', borderRadius: 'var(--radius-control)', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
        opacity: disabled ? 0.45 : 1, transform: down && !disabled ? 'translateY(1px)' : 'none',
        ...VARIANTS[variant], ...(hover && !disabled ? HOVER[variant] : null), ...style
      }} {...rest}>
      {icon ? <Icon name={icon} size={size === 'lg' ? 20 : 16} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={size === 'lg' ? 20 : 16} /> : null}
    </button>
  );
}
