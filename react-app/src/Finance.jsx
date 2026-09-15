import { useEffect, useState } from 'react';
import { EXPENSE_CATEGORIES, BRANCHES } from './data.js';
import { buildChart, fmtVnd, periodStartDate, previousPeriodStart, parseVnDate, smoothPathFromPoints } from './utils.js';
import { SearchIcon, XIcon, TrashIcon, EditIcon } from './icons.jsx';
import { pickDishArt } from './dishArt.jsx';
import { supabaseEnabled, insertExpense, updateExpenseRow, deleteExpenseRow } from './lib/expensesApi.js';
import SummaryCard from './SummaryCard.jsx';
import { listPaidTableOrdersSince, listPaidTableOrdersBetween } from './lib/tableOrdersApi.js';

const EXPENSE_BRANCHES = ['Toàn hệ thống', ...BRANCHES];
const PAYMENT_COLORS = { 'Tiền mặt': '#2F3E34', 'Chuyển khoản': '#C5A059', 'Ví điện tử': '#7A9471' };
const ITEM_TINTS = ['#E7ECE5', '#F3E7D2', '#E4E9E4', '#F6DED7'];
const CATEGORY_STYLE = {
  'Nguyên liệu': { bg: '#E7ECE5', fg: '#2E3B35', Icon: LeafMiniIcon },
  'Lương nhân viên': { bg: '#E4E9E4', fg: '#2F3E34', Icon: TeamIcon },
  'Thuê mặt bằng': { bg: '#F3E7D2', fg: '#A8792E', Icon: BuildingIcon },
  'Điện nước': { bg: '#DFE7EF', fg: '#3F5C79', Icon: BoltIcon },
  'Marketing': { bg: '#F6DED7', fg: '#8E3421', Icon: MegaphoneIcon },
  'Khác': { bg: '#EAEAE5', fg: '#5C6B60', Icon: DotsIcon }
};
function categoryStyle(cat) { return CATEGORY_STYLE[cat] || { bg: '#EAEAE5', fg: '#5C6B60', Icon: DotsIcon }; }
// Vị trí tương đối (theo %) để xếp bong bóng chồng nhau kiểu "packed" — bong bóng lớn nhất ở giữa dưới.
const BUBBLE_POS = [
  { x: 0.36, y: 0.58 }, { x: 0.68, y: 0.34 }, { x: 0.20, y: 0.24 },
  { x: 0.82, y: 0.68 }, { x: 0.55, y: 0.82 }, { x: 0.14, y: 0.72 }
];

export default function Finance({ ctx }) {
  const {
    expenseRecords, expenseQuery, setExpenseQuery, expenseFilterCategory, setExpenseFilterCategory,
    setExpenseAddOpen, setExpenseAddForm, setExpenseAddErrors, setDeleteExpenseId, menuRecords
  } = ctx;

  const [period, setPeriod] = useState('month'); // week | month
  const [paidOrders, setPaidOrders] = useState([]);
  const [prevOrders, setPrevOrders] = useState([]);
  const [loading, setLoading] = useState(false);
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
      .catch(e => { console.error('[Supabase] Không tải được dữ liệu doanh thu:', e); setErr(true); })
      .finally(() => setLoading(false));
  }
  useEffect(load, [period]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = periodStartDate(period);
  const prevStart = previousPeriodStart(period, start);
  const revenue = paidOrders.reduce((sum, o) => sum + (o.total - o.discount), 0);
  const orderCount = paidOrders.length;
  const periodExpenses = expenseRecords.filter(e => { const d = parseVnDate(e.date); return d && d >= start; });
  const expenseTotal = periodExpenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = revenue - expenseTotal;

  const prevRevenue = prevOrders.reduce((sum, o) => sum + (o.total - o.discount), 0);
  const prevOrderCount = prevOrders.length;
  const prevExpenses = expenseRecords.filter(e => { const d = parseVnDate(e.date); return d && d >= prevStart && d < start; }).reduce((sum, e) => sum + e.amount, 0);
  const prevProfit = prevRevenue - prevExpenses;

  function pctTrend(cur, prev) {
    if (prev <= 0) return cur > 0 ? { pct: 100, up: true } : null;
    const pct = Math.round(((cur - prev) / prev) * 100);
    return { pct: Math.abs(pct), up: pct >= 0 };
  }

  // Xu hướng doanh thu 7 ngày gần nhất (luôn theo tuần, không phụ thuộc bộ lọc phía trên).
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const dayRevenue = last7.map(d => {
    const next = new Date(d); next.setDate(next.getDate() + 1);
    return paidOrders
      .filter(o => { const t = new Date(o.paidAt); return t >= d && t < next; })
      .reduce((sum, o) => sum + (o.total - o.discount), 0);
  });
  const maxDay = Math.max(1, ...dayRevenue);
  const chart = buildChart(last7.map(d => d.toLocaleDateString('vi-VN', { weekday: 'short' })), dayRevenue.map(v => (v / maxDay) * 100), null);
  const smoothLinePath = smoothPathFromPoints(chart.chartPoints);
  const smoothAreaPath = smoothLinePath + ` L ${chart.chartPoints[chart.chartPoints.length - 1].cx},198 L ${chart.chartPoints[0].cx},198 Z`;

  // Phương thức thanh toán.
  const byMethod = {};
  paidOrders.forEach(o => { const k = o.paymentMethod || 'Khác'; byMethod[k] = (byMethod[k] || 0) + (o.total - o.discount); });
  const paymentSegments = Object.entries(byMethod).map(([label, value]) => ({ label, value, color: PAYMENT_COLORS[label] || '#8A9690' }));

  // Chi phí theo hạng mục.
  const byCategory = {};
  periodExpenses.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });
  const categoryBubbles = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value, color: categoryStyle(label).fg }));

  // Món bán chạy.
  const itemQty = {};
  paidOrders.forEach(o => o.items.forEach(([name, qty]) => { itemQty[name] = (itemQty[name] || 0) + qty; }));
  const topItems = Object.entries(itemQty).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([name, qty]) => {
    const menuItem = menuRecords.find(m => m.name === name);
    return { name, qty, category: menuItem && menuItem.category };
  });

  const q = expenseQuery.trim().toLowerCase();
  const filtered = expenseRecords.filter(e => {
    const matchesQuery = !q || e.note.toLowerCase().includes(q) || e.branch.toLowerCase().includes(q);
    const matchesCategory = !expenseFilterCategory || e.category === expenseFilterCategory;
    return matchesQuery && matchesCategory;
  });

  const expenseGroups = [];
  const groupIndex = new Map();
  filtered.forEach(e => {
    if (!groupIndex.has(e.date)) { groupIndex.set(e.date, { date: e.date, items: [] }); expenseGroups.push(groupIndex.get(e.date)); }
    groupIndex.get(e.date).items.push(e);
  });

  function openAdd() {
    setExpenseAddForm({ id: null, date: new Date().toLocaleDateString('vi-VN'), branch: '', category: '', amount: '', note: '' });
    setExpenseAddErrors({});
    setExpenseAddOpen(true);
  }
  function openEdit(e) {
    setExpenseAddForm({ id: e.id, date: e.date, branch: e.branch, category: e.category, amount: String(e.amount), note: e.note });
    setExpenseAddErrors({});
    setExpenseAddOpen(true);
  }

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Doanh thu &amp; Chi tiêu</h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Doanh thu tính từ hoá đơn đã thanh toán tại bàn — cập nhật theo thời gian thực.</div>
        </div>
        <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--surface-page)', border: '1px solid var(--border)', borderRadius: 999 }}>
          <button type="button" className={`tabp ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>7 ngày qua</button>
          <button type="button" className={`tabp ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>Tháng này</button>
        </div>
      </div>

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {!supabaseEnabled ? (
          <section className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>Chưa kết nối Supabase — không thể tải doanh thu thật.</section>
        ) : err ? (
          <section className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--danger-text)' }}>Không tải được dữ liệu, thử làm mới lại.</section>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <SummaryCard icon={<CoinIcon />} tone="green" label="Tổng doanh thu" value={loading ? '…' : fmtVnd(revenue)} trend={pctTrend(revenue, prevRevenue)} />
              <SummaryCard icon={<PackageMiniIcon />} tone="clay" label="Tổng đơn" value={loading ? '…' : String(orderCount)} trend={pctTrend(orderCount, prevOrderCount)} />
              <SummaryCard icon={<ReceiptIcon />} tone="gray" label="Tổng chi phí" value={loading ? '…' : fmtVnd(expenseTotal)} trend={pctTrend(expenseTotal, prevExpenses)} trendGoodDirection="down" />
              <SummaryCard icon={<TrendIcon />} tone={profit >= 0 ? 'green' : 'red'} label="Lợi nhuận ước tính" value={loading ? '…' : fmtVnd(profit)} negative={!loading && profit < 0} trend={pctTrend(profit, prevProfit)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) minmax(0, 2fr)', gap: 16 }}>
              <section className="panel" style={{ padding: 20, borderRadius: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Phương thức thanh toán</h3>
                {paymentSegments.length === 0 ? (
                  <p style={{ marginTop: 40, textAlign: 'center', fontSize: 13, color: 'var(--text-subtle)' }}>Chưa có giao dịch nào.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 12 }}>
                    <div style={{ position: 'relative', width: 168, height: 168 }}>
                      <DonutChart segments={paymentSegments} size={168} thickness={24} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 18, fontWeight: 700 }}>{fmtVnd(revenue)}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Tổng thu</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                      {paymentSegments.map(s => (
                        <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                          <span style={{ width: 9, height: 9, borderRadius: 999, background: s.color, flex: '0 0 auto' }} />
                          <span style={{ flex: 1, color: 'var(--text-muted)' }}>{s.label}</span>
                          <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{Math.round(s.value / (revenue || 1) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <section className="panel" style={{ padding: 20, borderRadius: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Xu hướng doanh thu</h3>
                <p style={{ marginTop: 2, fontSize: 12, color: 'var(--text-subtle)' }}>7 ngày gần nhất</p>
                <svg viewBox="0 0 720 200" style={{ display: 'block', width: '100%', height: 200, overflow: 'visible', marginTop: 8 }}>
                  <defs><linearGradient id="dpRevFillFinance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                  </linearGradient></defs>
                  {chart.chartGrid.map((g, i) => <line key={i} x1="8" x2="712" y1={g.y} y2={g.y} stroke="var(--border-soft)" strokeWidth={1} />)}
                  <path d={smoothAreaPath} fill="url(#dpRevFillFinance)" />
                  <path d={smoothLinePath} fill="none" stroke="var(--brand)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                  {chart.chartPoints.map((p, i) => <circle key={i} cx={p.cx} cy={p.cy} r={4} fill="var(--surface-card)" stroke="var(--brand)" strokeWidth={2.5} />)}
                  {chart.chartLabels.map((l, i) => <text key={i} x={l.x} y="194" textAnchor="middle" fill="var(--text-subtle)" fontSize="12" fontFamily="var(--font-ui)">{l.label}</text>)}
                </svg>
              </section>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) minmax(0, 2fr)', gap: 16 }}>
              <section className="panel" style={{ padding: 20, borderRadius: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Chi phí theo hạng mục</h3>
                {categoryBubbles.length === 0 ? (
                  <p style={{ marginTop: 40, textAlign: 'center', fontSize: 13, color: 'var(--text-subtle)' }}>Chưa có khoản chi nào trong kỳ này.</p>
                ) : (
                  <>
                    <BubbleCluster bubbles={categoryBubbles} total={expenseTotal} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16 }}>
                      {categoryBubbles.map(b => (
                        <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                          <span style={{ width: 8, height: 8, borderRadius: 999, background: b.color, flex: '0 0 auto' }} />
                          <span style={{ flex: 1, color: 'var(--text-muted)' }}>{b.label}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>

              <section className="panel" style={{ padding: 20, borderRadius: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Món bán chạy</h3>
                {topItems.length === 0 ? (
                  <p style={{ marginTop: 40, textAlign: 'center', fontSize: 13, color: 'var(--text-subtle)' }}>Chưa có món nào được bán trong kỳ này.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 14, marginTop: 12 }}>
                    {topItems.map((it, i) => {
                      const Art = pickDishArt(it);
                      const tint = ITEM_TINTS[i % ITEM_TINTS.length];
                      return (
                        <div key={it.name}>
                          <div style={{ position: 'relative' }}>
                            <div style={{ height: 96, borderRadius: 16, background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}><Art /></div>
                            <span style={{ position: 'absolute', right: 8, bottom: -10, background: 'var(--brand)', color: 'var(--text-on-brand)', borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>{it.qty} đã bán</span>
                          </div>
                          <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </>
        )}

        <section className="panel panel-flush" style={{ borderRadius: 20 }}>
          <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 auto' }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>Chi phí vận hành</h3>
            </div>
            <div style={{ flex: 1 }} />
            <button type="button" className="btn btn-primary btn-md" onClick={openAdd}>+ Thêm khoản chi</button>
          </div>
          <div style={{ padding: '0 24px 20px', display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
            <label className="field-wrap" style={{ width: 260 }}>
              <label>Tìm kiếm</label>
              <span className="field"><SearchIcon style={{ color: 'var(--text-subtle)', flex: '0 0 auto' }} /><input placeholder="Ghi chú hoặc chi nhánh" value={expenseQuery} onChange={e => setExpenseQuery(e.target.value)} /></span>
            </label>
            <label className="field-wrap" style={{ width: 200 }}>
              <label>Hạng mục</label>
              <span className="field"><select value={expenseFilterCategory} onChange={e => setExpenseFilterCategory(e.target.value)}>
                <option value="">Tất cả hạng mục</option>
                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select></span>
            </label>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)', paddingBottom: 10 }}>{filtered.length} / {expenseRecords.length} khoản chi</span>
          </div>

          {expenseGroups.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>Không tìm thấy khoản chi nào khớp với bộ lọc.</div>
          ) : (
            <div style={{ padding: '0 24px 24px' }}>
              {expenseGroups.map(group => {
                const subtotal = group.items.reduce((s, e) => s + e.amount, 0);
                return (
                  <div key={group.date}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0 10px' }}>
                      <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--brand)', flex: '0 0 auto' }} />
                      <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>{group.date}</span>
                      <span style={{ flex: 1, height: 1, background: 'var(--border-soft)' }} />
                      <span style={{ fontSize: 12, color: 'var(--text-subtle)', fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {group.items.map(e => {
                        const cat = categoryStyle(e.category);
                        const CatIcon = cat.Icon;
                        return (
                          <div key={e.id} className="expense-row" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 8px', borderRadius: 12 }}>
                            <span style={{ width: 38, height: 38, borderRadius: 999, background: cat.bg, color: cat.fg, display: 'grid', placeItems: 'center', flex: '0 0 auto' }}><CatIcon /></span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.note || e.category}</div>
                              <div style={{ marginTop: 2, fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 6, alignItems: 'center' }}>
                                <span style={{ color: cat.fg, fontWeight: 600 }}>{e.category}</span>
                                <span>·</span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.branch}</span>
                              </div>
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums', flex: '0 0 auto' }}>{fmtVnd(e.amount)}</div>
                            <div className="expense-row-actions" style={{ display: 'flex', gap: 2, flex: '0 0 auto' }}>
                              <button type="button" className="icon-btn" style={{ width: 30, height: 30 }} title="Sửa khoản chi" onClick={() => openEdit(e)}><EditIcon size={14} /></button>
                              <button type="button" className="icon-btn" style={{ width: 30, height: 30, color: 'var(--danger)' }} title="Xoá khoản chi" onClick={() => setDeleteExpenseId(e.id)}><TrashIcon size={14} /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <ExpenseAddDialog ctx={ctx} />
      <DeleteExpenseDialog ctx={ctx} />
    </div>
  );
}

function BubbleCluster({ bubbles, total }) {
  const maxV = bubbles[0].value;
  const minSize = 46, maxSize = 128;
  return (
    <div style={{ position: 'relative', height: 190, marginTop: 8 }}>
      {bubbles.slice(0, BUBBLE_POS.length).map((b, i) => {
        const size = Math.round(minSize + (b.value / maxV) * (maxSize - minSize));
        const pos = BUBBLE_POS[i];
        return (
          <div key={b.label} title={b.label} style={{
            position: 'absolute', left: `${pos.x * 100}%`, top: `${pos.y * 100}%`,
            transform: 'translate(-50%,-50%)', width: size, height: size, borderRadius: '50%',
            background: b.color, color: '#FFF9F0', display: 'grid', placeItems: 'center',
            fontSize: size > 80 ? 16 : size > 56 ? 12 : 10, fontWeight: 700, zIndex: bubbles.length - i,
            boxShadow: '0 6px 16px rgba(46,42,34,.14)'
          }}>
            {Math.round(b.value / total * 100)}%
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ segments, size = 168, thickness = 24 }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2},${size / 2}) rotate(-90)`}>
        <circle r={r} fill="none" stroke="var(--surface-sunken)" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const frac = s.value / total;
          const dash = frac * C;
          const el = <circle key={i} r={r} fill="none" stroke={s.color} strokeWidth={thickness} strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-acc} />;
          acc += dash;
          return el;
        })}
      </g>
    </svg>
  );
}

function CoinIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9 9.5c0-1.4 1.3-2.5 3-2.5s3 1 3 2.2c0 2.8-6 1.3-6 4.1 0 1.3 1.3 2.2 3 2.2s3-1 3-2.3" /></svg>; }
function PackageMiniIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v8a1 1 0 0 1-.5.87l-8 4.5a1 1 0 0 1-1 0l-8-4.5A1 1 0 0 1 3 16V8a1 1 0 0 1 .5-.87l8-4.5a1 1 0 0 1 1 0l8 4.5A1 1 0 0 1 21 8Z" /><path d="M3.3 7.3 12 12l8.7-4.7M12 22V12" /></svg>; }
function ReceiptIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" /><path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-4" /><path d="M17 12h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3a2 2 0 0 1 0-4z" /></svg>; }
function TrendIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>; }

function LeafMiniIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 1 5 1 6 0 8.7-8 12-9 12Z" /><path d="M2 21c0-3 1.9-5.4 5.1-6" /></svg>; }
function TeamIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>; }
function BuildingIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M6 21V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16" /><path d="M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1" /></svg>; }
function BoltIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6z" /></svg>; }
function MegaphoneIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M3 11v2a2 2 0 0 0 2 2h1l3 5h2l-1-5h4l6 4V6l-6 4H9L6 9H5a2 2 0 0 0-2 2Z" /></svg>; }
function DotsIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>; }

function ExpenseAddDialog({ ctx }) {
  const { expenseAddOpen, setExpenseAddOpen, expenseAddForm, setExpenseAddForm, expenseAddErrors, setExpenseAddErrors, setExpenseRecords, flash } = ctx;
  if (!expenseAddOpen) return null;
  const isEdit = !!expenseAddForm.id;

  function close() { setExpenseAddOpen(false); }
  function setField(key) { return e => { setExpenseAddForm({ ...expenseAddForm, [key]: e.target.value }); setExpenseAddErrors({ ...expenseAddErrors, [key]: null }); }; }
  async function submit() {
    const errs = {};
    if (!expenseAddForm.date.trim()) errs.date = 'Nhập ngày chi';
    if (!expenseAddForm.branch) errs.branch = 'Chọn chi nhánh';
    if (!expenseAddForm.category) errs.category = 'Chọn hạng mục';
    const amountNum = Number(expenseAddForm.amount);
    if (!expenseAddForm.amount || !Number.isFinite(amountNum) || amountNum <= 0) errs.amount = 'Nhập số tiền hợp lệ';
    if (Object.keys(errs).length) { setExpenseAddErrors(errs); return; }

    const payload = { date: expenseAddForm.date.trim(), branch: expenseAddForm.branch, category: expenseAddForm.category, amount: amountNum, note: expenseAddForm.note.trim() };

    if (isEdit) {
      setExpenseRecords(recs => recs.map(x => (x.id === expenseAddForm.id ? { ...x, ...payload } : x)));
      setExpenseAddOpen(false);
      flash('Đã cập nhật khoản chi.');
      if (supabaseEnabled) {
        try { await updateExpenseRow(expenseAddForm.id, payload); }
        catch (err) { console.error('[Supabase] Cập nhật khoản chi thất bại:', err); flash('Không lưu được lên máy chủ — thay đổi chỉ có trên trình duyệt này.'); }
      }
    } else {
      setExpenseAddOpen(false);
      const localRec = { id: Date.now(), ...payload };
      if (supabaseEnabled) {
        try {
          const created = await insertExpense(payload);
          setExpenseRecords(recs => [created, ...recs]);
          flash('Đã thêm khoản chi mới.');
        } catch (err) {
          console.error('[Supabase] Thêm khoản chi thất bại:', err);
          setExpenseRecords(recs => [localRec, ...recs]);
          flash('Không lưu được lên máy chủ — đã thêm tạm trên trình duyệt này.');
        }
      } else {
        setExpenseRecords(recs => [localRec, ...recs]);
        flash('Đã thêm khoản chi mới.');
      }
    }
  }

  const borderFor = k => (expenseAddErrors[k] ? 'var(--danger)' : 'var(--border-strong)');

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 60 }} onClick={close}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel panel-flush modal-pop" style={{ width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '24px 24px 0' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 600 }}>{isEdit ? 'Sửa khoản chi' : 'Thêm khoản chi'}</h3>
            <p style={{ marginTop: 6, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>{isEdit ? 'Cập nhật thông tin khoản chi.' : 'Ghi nhận một khoản chi phí vận hành.'}</p>
          </div>
          <button type="button" className="icon-btn" style={{ width: 32, height: 32 }} onClick={close}><XIcon /></button>
        </div>
        <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Ngày chi</label>
              <span className="field" style={{ borderColor: borderFor('date') }}><input placeholder="dd/MM/yyyy" value={expenseAddForm.date} onChange={setField('date')} /></span>
              {expenseAddErrors.date && <span className="err-msg">{expenseAddErrors.date}</span>}
            </label>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Số tiền (₫)</label>
              <span className="field" style={{ borderColor: borderFor('amount') }}><input inputMode="numeric" placeholder="5000000" value={expenseAddForm.amount} onChange={setField('amount')} /></span>
              {expenseAddErrors.amount && <span className="err-msg">{expenseAddErrors.amount}</span>}
            </label>
          </div>
          <label className="field-wrap">
            <label>Chi nhánh</label>
            <span className="field" style={{ borderColor: borderFor('branch') }}><select value={expenseAddForm.branch} onChange={setField('branch')}>
              <option value="">— Chọn chi nhánh —</option>
              {EXPENSE_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select></span>
            {expenseAddErrors.branch && <span className="err-msg">{expenseAddErrors.branch}</span>}
          </label>
          <label className="field-wrap">
            <label>Hạng mục</label>
            <span className="field" style={{ borderColor: borderFor('category') }}><select value={expenseAddForm.category} onChange={setField('category')}>
              <option value="">— Chọn hạng mục —</option>
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select></span>
            {expenseAddErrors.category && <span className="err-msg">{expenseAddErrors.category}</span>}
          </label>
          <label className="field-wrap">
            <label>Ghi chú</label>
            <textarea rows={2} placeholder="Ghi chú ngắn về khoản chi" value={expenseAddForm.note} onChange={setField('note')}
              style={{ width: '100%', resize: 'vertical', padding: '10px 12px', borderRadius: 'var(--radius-control)', border: '1px solid var(--border-strong)', fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-body-sm)', color: 'var(--text-body)', background: 'var(--surface-card)' }} />
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 24 }}>
          <button type="button" className="btn btn-secondary btn-md" onClick={close}>Huỷ</button>
          <button type="button" className="btn btn-primary btn-md" onClick={submit}>{isEdit ? 'Lưu thay đổi' : 'Thêm khoản chi'}</button>
        </div>
      </div>
    </div>
  );
}

function DeleteExpenseDialog({ ctx }) {
  const { expenseRecords, deleteExpenseId, setDeleteExpenseId, setExpenseRecords, flash } = ctx;
  const rec = expenseRecords.find(e => e.id === deleteExpenseId);
  if (!rec) return null;
  function cancel() { setDeleteExpenseId(null); }
  function confirm() {
    setExpenseRecords(recs => recs.filter(x => x.id !== deleteExpenseId));
    setDeleteExpenseId(null);
    flash('Đã xoá khoản chi.');
    if (supabaseEnabled) {
      deleteExpenseRow(rec.id).catch(err => {
        console.error('[Supabase] Xoá khoản chi thất bại:', err);
        flash('Không xoá được trên máy chủ — khoản chi có thể xuất hiện lại sau khi tải lại trang.');
      });
    }
  }
  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 62 }} onClick={cancel}>
      <div role="alertdialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel panel-flush modal-pop" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ padding: 24 }}>
          <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 600 }}>Xoá khoản chi này?</h3>
          <p style={{ marginTop: 8, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>{rec.category} · {fmtVnd(rec.amount)} · {rec.date}. Không thể hoàn tác.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0 24px 24px' }}>
          <button type="button" className="btn btn-secondary btn-md" onClick={cancel}>Huỷ</button>
          <button type="button" className="btn btn-danger btn-md" onClick={confirm}>Xoá khoản chi</button>
        </div>
      </div>
    </div>
  );
}
