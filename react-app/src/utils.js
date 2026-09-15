import { VIET_MAP, PHONE_PREFIXES } from './data.js';

export function buildChart(labels, series, prev) {
  const W = 720, H = 220, PL = 8, PR = 8, PT = 12, PB = 26;
  const n = series.length;
  const x = i => PL + (i * (W - PL - PR)) / (n - 1);
  const y = v => PT + (1 - v / 100) * (H - PT - PB);
  const line = a => a.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(v).toFixed(1)).join(' ');
  const area = line(series) + ' L' + x(n - 1).toFixed(1) + ',' + (H - PB).toFixed(1) + ' L' + x(0).toFixed(1) + ',' + (H - PB).toFixed(1) + ' Z';
  return {
    chartPath: line(series), chartPrevPath: prev ? line(prev) : null, chartArea: area,
    chartGrid: [0, 25, 50, 75, 100].map(g => ({ y: y(g).toFixed(1) })),
    chartPoints: series.map((v, i) => ({ cx: x(i).toFixed(1), cy: y(v).toFixed(1), r: i === n - 1 ? 5 : 3.5 })),
    chartLabels: labels.map((l, i) => ({ x: x(i).toFixed(1), label: l }))
  };
}

export function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export function slug(name) {
  return name.trim().toLowerCase().split('').map(ch => VIET_MAP[ch] || ch).join('').replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomGmailFor(name) {
  const base = name && name.trim() ? slug(name) : 'nhanvien';
  return base + randomInt(10, 999) + '@gmail.com';
}

export function randomPhone() {
  const prefix = PHONE_PREFIXES[randomInt(0, PHONE_PREFIXES.length - 1)];
  let rest = '';
  for (let i = 0; i < 7; i++) rest += randomInt(0, 9);
  return prefix + ' ' + rest.slice(0, 3) + ' ' + rest.slice(3, 7);
}

export function randomPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let out = '';
  for (let i = 0; i < 10; i++) out += chars[randomInt(0, chars.length - 1)];
  return out;
}

export function buildStaffCalendar(weekPattern, year, month, STAFF_SHIFT_CELL) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mondayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < mondayIndex; i++) cells.push({ day: '', bg: 'transparent', border: 'transparent', text: 'transparent', label: '' });
  const today = new Date(2026, 8, 3);
  for (let day = 1; day <= daysInMonth; day++) {
    if (new Date(year, month, day) > today) {
      cells.push({ day, bg: 'transparent', border: 'var(--border-soft)', text: 'var(--text-subtle)', label: '' });
      continue;
    }
    const wd = (mondayIndex + day - 1) % 7;
    const [bg, border, text, label] = STAFF_SHIFT_CELL[weekPattern[wd]] || STAFF_SHIFT_CELL.off;
    cells.push({ day, bg, border, text, label });
  }
  return cells;
}

export function fmtVnd(n) {
  return n.toLocaleString('vi-VN') + '₫';
}

// Bo cong đường biểu đồ bằng cubic bezier (điểm điều khiển ở giữa hai mốc) thay vì nối thẳng góc cạnh.
export function smoothPathFromPoints(points) {
  if (!points.length) return '';
  let d = `M ${points[0].cx} ${points[0].cy}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i], p1 = points[i + 1];
    const midX = (Number(p0.cx) + Number(p1.cx)) / 2;
    d += ` C ${midX} ${p0.cy}, ${midX} ${p1.cy}, ${p1.cx} ${p1.cy}`;
  }
  return d;
}

// Mốc bắt đầu của khoảng thời gian KPI ("7 ngày qua" hoặc "Tháng này").
export function periodStartDate(period) {
  const d = new Date();
  if (period === 'week') { d.setDate(d.getDate() - 7); return d; }
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Mốc bắt đầu của kỳ TRƯỚC kỳ hiện tại (cùng độ dài) — dùng để so sánh tăng/giảm.
export function previousPeriodStart(period, start) {
  const d = new Date(start);
  if (period === 'week') d.setDate(d.getDate() - 7);
  else d.setMonth(d.getMonth() - 1);
  return d;
}

// Chuyển "dd/MM/yyyy" (định dạng ngày dùng trong bảng expenses) sang Date thật để so sánh khoảng thời gian.
export function parseVnDate(s) {
  const [d, m, y] = (s || '').split('/').map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
}
