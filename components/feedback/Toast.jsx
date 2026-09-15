import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
const TONE = {
  success: { icon: 'circle-check', color: 'var(--success)' },
  warning: { icon: 'triangle-alert', color: 'var(--warning)' },
  danger: { icon: 'circle-x', color: 'var(--danger)' },
  info: { icon: 'info', color: 'var(--info)' }
};
export function Toast({ tone = 'success', title, description, onClose, style }) {
  const t = TONE[tone] || TONE.info;
  return (
    <div role="status" style={{
      display: 'flex', gap: 12, alignItems: 'flex-start', width: 360, padding: 16,
      background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-raised)', ...style
    }}>
      <Icon name={t.icon} size={20} color={t.color} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--fs-body-sm)', fontWeight: 'var(--fw-semibold)' }}>{title}</div>
        {description ? <div style={{ marginTop: 2, fontSize: 'var(--fs-label)', color: 'var(--text-muted)' }}>{description}</div> : null}
      </div>
      {onClose ? <IconButton icon="x" label="Đóng" size="sm" onClick={onClose} /> : null}
    </div>
  );
}
