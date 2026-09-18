import { LeafIcon } from './icons.jsx';

export default function SiteFooter({ ctx }) {
  const { goAuth, isLoggedIn, appMode, internalOrigin } = ctx;
  // Trên web khách hàng (dev:customer), khu vực nội bộ không tồn tại trong app này nữa — link
  // "Đăng nhập quản trị" phải trỏ hẳn sang web nội bộ (dev:internal, cổng khác), không gọi
  // goAuth() nội bộ nữa (nếu không sẽ chỉ bị app tự đá về trang chủ, xem effect chặn theo cổng
  // trong App.jsx).
  const isCrossPort = appMode === 'customer';
  return (
    <footer style={{ background: 'var(--surface-card)', borderTop: '1px solid var(--border)', padding: '72px 0 32px' }}>
      <div className="wrap foot-grid">
        <div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 28, height: 28, flex: '0 0 auto', borderRadius: 8, background: 'var(--surface-brand-soft)', color: 'var(--brand)', display: 'grid', placeItems: 'center' }}><LeafIcon size={14} /></span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text-brand)' }}>Duyên Phần</span>
          </span>
          <p style={{ marginTop: 14, fontSize: 'var(--fs-body-sm)', lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 280 }}>Chuỗi nhà hàng cơm chay thuần Việt. Nấu vừa đủ, ăn vừa lành.</p>
          <p style={{ marginTop: 16, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>Trụ sở: 45 Trần Quốc Thảo, Quận 3, TP.HCM</p>
          <p style={{ marginTop: 4, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>Giờ mở cửa: 08:00-21:00 mỗi ngày</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <a href="#" className="icon-btn" style={{ width: 36, height: 36, border: '1px solid var(--border)' }} title="Facebook"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
            <a href="#" className="icon-btn" style={{ width: 36, height: 36, border: '1px solid var(--border)' }} title="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg></a>
            <a href="#" className="icon-btn" style={{ width: 36, height: 36, border: '1px solid var(--border)' }} title="Zalo"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H3l1.7-3.4A8.5 8.5 0 1 1 21 11.5Z" /></svg></a>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 'var(--fs-label)', fontWeight: 600, marginBottom: 12, color: 'var(--green-700)' }}>Về chúng tôi</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a className="foot-link" href="#">Câu chuyện</a>
            <a className="foot-link" href="#">Nhượng quyền</a>
            <a className="foot-link" href="#">Liên hệ</a>
            {isCrossPort ? (
              <a className="foot-link" href={`${internalOrigin}/dang-nhap`}>Đăng nhập quản trị</a>
            ) : (
              <a className="foot-link" onClick={goAuth} style={{ cursor: 'pointer' }}>{isLoggedIn ? 'Vào trang quản trị' : 'Đăng nhập quản trị'}</a>
            )}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 'var(--fs-label)', fontWeight: 600, marginBottom: 12, color: 'var(--green-700)' }}>Nhận thực đơn tuần</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="plain-field" placeholder="Email của bạn" style={{ flex: 1 }} />
            <a href="#" className="btn btn-primary btn-md">Gửi</a>
          </div>
          <p style={{ marginTop: 8, fontSize: 'var(--fs-caption)', color: 'var(--text-subtle)' }}>Mỗi thứ Hai, một email. Huỷ bất cứ lúc nào.</p>
        </div>
      </div>
      <div className="wrap" style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-caption)', color: 'var(--text-subtle)' }}>
        <span>© 2026 Duyên Phần. Giấy phép ĐKKD 0312xxxxxx.</span>
        <span>1900 6088 · xinchao@duyenphan.vn</span>
      </div>
    </footer>
  );
}
