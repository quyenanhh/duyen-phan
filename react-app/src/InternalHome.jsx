import { LeafIcon } from './icons.jsx';

const LEAF_D = 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 1 5 1 6 0 8.7-8 12-9 12Z';

// Trang chủ tối giản riêng cho web nội bộ (dev:internal, cổng 5174). Hai trường hợp ghé trang
// này: (1) CHƯA đăng nhập — mở web lên thấy trang này trước, bấm "Đăng nhập" mới vào form
// thật; (2) ĐÃ đăng nhập nhưng chủ động bấm logo "Duyên Phần" ở sidebar Dashboard (xem
// Dashboard.jsx#goLanding trong App.jsx) — trước đây rơi vào cùng một màn "chưa đăng nhập" y
// hệt trường hợp (1), trông như vừa bị đăng xuất dù tài khoản vẫn còn phiên. Tách rõ hai giao
// diện theo isLoggedIn để trường hợp (2) thấy đúng "đã vào rồi", có lối quay lại hệ thống thay
// vì bị hỏi đăng nhập lần nữa. Không có menu/chi nhánh/giới thiệu công khai nào ở đây (những
// cái đó chỉ có ở web khách hàng) vì đây không phải một trang marketing.
export default function InternalHome({ ctx }) {
  const { goAuth, isLoggedIn, userName, userRoleLabel, logout } = ctx;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: 'var(--surface-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', background: 'var(--green-100)', filter: 'blur(100px)', opacity: .85, top: -160, left: -160 }} />
        <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', background: 'var(--clay-50)', filter: 'blur(110px)', opacity: .8, bottom: -180, right: -160 }} />
      </div>

      <div className="panel modal-pop" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480, padding: '48px 40px', textAlign: 'center' }}>
        <span style={{ width: 56, height: 56, margin: '0 auto', borderRadius: 16, background: 'var(--surface-brand-soft)', color: 'var(--brand)', display: 'grid', placeItems: 'center' }}>
          <LeafIcon size={28} />
        </span>
        <h1 style={{ marginTop: 20, fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text-brand)' }}>
          Duyên Phần
        </h1>

        {isLoggedIn ? (
          <>
            <p style={{ marginTop: 6, fontSize: 14, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-accent)' }}>
              {userRoleLabel}
            </p>
            <p style={{ marginTop: 16, fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-muted)' }}>
              Xin chào, {userName}. Bạn đang đăng nhập trên hệ thống quản trị nội bộ Duyên Phần.
            </p>
            <a onClick={goAuth} className="btn btn-primary btn-lg" style={{ marginTop: 28, cursor: 'pointer' }}>
              Vào hệ thống quản trị
            </a>
            <div style={{ marginTop: 14 }}>
              <a onClick={logout} className="foot-link" style={{ cursor: 'pointer', fontSize: 13 }}>Đăng xuất</a>
            </div>
          </>
        ) : (
          <>
            <p style={{ marginTop: 6, fontSize: 14, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-accent)' }}>
              Hệ thống quản trị nội bộ
            </p>
            <p style={{ marginTop: 16, fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-muted)' }}>
              Dành riêng cho Quản lý, Nhân viên, Thu ngân và Bếp của chuỗi Duyên Phần. Đăng nhập bằng
              tài khoản do Quản lý cấp để vào hệ thống.
            </p>
            <a onClick={goAuth} className="btn btn-primary btn-lg" style={{ marginTop: 28, cursor: 'pointer' }}>
              Đăng nhập
            </a>
          </>
        )}
      </div>
    </div>
  );
}
