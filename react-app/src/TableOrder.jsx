import { useState } from 'react';
import { MENU_CATEGORIES } from './data.js';
import { fmtVnd } from './utils.js';
import { TrashIcon } from './icons.jsx';
import { supabaseEnabled, insertTableOrder, updateTableOrderRow } from './lib/tableOrdersApi.js';
import { updateTableRow } from './lib/tablesApi.js';
import Receipt from './Receipt.jsx';

export default function TableOrder({ ctx }) {
  const {
    tableRecords, setTableRecords, tableOrderRecords, setTableOrderRecords,
    orderingTableId, closeTableOrder, menuRecords, userBranch, userName, flash
  } = ctx;

  const table = tableRecords.find(t => t.id === orderingTableId);
  const existingOrder = tableOrderRecords.find(o => o.tableId === orderingTableId && o.status !== 'paid' && o.status !== 'cancelled');
  const [cart, setCart] = useState(() => (existingOrder ? existingOrder.items.map(x => [...x]) : []));
  const [note, setNote] = useState(existingOrder ? existingOrder.note : '');
  const [saving, setSaving] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  if (!table) return null;

  if (showReceipt) {
    return <Receipt order={{ status: 'draft', items: cart, discount: 0, vatAmount: 0, tableName: table.name }} branchName={userBranch} onClose={() => setShowReceipt(false)} />;
  }

  const availableItems = menuRecords.filter(m => m.status === 'available');
  const grouped = MENU_CATEGORIES
    .map(cat => [cat, availableItems.filter(m => m.category === cat)])
    .filter(([, items]) => items.length > 0);
  const extraCats = [...new Set(availableItems.map(m => m.category))].filter(c => !MENU_CATEGORIES.includes(c));
  extraCats.forEach(cat => grouped.push([cat, availableItems.filter(m => m.category === cat)]));

  const total = cart.reduce((sum, [, qty, price]) => sum + qty * price, 0);

  function addItem(item) {
    setCart(c => {
      const i = c.findIndex(([name]) => name === item.name);
      if (i === -1) return [...c, [item.name, 1, item.price, '']];
      const next = c.map(x => [...x]);
      next[i][1] += 1;
      return next;
    });
  }
  function changeQty(name, delta) {
    setCart(c => c
      .map(([n, q, p, note]) => (n === name ? [n, q + delta, p, note] : [n, q, p, note]))
      .filter(([, q]) => q > 0));
  }
  function removeItem(name) {
    setCart(c => c.filter(([n]) => n !== name));
  }
  function setItemNote(name, itemNote) {
    setCart(c => c.map(([n, q, p, note]) => (n === name ? [n, q, p, itemNote] : [n, q, p, note])));
  }

  async function ensureTableOccupied() {
    if (table.status === 'trong') {
      setTableRecords(recs => recs.map(t => (t.id === table.id ? { ...t, status: 'co_khach' } : t)));
      if (supabaseEnabled) {
        try { await updateTableRow(table.id, { status: 'co_khach' }); } catch (err) { console.error('[Supabase] Không cập nhật được trạng thái bàn:', err); }
      }
    }
  }

  async function submitOrder() {
    if (!cart.length) { flash('Chưa chọn món nào để gửi bếp.'); return; }
    setSaving(true);
    const payload = { branch: userBranch, tableName: table.name, tableId: table.id, items: cart, total, note, waiterName: userName, status: 'sent' };
    try {
      if (existingOrder) {
        const updated = await (supabaseEnabled ? updateTableOrderRow(existingOrder.id, payload) : Promise.resolve({ ...existingOrder, ...payload }));
        setTableOrderRecords(recs => recs.map(o => (o.id === existingOrder.id ? updated : o)));
      } else {
        const created = await (supabaseEnabled ? insertTableOrder(payload) : Promise.resolve({ id: Date.now(), ...payload }));
        setTableOrderRecords(recs => [...recs, created]);
      }
      await ensureTableOccupied();
      flash('Đã gửi order ' + table.name + ' xuống bếp.');
      closeTableOrder();
    } catch (err) {
      console.error('[Supabase] Gửi order thất bại:', err);
      flash('Không gửi được order lên máy chủ, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  }

  async function cancelOrder() {
    if (!existingOrder) { closeTableOrder(); return; }
    setTableOrderRecords(recs => recs.map(o => (o.id === existingOrder.id ? { ...o, status: 'cancelled' } : o)));
    flash('Đã huỷ order ' + table.name + '.');
    closeTableOrder();
    if (supabaseEnabled) {
      updateTableOrderRow(existingOrder.id, { status: 'cancelled' }).catch(err => {
        console.error('[Supabase] Huỷ order thất bại:', err);
        flash('Không huỷ được order trên máy chủ — thay đổi chỉ có trên trình duyệt này.');
      });
    }
  }

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)', display: 'flex' }}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="toolbar">
          <div style={{ flex: 1 }}>
            <span className="back-link" onClick={closeTableOrder} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
              Sơ đồ bàn
            </span>
            <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 4 }}>Gọi món — {table.name}</h2>
          </div>
        </div>
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
          {grouped.length === 0 && (
            <section className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>Hiện không có món nào khả dụng để gọi.</section>
          )}
          {grouped.map(([cat, items]) => (
            <section key={cat}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>{cat}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                {items.map(item => (
                  <button key={item.name} type="button" className="panel" onClick={() => addItem(item)}
                    style={{ padding: '14px 16px', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4, border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-accent)', fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(item.price)}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <aside style={{ flex: '0 0 360px', borderLeft: '1px solid var(--border)', background: 'var(--surface-card)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 20px 0' }}>
          <h3 style={{ fontSize: 17, fontWeight: 600 }}>Order hiện tại</h3>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{table.name} · sức chứa {table.capacity}</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cart.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-subtle)', textAlign: 'center', marginTop: 24 }}>Chưa chọn món nào — bấm vào món ở bên trái để thêm.</p>
          ) : cart.map(([name, qty, price, itemNote]) => (
            <div key={name} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-soft)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(price)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button type="button" className="icon-btn" style={{ width: 26, height: 26 }} onClick={() => changeQty(name, -1)}>−</button>
                  <span style={{ width: 20, textAlign: 'center', fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{qty}</span>
                  <button type="button" className="icon-btn" style={{ width: 26, height: 26 }} onClick={() => changeQty(name, 1)}>+</button>
                </div>
                <button type="button" className="icon-btn" style={{ width: 26, height: 26 }} onClick={() => removeItem(name)}><TrashIcon size={14} /></button>
              </div>
              <input
                placeholder="Ghi chú riêng cho món này (ít cay, không hành...)"
                value={itemNote || ''}
                onChange={e => setItemNote(name, e.target.value)}
                style={{ marginTop: 6, width: '100%', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-control)', padding: '5px 8px', fontSize: 12, fontFamily: 'var(--font-ui)', color: 'var(--text-muted)', background: 'var(--surface-page)' }}
              />
            </div>
          ))}
        </div>
        <div style={{ padding: 20, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label className="field-wrap">
            <label>Ghi chú</label>
            <span className="field"><input placeholder="Ví dụ: ít cay, không hành..." value={note} onChange={e => setNote(e.target.value)} /></span>
          </label>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600 }}>
            <span>Tổng cộng</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(total)}</span>
          </div>
          <button type="button" className="btn btn-primary btn-md btn-block" onClick={submitOrder} disabled={saving}>{saving ? 'Đang gửi…' : 'Gửi bếp'}</button>
          {cart.length > 0 && <button type="button" className="btn btn-secondary btn-md btn-block" onClick={() => setShowReceipt(true)}>In tạm tính</button>}
          {existingOrder && <button type="button" className="btn btn-secondary btn-md btn-block" onClick={cancelOrder}>Huỷ order</button>}
        </div>
      </aside>
    </div>
  );
}
