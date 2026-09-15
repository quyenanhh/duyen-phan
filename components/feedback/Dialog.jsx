import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
export function Dialog({ open = true, title, description, children, footer, width = 480, onClose }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'grid', placeItems: 'center', padding: 24, zIndex: 50 }}>
      <div onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" style={{
        width: '100%', maxWidth: width, background: 'var(--surface-card)', borderRadius: 'var(--radius-modal)',
        boxShadow: 'var(--shadow-modal)', border: '1px solid var(--border)', overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '24px 24px 0' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 'var(--fs-h3)' }}>{title}</h3>
            {description ? <p style={{ marginTop: 6, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>{description}</p> : null}
          </div>
          {onClose ? <IconButton icon="x" label="Đóng" size="sm" onClick={onClose} /> : null}
        </div>
        {children ? <div style={{ padding: '20px 24px 0' }}>{children}</div> : null}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 24 }}>{footer}</div>
      </div>
    </div>
  );
}
