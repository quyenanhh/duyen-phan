import React from 'react';
export function Radio({ label, checked, disabled, name, onChange, style }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, fontSize: 'var(--fs-body-sm)', ...style }}>
      <input type="radio" name={name} checked={!!checked} disabled={disabled} onChange={() => onChange && onChange(true)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span style={{
        width: 18, height: 18, flex: '0 0 auto', borderRadius: 999, display: 'grid', placeItems: 'center',
        background: 'var(--surface-card)', border: '1px solid ' + (checked ? 'var(--brand)' : 'var(--border-strong)'),
        transition: 'border-color var(--dur-fast) var(--ease-out)'
      }}>
        {checked ? <span style={{ width: 9, height: 9, borderRadius: 999, background: 'var(--brand)' }} /> : null}
      </span>
      {label}
    </label>
  );
}
