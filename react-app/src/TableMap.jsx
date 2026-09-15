import { useState } from 'react';
import { TABLE_STATUS_STYLE } from './data.js';
import { PersonIcon } from './icons.jsx';
import { supabaseEnabled, updateTableRow } from './lib/tablesApi.js';

const ORDER_STATUS_LABEL = { open: 'Đang chọn món', sent: 'Đã gửi bếp', served: 'Đã lên món' };

export default function TableMap({ ctx }) {
  const { tableRecords, setTableRecords, tablesLoading, userBranch, userRole, tableOrderRecords, openTableOrder, openCheckout, flash } = ctx;
  const branchTables = tableRecords.filter(t => t.branch === userBranch);
  const isWaiter = userRole === 'Nhân viên';
  const isCashier = userRole === 'Thu ngân';

  const total = branchTables.length;
  const empty = branchTables.filter(t => t.status === 'trong').length;
  const occupied = branchTables.filter(t => t.status === 'co_khach').length;

  function setStatus(table, next) {
    setTableRecords(recs => recs.map(t => (t.id === table.id ? { ...t, status: next } : t)));
    const [, , label] = TABLE_STATUS_STYLE[next] || [];
    flash('Đã cập nhật ' + table.name + ': ' + label + '.');
    if (supabaseEnabled) {
      updateTableRow(table.id, { status: next }).catch(err => {
        console.error('[Supabase] Cập nhật trạng thái bàn thất bại:', err);
        flash('Không lưu được trạng thái lên máy chủ — thay đổi chỉ có trên trình duyệt này.');
      });
    }
  }

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Sơ đồ bàn</h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{userBranch || 'Chưa gán chi nhánh'}</div>
        </div>
      </div>

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {!userBranch ? (
          <section className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
            Bạn chưa được gán chi nhánh — liên hệ quản lý để xem sơ đồ bàn.
          </section>
        ) : tablesLoading && total === 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="panel" style={{ padding: 16, height: 128, background: 'var(--surface-sunken)', opacity: 0.5 }} />
            ))}
          </div>
        ) : total === 0 ? (
          <section className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
            Chi nhánh này chưa có dữ liệu bàn ăn.
          </section>
        ) : (
          <>
            <div className="panel" style={{ display: 'flex', alignItems: 'stretch' }}>
              {[
                { value: total, label: 'tổng số bàn' },
                { value: empty, label: 'đang trống' },
                { value: occupied, label: 'có khách' }
              ].map((it, i) => (
                <div key={i} style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 16px', borderLeft: i > 0 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{it.value}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{it.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {branchTables.map(t => (
                <TableCard
                  key={t.id}
                  table={t}
                  order={tableOrderRecords.find(o => o.tableId === t.id && o.status !== 'paid' && o.status !== 'cancelled')}
                  onChangeStatus={next => setStatus(t, next)}
                  onOrder={isWaiter ? () => openTableOrder(t.id) : null}
                  onCheckout={isCashier ? () => openCheckout(t.id) : null}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TableCard({ table, order, onChangeStatus, onOrder, onCheckout }) {
  const [open, setOpen] = useState(false);
  const [bg, color, label] = TABLE_STATUS_STYLE[table.status] || TABLE_STATUS_STYLE.trong;

  return (
    <div className="panel" style={{ padding: 16, borderTop: `3px solid ${color}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>{table.name}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
          <PersonIcon size={14} /> {table.capacity}
        </span>
      </div>
      <span className="badge" style={{ background: bg, color, alignSelf: 'flex-start' }}><span className="dot" />{label}</span>
      {order && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {order.items.length} món · {ORDER_STATUS_LABEL[order.status] || order.status}
        </div>
      )}
      {onOrder && (
        <button type="button" className="btn btn-primary" style={{ height: 34, padding: '0 12px', fontSize: 13 }} onClick={onOrder}>
          {order ? 'Xem / sửa order' : 'Gọi món'}
        </button>
      )}
      {onCheckout && order && order.items.length > 0 && (
        <button type="button" className="btn btn-primary" style={{ height: 34, padding: '0 12px', fontSize: 13 }} onClick={onCheckout}>Thanh toán</button>
      )}
      {open ? (
        <span className="field" style={{ height: 34 }}>
          <select
            autoFocus
            value={table.status}
            onChange={e => { onChangeStatus(e.target.value); setOpen(false); }}
            onBlur={() => setOpen(false)}
          >
            {Object.entries(TABLE_STATUS_STYLE).map(([k, v]) => <option key={k} value={k}>{v[2]}</option>)}
          </select>
        </span>
      ) : (
        <button type="button" className="btn btn-secondary" style={{ height: 34, padding: '0 12px', fontSize: 13 }} onClick={() => setOpen(true)}>Đổi trạng thái</button>
      )}
    </div>
  );
}
