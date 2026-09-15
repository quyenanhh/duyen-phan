import { XIcon } from './icons.jsx';

function Toggle({ on, onClick }) {
  return (
    <span role="switch" aria-checked={on} onClick={onClick} style={{ flex: '0 0 auto', width: 40, height: 22, borderRadius: 999, background: on ? 'var(--brand)' : 'var(--border-strong)', position: 'relative', cursor: 'pointer' }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: 999, background: '#FFF', transition: 'left var(--dur-fast) var(--ease-out)' }} />
    </span>
  );
}

export default function SecurityDialog({ ctx }) {
  const {
    securityOpen, closeSecurity,
    secCurrent, setSecCurrent, secNew, setSecNew, secConfirm, setSecConfirm, secErrors,
    submitSecurity, goForgotPassword,
    secSms, setSecSms, secEmail, setSecEmail, secApp, setSecApp,
    loggedPhone, loggedEmail
  } = ctx;
  if (!securityOpen) return null;

  const borderFor = k => (secErrors[k] ? 'var(--danger)' : 'var(--border-strong)');

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 60 }} onClick={closeSecurity}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel modal-pop" style={{ width: '100%', maxWidth: 460, maxHeight: '88vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '24px 24px 0' }}>
          <h3 style={{ flex: 1, fontSize: 'var(--fs-h3)', fontWeight: 600 }}>Mật khẩu và bảo mật</h3>
          <button type="button" className="icon-btn" style={{ width: 32, height: 32 }} onClick={closeSecurity}><XIcon /></button>
        </div>

        <div style={{ padding: '20px 24px 0' }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Mật khẩu</h4>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label className="field-wrap">
              <label>Mật khẩu hiện tại</label>
              <span className="field" style={{ borderColor: borderFor('secCurrent') }}><input type="password" placeholder="Nhập mật khẩu hiện tại" value={secCurrent} onChange={e => setSecCurrent(e.target.value)} /></span>
              {secErrors.secCurrent && <span className="err-msg">{secErrors.secCurrent}</span>}
            </label>
            <label className="field-wrap">
              <label>Mật khẩu mới</label>
              <span className="field" style={{ borderColor: borderFor('secNew') }}><input type="password" placeholder="Tối thiểu 8 ký tự" value={secNew} onChange={e => setSecNew(e.target.value)} /></span>
              {secErrors.secNew && <span className="err-msg">{secErrors.secNew}</span>}
            </label>
            <label className="field-wrap">
              <label>Xác nhận mật khẩu mới</label>
              <span className="field" style={{ borderColor: borderFor('secConfirm') }}><input type="password" placeholder="Nhập lại mật khẩu mới" value={secConfirm} onChange={e => setSecConfirm(e.target.value)} /></span>
              {secErrors.secConfirm && <span className="err-msg">{secErrors.secConfirm}</span>}
            </label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a onClick={goForgotPassword} style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-brand)', cursor: 'pointer' }}>Quên mật khẩu?</a>
              <button type="button" className="btn btn-primary btn-md" onClick={submitSecurity}>Cập nhật mật khẩu</button>
            </div>
          </div>
        </div>

        <div style={{ padding: 24, marginTop: 20, borderTop: '1px solid var(--border-soft)' }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Bảo mật</h4>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Xác minh qua SĐT khi đăng nhập</div>
                <div style={{ marginTop: 2, fontSize: 12, color: 'var(--text-muted)' }}>Gửi mã OTP về {loggedPhone} mỗi lần đăng nhập.</div>
              </div>
              <Toggle on={secSms} onClick={() => setSecSms(v => !v)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Xác minh qua Gmail</div>
                <div style={{ marginTop: 2, fontSize: 12, color: 'var(--text-muted)' }}>Gửi mã xác minh về {loggedEmail || 'an.nguyen@duyenphan.vn'}.</div>
              </div>
              <Toggle on={secEmail} onClick={() => setSecEmail(v => !v)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Ứng dụng xác thực (Authenticator)</div>
                <div style={{ marginTop: 2, fontSize: 12, color: 'var(--text-muted)' }}>Dùng mã từ ứng dụng như Google Authenticator.</div>
              </div>
              <Toggle on={secApp} onClick={() => setSecApp(v => !v)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
