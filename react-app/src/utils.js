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

// Bỏ dấu tiếng Việt, viết hoa — dùng cho nội dung chuyển khoản VietQR (addInfo), vì một số
// app ngân hàng hiển thị sai/lược bỏ ký tự có dấu.
export function toPlainAscii(str) {
  return str.trim().toLowerCase().split('').map(ch => VIET_MAP[ch] || ch).join('').toUpperCase();
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
  // Ngày thật hiện tại — KHÔNG hardcode một mốc cố định ở đây nữa. Trước đây để cố định
  // "hôm nay" = 03/09/2026 (dữ liệu mẫu ban đầu), nên mỗi tháng thật trôi qua, các ngày sau
  // mốc đó bị tính nhầm là "chưa tới" (ô trống) mãi mãi — lịch (và lương ước tính suy ra từ
  // lịch, xem estimateMonthlyPay) không tự cập nhật theo tháng thật nữa.
  const today = new Date();
  today.setHours(23, 59, 59, 999); // tính trọn ngày hôm nay là "đã qua", không bị lệch múi giờ/giờ trong ngày
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

// Thứ Hai của tuần chứa `refDate` (mặc định hôm nay) — mốc dùng để lật qua tuần
// trước/sau (xem weekDaysFor, mondayOfWeek(refDate, +-7*n) khi cần đổi tuần).
export function mondayOfWeek(refDate = new Date()) {
  const mondayOffset = (refDate.getDay() + 6) % 7; // Chủ nhật (getDay()=0) -> lùi 6 ngày về T2
  return new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate() - mondayOffset);
}

// Ngày thật (T2 -> CN) của tuần chứa `monday` — thay cho mảng ngày viết cứng trước đây
// (STAFF_WEEK_DAYS trong data.js, ví dụ luôn cố định "31/08"..."06/09"). Nhờ tính từ ngày
// thật mỗi lần gọi (và nhận `monday` bất kỳ, không chỉ tuần hiện tại), "Ca làm tuần này" ở
// màn Nhân viên/Thu ngân/Bếp vừa tự đúng tuần thật, vừa lật được sang tuần khác/tháng khác.
export function weekDaysFor(monday) {
  const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  return labels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return [label, `${dd}/${mm}`];
  });
}

// Lương ước tính = đơn giá/ca × số ca ĐÃ LÀM (tính đến hôm nay) trong tháng đang xem trên
// lịch (đối số `cells` là kết quả của buildStaffCalendar ở trên). Đơn giá/ca suy ra từ
// "Lương/tháng" (field có sẵn, không cần thêm cột DB mới) chia cho tổng số ca CHUẨN của
// tháng đó nếu đi làm đủ theo ca tuần đang đăng ký (week pattern × số tuần trong tháng) —
// nên khi nhân viên nghỉ nhiều hơn/ít hơn bình thường, số tiền ước tính tự thấp/cao hơn
// lương chuẩn, không phải một con số cố định vô nghĩa với lịch bên cạnh. Dùng chung cho cả
// màn Quản lý xem hồ sơ nhân viên (StaffList.jsx) lẫn màn nhân viên tự xem lịch của mình
// (StaffView.jsx). Chỉ là số tạm tính để tham khảo, không phải bảng lương chính thức.
export function estimateMonthlyPay(weekPattern, salary, cells, year, month, defaultWeekPattern) {
  const pattern = weekPattern && weekPattern.length === 7 ? weekPattern : defaultWeekPattern;
  const shiftsPerWeek = pattern.filter(t => t !== 'off').length;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const standardShifts = Math.round((shiftsPerWeek * daysInMonth) / 7) || 0;
  const workedShifts = cells.filter(c => c.label === 'Ca sáng' || c.label === 'Ca chiều').length;
  const ratePerShift = standardShifts > 0 ? Math.round((salary || 0) / standardShifts) : 0;
  const estimatedPay = Math.round((ratePerShift * workedShifts) / 1000) * 1000;
  return { standardShifts, workedShifts, ratePerShift, estimatedPay };
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
