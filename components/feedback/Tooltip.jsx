import React from 'react';
export function Tooltip({ label, children, placement = 'top', style }) {
  const [show, setShow] = React.useState(false);
  const pos = placement === 'bottom'
    ? { top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' }
    : { bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' };
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show ? (
        <span role="tooltip" style={{
          position: 'absolute', ...pos, zIndex: 40, whiteSpace: 'nowrap',
          background: 'var(--surface-inverse)', color: 'var(--cream-50)', padding: '5px 10px',
          borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-caption)', boxShadow: 'var(--shadow-card)', ...style
        }}>{label}</span>
      ) : null}
    </span>
  );
}
