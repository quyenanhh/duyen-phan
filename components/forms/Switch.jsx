import React from 'react';
export function Switch({ label, checked, disabled, onChange, style }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 12, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, fontSize: 'var(--fs-body-sm)', ...style }}>
      <input type="checkbox" checked={!!checked} disabled={disabled} onChange={e => onChange && onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span style={{
        width: 40, height: 22, flex: '0 0 auto', borderRadius: 999, padding: 2, display: 'flex',
        background: checked ? 'var(--brand)' : 'var(--line-200)', transition: 'background var(--dur-base) var(--ease-out)'
      }}>
        <span style={{
          width: 18, height: 18, borderRadius: 999, background: 'var(--white)', boxShadow: '0 1px 3px rgba(46,42,34,.18)',
          transform: checked ? 'translateX(18px)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)'
        }} />
      </span>
      {label}
    </label>
  );
}
