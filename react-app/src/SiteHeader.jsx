import { useEffect, useState } from 'react';
import { LeafIcon, ChevronRight, LoginArrowIcon } from './icons.jsx';

export default function SiteHeader({ ctx, active }) {
  const {
    theme, toggleTheme, isLoggedIn, goAuth, goLanding, goMenu, goBranchesPublic, goAbout, goContact, userInitials, userName,
    landingAcctMenuOpen, setLandingAcctMenuOpen, userRoleLabel,
    openProfileFromLanding, openSecurityFromLanding, switchAccount, logout
  } = ctx;
  const isLoggedOut = !isLoggedIn;
  const isDark = theme === 'dark';

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--header-bg)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border)', boxShadow: scrolled ? 'var(--shadow-card)' : 'none', transition: 'background var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)' }}>
      <div className="wrap" style={{ height: 76, display: 'flex', alignItems: 'center', gap: 36 }}>
        <span onClick={goLanding} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
          <span style={{ width: 32, height: 32, flex: '0 0 auto', borderRadius: 9, background: 'var(--surface-brand-soft)', color: 'var(--brand)', display: 'grid', placeItems: 'center' }}><LeafIcon size={17} /></span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text-brand)' }}>Duyên Phần</span>
        </span>
        <nav className="site-nav">
          <a className="nav-link" onClick={goLanding} style={{ cursor: 'pointer', color: active === 'landing' ? 'var(--text-brand)' : undefined }}>Trang chủ</a>
          <a className="nav-link" onClick={goMenu} style={{ cursor: 'pointer', color: active === 'menu' ? 'var(--text-brand)' : undefined }}>Thực đơn</a>
          <a className="nav-link" onClick={goBranchesPublic} style={{ cursor: 'pointer', color: active === 'branches' ? 'var(--text-brand)' : undefined }}>Chi nhánh</a>
          <a className="nav-link" onClick={goAbout} style={{ cursor: 'pointer', color: active === 'about' ? 'var(--text-brand)' : undefined }}>Về chúng tôi</a>
          <a className="nav-link" onClick={goContact} style={{ cursor: 'pointer', color: active === 'contact' ? 'var(--text-brand)' : undefined }}>Liên hệ</a>
        </nav>
        <span style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
          <button type="button" className="icon-btn" style={{ width: 36, height: 36 }} title="Đổi giao diện sáng/tối" onClick={toggleTheme}>
            {isDark ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" /></svg>
            )}
          </button>
          {isLoggedIn && (
            <span style={{ position: 'relative' }}>
              <a onClick={() => setLandingAcctMenuOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '4px 12px 4px 4px', borderRadius: 999, background: 'var(--surface-brand-soft)' }}>
                <span style={{ width: 28, height: 28, flex: '0 0 auto', borderRadius: 999, background: 'var(--clay-100)', color: 'var(--text-accent)', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 12 }}>{userInitials}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-brand)' }}>{userName}</span>
              </a>
              {landingAcctMenuOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 29 }} onClick={() => setLandingAcctMenuOpen(false)} />
                  <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 300, background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-modal)', padding: 20, zIndex: 30, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 40, height: 40, flex: '0 0 auto', borderRadius: 999, background: 'var(--clay-100)', color: 'var(--text-accent)', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 14 }}>{userInitials}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{userRoleLabel}</div>
                      </div>
                    </div>
                    <a onClick={openProfileFromLanding} style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--text-body)' }}>Thông tin cá nhân</span>
                      <ChevronRight style={{ color: 'var(--text-subtle)' }} />
                    </a>
                    <a onClick={openSecurityFromLanding} style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--text-body)' }}>Mật khẩu và bảo mật</span>
                      <ChevronRight style={{ color: 'var(--text-subtle)' }} />
                    </a>
                    <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-soft)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <a onClick={goAuth} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', cursor: 'pointer', color: 'var(--text-body)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
                        Vào trang quản trị
                      </a>
                      <a onClick={e => e.preventDefault()} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', cursor: 'pointer', color: 'var(--text-body)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                        Hỗ trợ
                      </a>
                      <a onClick={switchAccount} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', cursor: 'pointer', color: 'var(--text-body)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5" /><path d="M4 20 21 3" /><path d="M21 16v5h-5" /><path d="M15 15l6 6" /><path d="M4 4l5 5" /></svg>
                        Chuyển đổi tài khoản
                      </a>
                      <a onClick={logout} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', cursor: 'pointer', color: 'var(--danger-text)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>
                        Đăng xuất
                      </a>
                    </div>
                  </div>
                </>
              )}
            </span>
          )}
          {isLoggedOut && (
            <a onClick={goAuth} className="btn btn-primary btn-md">
              <LoginArrowIcon />
              Đăng nhập quản trị
            </a>
          )}
        </span>
      </div>
    </header>
  );
}
