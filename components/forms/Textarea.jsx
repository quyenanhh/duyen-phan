import React from 'react';
export function Textarea({ label, hint, error, rows = 4, disabled, style, wrapperStyle, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: 'block', ...wrapperStyle }}>
      {label ? <span style={{ display: 'block', marginBottom: 6, fontSize: 'var(--fs-label)', fontWeight: 'var(--fw-medium)' }}>{label}</span> : null}
      <textarea rows={rows} disabled={disabled} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          display: 'block', width: '100%', padding: '10px 12px', resize: 'vertical',
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)', fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-dense)',
          border: '1px solid ' + (error ? 'var(--danger)' : focus ? 'var(--brand)' : 'var(--border-strong)'),
          boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
          borderRadius: 'var(--radius-control)', outline: 'none',
          transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)', ...style
        }} {...rest} />
      {(hint || error) ? <span style={{ display: 'block', marginTop: 6, fontSize: 'var(--fs-caption)', color: error ? 'var(--danger-text)' : 'var(--text-muted)' }}>{error || hint}</span> : null}
    </label>
  );
}
