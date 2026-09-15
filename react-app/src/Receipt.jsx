import { fmtVnd } from './utils.js';

export default function Receipt({ order, branchName, final, onClose }) {
  const isPaid = order.status === 'paid';
  const subtotal = order.items.reduce((sum, [, qty, price]) => sum + qty * price, 0);
  const discount = order.discount || 0;
  const vatAmount = order.vatAmount || 0;
  const total = subtotal - discount + vatAmount;
  const now = order.paidAt ? new Date(order.paidAt) : new Date();

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
      <div className="toolbar no-print">
        <div style={{ flex: 1 }}>
          <span className="back-link" onClick={onClose} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            {final ? 'Về sơ đồ bàn' : 'Quay lại'}
          </span>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 4 }}>{isPaid ? 'Hoá đơn thanh toán' : 'Hoá đơn tạm tính'} — {order.tableName}</h2>
        </div>
        <button type="button" className="btn btn-primary btn-md" onClick={() => window.print()}>In hoá đơn</button>
      </div>

      <div style={{ padding: 32, display: 'flex', justifyContent: 'center' }}>
        <div className="receipt panel" style={{ width: '100%', maxWidth: 380, padding: 28, fontFamily: 'var(--font-ui)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 600 }}>Duyên Phần</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{branchName}</div>
            <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 6 }}>{now.toLocaleString('vi-VN')}</div>
          </div>

          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px dashed var(--border-strong)', fontSize: 13, fontWeight: 700, textAlign: 'center', color: isPaid ? 'var(--text-body)' : 'var(--text-accent)' }}>
            {isPaid ? 'HOÁ ĐƠN THANH TOÁN' : 'HOÁ ĐƠN TẠM TÍNH (chưa thanh toán)'}
          </div>
          <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>{order.tableName}</div>

          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--border-strong)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {order.items.map(([name, qty, price, itemNote]) => (
              <div key={name} style={{ fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{name} ×{qty}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(qty * price)}</span>
                </div>
                {itemNote && <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>↳ {itemNote}</div>}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--border-strong)', display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tạm tính</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(subtotal)}</span></div>
            {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-accent)' }}><span>Giảm giá</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>− {fmtVnd(discount)}</span></div>}
            {vatAmount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>VAT ({order.vatPct || 0}%)</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>+ {fmtVnd(vatAmount)}</span></div>}
          </div>

          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-strong)', display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
            <span>Tổng cộng</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(total)}</span>
          </div>
          {isPaid && order.paymentMethod && (
            <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>Thanh toán: {order.paymentMethod}</div>
          )}

          <div style={{ marginTop: 18, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>Cảm ơn quý khách — hẹn gặp lại!</div>
        </div>
      </div>
    </div>
  );
}
