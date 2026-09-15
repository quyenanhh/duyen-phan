import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Input({ label, hint, error, icon, suffix, size = 'md', disabled, style, wrapperStyle, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'sm' ? 'var(--control-h-sm)' : size === 'lg' ? 'var(--control-h-lg)' : 'var(--control-h-md)';
  return (
    <label style={{ display: 'block', ...wrapperStyle }}>
      {label ? <span style={{ display: 'block', marginBottom: 6, fontSize: 'var(--fs-label)', fontWeight: 'var(--fw-medium)', color: 'var(--text-body)' }}>{label}</span> : null}
      <span style={{
        display: 'flex', alignItems: 'center', gap: 8, height: h, padding: '0 12px',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1px solid ' + (error ? 'var(--danger)' : focus ? 'var(--brand)' : 'var(--border-strong)'),
        boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
        borderRadius: 'var(--radius-control)', transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)'
      }}>
        {icon ? <Icon name={icon} size={16} color="var(--text-subtle)" /> : null}
        <input disabled={disabled} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', fontSize: 'var(--fs-body-sm)', ...style }} {...rest} />
        {suffix ? <span style={{ fontSize: 'var(--fs-label)', color: 'var(--text-subtle)' }}>{suffix}</span> : null}
      </span>
      {(hint || error) ? <span style={{ display: 'block', marginTop: 6, fontSize: 'var(--fs-caption)', color: error ? 'var(--danger-text)' : 'var(--text-muted)' }}>{error || hint}</span> : null}
    </label>
  );
}
