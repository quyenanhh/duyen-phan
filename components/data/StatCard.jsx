import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function StatCard({ label, value, delta, deltaTone = 'success', icon, style }) {
  const tone = deltaTone === 'danger' ? 'var(--danger-text)' : deltaTone === 'warning' ? 'var(--warning-text)' : 'var(--success-text)';
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: 20, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
        {icon ? <Icon name={icon} size={16} /> : null}
        <span style={{ fontSize: 'var(--fs-caption)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', fontWeight: 'var(--fw-semibold)' }}>{label}</span>
      </div>
      <div style={{ marginTop: 10, fontSize: 26, fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-tight)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {delta ? <div style={{ marginTop: 6, fontSize: 'var(--fs-label)', color: tone }}>{delta}</div> : null}
    </div>
  );
}
