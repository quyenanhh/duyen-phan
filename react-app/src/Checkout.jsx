import { useState } from 'react';
import { fmtVnd } from './utils.js';
import { supabaseEnabled, updateTableOrderRow } from './lib/tableOrdersApi.js';
import { updateTableRow } from './lib/tablesApi.js';
import { findCustomerByPhone, upsertCustomerAfterPurchase } from './lib/customersApi.js';
import { findVoucherByCode, incrementVoucherUse } from './lib/vouchersApi.js';
import { verifyManagerPin } from './lib/profilesApi.js';
import Receipt from './Receipt.jsx';

const PAYMENT_METHODS = ['Tiền mặt', 'Chuyển khoản', 'Ví điện tử'];
const POINTS_PER_VND = 1 / 10000; // 1 điểm mỗi 10.000đ chi tiêu
const VND_PER_POINT = 1000; // đổi 1 điểm = 1.000đ giảm giá

export default function Checkout({ ctx }) {
  const {
    tableRecords, setTableRecords, tableOrderRecords, setTableOrderRecords,
    checkoutTableId, closeCheckout, userName, flash
  } = ctx;

  const table = tableRecords.find(t => t.id === checkoutTableId);
  const order = tableOrderRecords.find(o => o.tableId === checkoutTableId && o.status !== 'paid' && o.status !== 'cancelled');

  const [discountType, setDiscountType] = useState('percent'); // percent | amount
  const [discountValue, setDiscountValue] = useState('');
  const [splitCount, setSplitCount] = useState(1);
  const [payment, setPayment] = useState('Tiền mặt');
  const [vatPct, setVatPct] = useState('0');
  const [saving, setSaving] = useState(false);

  const [phoneInput, setPhoneInput] = useState('');
  const [customer, setCustomer] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerLookedUp, setCustomerLookedUp] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState(false);

  const [voucherInput, setVoucherInput] = useState('');
  const [voucher, setVoucher] = useState(null);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError, setVoucherError] = useState('');

  const [receiptOrder, setReceiptOrder] = useState(null);
  const [items, setItems] = useState(() => (order ? order.items.map(x => [...x]) : []));
  const [voidingName, setVoidingName] = useState(null);
  const [voidPin, setVoidPin] = useState('');
  const [voidError, setVoidError] = useState('');
  const [voidChecking, setVoidChecking] = useState(false);

  if (!table) return null;

  if (receiptOrder) {
    return <Receipt order={receiptOrder} branchName={table.name} final onClose={() => { setReceiptOrder(null); closeCheckout(); }} />;
  }

  if (!order || items.length === 0) {
    return (
      <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
        <div className="toolbar">
          <div style={{ flex: 1 }}>
            <span className="back-link" onClick={closeCheckout} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
              Sơ đồ bàn
            </span>
            <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 4 }}>Thanh toán — {table.name}</h2>
          </div>
        </div>
        <div style={{ padding: 32 }}>
          <section className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>Bàn này chưa có order để thanh toán.</section>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, [, qty, price]) => sum + qty * price, 0);
  const rawDiscount = Number(discountValue) || 0;
  const manualDiscount = Math.max(0, discountType === 'percent' ? Math.round(subtotal * rawDiscount / 100) : rawDiscount);
  const voucherDiscount = voucher ? Math.round(voucher.discountType === 'percent' ? subtotal * voucher.discountValue / 100 : voucher.discountValue) : 0;
  const maxRedeemablePoints = customer ? Math.min(customer.points, Math.floor(subtotal / VND_PER_POINT)) : 0;
  const pointsDiscount = redeemPoints ? maxRedeemablePoints * VND_PER_POINT : 0;
  const totalDiscount = Math.min(subtotal, manualDiscount + voucherDiscount + pointsDiscount);
  const afterDiscount = subtotal - totalDiscount;
  const vatAmount = Math.round(afterDiscount * (Number(vatPct) || 0) / 100);
  const finalTotal = afterDiscount + vatAmount;
  const n = Math.max(1, Number(splitCount) || 1);
  const perPerson = Math.ceil(finalTotal / n / 1000) * 1000;
  const pointsEarned = Math.floor(finalTotal * POINTS_PER_VND);
  const pointsRedeemedNow = redeemPoints ? maxRedeemablePoints : 0;

  async function lookupCustomer() {
    const phone = phoneInput.trim();
    if (!phone) return;
    setCustomerLoading(true);
    setRedeemPoints(false);
    try {
      const found = await findCustomerByPhone(phone);
      setCustomer(found);
      setCustomerLookedUp(true);
    } catch (err) {
      console.error('[Supabase] Tra cứu khách hàng thất bại:', err);
      flash('Không tra cứu được khách hàng.');
    } finally {
      setCustomerLoading(false);
    }
  }

  async function applyVoucher() {
    const code = voucherInput.trim();
    if (!code) return;
    setVoucherLoading(true);
    setVoucherError('');
    try {
      const found = await findVoucherByCode(code);
      if (!found) { setVoucherError('Không tìm thấy mã này.'); setVoucher(null); }
      else if (!found.active) { setVoucherError('Mã này đã ngừng áp dụng.'); setVoucher(null); }
      else if (found.maxUses != null && found.usedCount >= found.maxUses) { setVoucherError('Mã này đã hết lượt sử dụng.'); setVoucher(null); }
      else { setVoucher(found); flash('Đã áp dụng mã ' + found.code + '.'); }
    } catch (err) {
      console.error('[Supabase] Áp dụng mã giảm giá thất bại:', err);
      setVoucherError('Không kiểm tra được mã, thử lại.');
    } finally {
      setVoucherLoading(false);
    }
  }
  function removeVoucher() { setVoucher(null); setVoucherInput(''); setVoucherError(''); }

  function requestVoidItem(name) { setVoidingName(name); setVoidPin(''); setVoidError(''); }
  function cancelVoidItem() { setVoidingName(null); setVoidPin(''); setVoidError(''); }
  async function confirmVoidItem() {
    if (!voidPin.trim()) { setVoidError('Nhập mã duyệt.'); return; }
    setVoidChecking(true);
    try {
      const ok = await verifyManagerPin(voidPin);
      if (!ok) { setVoidError('Mã duyệt không đúng.'); return; }
      setItems(list => list.filter(([n]) => n !== voidingName));
      flash('Đã huỷ món "' + voidingName + '" khỏi hoá đơn.');
      cancelVoidItem();
    } catch (err) {
      console.error('[Supabase] Kiểm tra mã duyệt thất bại:', err);
      setVoidError('Không kiểm tra được mã, thử lại.');
    } finally {
      setVoidChecking(false);
    }
  }

  async function confirmPayment() {
    setSaving(true);
    const payload = {
      status: 'paid', items, discount: totalDiscount, paymentMethod: payment, cashierName: userName, paidAt: new Date().toISOString(),
      vatPct: Number(vatPct) || 0, vatAmount, customerPhone: customer ? customer.phone : '',
      voucherCode: voucher ? voucher.code : '', pointsEarned, pointsRedeemed: pointsRedeemedNow
    };
    try {
      const updated = await (supabaseEnabled ? updateTableOrderRow(order.id, payload) : Promise.resolve({ ...order, ...payload }));
      setTableOrderRecords(recs => recs.map(o => (o.id === order.id ? updated : o)));
      setTableRecords(recs => recs.map(t => (t.id === table.id ? { ...t, status: 'cho_don' } : t)));
      if (supabaseEnabled) {
        try { await updateTableRow(table.id, { status: 'cho_don' }); } catch (err) { console.error('[Supabase] Không cập nhật được trạng thái bàn:', err); }
        if (customer) {
          try { await upsertCustomerAfterPurchase(customer.phone, customer.name, finalTotal, pointsEarned - pointsRedeemedNow); }
          catch (err) { console.error('[Supabase] Cập nhật điểm khách hàng thất bại:', err); }
        }
        if (voucher) {
          try { await incrementVoucherUse(voucher.id); }
          catch (err) { console.error('[Supabase] Cập nhật lượt dùng mã giảm giá thất bại:', err); }
        }
      }
      flash('Đã thanh toán ' + table.name + ': ' + fmtVnd(finalTotal) + '.');
      setReceiptOrder({ ...updated, tableName: table.name });
    } catch (err) {
      console.error('[Supabase] Thanh toán thất bại:', err);
      flash('Không lưu được thanh toán lên máy chủ, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <span className="back-link" onClick={closeCheckout} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            Sơ đồ bàn
          </span>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 4 }}>Thanh toán — {table.name}</h2>
        </div>
        <button type="button" className="btn btn-secondary btn-md" onClick={() => setReceiptOrder({ ...order, items, tableName: table.name })}>In tạm tính</button>
      </div>

      <div style={{ padding: 32, maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <section className="panel" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Chi tiết hoá đơn</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(([name, qty, price, itemNote]) => (
              <div key={name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, gap: 8 }}>
                  <span style={{ flex: 1 }}>{name} <span style={{ color: 'var(--text-muted)' }}>×{qty}</span></span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(qty * price)}</span>
                  {voidingName === name ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input
                        autoFocus type="password" inputMode="numeric" placeholder="Mã duyệt"
                        value={voidPin} onChange={e => setVoidPin(e.target.value)}
                        style={{ width: 90, height: 28, border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-control)', padding: '0 8px', fontSize: 12 }}
                      />
                      <button type="button" className="btn btn-danger" style={{ height: 28, padding: '0 8px', fontSize: 12 }} onClick={confirmVoidItem} disabled={voidChecking}>OK</button>
                      <button type="button" className="btn btn-secondary" style={{ height: 28, padding: '0 8px', fontSize: 12 }} onClick={cancelVoidItem}>Huỷ</button>
                    </span>
                  ) : (
                    <button type="button" className="icon-btn" style={{ width: 26, height: 26, color: 'var(--danger)', flex: '0 0 auto' }} title="Huỷ món (cần mã duyệt quản lý)" onClick={() => requestVoidItem(name)}>×</button>
                  )}
                </div>
                {itemNote && <div style={{ fontSize: 12, color: 'var(--text-subtle)' }}>↳ {itemNote}</div>}
                {voidingName === name && voidError && <div className="err-msg">{voidError}</div>}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border-soft)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span>Tạm tính</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(subtotal)}</span>
          </div>
        </section>

        <section className="panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>Khách hàng thân thiết</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="field" style={{ flex: 1 }}>
              <input placeholder="Số điện thoại khách" value={phoneInput} onChange={e => { setPhoneInput(e.target.value); setCustomerLookedUp(false); setCustomer(null); }} />
            </span>
            <button type="button" className="btn btn-secondary btn-md" onClick={lookupCustomer} disabled={customerLoading || !phoneInput.trim()}>{customerLoading ? 'Đang tra…' : 'Tra cứu'}</button>
          </div>
          {customerLookedUp && (
            customer ? (
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Khách quen{customer.name ? ' — ' + customer.name : ''} · đang có <strong style={{ color: 'var(--text-body)' }}>{customer.points} điểm</strong> ({fmtVnd(customer.points * VND_PER_POINT)})
                {maxRedeemablePoints > 0 && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={redeemPoints} onChange={e => setRedeemPoints(e.target.checked)} />
                    Dùng {maxRedeemablePoints} điểm để giảm {fmtVnd(maxRedeemablePoints * VND_PER_POINT)}
                  </label>
                )}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--text-subtle)' }}>Khách mới — sẽ tự tạo hồ sơ tích điểm sau khi thanh toán.</div>
            )
          )}
        </section>

        <section className="panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>Mã giảm giá</h3>
          {voucher ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
              <span>Đã áp dụng <strong>{voucher.code}</strong> (− {voucher.discountType === 'percent' ? voucher.discountValue + '%' : fmtVnd(voucher.discountValue)})</span>
              <button type="button" className="btn btn-secondary" style={{ height: 30, padding: '0 10px', fontSize: 12 }} onClick={removeVoucher}>Bỏ mã</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="field" style={{ flex: 1 }}>
                <input placeholder="Nhập mã giảm giá" value={voucherInput} onChange={e => setVoucherInput(e.target.value)} />
              </span>
              <button type="button" className="btn btn-secondary btn-md" onClick={applyVoucher} disabled={voucherLoading || !voucherInput.trim()}>{voucherLoading ? 'Đang kiểm tra…' : 'Áp dụng'}</button>
            </div>
          )}
          {voucherError && <span className="err-msg">{voucherError}</span>}
        </section>

        <section className="panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>Giảm giá thủ công</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="field" style={{ width: 140 }}>
              <select value={discountType} onChange={e => setDiscountType(e.target.value)}>
                <option value="percent">Theo %</option>
                <option value="amount">Số tiền (₫)</option>
              </select>
            </span>
            <span className="field" style={{ flex: 1 }}>
              <input type="number" min="0" placeholder={discountType === 'percent' ? 'Ví dụ: 10' : 'Ví dụ: 20000'} value={discountValue} onChange={e => setDiscountValue(e.target.value)} />
            </span>
          </div>
          {totalDiscount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-accent)' }}>
              <span>Tổng đã giảm</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>− {fmtVnd(totalDiscount)}</span>
            </div>
          )}
        </section>

        <section className="panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>Thuế VAT</h3>
          <label className="field-wrap">
            <label>Thuế suất (%)</label>
            <span className="field" style={{ width: 120 }}><input type="number" min="0" max="100" value={vatPct} onChange={e => setVatPct(e.target.value)} /></span>
          </label>
          {vatAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span>Tiền thuế VAT ({vatPct}%)</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>+ {fmtVnd(vatAmount)}</span>
            </div>
          )}
        </section>

        <section className="panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>Chia hoá đơn</h3>
          <label className="field-wrap">
            <label>Số người chia</label>
            <span className="field" style={{ width: 120 }}><input type="number" min="1" value={splitCount} onChange={e => setSplitCount(e.target.value)} /></span>
          </label>
          {n > 1 && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Mỗi người trả khoảng <strong style={{ color: 'var(--text-body)' }}>{fmtVnd(perPerson)}</strong> (chia đều {n} người).</div>
          )}
        </section>

        <section className="panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>Phương thức thanh toán</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PAYMENT_METHODS.map(m => (
              <button key={m} type="button" className={payment === m ? 'btn btn-primary' : 'btn btn-secondary'} style={{ height: 36, padding: '0 16px', fontSize: 13 }} onClick={() => setPayment(m)}>{m}</button>
            ))}
          </div>
        </section>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 19, fontWeight: 700, padding: '4px 4px' }}>
          <span>Tổng cần thu</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(finalTotal)}</span>
        </div>
        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={confirmPayment} disabled={saving}>{saving ? 'Đang xử lý…' : 'Xác nhận thanh toán'}</button>
      </div>
    </div>
  );
}
