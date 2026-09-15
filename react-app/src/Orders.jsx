import { ORDER_STATUS_STYLE, ORDER_NEXT_STATUS } from './data.js';
import { fmtVnd } from './utils.js';
import { SearchIcon, XIcon, TrashIcon, EditIcon, PackageIcon } from './icons.jsx';
import SummaryCard from './SummaryCard.jsx';
import { supabaseEnabled, insertOrderRow, updateOrderRow, updateOrderStatusRow, deleteOrderRow } from './lib/ordersApi.js';

const PAYMENT_METHODS = ['Tiền mặt', 'Chuyển khoản', 'Ví điện tử'];

function nextOrderCode(records) {
  const nums = records.map(o => parseInt(String(o.code || '').replace(/^DP-/, ''), 10)).filter(n => !isNaN(n));
  return 'DP-' + (nums.length ? Math.max(...nums) + 1 : 1000);
}

function nowVn() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm} ${d.toLocaleDateString('vi-VN')}`;
}

export default function Orders({ ctx }) {
  const {
    orderRecords, orderQuery, setOrderQuery, orderFilterStatus, setOrderFilterStatus, orderFilterBranch, setOrderFilterBranch,
    setOrderProfileId, setDeleteOrderId, setOrderAddOpen, setOrderAddForm, setOrderAddErrors
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

  function openCreate() {
    setOrderAddForm({ id: null, code: nextOrderCode(orderRecords), br: '', customer: '', phone: '', address: '', payment: '', note: '', items: [{ name: '', qty: 1, price: 0 }] });
    setOrderAddErrors({});
    setOrderAddOpen(true);
  }
  function openEdit(o) {
    setOrderAddForm({
      id: o.id, code: o.code, br: o.br, customer: o.customer, phone: o.phone, address: o.address,
      payment: o.payment, note: o.note, items: o.items.map(([name, qty, price]) => ({ name, qty, price }))
    });
    setOrderAddErrors({});
    setOrderAddOpen(true);
  }

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Đặt hàng &amp; Giao hàng</h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{orderCount} đơn hàng trong hệ thống</div>
        </div>
        <button type="button" className="btn btn-primary btn-md" onClick={openCreate}>+ Tạo đơn hàng</button>
      </div>

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <SummaryCard icon={<PackageIcon />} tone="brand" label="Tổng đơn" value={orderCount} />
          <SummaryCard icon={<TruckIcon />} tone="brand" label="Đang giao" value={deliveringCount} />
          <SummaryCard icon={<CheckCircleIcon />} tone="brand" label="Hoàn tất" value={completedCount} />
          <SummaryCard icon={<XCircleIcon />} tone="warn" label="Đã huỷ" value={cancelledCount} />
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
                      <button type="button" className="icon-btn" style={{ width: 32, height: 32 }} title="Sửa đơn hàng" onClick={e => { e.stopPropagation(); openEdit(o); }}><EditIcon /></button>
                      <button type="button" className="icon-btn" style={{ width: 32, height: 32, color: 'var(--danger)' }} title="Xoá đơn hàng" onClick={e => { e.stopPropagation(); setDeleteOrderId(o.id); }}><TrashIcon /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>

      <OrderProfileDialog ctx={ctx} onEdit={openEdit} />
      <DeleteOrderDialog ctx={ctx} />
      <OrderFormDialog ctx={ctx} />
    </div>
  );
}

function OrderProfileDialog({ ctx, onEdit }) {
  const { orderRecords, orderProfileId, setOrderProfileId, setOrderRecords, flash } = ctx;
  const o = orderRecords.find(x => x.id === orderProfileId);
  if (!o) return null;
  const [stBg, stColor, stLabel] = ORDER_STATUS_STYLE[o.st] || ORDER_STATUS_STYLE.pending;
  const nextActions = ORDER_NEXT_STATUS[o.st] || [];
  const itemsTotal = o.items.reduce((sum, [, qty, price]) => sum + qty * price, 0);

  function close() { setOrderProfileId(null); }
  function edit() { close(); onEdit(o); }
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
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel modal-pop" style={{ width: '100%', maxWidth: 560, maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'var(--green-100)', padding: '28px 96px 28px 28px', position: 'relative', flex: '0 0 auto' }}>
          <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
            <button type="button" className="icon-btn" style={{ width: 32, height: 32, background: 'var(--surface-card)' }} title="Sửa đơn hàng" onClick={edit}><EditIcon /></button>
            <button type="button" className="icon-btn" style={{ width: 32, height: 32, background: 'var(--surface-card)' }} onClick={close}><XIcon /></button>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ flex: '0 0 auto', width: 48, height: 48, borderRadius: 12, background: 'var(--surface-card)', display: 'grid', placeItems: 'center', color: 'var(--brand)' }}><PackageIcon size={22} /></span>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.3 }}>{o.code} · {o.br}</div>
              <span className="badge" style={{ background: stBg, color: stColor, width: 'fit-content' }}><span className="dot" />{stLabel}</span>
            </div>
          </div>
        </div>
        <div style={{ padding: 24, overflowY: 'auto', minHeight: 0 }}>
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

function OrderFormDialog({ ctx }) {
  const {
    orderAddOpen, setOrderAddOpen, orderAddForm, setOrderAddForm, orderAddErrors, setOrderAddErrors,
    setOrderRecords, flash, branchRecords, menuRecords
  } = ctx;
  if (!orderAddOpen || !orderAddForm) return null;
  const isEdit = !!orderAddForm.id;
  const branchOptions = (branchRecords || []).map(b => b.name);
  const menuOptions = menuRecords || [];

  function close() { setOrderAddOpen(false); }
  function setField(key) { return e => { setOrderAddForm({ ...orderAddForm, [key]: e.target.value }); setOrderAddErrors({ ...orderAddErrors, [key]: null }); }; }

  function setItem(i, patch) {
    setOrderAddForm({ ...orderAddForm, items: orderAddForm.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  }
  function addItemRow() {
    setOrderAddForm({ ...orderAddForm, items: [...orderAddForm.items, { name: '', qty: 1, price: 0 }] });
  }
  function removeItemRow(i) {
    setOrderAddForm({ ...orderAddForm, items: orderAddForm.items.filter((_, idx) => idx !== i) });
  }
  function pickMenuItem(i, name) {
    const m = menuOptions.find(x => x.name === name);
    setItem(i, { name, price: m ? m.price : 0 });
  }

  const itemsTotal = orderAddForm.items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);

  async function submit() {
    const errs = {};
    if (!orderAddForm.br) errs.br = 'Chọn chi nhánh';
    if (!orderAddForm.customer.trim()) errs.customer = 'Nhập tên khách hàng';
    if (!orderAddForm.phone.trim()) errs.phone = 'Nhập số điện thoại';
    if (!orderAddForm.address.trim()) errs.address = 'Nhập địa chỉ giao';
    if (!orderAddForm.payment) errs.payment = 'Chọn phương thức thanh toán';
    const items = orderAddForm.items.filter(it => it.name && Number(it.qty) > 0);
    if (items.length === 0) errs.items = 'Thêm ít nhất một món';
    if (Object.keys(errs).length) { setOrderAddErrors(errs); return; }

    const itemsTuples = items.map(it => [it.name, Number(it.qty), Number(it.price) || 0]);
    const total = itemsTuples.reduce((sum, [, qty, price]) => sum + qty * price, 0);
    const payload = {
      br: orderAddForm.br, customer: orderAddForm.customer.trim(), phone: orderAddForm.phone.trim(),
      address: orderAddForm.address.trim(), payment: orderAddForm.payment, note: orderAddForm.note.trim(),
      items: itemsTuples, totalRaw: total, total: fmtVnd(total)
    };

    if (isEdit) {
      setOrderRecords(recs => recs.map(x => (x.id === orderAddForm.id ? { ...x, ...payload } : x)));
      setOrderAddOpen(false);
      flash('Đã cập nhật đơn ' + orderAddForm.code + '.');
      if (supabaseEnabled) {
        try { await updateOrderRow(orderAddForm.id, payload); }
        catch (err) { console.error('[Supabase] Cập nhật đơn hàng thất bại:', err); flash('Không lưu được lên máy chủ — thay đổi chỉ có trên trình duyệt này.'); }
      }
    } else {
      setOrderAddOpen(false);
      const newPayload = { ...payload, code: orderAddForm.code, st: 'pending', t: nowVn() };
      const localRec = { id: Date.now(), ...newPayload };
      if (supabaseEnabled) {
        try {
          const created = await insertOrderRow(newPayload);
          setOrderRecords(recs => [created, ...recs]);
          flash('Đã tạo đơn ' + created.code + '.');
        } catch (err) {
          console.error('[Supabase] Tạo đơn hàng thất bại:', err);
          setOrderRecords(recs => [localRec, ...recs]);
          flash('Không lưu được lên máy chủ — đã thêm tạm trên trình duyệt này.');
        }
      } else {
        setOrderRecords(recs => [localRec, ...recs]);
        flash('Đã tạo đơn ' + newPayload.code + '.');
      }
    }
  }

  const borderFor = k => (orderAddErrors[k] ? 'var(--danger)' : 'var(--border-strong)');

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 60 }} onClick={close}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel panel-flush modal-pop" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '24px 24px 0', flex: '0 0 auto' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 600 }}>{isEdit ? 'Sửa đơn ' + orderAddForm.code : 'Tạo đơn hàng mới'}</h3>
            <p style={{ marginTop: 6, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>{isEdit ? 'Cập nhật thông tin đơn hàng.' : 'Mã đơn tự sinh: ' + orderAddForm.code}</p>
          </div>
          <button type="button" className="icon-btn" style={{ width: 32, height: 32 }} onClick={close}><XIcon /></button>
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', minHeight: 0 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Khách hàng</label>
              <span className="field" style={{ borderColor: borderFor('customer') }}><input value={orderAddForm.customer} onChange={setField('customer')} /></span>
              {orderAddErrors.customer && <span className="err-msg">{orderAddErrors.customer}</span>}
            </label>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Số điện thoại</label>
              <span className="field" style={{ borderColor: borderFor('phone') }}><input value={orderAddForm.phone} onChange={setField('phone')} /></span>
              {orderAddErrors.phone && <span className="err-msg">{orderAddErrors.phone}</span>}
            </label>
          </div>
          <label className="field-wrap">
            <label>Địa chỉ giao</label>
            <span className="field" style={{ borderColor: borderFor('address') }}><input value={orderAddForm.address} onChange={setField('address')} /></span>
            {orderAddErrors.address && <span className="err-msg">{orderAddErrors.address}</span>}
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Chi nhánh</label>
              <span className="field" style={{ borderColor: borderFor('br') }}><select value={orderAddForm.br} onChange={setField('br')}>
                <option value="">— Chọn chi nhánh —</option>
                {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select></span>
              {orderAddErrors.br && <span className="err-msg">{orderAddErrors.br}</span>}
            </label>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Thanh toán</label>
              <span className="field" style={{ borderColor: borderFor('payment') }}><select value={orderAddForm.payment} onChange={setField('payment')}>
                <option value="">— Chọn phương thức —</option>
                {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p}</option>)}
              </select></span>
              {orderAddErrors.payment && <span className="err-msg">{orderAddErrors.payment}</span>}
            </label>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Danh sách món</label>
            {orderAddForm.items.map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <select value={it.name} onChange={e => pickMenuItem(i, e.target.value)} style={{ flex: 1, height: 38, borderRadius: 'var(--radius-control)', border: '1px solid var(--border-strong)', padding: '0 8px' }}>
                  <option value="">— Chọn món —</option>
                  {menuOptions.map(m => <option key={m.id || m.name} value={m.name}>{m.name}</option>)}
                </select>
                <input type="number" min="1" value={it.qty} onChange={e => setItem(i, { qty: e.target.value })} style={{ width: 64, height: 38, borderRadius: 'var(--radius-control)', border: '1px solid var(--border-strong)', padding: '0 8px' }} />
                <input type="number" min="0" value={it.price} onChange={e => setItem(i, { price: e.target.value })} style={{ width: 100, height: 38, borderRadius: 'var(--radius-control)', border: '1px solid var(--border-strong)', padding: '0 8px' }} />
                <button type="button" className="icon-btn" style={{ width: 34, height: 34, color: 'var(--danger)' }} title="Xoá dòng" onClick={() => removeItemRow(i)}><XIcon /></button>
              </div>
            ))}
            {orderAddErrors.items && <span className="err-msg">{orderAddErrors.items}</span>}
            <button type="button" className="btn btn-secondary btn-md" style={{ marginTop: 4 }} onClick={addItemRow}>+ Thêm món</button>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-body-sm)' }}>
              <span style={{ fontWeight: 600 }}>Tổng cộng</span>
              <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(itemsTotal)}</span>
            </div>
          </div>

          <label className="field-wrap">
            <label>Ghi chú</label>
            <textarea rows={2} placeholder="Ghi chú giao hàng" value={orderAddForm.note} onChange={setField('note')}
              style={{ width: '100%', resize: 'vertical', padding: '10px 12px', borderRadius: 'var(--radius-control)', border: '1px solid var(--border-strong)', fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-body-sm)', color: 'var(--text-body)', background: 'var(--surface-card)' }} />
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 24, flex: '0 0 auto' }}>
          <button type="button" className="btn btn-secondary btn-md" onClick={close}>Huỷ</button>
          <button type="button" className="btn btn-primary btn-md" onClick={submit}>{isEdit ? 'Lưu thay đổi' : 'Tạo đơn hàng'}</button>
        </div>
      </div>
    </div>
  );
}
