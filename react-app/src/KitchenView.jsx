import { useEffect, useState } from 'react';
import { supabaseEnabled, updateTableOrderRow } from './lib/tableOrdersApi.js';

function minutesAgo(iso) {
  if (!iso) return 0;
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
}

export default function KitchenView({ ctx }) {
  const { tableOrderRecords, setTableOrderRecords, userBranch, userName, flash } = ctx;
  const [, forceTick] = useState(0);

  // cập nhật lại "chờ X phút" mỗi phút mà không cần tải lại dữ liệu.
  useEffect(() => {
    const t = setInterval(() => forceTick(n => n + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const queue = tableOrderRecords
    .filter(o => o.branch === userBranch && o.status === 'sent')
    .sort((a, b) => new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt));

  function markDone(order) {
    setTableOrderRecords(recs => recs.map(o => (o.id === order.id ? { ...o, status: 'served', cookName: userName } : o)));
    flash('Đã đánh dấu xong món cho ' + order.tableName + '.');
    if (supabaseEnabled) {
      updateTableOrderRow(order.id, { status: 'served', cookName: userName }).catch(err => {
        console.error('[Supabase] Cập nhật trạng thái order thất bại:', err);
        flash('Không lưu được trạng thái lên máy chủ — thay đổi chỉ có trên trình duyệt này.');
      });
    }
  }

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Màn hình bếp</h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{userBranch || 'Chưa gán chi nhánh'} · {queue.length} order đang chờ chế biến</div>
        </div>
      </div>

      <div style={{ padding: 32 }}>
        {!userBranch ? (
          <section className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
            Bạn chưa được gán chi nhánh — liên hệ quản lý để xem màn hình bếp.
          </section>
        ) : queue.length === 0 ? (
          <section className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
            Chưa có order nào cần chế biến. Order mới từ phục vụ sẽ hiện tại đây.
          </section>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {queue.map(order => {
              const mins = minutesAgo(order.updatedAt || order.createdAt);
              const urgent = mins >= 15;
              return (
                <div key={order.id} className="panel" style={{ padding: 18, borderTop: `3px solid ${urgent ? 'var(--danger)' : 'var(--brand)'}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 17, fontWeight: 600 }}>{order.tableName}</span>
                    <span className="badge" style={{ background: urgent ? 'var(--danger-soft)' : 'var(--clay-100)', color: urgent ? 'var(--danger-text)' : 'var(--text-accent)' }}>
                      <span className="dot" />chờ {mins} phút
                    </span>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
                    {order.items.map(([name, qty, , itemNote]) => (
                      <li key={name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                          <span>{name}</span>
                          <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>×{qty}</span>
                        </div>
                        {itemNote && <div style={{ fontSize: 12, color: 'var(--danger-text)', fontWeight: 600 }}>↳ {itemNote}</div>}
                      </li>
                    ))}
                  </ul>
                  {order.note && (
                    <p style={{ fontSize: 12, color: 'var(--text-accent)', background: 'var(--clay-50)', padding: '8px 10px', borderRadius: 'var(--radius-control)' }}>Ghi chú: {order.note}</p>
                  )}
                  <button type="button" className="btn btn-primary btn-md" onClick={() => markDone(order)}>Đã làm xong</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
