import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
export function Pagination({ page = 1, pageCount = 1, total, onChange, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 16px', borderTop: '1px solid var(--border-soft)', ...style }}>
      <span style={{ fontSize: 'var(--fs-label)', color: 'var(--text-muted)' }}>
        {total != null ? 'Tổng ' + total + ' bản ghi · ' : ''}Trang {page}/{pageCount}
      </span>
      <span style={{ display: 'flex', gap: 4 }}>
        <IconButton icon="chevron-left" label="Trang trước" size="sm" variant="outline" disabled={page <= 1} onClick={() => onChange && onChange(page - 1)} />
        <IconButton icon="chevron-right" label="Trang sau" size="sm" variant="outline" disabled={page >= pageCount} onClick={() => onChange && onChange(page + 1)} />
      </span>
    </div>
  );
}
