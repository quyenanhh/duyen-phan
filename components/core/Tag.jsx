import React from 'react';
import { Icon } from './Icon.jsx';
export function Tag({ children, onRemove, selected, onClick, style }) {
  const interactive = !!onClick;
  return (
    <span onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px',
      borderRadius: 'var(--radius-pill)', fontSize: 'var(--fs-label)', fontWeight: 'var(--fw-medium)',
      cursor: interactive ? 'pointer' : 'default',
      background: selected ? 'var(--brand)' : 'var(--surface-accent-soft)',
      color: selected ? 'var(--text-on-brand)' : 'var(--text-accent)',
      border: '1px solid ' + (selected ? 'var(--brand)' : 'var(--clay-100)'),
      transition: 'background var(--dur-fast) var(--ease-out)', ...style
    }}>
      {children}
      {onRemove ? <span onClick={e => { e.stopPropagation(); onRemove(); }} style={{ display: 'flex', cursor: 'pointer', opacity: .7 }}><Icon name="x" size={13} /></span> : null}
    </span>
  );
}
