import React from 'react';
import { Icon } from './Icon.jsx';
const TONES = {
  neutral: { bg: 'var(--surface-sunken)', fg: 'var(--text-muted)' },
  brand: { bg: 'var(--surface-brand-soft)', fg: 'var(--success-text)' },
  accent: { bg: 'var(--clay-100)', fg: 'var(--text-accent)' },
  success: { bg: 'var(--success-soft)', fg: 'var(--success-text)' },
  warning: { bg: 'var(--warning-soft)', fg: 'var(--warning-text)' },
  danger: { bg: 'var(--danger-soft)', fg: 'var(--danger-text)' },
  info: { bg: 'var(--info-soft)', fg: 'var(--info-text)' }
};
export function Badge({ children, tone = 'neutral', icon, dot, style }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
      borderRadius: 'var(--radius-pill)', background: t.bg, color: t.fg,
      fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-medium)', lineHeight: 1.4, whiteSpace: 'nowrap', ...style
    }}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }} /> : null}
      {icon ? <Icon name={icon} size={13} /> : null}
      {children}
    </span>
  );
}
