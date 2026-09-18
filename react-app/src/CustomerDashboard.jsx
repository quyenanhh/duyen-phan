import { useState } from 'react';
import { MENU_CATEGORIES, BRANCHES } from './data.js';
import { fmtVnd } from './utils.js';
import { TrashIcon, CalendarIcon, ReceiptIcon, CartIcon } from './icons.jsx';
import SiteHeader from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';
import { supabaseEnabled, createReservation, cancelReservation } from './lib/reservationsApi.js';
import { createCustomerOrder, cancelCustomerOrder } from './lib/customerOrdersApi.js';

const RES_STATUS_STYLE = {
  pending: ['#F7E9CC', '#8C5E14', 'Chờ xác nhận'],
  confirmed: ['#E7ECE5', '#2E3B35', 'Đã xác nhận'],
  completed: ['#DFE7EF', '#3F5C79', 'Đã hoàn tất'],
  cancelled: ['#F6DED7', '#8E3421', 'Đã huỷ']
};

const ORDER_STATUS_STYLE = {
  pending: ['#F7E9CC', '#8C5E14', 'Chờ xác nhận'],
  confirmed: ['#DFE7EF', '#3F5C79', 'Đã xác nhận'],
  preparing: ['#DFE7EF', '#3F5C79', 'Đang chuẩn bị'],
  ready: ['#E7ECE5', '#2E3B35', 'Sẵn sàng'],
  completed: ['#E7ECE5', '#2E3B35', 'Đã hoàn tất'],
  cancelled: ['#F6DED7', '#8E3421', 'Đã huỷ']
};

const PAYMENT_METHOD_LABEL = {
  tien_mat: 'Tiền mặt khi nhận',
  chuyen_khoan: 'Chuyển khoản',
  the: 'Quẹt thẻ khi nhận'
};

const PAYMENT_STATUS_STYLE = {
  chua_thanh_toan: ['#F6DED7', '#8E3421', 'Chưa thanh toán'],
  da_thanh_toan: ['#E7ECE5', '#2E3B35', 'Đã thanh toán']
};

const TABS = [
  { id: 'menu', label: 'Đặt món' },
  { id: 'reservation', label: 'Đặt bàn' },
  { id: 'orders', label: 'Đơn của tôi' }
];

export default function CustomerDashboard({ ctx }) {
  const { theme, loggedName, loggedEmail, loggedPhone } = ctx;
  const themeClass = theme === 'dark' ? 'dark-mode' : '';
  const [tab, setTab] = useState('menu');

  return (
    <div className={`landing-scope ${themeClass}`} style={{ background: 'var(--surface-page)', minHeight: '100vh' }}>
      <SiteHeader ctx={ctx} active="account" />

      <section style={{ padding: '48px 0 24px' }}>
        <div className="wrap">
          <p className="eyebrow">Tài khoản của tôi</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 34, lineHeight: 1.15, letterSpacing: '-0.02em', fontWeight: 600, marginTop: 8, color: 'var(--text-brand)' }}>
            Xin chào, {loggedName || 'bạn'}
          </h1>
          <p style={{ marginTop: 8, fontSize: 'var(--fs-body)', color: 'var(--text-muted)' }}>{loggedEmail}{loggedPhone ? ` · ${loggedPhone}` : ''}</p>

          <div style={{ display: 'flex', gap: 6, marginTop: 24, padding: 4, background: 'var(--surface-sunken)', borderRadius: 999, width: 'fit-content' }}>
            {TABS.map(t => (
              <button key={t.id} type="button" className={`tabp ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 96px' }}>
        <div className="wrap">
          {tab === 'menu' && <OrderFoodTab ctx={ctx} />}
          {tab === 'reservation' && <ReservationTab ctx={ctx} />}
          {tab === 'orders' && <MyOrdersTab ctx={ctx} />}
        </div>
      </section>

      <SiteFooter ctx={ctx} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 1 — Đặt món: chọn chi nhánh + hình thức, thêm món vào giỏ, gửi đơn.
// ---------------------------------------------------------------------------
function OrderFoodTab({ ctx }) {
  const {
    menuRecords, cart, addToCart, updateCartQty, removeFromCart, clearCart, cartTotal,
    loggedName, loggedPhone, flash, setMyCustomerOrders, setMyReservations
  } = ctx;

  const [branch, setBranch] = useState(BRANCHES[0] || '');
  const [orderMode, setOrderMode] = useState('mang_ve');
  const [paymentMethod, setPaymentMethod] = useState('tien_mat');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Đặt bàn nhanh — dùng chung ô chọn chi nhánh phía dưới với phần đặt món.
  const [resDate, setResDate] = useState('');
  const [resTime, setResTime] = useState('18:00');
  const [resGuests, setResGuests] = useState(2);
  const [resErrors, setResErrors] = useState({});
  const [resSubmitting, setResSubmitting] = useState(false);

  const availableItems = menuRecords.filter(m => m.status === 'available' && m.visible !== false);
  const grouped = MENU_CATEGORIES
    .map(cat => [cat, availableItems.filter(m => m.category === cat)])
    .filter(([, items]) => items.length > 0);
  const extraCats = [...new Set(availableItems.map(m => m.category))].filter(c => !MENU_CATEGORIES.includes(c));
  extraCats.forEach(cat => grouped.push([cat, availableItems.filter(m => m.category === cat)]));

  async function submitOrder() {
    if (!cart.length) { flash('Chưa chọn món nào để đặt.'); return; }
    if (!branch) { flash('Vui lòng chọn chi nhánh.'); return; }

    if (!supabaseEnabled) { flash('Chưa cấu hình Supabase — không thể đặt món lúc này.'); return; }

    setSubmitting(true);
    try {
      const created = await createCustomerOrder({ branch, orderMode, note, customerName: loggedName, customerPhone: loggedPhone, cart, paymentMethod });
      setMyCustomerOrders(prev => [created, ...prev]);
      clearCart();
      setNote('');
      flash(`Đã đặt món thành công — mã đơn ${created.code}.`);
    } catch (err) {
      console.error('[Supabase] Đặt món thất bại:', err);
      flash('Không đặt được món, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }

  async function submitQuickReservation() {
    const errs = {};
    if (!branch) errs.branch = 'Chọn chi nhánh';
    if (!resDate) errs.date = 'Chọn ngày';
    if (!resTime) errs.time = 'Chọn giờ';
    if (!resGuests || resGuests < 1) errs.guests = 'Nhập số khách hợp lệ';
    if (Object.keys(errs).length) { setResErrors(errs); return; }

    if (!supabaseEnabled) { flash('Chưa cấu hình Supabase — không thể đặt bàn lúc này.'); return; }

    setResErrors({});
    setResSubmitting(true);
    try {
      const created = await createReservation({ branch, date: resDate, time: resTime, guests: Number(resGuests), note: '', customerName: loggedName, customerPhone: loggedPhone });
      setMyReservations(prev => [created, ...prev]);
      setResDate('');
      flash('Đã gửi yêu cầu đặt bàn — chi nhánh sẽ xác nhận sớm.');
    } catch (err) {
      console.error('[Supabase] Đặt bàn thất bại:', err);
      flash('Không đặt được bàn, vui lòng thử lại.');
    } finally {
      setResSubmitting(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Lưới thực đơn — chiếm toàn bộ chiều rộng vì đã bỏ sidebar giỏ hàng bên phải */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {grouped.length === 0 && (
          <div className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>Hiện chưa có món nào để đặt.</div>
        )}
        {grouped.map(([cat, items]) => (
          <section key={cat}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>{cat}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {items.map(item => (
                <button key={item.id} type="button" className="panel" onClick={() => addToCart(item)}
                  style={{ padding: '14px 16px', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4, border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
                  {item.desc && <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>{item.desc}</span>}
                  <span style={{ fontSize: 13, color: 'var(--text-accent)', fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(item.price)}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 2 khu vực chính, canh giữa, nằm giữa lưới thực đơn và ô chọn chi nhánh dùng chung */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24, maxWidth: 960, margin: '0 auto', width: '100%' }}>
        <section className="panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><CartIcon size={17} />Đặt món</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {cart.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-subtle)', textAlign: 'center', margin: '16px 0' }}>Chưa chọn món nào — bấm vào món bên trên để thêm.</p>
            ) : cart.map(it => (
              <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-soft)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{it.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(it.price)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button type="button" className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => updateCartQty(it.id, it.quantity - 1)}>−</button>
                  <span style={{ width: 22, textAlign: 'center', fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{it.quantity}</span>
                  <button type="button" className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => updateCartQty(it.id, it.quantity + 1)}>+</button>
                </div>
                <div style={{ width: 96, textAlign: 'right', fontSize: 13.5, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(it.price * it.quantity)}</div>
                <button type="button" className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => removeFromCart(it.id)}><TrashIcon size={14} /></button>
              </div>
            ))}
          </div>

          <label className="field-wrap">
            <label>Hình thức</label>
            <span className="field"><select value={orderMode} onChange={e => setOrderMode(e.target.value)}>
              <option value="mang_ve">Mang về</option>
              <option value="tai_ban">Dùng tại quán</option>
            </select></span>
          </label>
          <label className="field-wrap">
            <label>Ghi chú</label>
            <span className="field"><input placeholder="Ví dụ: số bàn, ít cay, không hành..." value={note} onChange={e => setNote(e.target.value)} /></span>
          </label>
          <label className="field-wrap">
            <label>Thanh toán</label>
            <span className="field"><select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option value="tien_mat">Tiền mặt khi nhận</option>
              <option value="chuyen_khoan">Chuyển khoản</option>
              <option value="the">Quẹt thẻ khi nhận</option>
            </select></span>
          </label>
          <p style={{ fontSize: 12, color: 'var(--text-subtle)' }}>
            Dự án chưa tích hợp cổng thanh toán trực tuyến — nhân viên sẽ xác nhận trạng thái thanh toán khi giao/nhận món.
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <span>Tổng cộng</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(cartTotal)}</span>
          </div>
          <button type="button" className="btn btn-primary btn-lg btn-block" onClick={submitOrder} disabled={submitting}>{submitting ? 'Đang đặt…' : 'Đặt món'}</button>
        </section>

        <section className="panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><CalendarIcon size={17} />Đặt bàn</h3>

          <div style={{ display: 'flex', gap: 12 }}>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Ngày</label>
              <span className="field" style={{ borderColor: resErrors.date ? 'var(--danger)' : undefined }}>
                <input type="date" value={resDate} onChange={e => setResDate(e.target.value)} />
              </span>
              {resErrors.date && <span className="err-msg">{resErrors.date}</span>}
            </label>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Giờ</label>
              <span className="field" style={{ borderColor: resErrors.time ? 'var(--danger)' : undefined }}>
                <input type="time" value={resTime} onChange={e => setResTime(e.target.value)} />
              </span>
              {resErrors.time && <span className="err-msg">{resErrors.time}</span>}
            </label>
          </div>
          <label className="field-wrap">
            <label>Số khách</label>
            <span className="field" style={{ borderColor: resErrors.guests ? 'var(--danger)' : undefined }}>
              <input type="number" min={1} value={resGuests} onChange={e => setResGuests(e.target.value)} />
            </span>
            {resErrors.guests && <span className="err-msg">{resErrors.guests}</span>}
          </label>

          <button type="button" className="btn btn-primary btn-lg btn-block" style={{ marginTop: 'auto' }} onClick={submitQuickReservation} disabled={resSubmitting}>{resSubmitting ? 'Đang gửi…' : 'Gửi yêu cầu đặt bàn'}</button>
        </section>
      </div>

      {/* Ô chọn chi nhánh dùng chung — áp dụng cho cả đặt món lẫn đặt bàn ở trên */}
      <div className="panel" style={{ padding: 20, maxWidth: 420, margin: '0 auto', width: '100%' }}>
        <label className="field-wrap">
          <label>Chi nhánh</label>
          <span className="field" style={{ borderColor: resErrors.branch ? 'var(--danger)' : undefined }}>
            <select value={branch} onChange={e => setBranch(e.target.value)}>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </span>
          {resErrors.branch && <span className="err-msg">{resErrors.branch}</span>}
        </label>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 2 — Đặt bàn: form đặt bàn + danh sách các lượt đặt bàn của khách.
// ---------------------------------------------------------------------------
function ReservationTab({ ctx }) {
  const { myReservations, setMyReservations, loggedName, loggedPhone, flash } = ctx;

  const [branch, setBranch] = useState(BRANCHES[0] || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00');
  const [guests, setGuests] = useState(2);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  async function submitReservation() {
    const errs = {};
    if (!branch) errs.branch = 'Chọn chi nhánh';
    if (!date) errs.date = 'Chọn ngày';
    if (!time) errs.time = 'Chọn giờ';
    if (!guests || guests < 1) errs.guests = 'Nhập số khách hợp lệ';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (!supabaseEnabled) { flash('Chưa cấu hình Supabase — không thể đặt bàn lúc này.'); return; }

    setErrors({});
    setSubmitting(true);
    try {
      const created = await createReservation({ branch, date, time, guests: Number(guests), note, customerName: loggedName, customerPhone: loggedPhone });
      setMyReservations(prev => [created, ...prev]);
      setDate(''); setNote('');
      flash('Đã gửi yêu cầu đặt bàn — chi nhánh sẽ xác nhận sớm.');
    } catch (err) {
      console.error('[Supabase] Đặt bàn thất bại:', err);
      flash('Không đặt được bàn, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }

  async function cancel(id) {
    setMyReservations(prev => prev.map(r => (r.id === id ? { ...r, status: 'cancelled' } : r)));
    try { await cancelReservation(id); }
    catch (err) {
      console.error('[Supabase] Huỷ đặt bàn thất bại:', err);
      flash('Không huỷ được đặt bàn trên máy chủ, vui lòng thử lại.');
    }
  }

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div className="panel" style={{ flex: '0 0 380px', padding: 24 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><CalendarIcon size={17} />Đặt bàn</h3>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label className="field-wrap">
            <label>Chi nhánh</label>
            <span className="field" style={{ borderColor: errors.branch ? 'var(--danger)' : undefined }}>
              <select value={branch} onChange={e => setBranch(e.target.value)}>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </span>
            {errors.branch && <span className="err-msg">{errors.branch}</span>}
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Ngày</label>
              <span className="field" style={{ borderColor: errors.date ? 'var(--danger)' : undefined }}>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </span>
              {errors.date && <span className="err-msg">{errors.date}</span>}
            </label>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Giờ</label>
              <span className="field" style={{ borderColor: errors.time ? 'var(--danger)' : undefined }}>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} />
              </span>
              {errors.time && <span className="err-msg">{errors.time}</span>}
            </label>
          </div>
          <label className="field-wrap">
            <label>Số khách</label>
            <span className="field" style={{ borderColor: errors.guests ? 'var(--danger)' : undefined }}>
              <input type="number" min={1} value={guests} onChange={e => setGuests(e.target.value)} />
            </span>
            {errors.guests && <span className="err-msg">{errors.guests}</span>}
          </label>
          <label className="field-wrap">
            <label>Yêu cầu đặc biệt (không bắt buộc)</label>
            <span className="field"><input placeholder="Ví dụ: bàn gần cửa sổ, có trẻ nhỏ..." value={note} onChange={e => setNote(e.target.value)} /></span>
          </label>
          <button type="button" className="btn btn-primary btn-lg btn-block" onClick={submitReservation} disabled={submitting}>{submitting ? 'Đang gửi…' : 'Gửi yêu cầu đặt bàn'}</button>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 320 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Các lượt đặt bàn của tôi</h3>
        {myReservations.length === 0 ? (
          <div className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>Bạn chưa có lượt đặt bàn nào.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myReservations.map(r => {
              const [bg, color, label] = RES_STATUS_STYLE[r.status] || RES_STATUS_STYLE.pending;
              return (
                <div key={r.id} className="panel" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{r.branch}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{r.date} · {r.time} · {r.guests} khách</div>
                    {r.note && <div style={{ fontSize: 12, color: 'var(--text-subtle)', marginTop: 2 }}>{r.note}</div>}
                  </div>
                  <span className="badge" style={{ background: bg, color }}><span className="dot" />{label}</span>
                  {r.status === 'pending' && <button type="button" className="btn btn-secondary btn-md" onClick={() => cancel(r.id)}>Huỷ</button>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 3 — Đơn của tôi: lịch sử đơn đặt món.
// ---------------------------------------------------------------------------
function MyOrdersTab({ ctx }) {
  const { myCustomerOrders, setMyCustomerOrders, flash } = ctx;

  async function cancel(id) {
    setMyCustomerOrders(prev => prev.map(o => (o.id === id ? { ...o, status: 'cancelled' } : o)));
    try { await cancelCustomerOrder(id); }
    catch (err) {
      console.error('[Supabase] Huỷ đơn thất bại:', err);
      flash('Không huỷ được đơn trên máy chủ, vui lòng thử lại.');
    }
  }

  if (myCustomerOrders.length === 0) {
    return <div className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>Bạn chưa đặt món nào.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {myCustomerOrders.map(o => {
        const [bg, color, label] = ORDER_STATUS_STYLE[o.status] || ORDER_STATUS_STYLE.pending;
        const [payBg, payColor, payLabel] = PAYMENT_STATUS_STYLE[o.paymentStatus] || PAYMENT_STATUS_STYLE.chua_thanh_toan;
        return (
          <div key={o.id} className="panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <ReceiptIcon size={17} style={{ color: 'var(--text-subtle)' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{o.code} · {o.branch}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>
                  {o.orderMode === 'tai_ban' ? 'Dùng tại quán' : 'Mang về'} · {new Date(o.createdAt).toLocaleString('vi-VN')} · {PAYMENT_METHOD_LABEL[o.paymentMethod] || PAYMENT_METHOD_LABEL.tien_mat}
                </div>
              </div>
              <span className="badge" style={{ background: payBg, color: payColor }}><span className="dot" />{payLabel}</span>
              <span className="badge" style={{ background: bg, color }}><span className="dot" />{label}</span>
              {o.status === 'pending' && <button type="button" className="btn btn-secondary btn-md" onClick={() => cancel(o.id)}>Huỷ đơn</button>}
            </div>
            <div style={{ marginTop: 14, borderTop: '1px solid var(--border-soft)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(o.items || []).map(it => (
                <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span>{it.name} × {it.quantity}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-muted)' }}>{fmtVnd(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: 14 }}>
              <span>Tổng cộng</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(o.total)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
