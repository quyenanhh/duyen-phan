import { STAFF_WEEK_DAYS, STAFF_WEEK_PATTERN, STAFF_SHIFT_CELL } from './data.js';

export default function StaffView({ ctx }) {
  const { userName, userRoleLabel, userBranch, userWeek, staffCode, openSecurity, logout } = ctx;
  const weekPattern = userWeek || STAFF_WEEK_PATTERN;
  const staffWeek = STAFF_WEEK_DAYS.map(([day, date], i) => {
    const [bg, border, text, label] = STAFF_SHIFT_CELL[weekPattern[i]] || STAFF_SHIFT_CELL.off;
    return { day, date, bg, border, text, label };
  });

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Lịch làm việc của tôi</h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{userName} · {userRoleLabel} · {userBranch || 'Chưa gán chi nhánh'}</div>
        </div>
      </div>
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>
        <section className="panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Ca làm tuần này</h3>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>31/08 – 06/09/2026</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8, marginTop: 20 }}>
            {staffWeek.map((d, i) => (
              <div key={i} style={{ border: `1px solid ${d.border}`, background: d.bg, borderRadius: 8, padding: '12px 8px', textAlign: 'center', minHeight: 96, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>{d.day}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{d.date}</span>
                <span style={{ marginTop: 'auto', fontSize: 13, fontWeight: 600, color: d.text }}>{d.label}</span>
              </div>
            ))}
          </div>
          <Legend />
        </section>
        <section className="panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Nơi làm việc</h3>
          <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text-muted)' }}>Chi nhánh phụ trách</div>
          <div style={{ marginTop: 4, fontSize: 17, fontWeight: 600 }}>{userBranch || '— chưa được gán chi nhánh, liên hệ quản lý —'}</div>
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-subtle)' }}>Bạn chỉ xem được lịch và ca làm của chính mình. Liên hệ quản lý chi nhánh nếu cần đổi ca.</p>
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

export function Legend() {
  return (
    <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#E7ECE5', border: '1px solid #B7C2B4' }} />Ca sáng</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#F7E9CC', border: '1px solid #C98A2C' }} />Ca chiều</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#F0EBE3', border: '1px solid #D2C4B4' }} />Nghỉ</span>
    </div>
  );
}
