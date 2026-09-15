import { useEffect, useState } from 'react';
import { fmtVnd, periodStartDate, previousPeriodStart, parseVnDate, buildChart, smoothPathFromPoints } from './utils.js';
import { supabaseEnabled, listPaidTableOrdersSince, listPaidTableOrdersBetween } from './lib/tableOrdersApi.js';
import SummaryCard from './SummaryCard.jsx';

const RANK_TINTS = ['#E7ECE5', '#F3E7D2', '#E4E9E4', '#F6DED7'];
const RANK_FG = ['#2E3B35', '#A8792E', '#4C5A50', '#8E3421'];

function fmtPct(n) {
  if (n > 999) return '>999';
  if (n < -999) return '<-999';
  return String(n);
}

function lastNDays(n) {
  return Array.from({ length: n }).map((_, i) => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (n - 1 - i));
    return d;
  });
}
function sumInDay(orders, day) {
  const next = new Date(day); next.setDate(next.getDate() + 1);
  return orders.filter(o => { const t = new Date(o.paidAt); return t >= day && t < next; });
}

export default function BranchPerformance({ ctx }) {
  const { branchRecords, expenseRecords } = ctx;
  const [period, setPeriod] = useState('month'); // week | month
  const [loading, setLoading] = useState(false);
  const [paidOrders, setPaidOrders] = useState([]);
  const [prevOrders, setPrevOrders] = useState([]);
  const [err, setErr] = useState(false);

  function load() {
    if (!supabaseEnabled) return;
    setLoading(true);
    setErr(false);
    const start = periodStartDate(period);
    const prevStart = previousPeriodStart(period, start);
    Promise.all([
      listPaidTableOrdersSince(start.toISOString()),
      listPaidTableOrdersBetween(prevStart.toISOString(), start.toISOString())
    ])
      .then(([cur, prev]) => { setPaidOrders(cur); setPrevOrders(prev); })
      .catch(e => { console.error('[Supabase] Không tải được hiệu suất chi nhánh:', e); setErr(true); })
      .finally(() => setLoading(false));
  }
  useEffect(load, [period]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = periodStartDate(period);
  const branchExpenses = {};
  let systemWideExpense = 0;
  expenseRecords.forEach(e => {
    const d = parseVnDate(e.date);
    if (!d || d < start) return;
    if (e.branch === 'Toàn hệ thống') { systemWideExpense += e.amount; return; }
    branchExpenses[e.branch] = (branchExpenses[e.branch] || 0) + e.amount;
  });

  const rows = branchRecords.map(b => {
    const orders = paidOrders.filter(o => o.branch === b.name);
    const revenue = orders.reduce((sum, o) => sum + (o.total - o.discount), 0);
    const expense = branchExpenses[b.name] || 0;
    return { name: b.name, revenue, orderCount: orders.length, expense, profit: revenue - expense };
  }).sort((a, b) => b.revenue - a.revenue);

  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
  const totalOrders = rows.reduce((s, r) => s + r.orderCount, 0);
  const totalExpense = rows.reduce((s, r) => s + r.expense, 0) + systemWideExpense;
  const profit = totalRevenue - totalExpense;
  const maxRevenue = Math.max(1, ...rows.map(r => r.revenue));
  const activeBranches = rows.filter(r => r.revenue > 0).length;

  const prevRevenue = prevOrders.reduce((s, o) => s + (o.total - o.discount), 0);
  const revenueGrowth = prevRevenue > 0 ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) : (totalRevenue > 0 ? 100 : 0);
  const branchCoveragePct = Math.round((activeBranches / (rows.length || 1)) * 100);
  const costRatioPct = totalRevenue > 0 ? Math.round((totalExpense / totalRevenue) * 100) : 0;
  const profitMarginPct = totalRevenue > 0 ? Math.round((profit / totalRevenue) * 100) : 0;

  // Xu hướng doanh thu toàn chuỗi — 7 ngày gần nhất.
  const last7 = lastNDays(7);
  const dayRevenue = last7.map(d => sumInDay(paidOrders, d).reduce((s, o) => s + (o.total - o.discount), 0));
  const dayOrderCount = last7.map(d => sumInDay(paidOrders, d).length);
  const maxDay = Math.max(1, ...dayRevenue);
  const revChart = buildChart(last7.map(d => d.toLocaleDateString('vi-VN', { weekday: 'short' })), dayRevenue.map(v => (v / maxDay) * 100), null);
  const revSmoothLine = smoothPathFromPoints(revChart.chartPoints);
  const revSmoothArea = revChart.chartPoints.length ? revSmoothLine + ` L ${revChart.chartPoints[revChart.chartPoints.length - 1].cx},198 L ${revChart.chartPoints[0].cx},198 Z` : '';

  // Doanh thu theo thứ trong tuần — kỳ này so với kỳ trước (dùng 7 ngày liền trước 7 ngày hiện tại để so sánh cùng vị trí thứ).
  const prev7 = lastNDays(14).slice(0, 7);
  const prevDayRevenue = prev7.map(d => sumInDay(prevOrders.length ? prevOrders : paidOrders, d).reduce((s, o) => s + (o.total - o.discount), 0));
  const maxBar = Math.max(1, ...dayRevenue, ...prevDayRevenue);

  // Top chi nhánh — sparkline riêng của chi nhánh dẫn đầu.
  const topBranch = rows[0];
  const topBranchDay = topBranch ? last7.map(d => sumInDay(paidOrders.filter(o => o.branch === topBranch.name), d).reduce((s, o) => s + (o.total - o.discount), 0)) : [];
  const topMax = Math.max(1, ...topBranchDay);

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Hiệu suất chi nhánh</h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Doanh thu tính từ các hoá đơn đã thanh toán tại bàn — cập nhật theo thời gian thực.</div>
        </div>
        <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--surface-page)', border: '1px solid var(--border)', borderRadius: 999 }}>
          <button type="button" className={`tabp ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>7 ngày qua</button>
          <button type="button" className={`tabp ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>Tháng này</button>
        </div>
      </div>

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {!supabaseEnabled ? (
          <section className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>Chưa kết nối Supabase — không thể tải hiệu suất thật.</section>
        ) : err ? (
          <section className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--danger-text)' }}>Không tải được dữ liệu, thử làm mới lại.</section>
        ) : loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ height: 100, borderRadius: 20, background: 'var(--surface-sunken)', opacity: 0.5 }} />)}
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <SummaryCard icon={<CoinIcon />} tone="brand" label="Tổng doanh thu" value={fmtVnd(totalRevenue)} hint={(revenueGrowth >= 0 ? '+' : '') + fmtPct(revenueGrowth) + '% so với kỳ trước'} />
              <SummaryCard icon={<PackageMiniIcon />} tone="neutral" label="Tổng đơn" value={String(totalOrders)} hint={activeBranches + '/' + rows.length + ' chi nhánh có đơn'} />
              <SummaryCard icon={<ReceiptIcon />} tone="neutral" label="Tổng chi phí" value={fmtVnd(totalExpense)} hint={fmtPct(costRatioPct) + '% doanh thu'} />
              <SummaryCard icon={<TrendIcon />} tone={profit >= 0 ? 'brand' : 'warn'} label="Lợi nhuận ước tính" value={fmtVnd(profit)} hint={fmtPct(profitMarginPct) + '% biên lợi nhuận'} negative={profit < 0} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(220px,1fr)', gap: 16, alignItems: 'stretch' }}>
              <section className="panel" style={{ padding: 20, borderRadius: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>Xu hướng doanh thu toàn chuỗi</h3>
                    <p style={{ marginTop: 2, fontSize: 12, color: 'var(--text-subtle)' }}>7 ngày gần nhất</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{fmtVnd(totalRevenue)}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: revenueGrowth >= 0 ? '#2E7D4F' : 'var(--danger-text)' }}>{revenueGrowth >= 0 ? '+' : ''}{fmtPct(revenueGrowth)}% so với kỳ trước</div>
                  </div>
                </div>
                <svg viewBox="0 0 720 200" style={{ display: 'block', width: '100%', height: 200, overflow: 'visible', marginTop: 8 }}>
                  <defs><linearGradient id="dpBranchRevFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                  </linearGradient></defs>
                  {revChart.chartGrid.map((g, i) => <line key={i} x1="8" x2="712" y1={g.y} y2={g.y} stroke="var(--border-soft)" strokeWidth={1} />)}
                  <path d={revSmoothArea} fill="url(#dpBranchRevFill)" />
                  <path d={revSmoothLine} fill="none" stroke="var(--brand)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                  {revChart.chartPoints.map((p, i) => <circle key={i} cx={p.cx} cy={p.cy} r={4} fill="var(--surface-card)" stroke="var(--brand)" strokeWidth={2.5} />)}
                  {revChart.chartLabels.map((l, i) => <text key={i} x={l.x} y="194" textAnchor="middle" fill="var(--text-subtle)" fontSize="12" fontFamily="var(--font-ui)">{l.label}</text>)}
                </svg>
              </section>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <section className="panel" style={{ padding: 18, borderRadius: 20 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>Chi nhánh dẫn đầu</span>
                  <div style={{ marginTop: 4, fontSize: 16, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{topBranch ? topBranch.name : '—'}</div>
                  <div style={{ marginTop: 2, fontSize: 14, fontWeight: 600, color: 'var(--text-accent)' }}>{topBranch ? fmtVnd(topBranch.revenue) : fmtVnd(0)}</div>
                  <Sparkline values={topBranchDay} max={topMax} color="#C5A059" />
                </section>
                <section className="panel" style={{ padding: 18, borderRadius: 20 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>Chi nhánh có doanh thu</span>
                  <div style={{ marginTop: 4, fontSize: 22, fontWeight: 700 }}>{activeBranches}<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-subtle)' }}> / {rows.length}</span></div>
                  <div style={{ marginTop: 10, height: 8, borderRadius: 999, background: 'var(--surface-sunken)', overflow: 'hidden' }}>
                    <div style={{ width: branchCoveragePct + '%', height: '100%', background: 'var(--brand)' }} />
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>{branchCoveragePct}% chi nhánh đang có giao dịch</div>
                </section>
              </div>
            </div>

            {rows.some(r => r.revenue > 0) && (
              <section className="panel" style={{ padding: 20, borderRadius: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Top chi nhánh</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                  {rows.slice(0, 4).map((r, i) => (
                    <div key={r.name} style={{ borderRadius: 16, background: RANK_TINTS[i % RANK_TINTS.length], padding: 16 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 999, background: 'var(--surface-card)', color: RANK_FG[i % RANK_FG.length], fontWeight: 700, fontSize: 13 }}>#{i + 1}</span>
                      <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: RANK_FG[i % RANK_FG.length], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                      <div style={{ marginTop: 6, fontSize: 15, fontWeight: 700 }}>{fmtVnd(r.revenue)}</div>
                      <div style={{ marginTop: 2, fontSize: 12, color: 'var(--text-muted)' }}>{r.orderCount} đơn</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>
              <section className="panel" style={{ padding: 20, borderRadius: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Doanh thu theo ngày</h3>
                <p style={{ marginTop: 2, fontSize: 12, color: 'var(--text-subtle)' }}>Kỳ này so với kỳ trước</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140, marginTop: 16, padding: '0 4px' }}>
                  {last7.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 3, height: '100%' }}>
                      <div title={fmtVnd(prevDayRevenue[i])} style={{ width: 8, borderRadius: 4, height: Math.max(3, (prevDayRevenue[i] / maxBar) * 100) + '%', background: 'var(--surface-sunken)' }} />
                      <div title={fmtVnd(dayRevenue[i])} style={{ width: 8, borderRadius: 4, height: Math.max(3, (dayRevenue[i] / maxBar) * 100) + '%', background: 'var(--brand)' }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  {last7.map((d, i) => <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'var(--text-subtle)' }}>{d.toLocaleDateString('vi-VN', { weekday: 'short' })}</span>)}
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--surface-sunken)' }} />Kỳ trước</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--brand)' }} />Kỳ này</span>
                </div>
              </section>

              <section className="panel" style={{ padding: 20, borderRadius: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Số đơn theo ngày</h3>
                <p style={{ marginTop: 2, fontSize: 12, color: 'var(--text-subtle)' }}>7 ngày gần nhất</p>
                <OrderAreaChart values={dayOrderCount} labels={last7.map(d => d.toLocaleDateString('vi-VN', { weekday: 'short' }))} />
              </section>
            </div>

            <section className="panel panel-flush" style={{ borderRadius: 20 }}>
              <div style={{ padding: '18px 24px 4px' }}><h3 style={{ fontSize: 15, fontWeight: 600 }}>Chi tiết theo chi nhánh</h3></div>
              <table style={{ width: '100%', fontSize: 'var(--fs-body-sm)' }}>
                <thead><tr><th>Chi nhánh</th><th>Doanh thu</th><th style={{ textAlign: 'right' }}>Số đơn</th><th style={{ textAlign: 'right' }}>TB / đơn</th><th style={{ textAlign: 'right' }}>Chi phí</th><th style={{ textAlign: 'right' }}>Lợi nhuận</th></tr></thead>
                <tbody>
                  {rows.map(r => (
                    <tr className="row" key={r.name}>
                      <td style={{ fontWeight: 600, minWidth: 220 }}>
                        {r.name}
                        <div style={{ marginTop: 6, height: 4, borderRadius: 999, background: 'var(--surface-sunken)', overflow: 'hidden' }}>
                          <div style={{ width: (r.revenue / maxRevenue * 100) + '%', height: '100%', background: 'var(--brand)' }} />
                        </div>
                      </td>
                      <td style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(r.revenue)}</td>
                      <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.orderCount}</td>
                      <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(r.orderCount ? Math.round(r.revenue / r.orderCount) : 0)}</td>
                      <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(r.expense)}</td>
                      <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: r.profit >= 0 ? '#2E3B35' : 'var(--danger-text)' }}>{fmtVnd(r.profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            {systemWideExpense > 0 && (
              <p style={{ fontSize: 12, color: 'var(--text-subtle)' }}>Không tính {fmtVnd(systemWideExpense)} chi phí "Toàn hệ thống" vào từng chi nhánh — đã gộp riêng vào tổng chi phí phía trên.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Sparkline({ values, max, color }) {
  if (!values.length) return null;
  const W = 200, H = 44;
  const pts = values.map((v, i) => ({ x: (i / (values.length - 1 || 1)) * W, y: H - (v / (max || 1)) * (H - 6) - 3 }));
  const path = pts.map((p, i) => (i ? 'L' : 'M') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 44, marginTop: 10, display: 'block' }}>
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OrderAreaChart({ values, labels }) {
  const max = Math.max(1, ...values);
  const W = 300, H = 130, PAD = 6;
  const pts = values.map((v, i) => ({ cx: PAD + (i / (values.length - 1 || 1)) * (W - PAD * 2), cy: H - (v / max) * (H - 16) - 8 }));
  const line = smoothPathFromPoints(pts);
  const area = pts.length ? line + ` L ${pts[pts.length - 1].cx},${H} L ${pts[0].cx},${H} Z` : '';
  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} style={{ width: '100%', height: H + 20, marginTop: 8, overflow: 'visible' }}>
      <defs><linearGradient id="dpOrderAreaFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
      </linearGradient></defs>
      <path d={area} fill="url(#dpOrderAreaFill)" />
      <path d={line} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p.cx} cy={p.cy} r={3.2} fill="var(--surface-card)" stroke="var(--accent)" strokeWidth={2} />)}
      {labels.map((l, i) => <text key={i} x={pts[i].cx} y={H + 16} textAnchor="middle" fill="var(--text-subtle)" fontSize="10" fontFamily="var(--font-ui)">{l}</text>)}
    </svg>
  );
}

function CoinIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9 9.5c0-1.4 1.3-2.5 3-2.5s3 1 3 2.2c0 2.8-6 1.3-6 4.1 0 1.3 1.3 2.2 3 2.2s3-1 3-2.3" /></svg>; }
function PackageMiniIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v8a1 1 0 0 1-.5.87l-8 4.5a1 1 0 0 1-1 0l-8-4.5A1 1 0 0 1 3 16V8a1 1 0 0 1 .5-.87l8-4.5a1 1 0 0 1 1 0l8 4.5A1 1 0 0 1 21 8Z" /><path d="M3.3 7.3 12 12l8.7-4.7M12 22V12" /></svg>; }
function ReceiptIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" /><path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-4" /><path d="M17 12h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3a2 2 0 0 1 0-4z" /></svg>; }
function TrendIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>; }
