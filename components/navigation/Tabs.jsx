import React from 'react';
export function Tabs({ items = [], value, onChange, style }) {
  return (
    <div role="tablist" style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--border)', ...style }}>
      {items.map(it => {
        const id = it.id || it;
        const label = it.label || it;
        const on = value === id;
        return (
          <button key={id} role="tab" aria-selected={on} onClick={() => onChange && onChange(id)}
            style={{
              border: 0, background: 'transparent', cursor: 'pointer', padding: '0 0 12px',
              fontSize: 'var(--fs-body-sm)', fontWeight: on ? 'var(--fw-semibold)' : 'var(--fw-regular)',
              color: on ? 'var(--text-brand)' : 'var(--text-muted)',
              boxShadow: on ? 'inset 0 -2px 0 var(--brand)' : 'none',
              transition: 'color var(--dur-fast) var(--ease-out)'
            }}>
            {label}{it.count != null ? <span style={{ marginLeft: 6, color: 'var(--text-subtle)' }}>{it.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
