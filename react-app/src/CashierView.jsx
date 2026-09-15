import { useEffect, useState } from 'react';
import { fmtVnd } from './utils.js';
import SummaryCard from './SummaryCard.jsx';
import { supabaseEnabled, listPaidTableOrdersByCashier } from './lib/tableOrdersApi.js';

function startOfTodayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function fmtTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export default function CashierView({ ctx }) {
  const { userName, userRoleLabel, userBranch, staffCode, openSecurity, logout, flash } = ctx;
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  function loadReport() {
    if (!supabaseEnabled || !userBranch) { setLoaded(true); return; }
    setLoading(true);
    listPaidTableOrdersByCashier(userBranch, userName, startOfTodayIso())
      .then(setTxns)
      .catch(err => {
        console.error('[Supabase] Không tải được báo cáo kết ca:', err);
        flash('Không tải được báo cáo kết ca, thử làm mới lại.');
      })
      .finally(() => { setLoading(false); setLoaded(true); });
  }

  useEffect(loadReport, [userBranch, userName]); // eslint-disable-line react-hooks/exhaustive-deps

  const count = txns.length;
  const totalCollected = txns.reduce((sum, o) => sum + (o.total - o.discount), 0);
  const totalDiscount = txns.reduce((sum, o) => sum + o.discount, 0);
  const byMethod = {};
  txns.forEach(o => {
    const key = o.paymentMethod || 'Khác';
    byMethod[key] = (byMethod[key] || 0) + (o.total - o.discount);
  });

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Ca trực của tôi</h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{userName} · {userRoleLabel} · {userBranch || 'Chưa gán chi nhánh'}</div>
        </div>
      </div>

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 780 }}>
        <section className="panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Thông tin tài khoản</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <InfoBox label="Mã nhân viên" value={staffCode || '—'} mono />
            <InfoBox label="Chức vụ" value={userRoleLabel} />
            <InfoBox label="Chi nhánh" value={userBranch || '— chưa được gán —'} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button type="button" className="btn btn-secondary btn-md" onClick={openSecurity}>Đổi mật khẩu</button>
            <button type="button" className="btn btn-secondary btn-md" onClick={logout}>Đăng xuất</button>
          </div>
        </section>

        <section className="panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Báo cáo kết ca</h3>
              <p style={{ marginTop: 4, fontSize: 14, color: 'var(--text-muted)' }}>Các giao dịch bạn đã thu tiền hôm nay, tính từ 00:00.</p>
            </div>
            <button type="button" className="btn btn-secondary btn-md" onClick={loadReport} disabled={loading}>{loading ? 'Đang tải…' : 'Làm mới'}</button>
          </div>

          {!supabaseEnabled ? (
            <EmptyBlock text="Chưa kết nối Supabase — không thể tải báo cáo thật." />
          ) : !userBranch ? (
            <EmptyBlock text="Bạn chưa được gán chi nhánh — liên hệ quản lý để xem báo cáo." />
          ) : !loaded && loading ? (
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Array.from({ length: 3 }).map((_, i) => <div key={i} style={{ height: 44, borderRadius: 'var(--radius-control)', background: 'var(--surface-sunken)', opacity: 0.5 }} />)}
            </div>
          ) : count === 0 ? (
            <EmptyBlock text="Chưa có giao dịch nào trong ca này." sub="Giao dịch thanh toán mới sẽ hiển thị tại đây." />
          ) : (
            <>
              <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <SummaryCard icon={<ReceiptIcon />} tone="brand" label="Giao dịch" value={count} />
                <SummaryCard icon={<CoinIcon />} tone="brand" label="Tổng thu" value={fmtVnd(totalCollected)} />
                <SummaryCard icon={<TagIcon />} tone="neutral" label="Đã giảm giá" value={fmtVnd(totalDiscount)} />
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {Object.entries(byMethod).map(([method, amount]) => (
                  <div key={method} style={{ flex: '1 1 160px', background: 'var(--surface-page)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-control)', padding: '12px 14px' }}>
                    <span style={{ display: 'block', fontSize: 'var(--fs-caption)', color: 'var(--text-subtle)' }}>{method}</span>
                    <span style={{ fontWeight: 600, fontSize: 'var(--fs-body-sm)', fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(amount)}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column' }}>
                {txns.map(o => (
                  <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-soft)', fontSize: 13 }}>
                    <span style={{ width: 56, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{fmtTime(o.paidAt)}</span>
                    <span style={{ flex: 1, fontWeight: 600 }}>{o.tableName}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{o.paymentMethod || '—'}</span>
                    <span style={{ width: 100, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(o.total - o.discount)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function ReceiptIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" /><path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-4" /><path d="M17 12h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3a2 2 0 0 1 0-4z" /></svg>; }
function CoinIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9 9.5c0-1.4 1.3-2.5 3-2.5s3 1 3 2.2c0 2.8-6 1.3-6 4.1 0 1.3 1.3 2.2 3 2.2s3-1 3-2.3" /></svg>; }
function TagIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20.6 12.6 12 21.2 2.8 12 2.8 3.4 12 3.4 20.6 12.6Z" /><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" /></svg>; }

function EmptyBlock({ text, sub }) {
  return (
    <div style={{ marginTop: 20, textAlign: 'center', padding: '40px 24px', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-control)' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-subtle)', margin: '0 auto' }}><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" /><path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-4" /><path d="M17 12h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3a2 2 0 0 1 0-4z" /></svg>
      <p style={{ marginTop: 12, fontSize: 'var(--fs-body)', color: 'var(--text-muted)' }}>{text}</p>
      {sub && <p style={{ marginTop: 4, fontSize: 'var(--fs-caption)', color: 'var(--text-subtle)' }}>{sub}</p>}
    </div>
  );
}

function InfoBox({ label, value, mono }) {
  return (
    <div style={{ background: 'var(--surface-page)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-control)', padding: '12px 14px' }}>
      <span style={{ display: 'block', fontSize: 'var(--fs-caption)', color: 'var(--text-subtle)' }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 'var(--fs-body-sm)', fontVariantNumeric: mono ? 'tabular-nums' : undefined }}>{value}</span>
    </div>
  );
}
