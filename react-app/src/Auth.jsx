import { CheckIcon, LeafIcon } from './icons.jsx';

const LEAF_D = 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 1 5 1 6 0 8.7-8 12-9 12Z';

function AuthBackground() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
      <div style={{ position: 'absolute', width: 560, height: 560, borderRadius: '50%', background: 'var(--clay-50)', filter: 'blur(110px)', opacity: .9, top: -200, right: -160 }} />
      <div style={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', background: 'var(--green-100)', filter: 'blur(100px)', opacity: .85, top: -160, left: -160 }} />

      {/* Đồi cây/lá cách điệu ở chân trang — thay cho ảnh chụp thật, giữ đúng phong cách minh hoạ vector của toàn app. */}
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path d="M0 600 Q 240 540 480 590 T 960 580 T 1440 610 V900 H0 Z" fill="var(--green-100)" opacity=".7" />
        <path d="M0 690 Q 260 630 540 680 T 1040 665 T 1440 700 V900 H0 Z" fill="var(--green-300)" opacity=".55" />
        <path d="M0 790 Q 300 740 620 780 T 1140 770 T 1440 795 V900 H0 Z" fill="var(--green-700)" opacity=".9" />
        <g fill="var(--green-800)" opacity=".8">
          <path transform="translate(110,740) rotate(-20) scale(1.8)" d={LEAF_D} />
          <path transform="translate(260,810) rotate(35) scale(1.3)" d={LEAF_D} />
          <path transform="translate(1180,760) rotate(160) scale(2)" d={LEAF_D} />
          <path transform="translate(1330,820) rotate(-60) scale(1.4)" d={LEAF_D} />
          <path transform="translate(700,830) rotate(10) scale(1.5)" d={LEAF_D} />
        </g>
      </svg>

      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', color: 'var(--brand)', opacity: .1 }}>
        <g fill="currentColor" stroke="none">
          <path transform="translate(120,110) rotate(-18) scale(2.4)" d={LEAF_D} />
          <path transform="translate(1010,130) rotate(150) scale(2)" d={LEAF_D} />
          <path transform="translate(1040,420) rotate(-40) scale(1.6)" d={LEAF_D} />
          <path transform="translate(130,440) rotate(70) scale(1.4)" d={LEAF_D} />
        </g>
      </svg>
    </div>
  );
}

function Chk({ checked, onClick, children }) {
  return (
    <label className="chk" onClick={onClick}>
      <span className="chk-box" style={{ background: checked ? 'var(--brand)' : 'var(--surface-card)', border: `1px solid ${checked ? 'var(--brand)' : 'var(--border-strong)'}` }}>
        {checked && <CheckIcon />}
      </span>
      {children}
    </label>
  );
}

function AuthLogo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 36, height: 36, flex: '0 0 auto', borderRadius: 10, background: 'var(--surface-brand-soft)', color: 'var(--brand)', display: 'grid', placeItems: 'center' }}><LeafIcon size={19} /></span>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 27, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text-brand)' }}>Duyên Phần</span>
      </span>
    </div>
  );
}

function AuthHeading({ title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', marginTop: 22 }}>
      <h1 style={{ fontSize: 21, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-brand)' }}>{title}</h1>
      {subtitle && <p style={{ marginTop: 6, fontSize: 13.5, color: 'var(--text-muted)' }}>{subtitle}</p>}
    </div>
  );
}

function QuickAccessRow({ label }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0 16px' }}>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>{label}</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button type="button" className="icon-btn" style={{ width: 46, height: 46, borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)' }} onClick={e => e.preventDefault()} title="Chưa hỗ trợ — sắp ra mắt">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z" /><path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.88-3c-1.08.72-2.46 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.1A12 12 0 0 0 12 24Z" /><path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.26a12 12 0 0 0 0 10.78l4.01-3.1Z" /><path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.61l4.01 3.1C6.22 6.86 8.87 4.75 12 4.75Z" /></svg>
        </button>
        <button type="button" className="icon-btn" style={{ width: 46, height: 46, borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)' }} onClick={e => e.preventDefault()} title="Chưa hỗ trợ — sắp ra mắt">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} style={{ color: 'var(--text-body)' }}>
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </>
  );
}

export default function Auth({ ctx }) {
  const {
    goLanding,
    page,
    email, setEmail, password, setPassword, remember, setRemember, errors, setErrors,
    submitLogin, authLoading,
    newPassword, setNewPassword, newConfirm, setNewConfirm, submitNewPassword,
    isLoggedIn, loggedName
  } = ctx;

  const isChangePassword = page === 'changePassword';
  const isLogin = !isChangePassword;

  const borderFor = (obj, key) => (obj[key] ? 'var(--danger)' : 'var(--border-strong)');
  const pillField = key => obj => ({ borderColor: borderFor(obj, key), borderRadius: 'var(--radius-pill)', padding: '0 18px', height: 48 });
  const changePasswordHint = isLoggedIn
    ? `Đặt mật khẩu mới cho tài khoản ${loggedName || 'của bạn'}.`
    : `Đây là lần đăng nhập đầu tiên của ${loggedName || 'nhân viên'}. Vui lòng đặt mật khẩu mới trước khi tiếp tục.`;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: 'var(--surface-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
      <AuthBackground />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 448 }}>
        <div className="panel modal-pop" style={{ padding: '32px 36px 30px', position: 'relative' }}>
          <span className="back-link" style={{ position: 'absolute', top: 26, right: 28, fontSize: 12.5 }} onClick={goLanding}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            Về trang chủ
          </span>

          <AuthLogo />

          {isLogin && (
            <>
              <AuthHeading title="Đăng nhập quản trị" subtitle="Hệ thống quản trị chuỗi cơm chay" />
              <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label className="field-wrap">
                  <label>Email</label>
                  <span className="field" style={pillField('email')(errors)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-subtle)', flex: '0 0 auto' }}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></svg>
                    <input placeholder="ten@gmail.com" value={email} onChange={e => { setEmail(e.target.value); setErrors({ ...errors, email: null }); }} />
                  </span>
                  {errors.email && <span className="err-msg">{errors.email}</span>}
                </label>
                <label className="field-wrap">
                  <label>Mật khẩu</label>
                  <span className="field" style={pillField('password')(errors)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-subtle)', flex: '0 0 auto' }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    <input type="password" placeholder="Nhập mật khẩu" value={password} onChange={e => { setPassword(e.target.value); setErrors({ ...errors, password: null }); }} />
                  </span>
                  {errors.password && <span className="err-msg">{errors.password}</span>}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '2px 4px' }}>
                  <Chk checked={remember} onClick={() => setRemember(v => !v)}>Ghi nhớ đăng nhập</Chk>
                  <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 13, fontWeight: 500 }}>Quên mật khẩu?</a>
                </div>
                <button type="button" className="btn btn-primary btn-lg btn-block" style={{ borderRadius: 'var(--radius-pill)', height: 50, marginTop: 4 }} onClick={submitLogin} disabled={authLoading}>{authLoading ? 'Đang đăng nhập…' : 'Đăng nhập'}</button>
              </div>
              <QuickAccessRow label="Đăng nhập nhanh" />
            </>
          )}

          {isChangePassword && (
            <>
              <AuthHeading title="Đổi mật khẩu mới" subtitle={changePasswordHint} />
              <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label className="field-wrap">
                  <label>Mật khẩu mới</label>
                  <span className="field" style={pillField('newPassword')(errors)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-subtle)', flex: '0 0 auto' }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    <input type="password" placeholder="Tối thiểu 8 ký tự" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                  </span>
                  {errors.newPassword && <span className="err-msg">{errors.newPassword}</span>}
                </label>
                <label className="field-wrap">
                  <label>Xác nhận mật khẩu mới</label>
                  <span className="field" style={pillField('newConfirm')(errors)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-subtle)', flex: '0 0 auto' }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    <input type="password" placeholder="Nhập lại mật khẩu mới" value={newConfirm} onChange={e => setNewConfirm(e.target.value)} />
                  </span>
                  {errors.newConfirm && <span className="err-msg">{errors.newConfirm}</span>}
                </label>
                <button type="button" className="btn btn-primary btn-lg btn-block" style={{ borderRadius: 'var(--radius-pill)', height: 50, marginTop: 4 }} onClick={submitNewPassword}>Đổi mật khẩu và tiếp tục</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
