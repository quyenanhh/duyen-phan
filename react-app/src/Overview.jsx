import { useEffect, useState } from 'react';
import { RANGES } from './data.js';
import { fmtVnd } from './utils.js';
import { pickDishArt } from './dishArt.jsx';
import { supabaseEnabled, listPaidTableOrdersSince, listTableOrdersSince } from './lib/tableOrdersApi.js';
import SummaryCard from './SummaryCard.jsx';

const STATUS_META = {
  open: { label: 'Đang chọn món', bg: '#EAEAE5', fg: '#5C6B60' },
  sent: { label: 'Đang chuẩn bị', bg: '#F7E9CC', fg: '#8C5E14' },
  served: { label: 'Đã phục vụ', bg: '#E7ECE5', fg: '#2E3B35' },
  paid: { label: 'Đã thanh toán', bg: '#E4E9E4', fg: '#2F3E34' },
  cancelled: { label: 'Đã huỷ', bg: '#F6DED7', fg: '#8E3421' }
};

function rangeStartDate(range) {
  const d = new Date();
  if (range === 'today') { d.setHours(0, 0, 0, 0); return d; }
  if (range === 'week') { d.setDate(d.getDate() - 7); return d; }
  if (range === 'year') { d.setMonth(0, 1); d.setHours(0, 0, 0, 0); return d; }
  d.setDate(1); d.setHours(0, 0, 0, 0); return d; // month (mặc định)
}

function csvEscape(v) {
  return `"${String(v ?? '').replace(/"/g, '""')}"`;
}

export default function Overview({ ctx }) {
  const { range, setRange, branchRecords, tableRecords, menuRecords, flash } = ctx;

  const [branchFilter, setBranchFilter] = useState('');
  const [allOrders, setAllOrders] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);
  const [chartOrders, setChartOrders] = useState([]); // luôn 7 ngày gần nhất, không phụ thuộc bộ lọc range
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  function load() {
    if (!supabaseEnabled) return;
    setLoading(true);
    setErr(false);
    const start = rangeStartDate(range);
    Promise.all([listTableOrdersSince(start.toISOString()), listPaidTableOrdersSince(start.toISOString())])
      .then(([all, paid]) => { setAllOrders(all); setPaidOrders(paid); })
      .catch(e => { console.error('[Supabase] Không tải được dữ liệu tổng quan:', e); setErr(true); })
      .finally(() => setLoading(false));
  }
  useEffect(load, [range]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!supabaseEnabled) return;
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - 6);
    listPaidTableOrdersSince(d.toISOString()).then(setChartOrders).catch(() => {});
  }, []);

  const branchAll = branchFilter ? allOrders.filter(o => o.branch === branchFilter) : allOrders;
  const branchPaid = branchFilter ? paidOrders.filter(o => o.branch === branchFilter) : paidOrders;
  const branchChart = branchFilter ? chartOrders.filter(o => o.branch === branchFilter) : chartOrders;
  const branchTables = branchFilter ? tableRecords.filter(t => t.branch === branchFilter) : tableRecords;

  const revenue = branchPaid.reduce((sum, o) => sum + (o.total - o.discount), 0);
  const pendingCount = branchAll.filter(o => o.status === 'open').length;
  const progressCount = branchAll.filter(o => o.status === 'sent' || o.status === 'served').length;
  const cancelledCount = branchAll.filter(o => o.status === 'cancelled').length;
  const paidCount = branchAll.filter(o => o.status === 'paid').length;
  const totalCount = branchAll.length;
  const availableTables = branchTables.filter(t => t.status === 'trong').length;
  const totalTables = branchTables.length;

  // Doanh thu 7 ngày gần nhất — luôn cố định 7 ngày để vẽ biểu đồ cột, tách biệt khỏi bộ lọc range ở trên.
  const last7 = Array.from({ length: 7 }).map((_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - i)); return d; });
  const dayRevenue = last7.map(d => {
    const next = new Date(d); next.setDate(next.getDate() + 1);
    return branchChart.filter(o => { const t = new Date(o.paidAt); return t >= d && t < next; }).reduce((sum, o) => sum + (o.total - o.discount), 0);
  });
  const maxDay = Math.max(1, ...dayRevenue);
  const peakIdx = dayRevenue.indexOf(Math.max(...dayRevenue));

  // Món bán chạy (số lượng + doanh thu) trong khoảng range đang chọn.
  const itemStats = {};
  branchPaid.forEach(o => (o.items || []).forEach(([name, qty, price]) => {
    if (!itemStats[name]) itemStats[name] = { qty: 0, revenue: 0 };
    itemStats[name].qty += qty;
    itemStats[name].revenue += qty * (price || 0);
  }));
  const popularMenu = Object.entries(itemStats).sort((a, b) => b[1].qty - a[1].qty).slice(0, 4)
    .map(([name, s]) => ({ name, ...s, menuItem: menuRecords.find(m => m.name === name) }));

  // Hoạt động gần đây — trải phẳng từng món trong các order mới nhất (đã sắp mới nhất trước).
  const recentActivities = [];
  for (const o of branchAll) {
    for (const [name, qty, price] of (o.items || [])) {
      recentActivities.push({ key: `${o.id}-${recentActivities.length}`, name, price, table: o.tableName, branch: o.branch, qty, status: o.status });
      if (recentActivities.length >= 8) break;
    }
    if (recentActivities.length >= 8) break;
  }

  function exportCsv() {
    const header = ['Bàn', 'Chi nhánh', 'Trạng thái', 'Tổng tiền', 'Thời gian tạo'];
    const rows = branchAll.map(o => [
      o.tableName, o.branch, (STATUS_META[o.status] || {}).label || o.status, o.total,
      o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : ''
    ]);
    const csv = [header, ...rows].map(r => r.map(csvEscape).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `don-hang-${range}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    flash('Đã xuất file CSV.');
  }

  const ringSegs = [
    { value: paidCount, color: '#2E3B35' },
    { value: progressCount, color: '#C98A2C' },
    { value: pendingCount, color: '#B7C2B4' },
    { value: cancelledCount, color: '#B4453A' }
  ];
  const ringTotal = Math.max(1, ringSegs.reduce((s, x) => s + x.value, 0));
  const CIRC = 2 * Math.PI * 52;
  let ringOffset = 0;

  const avgTicket = paidCount > 0 ? Math.round(revenue / paidCount) : 0;
  const completionRate = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;
  const tableOccupancy = totalTables > 0 ? Math.round(((totalTables - availableTables) / totalTables) * 100) : 0;

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Chào mừng trở lại</h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tổng quan toàn chuỗi, cập nhật theo thời gian thực</div>
        </div>
        <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--surface-page)', border: '1px solid var(--border)', borderRadius: 999 }}>
          {RANGES.map(r => (
            <button key={r.id} type="button" className={`tabp ${range === r.id ? 'active' : ''}`} onClick={() => setRange(r.id)}>{r.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <label className="field-wrap" style={{ width: 240 }}>
            <span className="field"><select value={branchFilter} onChange={e => setBranchFilter(e.target.value)}>
              <option value="">Toàn hệ thống</option>
              {branchRecords.map(b => <option key={b.id || b.name} value={b.name}>{b.name}</option>)}
            </select></span>
          </label>
          <div style={{ flex: 1 }} />
          <button type="button" className="btn btn-secondary btn-md" onClick={exportCsv} disabled={!branchAll.length}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M4 21h16" /></svg>
            Xuất CSV
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          <SummaryCard icon={<InboxSmallIcon />} tone="gray" label="Đơn chờ xử lý" value={pendingCount} hint="Chưa gửi bếp" />
          <SummaryCard icon={<FlameIcon />} tone="amber" label="Đơn đang phục vụ" value={progressCount} hint="Đang chuẩn bị / đã phục vụ" />
          <SummaryCard icon={<ListIcon />} tone="blue" label="Tổng số đơn" value={totalCount} hint={RANGES.find(r => r.id === range)?.label} />
          <SummaryCard icon={<TableSmallIcon />} tone="green" label="Bàn còn trống" value={`${availableTables}/${totalTables}`} hint="Hiện tại" />
        </div>

        {!supabaseEnabled ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-card)', color: 'var(--text-muted)' }}>Chưa kết nối Supabase — không có dữ liệu thật để hiển thị tổng quan.</div>
        ) : err ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', border: '1px dashed var(--danger)', borderRadius: 'var(--radius-card)', color: 'var(--danger-text)' }}>Không tải được dữ liệu — thử tải lại trang.</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start', minWidth: 0 }}>
              <section className="panel" style={{ padding: 24, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Doanh thu</h3>
                    <p style={{ marginTop: 4, fontSize: 26, fontWeight: 700, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(revenue)}</p>
                    <p style={{ marginTop: 2, fontSize: 13, color: 'var(--text-muted)' }}>{RANGES.find(r => r.id === range)?.label}{branchFilter ? ' · ' + branchFilter : ' · toàn hệ thống'}</p>
                  </div>
                </div>
                <div style={{ marginTop: 24, position: 'relative', height: 220 }}>
                  {loading ? (
                    <div style={{ height: '100%', borderRadius: 'var(--radius-control)', background: 'var(--surface-sunken)', opacity: .5 }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 180, position: 'relative' }}>
                      {dayRevenue.map((v, i) => {
                        const h = Math.max(6, (v / maxDay) * 160);
                        const isPeak = i === peakIdx && v > 0;
                        return (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                            {isPeak && (
                              <div style={{ position: 'absolute', bottom: h + 14, background: 'var(--surface-inverse)', color: 'var(--text-on-brand)', borderRadius: 10, padding: '8px 12px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', boxShadow: 'var(--shadow-modal)' }}>
                                {last7[i].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} · {fmtVnd(v)}
                              </div>
                            )}
                            <div style={{ width: '100%', maxWidth: 44, height: h, borderRadius: 10, background: isPeak ? 'var(--accent)' : 'var(--surface-brand-soft)', transition: 'height var(--dur-base) var(--ease-out)' }} />
                            <span style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>{last7[i].toLocaleDateString('vi-VN', { weekday: 'short' })}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>

              <section className="panel" style={{ padding: 24, minWidth: 0 }}>
                <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Món bán chạy</h3>
                <p style={{ marginTop: 4, fontSize: 14, color: 'var(--text-muted)' }}>{RANGES.find(r => r.id === range)?.label}</p>
                {popularMenu.length === 0 ? (
                  <div style={{ marginTop: 20, padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Chưa có dữ liệu bán hàng trong khoảng này.</div>
                ) : (
                  <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {popularMenu.map(it => {
                      const Art = pickDishArt(it.menuItem || { name: it.name });
                      return (
                        <div key={it.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div className="photo-card" style={{ width: 40, height: 40, flex: '0 0 auto', padding: 6 }}><Art /></div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{it.qty} lượt bán</div>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(it.revenue)}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'stretch', minWidth: 0 }}>
              <section className="panel panel-flush" style={{ minWidth: 0, overflowX: 'auto' }}>
                <div style={{ padding: '20px 24px' }}>
                  <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Hoạt động gần đây</h3>
                  <p style={{ marginTop: 4, fontSize: 14, color: 'var(--text-muted)' }}>Món mới nhất từ tất cả order</p>
                </div>
                {recentActivities.length === 0 ? (
                  <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có hoạt động nào trong khoảng này.</div>
                ) : (
                  <table style={{ width: '100%', fontSize: 'var(--fs-body-sm)' }}>
                    <thead><tr><th>Món</th><th>Chi nhánh</th><th>Bàn</th><th style={{ textAlign: 'right' }}>Đơn giá</th><th style={{ textAlign: 'right' }}>SL</th><th style={{ textAlign: 'right' }}>Trạng thái</th></tr></thead>
                    <tbody>
                      {recentActivities.map(a => {
                        const meta = STATUS_META[a.status] || STATUS_META.open;
                        return (
                          <tr className="row" key={a.key}>
                            <td style={{ fontWeight: 600 }}>{a.name}</td>
                            <td style={{ color: 'var(--text-muted)' }}>{a.branch}</td>
                            <td>{a.table}</td>
                            <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(a.price || 0)}</td>
                            <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{a.qty}</td>
                            <td style={{ textAlign: 'right' }}><span className="badge" style={{ background: meta.bg, color: meta.fg }}><span className="dot" />{meta.label}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </section>

              <section className="panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', minWidth: 0 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, alignSelf: 'flex-start' }}>Tổng quan đơn</h3>
                <div style={{ position: 'relative', width: 160, height: 160, marginTop: 12 }}>
                  <svg viewBox="0 0 120 120" width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="60" cy="60" r="52" fill="none" stroke="var(--surface-sunken)" strokeWidth="12" />
                    {ringSegs.filter(s => s.value > 0).map((s, i) => {
                      const frac = s.value / ringTotal;
                      const len = frac * CIRC;
                      const el = <circle key={i} cx="60" cy="60" r="52" fill="none" stroke={s.color} strokeWidth="12" strokeDasharray={`${len} ${CIRC - len}`} strokeDashoffset={-ringOffset} strokeLinecap="butt" />;
                      ringOffset += len;
                      return el;
                    })}
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Doanh thu</span>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{fmtVnd(revenue)}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2 }}>{totalCount} đơn</span>
                  </div>
                </div>
                <div style={{ marginTop: 18, width: '100%', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
                  <RingLegend color="#2E3B35" label="Đã thanh toán" value={paidCount} />
                  <RingLegend color="#C98A2C" label="Đang xử lý" value={progressCount} />
                  <RingLegend color="#B7C2B4" label="Chờ xử lý" value={pendingCount} />
                  <RingLegend color="#B4453A" label="Đã huỷ" value={cancelledCount} />
                </div>

                <div style={{ width: '100%', marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--border-soft)', display: 'flex', flexDirection: 'column', gap: 14, flex: 1, justifyContent: 'center' }}>
                  <MiniStatRow label="Giá trị đơn trung bình" value={fmtVnd(avgTicket)} />
                  <MiniStatRow label="Tỉ lệ hoàn tất" value={`${completionRate}%`} />
                  <MiniStatRow label="Tỉ lệ bàn đang dùng" value={`${tableOccupancy}%`} />
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RingLegend({ color, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flex: '0 0 auto' }} />
      <span style={{ flex: 1, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function MiniStatRow({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', width: '100%' }}>
      <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

function InboxSmallIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" /></svg>;
}
function FlameIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2s-6 6.5-6 11a6 6 0 0 0 12 0c0-2-1-3-1-3s-.5 2-2 2c1-3-1-5-1-6.5C14 8 12 2 12 2Z" /></svg>;
}
function ListIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 2h16v20l-3-2-3 2-3-2-3 2-4-2z" /><path d="M8 7h8" /><path d="M8 11h8" /><path d="M8 15h5" /></svg>;
}
function TableSmallIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="9" width="18" height="4" rx="1" /><path d="M6 13v7M18 13v7" /></svg>;
}
