import { useState } from 'react';
import { MENU_CATEGORIES, BRANCHES, BANK_ACCOUNTS } from './data.js';
import { fmtVnd, toPlainAscii } from './utils.js';
import { TrashIcon, CalendarIcon, ReceiptIcon, CartIcon, SearchIcon, ChevronLeft, ChevronRight } from './icons.jsx';
import { pickDishArt } from './dishArt.jsx';
import heroQuanPhoto from './assets/hero-quan.jpg';
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

// QR chuyển khoản (VietQR, miễn phí — không qua cổng thanh toán trả phí) cho phương thức
// "Chuyển khoản". Dùng chung cho cả lúc đặt món (OrderFoodTab) lẫn xem lại đơn chưa thanh
// toán (MyOrdersTab). `content` nên là nội dung chuyển khoản để nhân viên đối soát (mã đơn
// nếu đã có, hoặc số điện thoại nếu đang ở bước đặt món, chưa có mã đơn).
function BankTransferInfo({ amount, content }) {
  const [selected, setSelected] = useState(0);
  if (!BANK_ACCOUNTS.length) return null;
  const acc = BANK_ACCOUNTS[selected] || BANK_ACCOUNTS[0];
  const safeContent = toPlainAscii(content);
  const qrUrl = `https://img.vietqr.io/image/${acc.bankCode}-${acc.accountNumber}-compact2.png?amount=${Math.max(0, Math.round(amount || 0))}&addInfo=${encodeURIComponent(safeContent)}&accountName=${encodeURIComponent(acc.accountName)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-card)' }}>
      {BANK_ACCOUNTS.length > 1 && (
        <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--surface-card)', borderRadius: 999, overflowX: 'auto' }}>
          {BANK_ACCOUNTS.map((b, i) => (
            <button key={b.accountNumber} type="button" className={`tabp ${selected === i ? 'active' : ''}`} onClick={() => setSelected(i)}>{b.bank}</button>
          ))}
        </div>
      )}
      <img src={qrUrl} alt={`QR chuyển khoản ${acc.bank}`} width={180} height={180} style={{ width: 180, height: 180, alignSelf: 'center', borderRadius: 'var(--radius-sm)', background: '#fff' }} />
      <p style={{ fontSize: 12, textAlign: 'center', color: 'var(--text-subtle)' }}>Quét mã bằng app ngân hàng bất kỳ, hoặc chuyển khoản thủ công theo thông tin bên dưới.</p>
      <div style={{ fontSize: 13, textAlign: 'center', lineHeight: 1.6 }}>
        <div style={{ fontWeight: 600 }}>{acc.bank}</div>
        <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{acc.accountNumber}</div>
        <div style={{ color: 'var(--text-muted)' }}>{acc.accountName}</div>
      </div>
      <div style={{ fontSize: 12, textAlign: 'center', color: 'var(--text-subtle)' }}>Nội dung chuyển khoản: <b>{safeContent}</b></div>
    </div>
  );
}

export default function CustomerDashboard({ ctx }) {
  const { theme, loggedName, loggedEmail, loggedPhone, customerDashboardTab: tab, setCustomerDashboardTab: setTab } = ctx;
  const themeClass = theme === 'dark' ? 'dark-mode' : '';

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
// Tab 1 — Đặt món: lưới thực đơn (lọc theo danh mục/tìm kiếm) bên trái, giỏ hàng
// dính (sticky) bên phải — bố cục theo mẫu POS khách hàng gửi.
// ---------------------------------------------------------------------------
function OrderFoodTab({ ctx }) {
  const {
    menuRecords, cart, addToCart, updateCartQty, removeFromCart, clearCart, cartTotal,
    loggedName, loggedPhone, flash, setMyCustomerOrders
  } = ctx;

  const [branch, setBranch] = useState(BRANCHES[0] || '');
  const [orderMode, setOrderMode] = useState('mang_ve');
  const [paymentMethod, setPaymentMethod] = useState('tien_mat');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('');

  const availableItems = menuRecords.filter(m => m.status === 'available' && m.visible !== false);
  const categories = MENU_CATEGORIES.filter(c => availableItems.some(m => m.category === c));
  const q = query.trim().toLowerCase();
  const filtered = availableItems.filter(m => (!activeCat || m.category === activeCat) && (!q || m.name.toLowerCase().includes(q)));

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

  return (
    <div className="order-layout">
      {/* Lưới thực đơn */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--surface-sunken)', borderRadius: 999, overflowX: 'auto' }}>
            <button type="button" className={`tabp ${!activeCat ? 'active' : ''}`} onClick={() => setActiveCat('')}>Tất cả</button>
            {categories.map(c => (
              <button key={c} type="button" className={`tabp ${activeCat === c ? 'active' : ''}`} onClick={() => setActiveCat(c)}>{c}</button>
            ))}
          </div>
          <span style={{ flex: 1 }} />
          <span className="field" style={{ width: 220 }}>
            <SearchIcon style={{ color: 'var(--text-subtle)', flex: '0 0 auto' }} />
            <input placeholder="Tìm món" value={query} onChange={e => setQuery(e.target.value)} />
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>Không tìm thấy món phù hợp.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {filtered.map(item => {
              const Art = pickDishArt(item);
              const inCart = cart.find(it => it.id === item.id);
              return (
                <div key={item.id} className="panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="photo-card" style={{ height: 110, padding: 12 }}><Art /></div>
                  <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{item.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 13.5, color: 'var(--text-accent)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(item.price)}</span>
                    <button type="button" className="btn btn-secondary btn-md" style={{ height: 32, padding: '0 12px', fontSize: 12.5 }} onClick={() => addToCart(item)}>
                      {inCart ? `Thêm (${inCart.quantity})` : 'Thêm'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Giỏ hàng — dính bên phải, giống panel "Order" trong mẫu */}
      <section className="panel order-cart" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><CartIcon size={16} />Đơn của bạn</h3>

        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--surface-sunken)', borderRadius: 999 }}>
          <button type="button" className={`tabp ${orderMode === 'tai_ban' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setOrderMode('tai_ban')}>Dùng tại quán</button>
          <button type="button" className={`tabp ${orderMode === 'mang_ve' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setOrderMode('mang_ve')}>Mang về</button>
        </div>

        <label className="field-wrap">
          <label>Chi nhánh</label>
          <span className="field"><select value={branch} onChange={e => setBranch(e.target.value)}>
            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </select></span>
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 280, overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-subtle)', textAlign: 'center', margin: '16px 0' }}>Chưa chọn món nào — bấm "Thêm" ở món bên trái.</p>
          ) : cart.map(it => {
            const Art = pickDishArt(it);
            return (
              <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-soft)' }}>
                <div className="photo-card" style={{ width: 36, height: 36, flex: '0 0 auto', padding: 6 }}><Art /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(it.price)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button type="button" className="icon-btn" style={{ width: 24, height: 24 }} onClick={() => updateCartQty(it.id, it.quantity - 1)}>−</button>
                  <span style={{ width: 18, textAlign: 'center', fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>{it.quantity}</span>
                  <button type="button" className="icon-btn" style={{ width: 24, height: 24 }} onClick={() => updateCartQty(it.id, it.quantity + 1)}>+</button>
                </div>
                <button type="button" className="icon-btn" style={{ width: 24, height: 24 }} onClick={() => removeFromCart(it.id)}><TrashIcon size={13} /></button>
              </div>
            );
          })}
        </div>

        <label className="field-wrap">
          <label>Ghi chú</label>
          <span className="field"><input placeholder="Ví dụ: ít cay, không hành..." value={note} onChange={e => setNote(e.target.value)} /></span>
        </label>
        <label className="field-wrap">
          <label>Thanh toán</label>
          <span className="field"><select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value="tien_mat">Tiền mặt khi nhận</option>
            <option value="chuyen_khoan">Chuyển khoản</option>
            <option value="the">Quẹt thẻ khi nhận</option>
          </select></span>
        </label>

        {paymentMethod === 'chuyen_khoan' && cartTotal > 0 && (
          <BankTransferInfo amount={cartTotal} content={`DUYEN PHAN ${loggedPhone || loggedName || ''}`} />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <span>Tổng cộng</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(cartTotal)}</span>
        </div>
        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={submitOrder} disabled={submitting}>{submitting ? 'Đang đặt…' : 'Đặt món'}</button>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lịch chọn ngày dạng tháng — thay cho <input type="date"> mặc định của trình duyệt.
// ---------------------------------------------------------------------------
function MiniCalendar({ value, onChange, errored }) {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const initial = value ? new Date(value + 'T00:00:00') : today;
  const [view, setView] = useState({ y: initial.getFullYear(), m: initial.getMonth() });

  const first = new Date(view.y, view.m, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const monthLabel = first.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  const fmt = d => `${view.y}-${String(view.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <button type="button" className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => setView(v => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }))}><ChevronLeft size={14} /></button>
        <span style={{ fontWeight: 600, fontSize: 14, textTransform: 'capitalize' }}>{monthLabel}</span>
        <button type="button" className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => setView(v => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }))}><ChevronRight size={14} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, fontSize: 11, color: 'var(--text-subtle)', textAlign: 'center', marginBottom: 4 }}>
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(w => <span key={w}>{w}</span>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, border: errored ? '1px solid var(--danger)' : 'none', borderRadius: 8, padding: errored ? 4 : 0 }}>
        {cells.map((d, i) => {
          if (d === null) return <span key={i} />;
          const dateStr = fmt(d);
          const isPast = dateStr < todayStr;
          const isSelected = dateStr === value;
          return (
            <button key={i} type="button" disabled={isPast} onClick={() => onChange(dateStr)}
              style={{
                height: 32, borderRadius: 8, border: 'none', cursor: isPast ? 'not-allowed' : 'pointer',
                background: isSelected ? 'var(--brand)' : 'transparent',
                color: isSelected ? 'var(--text-on-brand)' : isPast ? 'var(--text-subtle)' : 'var(--text-body)',
                fontWeight: dateStr === todayStr ? 700 : 400, fontSize: 13
              }}>{d}</button>
          );
        })}
      </div>
    </div>
  );
}

function minutesToHHMM(mins) {
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Tab 2 — Đặt bàn: ảnh nền + lịch chọn ngày + thanh trượt chọn giờ + thông tin liên hệ,
// cùng danh sách các lượt đặt bàn của khách.
// ---------------------------------------------------------------------------
function ReservationTab({ ctx }) {
  const { myReservations, setMyReservations, loggedName, loggedPhone, flash } = ctx;

  const [branch, setBranch] = useState(BRANCHES[0] || '');
  const [date, setDate] = useState('');
  const [timeMinutes, setTimeMinutes] = useState(18 * 60);
  const [guests, setGuests] = useState(2);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const time = minutesToHHMM(timeMinutes);
  function pickDate(d) { setDate(d); setErrors(er => ({ ...er, date: null })); }

  async function submitReservation() {
    const errs = {};
    if (!branch) errs.branch = 'Chọn chi nhánh';
    if (!date) errs.date = 'Chọn ngày trên lịch';
    if (!guests || guests < 1) errs.guests = 'Chọn số khách hợp lệ';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Ảnh nền + tiêu đề */}
      <div style={{ position: 'relative', borderRadius: 'var(--radius-card)', overflow: 'hidden', minHeight: 180, display: 'flex', alignItems: 'center' }}>
        <img src={heroQuanPhoto} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(46,42,34,.55)' }} />
        <div style={{ position: 'relative', padding: '32px 36px' }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'rgba(248,249,247,.8)' }}>Đặt bàn trực tuyến</p>
          <h2 style={{ marginTop: 6, fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 600, color: '#F8F9F7' }}>Giữ bàn tại Duyên Phần chỉ trong một phút</h2>
        </div>
      </div>

      <div className="reserve-layout">
        {/* Lịch + giờ + số khách + chi nhánh */}
        <div className="panel reserve-form-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <MiniCalendar value={date} onChange={pickDate} errored={!!errors.date} />
          {errors.date && <span className="err-msg">{errors.date}</span>}

          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-label)', fontWeight: 500, color: 'var(--text-body)', marginBottom: 8 }}>Giờ đặt bàn</label>
            <input type="range" min={360} max={1290} step={30} value={timeMinutes} onChange={e => setTimeMinutes(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--brand)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>06:00</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-brand)', fontVariantNumeric: 'tabular-nums' }}>{time}</span>
              <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>21:30</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Số khách</label>
              <span className="field" style={{ borderColor: errors.guests ? 'var(--danger)' : undefined }}>
                <select value={guests} onChange={e => setGuests(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n} khách</option>)}
                  <option value={8}>8 khách trở lên</option>
                </select>
              </span>
              {errors.guests && <span className="err-msg">{errors.guests}</span>}
            </label>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Chi nhánh</label>
              <span className="field" style={{ borderColor: errors.branch ? 'var(--danger)' : undefined }}>
                <select value={branch} onChange={e => setBranch(e.target.value)}>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </span>
              {errors.branch && <span className="err-msg">{errors.branch}</span>}
            </label>
          </div>
        </div>

        {/* Thông tin liên hệ + xác nhận + chính sách */}
        <div className="panel reserve-contact-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>Thông tin liên hệ</h3>
          <div style={{ padding: '10px 14px', background: 'var(--surface-page)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-control)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Người đặt</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{loggedName || 'Khách hàng'}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{loggedPhone || 'Chưa cập nhật số điện thoại'}</div>
          </div>
          <label className="field-wrap">
            <label>Yêu cầu đặc biệt (không bắt buộc)</label>
            <textarea rows={3} placeholder="Ví dụ: bàn gần cửa sổ, có trẻ nhỏ..." value={note} onChange={e => setNote(e.target.value)}
              style={{ width: '100%', resize: 'vertical', padding: '10px 12px', borderRadius: 'var(--radius-control)', border: '1px solid var(--border-strong)', fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-body-sm)', color: 'var(--text-body)', background: 'var(--surface-card)' }} />
          </label>
          <button type="button" className="btn btn-primary btn-lg btn-block" onClick={submitReservation} disabled={submitting}>
            <CalendarIcon size={16} />{submitting ? 'Đang gửi…' : 'Xác nhận đặt bàn'}
          </button>

          <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Chính sách đặt bàn</div>
              <p style={{ marginTop: 4, fontSize: 12, lineHeight: 1.6, color: 'var(--text-muted)' }}>Chi nhánh giữ bàn 15 phút kể từ giờ đã đặt. Vui lòng gọi trước cho chi nhánh nếu cần đổi giờ hoặc huỷ.</p>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Đặt bàn theo nhóm</div>
              <p style={{ marginTop: 4, fontSize: 12, lineHeight: 1.6, color: 'var(--text-muted)' }}>Từ 8 khách trở lên, nhân viên chi nhánh sẽ gọi lại xác nhận trước khi giữ bàn.</p>
            </div>
          </div>
        </div>
      </div>

      <div>
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
            {o.paymentMethod === 'chuyen_khoan' && o.paymentStatus === 'chua_thanh_toan' && o.status !== 'cancelled' && (
              <div style={{ marginTop: 14 }}>
                <BankTransferInfo amount={o.total} content={`DH ${o.code}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
