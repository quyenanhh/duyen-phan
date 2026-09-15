import { useState } from 'react';
import { XIcon } from './icons.jsx';
import { supabaseEnabled, uploadAvatar, updateProfileRow } from './lib/profilesApi.js';

export default function ProfileDialog({ ctx }) {
  const {
    profileOpen, closeProfile, userInitials, profileNameDraft, setProfileNameDraft,
    loggedId, loggedEmail, loggedPhone, loggedAvatarUrl, setLoggedAvatarUrl, userRole, userRoleLabel, userBranch, staffCode, saveProfile, openSecurity,
    pinDraft, setPinDraft, flash
  } = ctx;
  const [avatarUploading, setAvatarUploading] = useState(false);
  if (!profileOpen) return null;
  function changePassword() { closeProfile(); openSecurity(); }

  async function handleAvatarFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!supabaseEnabled || !loggedId) { flash('Chưa cấu hình Supabase — không thể tải ảnh lên.'); return; }
    setAvatarUploading(true);
    try {
      const url = await uploadAvatar(loggedId, file);
      await updateProfileRow(loggedId, { avatarUrl: url });
      setLoggedAvatarUrl(url);
      flash('Đã cập nhật ảnh đại diện.');
    } catch (err) {
      console.error('[Supabase] Tải ảnh đại diện thất bại:', err);
      flash('Không tải được ảnh lên — thử lại sau.');
    } finally {
      setAvatarUploading(false);
    }
  }

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 60 }} onClick={closeProfile}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel panel-flush modal-pop" style={{ width: '100%', maxWidth: 420, maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '24px 24px 0', flex: '0 0 auto' }}>
          <h3 style={{ flex: 1, fontSize: 'var(--fs-h3)', fontWeight: 600 }}>Thông tin cá nhân</h3>
          <button type="button" className="icon-btn" style={{ width: 32, height: 32 }} onClick={closeProfile}><XIcon /></button>
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', minHeight: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span style={{ position: 'relative', width: 80, height: 80 }}>
              {loggedAvatarUrl ? (
                <img src={loggedAvatarUrl} alt={userInitials} style={{ width: 80, height: 80, borderRadius: 999, objectFit: 'cover', display: 'block' }} />
              ) : (
                <span style={{ width: 80, height: 80, borderRadius: 999, background: '#E8DFD2', color: '#8F775F', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 24 }}>{userInitials}</span>
              )}
              <label style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 999, background: 'var(--brand)', color: 'var(--text-on-brand)', border: '2px solid var(--surface-card)', display: 'grid', placeItems: 'center', cursor: 'pointer' }} title="Đổi ảnh đại diện">
                {avatarUploading ? (
                  <span style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', animation: 'spin .7s linear infinite' }} />
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" /><circle cx="12" cy="13" r="3.5" /></svg>
                )}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarFile} disabled={avatarUploading} />
              </label>
            </span>
          </div>
          <label className="field-wrap">
            <label>Họ và tên</label>
            <span className="field"><input value={profileNameDraft} onChange={e => setProfileNameDraft(e.target.value)} /></span>
          </label>
          <label className="field-wrap">
            <label>Gmail</label>
            <span className="field" style={{ background: 'var(--surface-page)' }}><input value={loggedEmail} disabled /></span>
          </label>
          <label className="field-wrap">
            <label>Số điện thoại</label>
            <span className="field" style={{ background: 'var(--surface-page)' }}><input value={loggedPhone || '— chưa cập nhật —'} disabled /></span>
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Mã nhân viên</label>
              <span className="field" style={{ background: 'var(--surface-page)' }}><input value={staffCode || '—'} disabled style={{ fontVariantNumeric: 'tabular-nums' }} /></span>
            </label>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Vai trò</label>
              <span className="field" style={{ background: 'var(--surface-page)' }}><input value={userRoleLabel} disabled /></span>
            </label>
          </div>
          {userBranch && (
            <label className="field-wrap">
              <label>Chi nhánh phụ trách</label>
              <span className="field" style={{ background: 'var(--surface-page)' }}><input value={userBranch} disabled /></span>
            </label>
          )}
          {userRole === 'Quản lý' && (
            <label className="field-wrap">
              <label>Mã PIN duyệt (dùng khi thu ngân xin huỷ món/điều chỉnh hoá đơn)</label>
              <span className="field"><input inputMode="numeric" maxLength={8} placeholder="Ví dụ: 2468" value={pinDraft} onChange={e => setPinDraft(e.target.value.replace(/[^0-9]/g, ''))} /></span>
            </label>
          )}
          <a onClick={changePassword} className="foot-link" style={{ cursor: 'pointer', fontWeight: 600 }}>Đổi mật khẩu</a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 24, flex: '0 0 auto' }}>
          <button type="button" className="btn btn-secondary btn-md" onClick={closeProfile}>Huỷ</button>
          <button type="button" className="btn btn-primary btn-md" onClick={saveProfile}>Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
}
