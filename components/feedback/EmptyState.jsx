import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function EmptyState({ icon = 'soup', title, description, action, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8, padding: '48px 24px', ...style }}>
      <span style={{ width: 48, height: 48, borderRadius: 999, background: 'var(--surface-accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center', marginBottom: 4 }}>
        <Icon name={icon} size={22} />
      </span>
      <div style={{ fontSize: 'var(--fs-body-lg)', fontWeight: 'var(--fw-semibold)' }}>{title}</div>
      {description ? <p style={{ maxWidth: 380, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)', textWrap: 'pretty' }}>{description}</p> : null}
      {action ? <div style={{ marginTop: 12 }}>{action}</div> : null}
    </div>
  );
}
