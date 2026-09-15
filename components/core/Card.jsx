import React from 'react';
export function Card({ children, title, subtitle, actions, padding = 24, tone = 'card', hoverable, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <section onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: tone === 'sunken' ? 'var(--surface-sunken)' : tone === 'soft' ? 'var(--surface-accent-soft)' : 'var(--surface-card)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-card)',
        boxShadow: hoverable && hover ? 'var(--shadow-raised)' : 'var(--shadow-card)',
        transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
        transform: hoverable && hover ? 'translateY(-2px)' : 'none', overflow: 'hidden', ...style
      }} {...rest}>
      {(title || actions) ? (
        <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '20px 24px 0' }}>
          <div>
            {title ? <h3 style={{ fontSize: 'var(--fs-h3)' }}>{title}</h3> : null}
            {subtitle ? <p style={{ marginTop: 4, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>{subtitle}</p> : null}
          </div>
          {actions}
        </header>
      ) : null}
      <div style={{ padding: (title || actions) ? (padding ? '16px ' + padding + 'px ' + padding + 'px' : '16px 0 0') : padding + 'px' }}>{children}</div>
    </section>
  );
}
