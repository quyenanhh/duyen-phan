import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Select({ label, hint, error, options = [], size = 'md', disabled, style, wrapperStyle, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'sm' ? 'var(--control-h-sm)' : size === 'lg' ? 'var(--control-h-lg)' : 'var(--control-h-md)';
  return (
    <label style={{ display: 'block', ...wrapperStyle }}>
      {label ? <span style={{ display: 'block', marginBottom: 6, fontSize: 'var(--fs-label)', fontWeight: 'var(--fw-medium)' }}>{label}</span> : null}
      <span style={{
        display: 'flex', alignItems: 'center', height: h, padding: '0 10px 0 12px', position: 'relative',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1px solid ' + (error ? 'var(--danger)' : focus ? 'var(--brand)' : 'var(--border-strong)'),
        boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none', borderRadius: 'var(--radius-control)'
      }}>
        <select disabled={disabled} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ flex: 1, appearance: 'none', border: 0, outline: 'none', background: 'transparent', fontSize: 'var(--fs-body-sm)', cursor: 'pointer', ...style }} {...rest}>
          {options.map(o => {
            const v = typeof o === 'string' ? o : o.value;
            const l = typeof o === 'string' ? o : o.label;
            return <option key={v} value={v}>{l}</option>;
          })}
        </select>
        <Icon name="chevron-down" size={16} color="var(--text-subtle)" />
      </span>
      {(hint || error) ? <span style={{ display: 'block', marginTop: 6, fontSize: 'var(--fs-caption)', color: error ? 'var(--danger-text)' : 'var(--text-muted)' }}>{error || hint}</span> : null}
    </label>
  );
}
