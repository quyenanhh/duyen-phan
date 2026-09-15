import { ORDER_STATUS_STYLE, ORDER_NEXT_STATUS } from './data.js';
import { fmtVnd } from './utils.js';
import { SearchIcon, XIcon, TrashIcon, PackageIcon } from './icons.jsx';
import SummaryCard from './SummaryCard.jsx';
import { supabaseEnabled, updateOrderStatusRow, deleteOrderRow } from './lib/ordersApi.js';

export default function Orders({ ctx }) {
  const {
    orderRecords, orderQuery, setOrderQuery, orderFilterStatus, setOrderFilterStatus, orderFilterBranch, setOrderFilterBranch,
    setOrderProfileId, setDeleteOrderId
  } = ctx;

  const orderCount = orderRecords.length;
  const deliveringCount = orderRecords.filter(o => o.st === 'delivering').length;
  const completedCount = orderRecords.filter(o => o.st === 'completed').length;
  const cancelledCount = orderRecords.filter(o => o.st === 'cancelled').length;

  const q = orderQuery.trim().toLowerCase();
  const filtered = orderRecords.filter(o => {
    const matchesQuery = !q || o.code.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
    const matchesStatus = !orderFilterStatus || o.st === orderFilterStatus;
    const matchesBranch = !orderFilterBranch || o.br === orderFilterBranch;
    return matchesQuery && matchesStatus && matchesBranch;
  });
  const branchOptions = [...new Set(orderRecords.map(o => o.br))];

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Đặt hàng &amp; Giao hàng</h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{orderCount} đơn hàng trong hệ thống</div>
        </div>
      </div>

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <SummaryCard icon={<PackageIcon />} tone="blue" label="Tổng đơn" value={orderCount} />
          <SummaryCard icon={<TruckIcon />} tone="amber" label="Đang giao" value={deliveringCount} />
          <SummaryCard icon={<CheckCircleIcon />} tone="green" label="Hoàn tất" value={completedCount} />
          <SummaryCard icon={<XCircleIcon />} tone="red" label="Đã huỷ" value={cancelledCount} />
        </div>

        <section className="panel panel-flush">
          <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
            <label className="field-wrap" style={{ width: 260 }}>
              <label>Tìm kiếm</label>
              <span className="field"><SearchIcon style={{ color: 'var(--text-subtle)', flex: '0 0 auto' }} /><input placeholder="Mã đơn hoặc khách hàng" value={orderQuery} onChange={e => setOrderQuery(e.target.value)} /></span>
            </label>
            <label className="field-wrap" style={{ width: 180 }}>
              <label>Trạng thái</label>
              <span className="field"><select value={orderFilterStatus} onChange={e => setOrderFilterStatus(e.target.value)}>
                <option value="">Tất cả trạng thái</option>
                {Object.entries(ORDER_STATUS_STYLE).map(([k, v]) => <option key={k} value={k}>{v[2]}</option>)}
              </select></span>
            </label>
            <label className="field-wrap" style={{ width: 220 }}>
              <label>Chi nhánh</label>
              <span className="field"><select value={orderFilterBranch} onChange={e => setOrderFilterBranch(e.target.value)}>
                <option value="">Tất cả chi nhánh</option>
                {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select></span>
            </label>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)', paddingBottom: 10 }}>{filtered.length} / {orderCount} đơn hàng</span>
          </div>
          <table style={{ width: '100%', fontSize: 'var(--fs-body-sm)' }}>
            <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Chi nhánh</th><th>Trạng thái</th><th style={{ textAlign: 'right' }}>Giá trị</th><th style={{ textAlign: 'right' }}>Thời gian</th><th style={{ textAlign: 'right' }}>Thao tác</th></tr></thead>
            <tbody>
              {filtered.map(o => {
                const [stBg, stColor, stLabel] = ORDER_STATUS_STYLE[o.st] || ORDER_STATUS_STYLE.pending;
                return (
                  <tr className="row" key={o.id} style={{ cursor: 'pointer' }} onClick={() => setOrderProfileId(o.id)}>
                    <td style={{ fontWeight: 600 }}>{o.code}</td>
                    <td>{o.customer}</td>
                    <td>{o.br}</td>
                    <td><span className="badge" style={{ background: stBg, color: stColor }}><span className="dot" />{stLabel}</span></td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{o.total}</td>
                    <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{o.t}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button type="button" className="icon-btn" style={{ width: 32, height: 32, color: 'var(--danger)' }} title="Xoá đơn hàng" onClick={e => { e.stopPropagation(); setDeleteOrderId(o.id); }}><TrashIcon /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>

      <OrderProfileDialog ctx={ctx} />
      <DeleteOrderDialog ctx={ctx} />
    </div>
  );
}

function OrderProfileDialog({ ctx }) {
  const { orderRecords, orderProfileId, setOrderProfileId, setOrderRecords, flash } = ctx;
  const o = orderRecords.find(x => x.id === orderProfileId);
  if (!o) return null;
  const [stBg, stColor, stLabel] = ORDER_STATUS_STYLE[o.st] || ORDER_STATUS_STYLE.pending;
  const nextActions = ORDER_NEXT_STATUS[o.st] || [];
  const itemsTotal = o.items.reduce((sum, [, qty, price]) => sum + qty * price, 0);

  function close() { setOrderProfileId(null); }
  function setStatus(next) {
    setOrderRecords(recs => recs.map(x => (x.id === o.id ? { ...x, st: next } : x)));
    const [, , label] = ORDER_STATUS_STYLE[next] || [];
    flash('Đã cập nhật đơn ' + o.code + ': ' + label + '.');
    setOrderProfileId(null);
    if (supabaseEnabled) {
      updateOrderStatusRow(o.id, next).catch(err => {
        console.error('[Supabase] Cập nhật trạng thái đơn hàng thất bại:', err);
        flash('Không lưu được trạng thái lên máy chủ — thay đổi chỉ có trên trình duyệt này.');
      });
    }
  }

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 60 }} onClick={close}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel modal-pop" style={{ width: '100%', maxWidth: 560, maxHeight: '88vh', overflowY: 'auto' }}>
        <div style={{ background: 'var(--green-100)', padding: '28px 56px 28px 28px', position: 'relative' }}>
          <button type="button" className="icon-btn" style={{ width: 32, height: 32, position: 'absolute', top: 16, right: 16, background: 'var(--surface-card)' }} onClick={close}><XIcon /></button>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ flex: '0 0 auto', width: 48, height: 48, borderRadius: 12, background: 'var(--surface-card)', display: 'grid', placeItems: 'center', color: 'var(--brand)' }}><PackageIcon size={22} /></span>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.3 }}>{o.code} · {o.br}</div>
              <span className="badge" style={{ background: stBg, color: stColor, width: 'fit-content' }}><span className="dot" />{stLabel}</span>
            </div>
          </div>
        </div>
        <div style={{ padding: 24 }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Thông tin giao hàng</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
            <InfoBox label="Khách hàng" value={o.customer} />
            <InfoBox label="Số điện thoại" value={o.phone} />
            <InfoBox label="Địa chỉ giao" value={o.address} span2 />
            <InfoBox label="Phương thức thanh toán" value={o.payment} />
            <InfoBox label="Thời gian đặt" value={o.t} />
          </div>

          <h4 style={{ marginTop: 24, fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Món đã đặt</h4>
          <div style={{ marginTop: 12, border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-control)', overflow: 'hidden' }}>
            {o.items.map(([name, qty, price], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: i < o.items.length - 1 ? '1px solid var(--border-soft)' : 'none', background: 'var(--surface-page)' }}>
                <span style={{ flex: 1, fontSize: 'var(--fs-body-sm)' }}>{name}</span>
                <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--text-muted)' }}>x{qty}</span>
                <span style={{ fontSize: 'var(--fs-body-sm)', fontWeight: 600, fontVariantNumeric: 'tabular-nums', minWidth: 90, textAlign: 'right' }}>{fmtVnd(qty * price)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface-card)' }}>
              <span style={{ fontSize: 'var(--fs-body-sm)', fontWeight: 600 }}>Tổng cộng</span>
              <span style={{ fontSize: 'var(--fs-body-sm)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(itemsTotal)}</span>
            </div>
          </div>

          {o.note && (
            <div style={{ marginTop: 16, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}><strong style={{ color: 'var(--text-body)' }}>Ghi chú: </strong>{o.note}</div>
          )}

          {nextActions.length > 0 && (
            <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {nextActions.map(([key, label]) => (
                <button key={key} type="button" className={key === 'cancelled' ? 'btn btn-danger btn-md' : 'btn btn-primary btn-md'} onClick={() => setStatus(key)}>{label}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TruckIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8Z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>; }
function CheckCircleIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.5 2.5 4.5-5" /></svg>; }
function XCircleIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m9.5 9.5 5 5M14.5 9.5l-5 5" /></svg>; }

function InfoBox({ label, value, span2 }) {
  return (
    <div style={{ gridColumn: span2 ? 'span 2' : undefined, background: 'var(--surface-page)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-control)', padding: '12px 14px' }}>
      <span style={{ display: 'block', fontSize: 'var(--fs-caption)', color: 'var(--text-subtle)' }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 'var(--fs-body-sm)' }}>{value}</span>
    </div>
  );
}

function DeleteOrderDialog({ ctx }) {
  const { orderRecords, deleteOrderId, setDeleteOrderId, setOrderRecords, flash } = ctx;
  const rec = orderRecords.find(o => o.id === deleteOrderId);
  if (!rec) return null;
  function cancel() { setDeleteOrderId(null); }
  function confirm() {
    setOrderRecords(recs => recs.filter(x => x.id !== deleteOrderId));
    setDeleteOrderId(null);
    flash('Đã xoá đơn ' + rec.code + ' khỏi hệ thống.');
    if (supabaseEnabled) {
      deleteOrderRow(rec.id).catch(err => {
        console.error('[Supabase] Xoá đơn hàng thất bại:', err);
        flash('Không xoá được trên máy chủ — đơn hàng có thể xuất hiện lại sau khi tải lại trang.');
      });
    }
  }
  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 62 }} onClick={cancel}>
      <div role="alertdialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel panel-flush modal-pop" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ padding: 24 }}>
          <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 600 }}>Xoá đơn {rec.code} khỏi hệ thống?</h3>
          <p style={{ marginTop: 8, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>Dữ liệu đơn hàng sẽ bị xoá vĩnh viễn. Không thể hoàn tác.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0 24px 24px' }}>
          <button type="button" className="btn btn-secondary btn-md" onClick={cancel}>Huỷ</button>
          <button type="button" className="btn btn-danger btn-md" onClick={confirm}>Xoá đơn hàng</button>
        </div>
      </div>
    </div>
  );
}
