import { useState } from 'react';
import { STAFF_WEEK_PATTERN, STAFF_SHIFT_CELL } from './data.js';
import { buildStaffCalendar, estimateMonthlyPay, fmtVnd, mondayOfWeek, weekDaysFor } from './utils.js';
import { ChevronLeft, ChevronRight } from './icons.jsx';
import { supabaseEnabled, updateProfileRow } from './lib/profilesApi.js';

const SHIFT_OPTIONS = [['am', 'Ca sáng'], ['pm', 'Ca chiều'], ['off', 'Nghỉ']];

export default function StaffView({ ctx }) {
  const { userName, userRoleLabel, userBranch, staffCode, openSecurity, logout } = ctx;

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Lịch làm việc của tôi</h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{userName} · {userRoleLabel} · {userBranch || 'Chưa gán chi nhánh'}</div>
        </div>
      </div>
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>
        <ShiftAndPaySection ctx={ctx} />
        <section className="panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Nơi làm việc</h3>
          <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text-muted)' }}>Chi nhánh phụ trách</div>
          <div style={{ marginTop: 4, fontSize: 17, fontWeight: 600 }}>{userBranch || '— chưa được gán chi nhánh, liên hệ quản lý —'}</div>
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-subtle)' }}>Bạn có thể tự sửa ca làm của mình theo tuần ở trên.</p>
        </section>
        <section className="panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Tài khoản</h3>
          <div style={{ marginTop: 12, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>Mã nhân viên: <strong style={{ color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums' }}>{staffCode || '—'}</strong></div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="button" className="btn btn-secondary btn-md" onClick={openSecurity}>Đổi mật khẩu</button>
            <button type="button" className="btn btn-secondary btn-md" onClick={logout}>Đăng xuất</button>
          </div>
        </section>
      </div>
    </div>
  );
}

// "Ca làm tuần này" (sửa ca theo tuần) + "Lịch đi làm & lương" (lịch tháng + lương ước
// tính) — dùng chung cho cả ba vai trò tự xem lịch của mình: Nhân viên/Bếp (StaffView, ở
// trên) và Thu ngân (CashierView.jsx). Tách riêng ở đây để không viết trùng lặp UI/logic
// giữa hai màn — sửa một chỗ, cả hai vai trò cùng cập nhật.
export function ShiftAndPaySection({ ctx }) {
  const {
    loggedId, userWeek, setUserWeek, loggedSalary, flash,
    staffCalYear, setStaffCalYear, staffCalMonth, setStaffCalMonth
  } = ctx;
  const weekPattern = userWeek || STAFF_WEEK_PATTERN;

  // Tuần đang xem ở "Ca làm tuần này" — mặc định tuần thật hiện tại, nhưng lật được sang
  // tuần trước/sau (kể cả qua tháng khác) bằng prevWeek/nextWeek bên dưới, giống cách "Lịch
  // đi làm" lật qua tháng. Ca làm chỉ lưu MỘT mẫu lặp lại theo thứ trong tuần (không lưu
  // riêng từng tuần/ngày cụ thể), nên lật sang tuần khác vẫn hiện đúng mẫu đó — chỉ đổi ngày
  // tháng hiển thị — và vì vậy chỉ cho sửa khi đang đứng ở tuần hiện tại (sửa "tuần sau" hay
  // "tuần trước" cũng sẽ đổi chung một mẫu, dễ gây hiểu nhầm là sửa riêng cho tuần đó).
  const [weekMonday, setWeekMonday] = useState(() => mondayOfWeek());
  const thisMonday = mondayOfWeek();
  const isCurrentWeek = weekMonday.getTime() === thisMonday.getTime();
  const weekDays = weekDaysFor(weekMonday);
  const staffWeek = weekDays.map(([day, date], i) => {
    const [bg, border, text, label] = STAFF_SHIFT_CELL[weekPattern[i]] || STAFF_SHIFT_CELL.off;
    return { day, date, bg, border, text, label };
  });
  function shiftWeek(deltaDays) {
    setWeekMonday(d => { const n = new Date(d); n.setDate(n.getDate() + deltaDays); return n; });
  }
  function prevWeek() { shiftWeek(-7); }
  function nextWeek() { shiftWeek(7); }
  function goCurrentWeek() { setWeekMonday(thisMonday); }
  const weekRangeLabel = `${weekDays[0][1]} - ${weekDays[6][1]}`;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(weekPattern);
  const [saving, setSaving] = useState(false);

  const calCells = buildStaffCalendar(weekPattern, staffCalYear, staffCalMonth, STAFF_SHIFT_CELL);
  const pay = estimateMonthlyPay(weekPattern, loggedSalary, calCells, staffCalYear, staffCalMonth, STAFF_WEEK_PATTERN);
  function prevMonth() {
    if (staffCalMonth === 0) { setStaffCalYear(y => y - 1); setStaffCalMonth(11); } else setStaffCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (staffCalMonth === 11) { setStaffCalYear(y => y + 1); setStaffCalMonth(0); } else setStaffCalMonth(m => m + 1);
  }

  function startEdit() { setDraft(weekPattern); setEditing(true); }
  function cancelEdit() { setEditing(false); }
  function setDay(i, val) { setDraft(d => d.map((v, idx) => (idx === i ? val : v))); }

  async function saveShift() {
    setUserWeek(draft);
    setEditing(false);
    flash('Đã cập nhật ca làm.');
    if (supabaseEnabled && loggedId) {
      setSaving(true);
      try { await updateProfileRow(loggedId, { week: draft }); }
      catch (err) {
        console.error('[Supabase] Cập nhật ca làm thất bại:', err);
        flash('Không lưu được lên máy chủ — thay đổi chỉ có trên trình duyệt này.');
      } finally { setSaving(false); }
    }
  }

  return (
    <>
      <section className="panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>{isCurrentWeek ? 'Ca làm tuần này' : 'Ca làm tuần khác'}</h3>
            <div style={{ marginTop: 2, fontSize: 12, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{weekRangeLabel}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button type="button" className="icon-btn" style={{ width: 28, height: 28 }} onClick={prevWeek} title="Tuần trước"><ChevronLeft /></button>
            {!isCurrentWeek && <button type="button" className="btn btn-secondary btn-md" onClick={goCurrentWeek}>Tuần này</button>}
            <button type="button" className="icon-btn" style={{ width: 28, height: 28 }} onClick={nextWeek} title="Tuần sau"><ChevronRight /></button>
            {isCurrentWeek && (editing ? (
              <span style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-secondary btn-md" onClick={cancelEdit}>Huỷ</button>
                <button type="button" className="btn btn-primary btn-md" onClick={saveShift} disabled={saving}>{saving ? 'Đang lưu…' : 'Lưu ca làm'}</button>
              </span>
            ) : (
              <button type="button" className="btn btn-secondary btn-md" onClick={startEdit}>Sửa ca làm</button>
            ))}
          </div>
        </div>
        {!isCurrentWeek && (
          <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-subtle)' }}>Ca làm lặp lại theo mẫu tuần cố định, nên tuần này hiện đúng mẫu như tuần hiện tại. Về "Tuần này" để sửa mẫu ca làm.</p>
        )}
        {editing ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8, marginTop: 20 }}>
            {weekDays.map(([day, date], i) => (
              <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '10px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>{day}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{date}</span>
                <select value={draft[i]} onChange={e => setDay(i, e.target.value)} style={{ marginTop: 4, fontSize: 12, padding: '4px 2px', borderRadius: 6, border: '1px solid var(--border-strong)' }}>
                  {SHIFT_OPTIONS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                </select>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8, marginTop: 20 }}>
            {staffWeek.map((d, i) => (
              <div key={i} style={{ border: `1px solid ${d.border}`, background: d.bg, borderRadius: 8, padding: '12px 8px', textAlign: 'center', minHeight: 96, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>{d.day}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{d.date}</span>
                <span style={{ marginTop: 'auto', fontSize: 13, fontWeight: 600, color: d.text }}>{d.label}</span>
              </div>
            ))}
          </div>
        )}
        <Legend />
      </section>
      <section className="panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Lịch đi làm &amp; lương</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button type="button" className="icon-btn" style={{ width: 28, height: 28 }} onClick={prevMonth}><ChevronLeft /></button>
            <span style={{ fontSize: 13, fontWeight: 600, minWidth: 96, textAlign: 'center' }}>Tháng {staffCalMonth + 1}/{staffCalYear}</span>
            <button type="button" className="icon-btn" style={{ width: 28, height: 28 }} onClick={nextMonth}><ChevronRight /></button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginTop: 20 }}>
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
            <span key={d} style={{ textAlign: 'center', fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-subtle)', paddingBottom: 4 }}>{d}</span>
          ))}
          {calCells.map((d, i) => (
            <div key={i} style={{ border: `1px solid ${d.border}`, background: d.bg, borderRadius: 6, padding: '6px 4px', textAlign: 'center', minHeight: 44, display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 600 }}>{d.day}</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: d.text }}>{d.label}</span>
            </div>
          ))}
        </div>
        <Legend />
        <div style={{ marginTop: 16, padding: 16, background: 'var(--surface-page)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-control)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 'var(--fs-caption)', color: 'var(--text-subtle)' }}>Lương ước tính tháng {staffCalMonth + 1}/{staffCalYear}</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(pay.estimatedPay)}</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
            {pay.workedShifts} / {pay.standardShifts} ca đã làm tính đến hôm nay<br />
            {fmtVnd(pay.ratePerShift)} / ca (theo lương {fmtVnd(loggedSalary || 0)}/tháng)
          </div>
        </div>
      </section>
    </>
  );
}

export function Legend() {
  return (
    <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#E7ECE5', border: '1px solid #B7C2B4' }} />Ca sáng</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#F7E9CC', border: '1px solid #C98A2C' }} />Ca chiều</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#F0EBE3', border: '1px solid #D2C4B4' }} />Nghỉ</span>
    </div>
  );
}
