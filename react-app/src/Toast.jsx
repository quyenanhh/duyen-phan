export default function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 70, display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', maxWidth: 360, background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-modal)', fontSize: 'var(--fs-body-sm)' }}>
      <span style={{ color: '#2E3B35', display: 'flex', flex: '0 0 auto' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
      </span>
      {msg}
    </div>
  );
}
