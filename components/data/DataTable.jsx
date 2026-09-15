import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function DataTable({ columns = [], rows = [], onRowClick, emptyText = 'Chưa có dữ liệu', style }) {
  const [hover, setHover] = React.useState(-1);
  return (
    <div style={{ overflowX: 'auto', ...style }}>
      <table style={{ width: '100%', fontSize: 'var(--fs-body-sm)' }}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c.key} style={{
                textAlign: c.align || 'left', padding: '10px 16px', whiteSpace: 'nowrap',
                fontSize: 'var(--fs-caption)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase',
                fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)',
                borderBottom: '1px solid var(--border)', background: 'var(--surface-sunken)', width: c.width
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{c.label}{c.sortable ? <Icon name="chevrons-up-down" size={12} /> : null}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>{emptyText}</td></tr>
          ) : rows.map((r, i) => (
            <tr key={r.id || i} onClick={() => onRowClick && onRowClick(r)}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)}
              style={{ cursor: onRowClick ? 'pointer' : 'default', background: hover === i ? 'var(--cream-100)' : 'transparent', transition: 'background var(--dur-fast) var(--ease-out)' }}>
              {columns.map(c => (
                <td key={c.key} style={{ padding: '0 16px', height: 'var(--row-h)', textAlign: c.align || 'left', borderBottom: '1px solid var(--border-soft)', color: c.muted ? 'var(--text-muted)' : 'var(--text-body)', fontVariantNumeric: c.align === 'right' ? 'tabular-nums' : undefined }}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
