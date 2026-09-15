import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Checkbox({ label, checked, indeterminate, disabled, onChange, style }) {
  const on = checked || indeterminate;
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, fontSize: 'var(--fs-body-sm)', ...style }}>
      <input type="checkbox" checked={!!checked} disabled={disabled} onChange={e => onChange && onChange(e.target.checked)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span style={{
        width: 18, height: 18, flex: '0 0 auto', display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-sm)',
        background: on ? 'var(--brand)' : 'var(--surface-card)', border: '1px solid ' + (on ? 'var(--brand)' : 'var(--border-strong)'),
        color: 'var(--text-on-brand)', transition: 'background var(--dur-fast) var(--ease-out)'
      }}>
        {indeterminate ? <Icon name="minus" size={13} strokeWidth={2.5} /> : checked ? <Icon name="check" size={13} strokeWidth={2.5} /> : null}
      </span>
      {label}
    </label>
  );
}
