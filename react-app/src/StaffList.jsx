import { useEffect, useState } from 'react';
import { STAFF_ROLES, STAFF_ROLE_STYLE, STAFF_STATUS_STYLE, STAFF_SHIFT_CELL, CONTRACT_TYPES } from './data.js';
import { buildStaffCalendar, fmtVnd, periodStartDate, initials } from './utils.js';
import { SearchIcon, XIcon, TrashIcon, PauseUserIcon, PersonIcon, ChevronLeft, ChevronRight, CheckIcon, EditIcon, PackageIcon } from './icons.jsx';
import SummaryCard from './SummaryCard.jsx';
import { supabaseEnabled, updateProfileRow, deleteProfileRow, listProfiles, uploadAvatar } from './lib/profilesApi.js';
import { createStaffAccount } from './lib/staffAdminApi.js';
import { listOrdersByWaiter, listOrdersByCook, listPaidTableOrdersByCashier } from './lib/tableOrdersApi.js';

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('vi-VN');
}

function PersonRosterIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M21 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function CalendarIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
}
function WalletIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /><path d="M18 12a2 2 0 0 0 0 4h3v-4Z" /></svg>;
}

function ItemsMiniIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M3 11h18" /><path d="M12 11V4" /><path d="M8 4h8" /><path d="M4 11a8 8 0 0 0 16 0Z" /></svg>;
}

export default function StaffList({ ctx }) {
  const {
    staffRecords, setStaffRecords, flash, branchRecords,
    staffQuery, setStaffQuery, staffFilterRole, setStaffFilterRole, staffFilterBranch, setStaffFilterBranch,
    setDeleteStaffId, setPauseStaffId, setStaffProfileId
  } = ctx;

  const [tab, setTab] = useState('roster'); // roster | schedule
  const [staffAddOpen, setStaffAddOpen] = useState(false);

  const roster = staffRecords;

  const staffCount = roster.length;
  const staffShiftTotal = roster.reduce((sum, s) => sum + (s.shifts || 0), 0);
  const staffPayrollTotal = fmtVnd(roster.reduce((sum, s) => sum + (s.salary || 0), 0));

  const q = staffQuery.trim().toLowerCase();
  const qDigits = q.replace(/\s+/g, '');
  const filtered = roster.filter(s => {
    const matchesQuery = !q || s.name.toLowerCase().includes(q) || (s.phone || '').replace(/\s+/g, '').includes(qDigits);
    const matchesRole = !staffFilterRole || s.role === staffFilterRole;
    const matchesBranch = !staffFilterBranch || s.branch === staffFilterBranch;
    return matchesQuery && matchesRole && matchesBranch;
  });
  const branchOptions = [...new Set(roster.map(s => s.branch).filter(Boolean))];

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Nhân viên</h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Quản lý tạo tài khoản trực tiếp tại đây, kèm mật khẩu tạm thời cho lần đăng nhập đầu tiên.</div>
        </div>
        <button type="button" className="btn btn-primary btn-md" onClick={() => setStaffAddOpen(true)}>+ Thêm nhân viên</button>
      </div>

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <SummaryCard icon={<PersonRosterIcon />} tone="brand" label="Số nhân viên" value={staffCount} />
          <SummaryCard icon={<CalendarIcon />} tone="brand" label="Số ca làm / tuần" value={staffShiftTotal} />
          <SummaryCard icon={<WalletIcon />} tone="warn" label="Quỹ lương / tháng" value={staffPayrollTotal} />
        </div>

        <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--surface-page)', border: '1px solid var(--border)', borderRadius: 999, alignSelf: 'flex-start' }}>
          <button type="button" className={`tabp ${tab === 'roster' ? 'active' : ''}`} onClick={() => setTab('roster')}>Danh sách nhân viên</button>
          <button type="button" className={`tabp ${tab === 'schedule' ? 'active' : ''}`} onClick={() => setTab('schedule')}>Lịch ca làm</button>
        </div>

        {tab === 'roster' && (
          <section className="panel panel-flush">
            <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
              <label className="field-wrap" style={{ width: 260 }}>
                <label>Tìm kiếm</label>
                <span className="field"><SearchIcon style={{ color: 'var(--text-subtle)', flex: '0 0 auto' }} /><input placeholder="Tên hoặc số điện thoại" value={staffQuery} onChange={e => setStaffQuery(e.target.value)} /></span>
              </label>
              <label className="field-wrap" style={{ width: 180 }}>
                <label>Vai trò</label>
                <span className="field"><select value={staffFilterRole} onChange={e => setStaffFilterRole(e.target.value)}>
                  <option value="">Tất cả vai trò</option>
                  {STAFF_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select></span>
              </label>
              <label className="field-wrap" style={{ width: 220 }}>
                <label>Chi nhánh</label>
                <span className="field"><select value={staffFilterBranch} onChange={e => setStaffFilterBranch(e.target.value)}>
                  <option value="">Tất cả chi nhánh</option>
                  {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </select></span>
              </label>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 13, color: 'var(--text-muted)', paddingBottom: 10 }}>{filtered.length} / {staffCount} nhân viên</span>
            </div>
            {roster.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có nhân viên nào trong danh sách.</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>Không tìm thấy nhân viên phù hợp.</div>
            ) : (
              <table style={{ width: '100%', fontSize: 'var(--fs-body-sm)' }}>
                <thead><tr><th>Nhân viên</th><th>Vai trò</th><th>Trạng thái</th><th>Chi nhánh</th><th style={{ textAlign: 'right' }}>Ca / tuần</th><th style={{ textAlign: 'right' }}>Thao tác</th></tr></thead>
                <tbody>
                  {filtered.map(s => {
                    const [roleBg, roleColor] = STAFF_ROLE_STYLE[s.role] || STAFF_ROLE_STYLE['Nhân viên'];
                    const [stBg, stColor, stLabel] = STAFF_STATUS_STYLE[s.status] || STAFF_STATUS_STYLE.active;
                    const isActive = s.status === 'active';
                    const pauseLabel = isActive ? 'Cho nghỉ tạm thời' : 'Cho đi làm lại';
                    return (
                      <tr className="row" key={s.id} style={{ cursor: 'pointer' }} onClick={() => setStaffProfileId(s.id)}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {s.avatarUrl ? (
                              <img src={s.avatarUrl} alt={s.name} style={{ width: 32, height: 32, flex: '0 0 auto', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                            ) : (
                              <span style={{ width: 32, height: 32, flex: '0 0 auto', borderRadius: '50%', background: roleBg, color: roleColor, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>{initials(s.name) || '?'}</span>
                            )}
                            <span style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name || '— chưa cập nhật —'}</span>
                          </div>
                        </td>
                        <td><span className="badge" style={{ background: roleBg, color: roleColor }}>{s.role}</span></td>
                        <td><span className="badge" style={{ background: stBg, color: stColor }}><span className="dot" />{stLabel}</span></td>
                        <td style={{ color: 'var(--text-muted)' }}>{s.branch || '—'}</td>
                        <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{s.shifts || 0}</td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button type="button" className="icon-btn" style={{ width: 30, height: 30, color: 'var(--text-accent)' }} title={pauseLabel} onClick={e => { e.stopPropagation(); setPauseStaffId(s.id); }}><PauseUserIcon /></button>
                          <button type="button" className="icon-btn" style={{ width: 30, height: 30, color: 'var(--danger)' }} title="Xoá nhân viên" onClick={e => { e.stopPropagation(); setDeleteStaffId(s.id); }}><TrashIcon /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>
        )}

        {tab === 'schedule' && <StaffScheduleTable roster={roster} branchOptions={branchOptions} staffFilterBranch={staffFilterBranch} setStaffFilterBranch={setStaffFilterBranch} />}
      </div>

      <StaffProfileDialog ctx={ctx} />
      <DeleteStaffDialog ctx={ctx} />
      <PauseStaffDialog ctx={ctx} />
      <StaffAddDialog open={staffAddOpen} onClose={() => setStaffAddOpen(false)} branchRecords={branchRecords} setStaffRecords={setStaffRecords} flash={flash} />
    </div>
  );
}

function StaffScheduleTable({ roster, branchOptions, staffFilterBranch, setStaffFilterBranch }) {
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const list = staffFilterBranch ? roster.filter(s => s.branch === staffFilterBranch) : roster;

  return (
    <section className="panel panel-flush">
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
        <label className="field-wrap" style={{ width: 220 }}>
          <label>Chi nhánh</label>
          <span className="field"><select value={staffFilterBranch} onChange={e => setStaffFilterBranch(e.target.value)}>
            <option value="">Tất cả chi nhánh</option>
            {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
          </select></span>
        </label>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--text-muted)', paddingBottom: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#E7ECE5', border: '1px solid #B7C2B4' }} />Ca sáng</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#F7E9CC', border: '1px solid #C98A2C' }} />Ca chiều</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#F0EBE3', border: '1px solid #D2C4B4' }} />Nghỉ</span>
        </div>
      </div>
      {list.length === 0 ? (
        <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>Không có nhân viên phù hợp để hiển thị lịch ca.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 'var(--fs-body-sm)', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', minWidth: 200 }}>Nhân viên</th>
                {days.map(d => <th key={d} style={{ textAlign: 'center', minWidth: 92 }}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {list.map(s => {
                const [roleBg, roleColor] = STAFF_ROLE_STYLE[s.role] || STAFF_ROLE_STYLE['Nhân viên'];
                const week = s.week && s.week.length === 7 ? s.week : ['off', 'off', 'off', 'off', 'off', 'off', 'off'];
                const paused = s.status !== 'active';
                return (
                  <tr className="row" key={s.id} style={{ opacity: paused ? .55 : 1 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {s.avatarUrl ? (
                          <img src={s.avatarUrl} alt={s.name} style={{ width: 30, height: 30, flex: '0 0 auto', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <span style={{ width: 30, height: 30, flex: '0 0 auto', borderRadius: '50%', background: roleBg, color: roleColor, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>{initials(s.name) || '?'}</span>
                        )}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
                            {paused && <span className="badge" style={{ background: '#F6DED7', color: '#8E3421', fontSize: 10 }}>Tạm nghỉ</span>}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.role}</div>
                        </div>
                      </div>
                    </td>
                    {week.map((tok, i) => {
                      const [bg, border, text, label] = STAFF_SHIFT_CELL[tok] || STAFF_SHIFT_CELL.off;
                      return (
                        <td key={i} style={{ textAlign: 'center' }}>
                          <span style={{ display: 'inline-block', padding: '5px 10px', borderRadius: 6, background: bg, border: `1px solid ${border}`, color: text, fontSize: 11, fontWeight: 600 }}>{label}</span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function StaffAddDialog({ open, onClose, branchRecords, setStaffRecords, flash }) {
  const blankForm = { name: '', email: '', phone: '', branch: '', role: 'Nhân viên' };
  const [form, setForm] = useState(blankForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { email, tempPassword, name, role, branch }
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  function setField(key) {
    return e => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: null }); };
  }

  function close() {
    onClose();
    setTimeout(() => { setForm(blankForm); setErrors({}); setResult(null); setCopied(false); }, 200);
  }

  async function submit() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nhập họ và tên';
    if (!form.email.trim()) errs.email = 'Nhập email đăng nhập';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Email không hợp lệ';
    if (!form.branch) errs.branch = 'Chọn chi nhánh phụ trách';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (!supabaseEnabled) { setErrors({ email: 'Chưa cấu hình Supabase — không thể tạo tài khoản lúc này.' }); return; }

    setSubmitting(true);
    try {
      const created = await createStaffAccount({
        email: form.email.trim(), name: form.name.trim(), phone: form.phone.trim(), branch: form.branch, role: form.role
      });
      setResult(created);
      try { setStaffRecords(await listProfiles()); } catch { /* danh sách sẽ tự làm mới ở lần tải trang sau */ }
      flash('Đã tạo tài khoản cho ' + created.name + '.');
    } catch (err) {
      console.error('[Supabase] Tạo tài khoản nhân viên thất bại:', err);
      setErrors({ email: err.message || 'Không tạo được tài khoản, thử lại sau.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(result.tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard có thể bị chặn — nhân viên vẫn nhìn thấy mật khẩu để chép tay */ }
  }

  const borderFor = k => (errors[k] ? 'var(--danger)' : 'var(--border-strong)');

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 62 }} onClick={close}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel panel-flush modal-pop" style={{ width: '100%', maxWidth: 460 }}>
        {result ? (
          <>
            <div style={{ padding: 24 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'var(--surface-brand-soft)', color: 'var(--brand)' }}>
                <CheckIcon />
              </span>
              <h3 style={{ marginTop: 14, fontSize: 'var(--fs-h3)', fontWeight: 600 }}>Đã tạo tài khoản cho {result.name}</h3>
              <p style={{ marginTop: 6, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>Gửi thông tin bên dưới cho nhân viên. Họ sẽ bị bắt buộc đổi mật khẩu ngay lần đăng nhập đầu tiên.</p>

              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ background: 'var(--surface-page)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-control)', padding: '12px 14px' }}>
                  <span style={{ display: 'block', fontSize: 'var(--fs-caption)', color: 'var(--text-subtle)' }}>Email đăng nhập</span>
                  <span style={{ fontWeight: 600, fontSize: 'var(--fs-body-sm)' }}>{result.email}</span>
                </div>
                <div style={{ background: 'var(--surface-page)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-control)', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span>
                    <span style={{ display: 'block', fontSize: 'var(--fs-caption)', color: 'var(--text-subtle)' }}>Mật khẩu tạm thời</span>
                    <span style={{ fontWeight: 600, fontSize: 15, fontFamily: 'monospace', letterSpacing: '.02em' }}>{result.tempPassword}</span>
                  </span>
                  <button type="button" className="btn btn-secondary btn-md" onClick={copyPassword}>{copied ? 'Đã chép' : 'Chép'}</button>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0 24px 24px' }}>
              <button type="button" className="btn btn-primary btn-md" onClick={close}>Xong</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ padding: 24 }}>
              <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 600 }}>Thêm nhân viên</h3>
              <p style={{ marginTop: 6, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>Hệ thống sẽ tạo tài khoản với mật khẩu tạm thời, đã duyệt sẵn — không cần chờ nhân viên tự đăng ký.</p>
            </div>
            <div style={{ padding: '0 24px 4px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label className="field-wrap">
                <label>Họ và tên</label>
                <span className="field" style={{ borderColor: borderFor('name') }}><input placeholder="Nguyễn Thị An" value={form.name} onChange={setField('name')} /></span>
                {errors.name && <span className="err-msg">{errors.name}</span>}
              </label>
              <label className="field-wrap">
                <label>Email đăng nhập</label>
                <span className="field" style={{ borderColor: borderFor('email') }}><input placeholder="annguyen@duyenphan.vn" value={form.email} onChange={setField('email')} /></span>
                {errors.email && <span className="err-msg">{errors.email}</span>}
              </label>
              <label className="field-wrap">
                <label>Số điện thoại</label>
                <span className="field" style={{ borderColor: borderFor('phone') }}><input placeholder="09xx xxx xxx" value={form.phone} onChange={setField('phone')} /></span>
              </label>
              <div style={{ display: 'flex', gap: 12 }}>
                <label className="field-wrap" style={{ flex: 1 }}>
                  <label>Vai trò</label>
                  <span className="field"><select value={form.role} onChange={setField('role')}>
                    {STAFF_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select></span>
                </label>
                <label className="field-wrap" style={{ flex: 1 }}>
                  <label>Chi nhánh</label>
                  <span className="field" style={{ borderColor: borderFor('branch') }}><select value={form.branch} onChange={setField('branch')}>
                    <option value="">Chọn chi nhánh</option>
                    {(branchRecords || []).map(b => <option key={b.id || b.name} value={b.name}>{b.name}</option>)}
                  </select></span>
                  {errors.branch && <span className="err-msg">{errors.branch}</span>}
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 24 }}>
              <button type="button" className="btn btn-secondary btn-md" onClick={close}>Huỷ</button>
              <button type="button" className="btn btn-primary btn-md" onClick={submit} disabled={submitting}>{submitting ? 'Đang tạo…' : 'Tạo tài khoản'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StaffProfileDialog({ ctx }) {
  const {
    staffRecords, setStaffRecords, staffProfileId, setStaffProfileId, staffCalYear, setStaffCalYear, staffCalMonth, setStaffCalMonth,
    setDeleteStaffId, setPauseStaffId, branchRecords, flash
  } = ctx;
  const p = staffRecords.find(s => s.id === staffProfileId);

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  if (!p) return null;

  const [roleBg, roleColor] = STAFF_ROLE_STYLE[p.role] || STAFF_ROLE_STYLE['Nhân viên'];
  const [stBg, stColor, stLabel] = STAFF_STATUS_STYLE[p.status] || STAFF_STATUS_STYLE.active;
  const cells = buildStaffCalendar(p.week, staffCalYear, staffCalMonth, STAFF_SHIFT_CELL);

  function close() { setStaffProfileId(null); setEditOpen(false); }
  function prevMonth() {
    if (staffCalMonth === 0) { setStaffCalYear(y => y - 1); setStaffCalMonth(11); } else setStaffCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (staffCalMonth === 11) { setStaffCalYear(y => y + 1); setStaffCalMonth(0); } else setStaffCalMonth(m => m + 1);
  }

  function startEdit() {
    setForm({
      name: p.name || '', dob: p.dob || '', cccd: p.cccd || '', phone: p.phone || '',
      branch: p.branch || '', role: p.role, salary: p.salary || 0,
      startDate: p.startDate || '', contractType: p.contractType || 'Toàn thời gian'
    });
    setEditOpen(true);
  }
  function cancelEdit() { setEditOpen(false); setForm(null); }
  function setField(key) { return e => setForm({ ...form, [key]: e.target.value }); }

  async function handleAvatarFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!supabaseEnabled) { flash('Chưa cấu hình Supabase — không thể tải ảnh lên.'); return; }
    setAvatarUploading(true);
    try {
      const url = await uploadAvatar(p.id, file);
      setStaffRecords(recs => recs.map(x => (x.id === p.id ? { ...x, avatarUrl: url } : x)));
      await updateProfileRow(p.id, { avatarUrl: url });
      flash('Đã cập nhật ảnh đại diện.');
    } catch (err) {
      console.error('[Supabase] Tải ảnh đại diện thất bại:', err);
      flash('Không tải được ảnh lên — thử lại sau.');
    } finally {
      setAvatarUploading(false);
    }
  }

  async function saveEdit() {
    if (!form.name.trim()) return;
    const patch = {
      name: form.name.trim(), dob: form.dob.trim(), cccd: form.cccd.trim(), phone: form.phone.trim(),
      branch: form.branch, role: form.role, salary: Number(form.salary) || 0,
      startDate: form.startDate, contractType: form.contractType
    };
    setStaffRecords(recs => recs.map(x => (x.id === p.id ? { ...x, ...patch } : x)));
    setEditOpen(false);
    flash('Đã cập nhật hồ sơ ' + patch.name + '.');
    if (supabaseEnabled) {
      setSaving(true);
      try { await updateProfileRow(p.id, patch); }
      catch (err) {
        console.error('[Supabase] Cập nhật hồ sơ nhân viên thất bại:', err);
        flash('Không lưu được lên máy chủ — thay đổi chỉ có trên trình duyệt này.');
      } finally { setSaving(false); }
    }
  }

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 60 }} onClick={close}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel modal-pop" style={{ width: '100%', maxWidth: 560, maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'var(--green-100)', padding: '28px 92px 28px 28px', position: 'relative', flex: '0 0 auto' }}>
          <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
            {!editOpen && (
              <>
                <button type="button" className="icon-btn" style={{ width: 32, height: 32, background: 'var(--surface-card)' }} title="Chỉnh sửa hồ sơ" onClick={startEdit}><EditIcon /></button>
                <button type="button" className="icon-btn" style={{ width: 32, height: 32, background: 'var(--surface-card)', color: 'var(--danger)' }} title="Xoá nhân viên" onClick={() => setDeleteStaffId(p.id)}><TrashIcon /></button>
              </>
            )}
            <button type="button" className="icon-btn" style={{ width: 32, height: 32, background: 'var(--surface-card)' }} onClick={close}><XIcon /></button>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <span style={{ position: 'relative', flex: '0 0 auto' }}>
              {p.avatarUrl ? (
                <img src={p.avatarUrl} alt={p.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', display: 'block', border: '1px solid var(--white)', boxShadow: 'var(--shadow-raised)' }} />
              ) : (
                <span style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-card)', border: '1px solid var(--white)', boxShadow: 'var(--shadow-raised)', display: 'grid', placeItems: 'center', color: 'var(--text-brand)', fontWeight: 700, fontSize: 20 }}>
                  {initials(p.name) || <PersonIcon size={26} />}
                </span>
              )}
              {editOpen && (
                <label title="Đổi ảnh đại diện" style={{ position: 'absolute', right: -4, bottom: -4, width: 26, height: 26, borderRadius: '50%', background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer', border: '2px solid var(--surface-card)' }}>
                  {avatarUploading ? (
                    <span style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent', animation: 'spin .7s linear infinite' }} />
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" /><circle cx="12" cy="13" r="4" /></svg>
                  )}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarFile} disabled={avatarUploading} />
                </label>
              )}
            </span>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: roleBg, color: roleColor }}>{p.role}</span>
                <span className="badge" style={{ background: stBg, color: stColor }}><span className="dot" />{stLabel}</span>
              </div>
              <div style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>{p.branch}</div>
            </div>
          </div>
        </div>
        <div style={{ padding: 24, overflowY: 'auto', minHeight: 0 }}>
          {editOpen ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Chỉnh sửa hồ sơ</h4>
                <span style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="btn btn-secondary btn-md" style={{ height: 32, padding: '0 12px' }} onClick={cancelEdit}>Huỷ</button>
                  <button type="button" className="btn btn-primary btn-md" style={{ height: 32, padding: '0 12px' }} onClick={saveEdit} disabled={saving}>{saving ? 'Đang lưu…' : 'Lưu'}</button>
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
                <label className="field-wrap"><label>Họ và tên</label><span className="field"><input value={form.name} onChange={setField('name')} /></span></label>
                <label className="field-wrap"><label>Ngày sinh</label><span className="field"><input placeholder="dd/mm/yyyy" value={form.dob} onChange={setField('dob')} /></span></label>
                <label className="field-wrap"><label>Số CCCD</label><span className="field"><input value={form.cccd} onChange={setField('cccd')} /></span></label>
                <label className="field-wrap"><label>Số điện thoại</label><span className="field"><input value={form.phone} onChange={setField('phone')} /></span></label>
                <label className="field-wrap">
                  <label>Chi nhánh</label>
                  <span className="field"><select value={form.branch} onChange={setField('branch')}>
                    <option value="">Chọn chi nhánh</option>
                    {(branchRecords || []).map(b => <option key={b.id || b.name} value={b.name}>{b.name}</option>)}
                  </select></span>
                </label>
                <label className="field-wrap">
                  <label>Vai trò</label>
                  <span className="field"><select value={form.role} onChange={setField('role')}>
                    {STAFF_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select></span>
                </label>
                <label className="field-wrap"><label>Lương / tháng</label><span className="field"><input type="number" min="0" value={form.salary} onChange={setField('salary')} /></span></label>
                <label className="field-wrap"><label>Ngày bắt đầu làm việc</label><span className="field"><input type="date" value={form.startDate} onChange={setField('startDate')} /></span></label>
                <label className="field-wrap">
                  <label>Loại hợp đồng</label>
                  <span className="field"><select value={form.contractType} onChange={setField('contractType')}>
                    {CONTRACT_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select></span>
                </label>
              </div>
            </>
          ) : (
            <>
              <h4 style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Thông tin cá nhân</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
                <InfoBox label="Họ và tên" value={p.name} />
                <InfoBox label="Ngày sinh" value={p.dob} />
                <InfoBox label="Số CCCD" value={p.cccd} mono />
                <InfoBox label="Số điện thoại" value={p.phone} />
              </div>

              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Thông tin công việc</h4>
                <button type="button" className="btn btn-secondary btn-md" style={{ height: 28, padding: '0 10px', fontSize: 12 }} onClick={() => setPauseStaffId(p.id)}>{p.status === 'active' ? 'Cho nghỉ tạm thời' : 'Cho đi làm lại'}</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
                <InfoBox label="Ngày bắt đầu làm việc" value={p.startDate ? fmtDate(p.startDate) : '— chưa cập nhật —'} />
                <InfoBox label="Loại hợp đồng" value={p.contractType || 'Toàn thời gian'} />
                <InfoBox label="Lương / tháng" value={fmtVnd(p.salary || 0)} />
                <InfoBox label="Trạng thái làm việc" value={p.status === 'active' ? 'Đang làm' : 'Tạm nghỉ'} />
              </div>

              <h4 style={{ marginTop: 24, fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Tài khoản đăng nhập</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
                <InfoBox label="Email đăng nhập" value={p.account || '— chưa cập nhật —'} />
              </div>

              {p.role !== 'Quản lý' && <StaffKpi p={p} />}
            </>
          )}

          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Lịch đi làm</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button type="button" className="icon-btn" style={{ width: 28, height: 28 }} onClick={prevMonth}><ChevronLeft /></button>
              <span style={{ fontSize: 13, fontWeight: 600, minWidth: 96, textAlign: 'center' }}>Tháng {staffCalMonth + 1}/{staffCalYear}</span>
              <button type="button" className="icon-btn" style={{ width: 28, height: 28 }} onClick={nextMonth}><ChevronRight /></button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginTop: 14 }}>
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
              <span key={d} style={{ textAlign: 'center', fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-subtle)', paddingBottom: 4 }}>{d}</span>
            ))}
            {cells.map((d, i) => (
              <div key={i} style={{ border: `1px solid ${d.border}`, background: d.bg, borderRadius: 6, padding: '6px 4px', textAlign: 'center', minHeight: 44, display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 600 }}>{d.day}</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: d.text }}>{d.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 11, color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#E7ECE5', border: '1px solid #B7C2B4' }} />Ca sáng</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#F7E9CC', border: '1px solid #C98A2C' }} />Ca chiều</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#F0EBE3', border: '1px solid #D2C4B4' }} />Nghỉ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffKpi({ p }) {
  const [period, setPeriod] = useState('month'); // week | month
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (!supabaseEnabled) return;
    setLoading(true);
    setErr(false);
    const sinceIso = periodStartDate(period).toISOString();
    const fetcher = p.role === 'Bếp'
      ? listOrdersByCook(p.branch, p.name, sinceIso)
      : p.role === 'Thu ngân'
        ? listPaidTableOrdersByCashier(p.branch, p.name, sinceIso)
        : listOrdersByWaiter(p.branch, p.name, sinceIso);
    fetcher
      .then(setOrders)
      .catch(err2 => { console.error('[Supabase] Không tải được KPI nhân viên:', err2); setErr(true); })
      .finally(() => setLoading(false));
  }, [period, p.id, p.role, p.branch, p.name]);

  const count = orders.length;
  const revenue = p.role === 'Thu ngân'
    ? orders.reduce((sum, o) => sum + (o.total - o.discount), 0)
    : orders.reduce((sum, o) => sum + o.total, 0);
  const itemCount = orders.reduce((sum, o) => sum + o.items.reduce((s, [, qty]) => s + qty, 0), 0);

  const countLabel = p.role === 'Bếp' ? 'order đã hoàn thành' : p.role === 'Thu ngân' ? 'giao dịch' : 'order đã tạo';
  const revenueLabel = p.role === 'Thu ngân' ? 'tổng thu' : 'tổng giá trị đơn';

  return (
    <>
      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Hiệu suất làm việc</h4>
        <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--surface-page)', border: '1px solid var(--border)', borderRadius: 999 }}>
          <button type="button" className={`tabp ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>7 ngày qua</button>
          <button type="button" className={`tabp ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>Tháng này</button>
        </div>
      </div>
      {!supabaseEnabled ? (
        <EmptyKpiBox text="Chưa kết nối Supabase — không thể tải hiệu suất thật." />
      ) : loading ? (
        <div style={{ marginTop: 12, height: 60, borderRadius: 'var(--radius-control)', background: 'var(--surface-sunken)', opacity: 0.5 }} />
      ) : err ? (
        <EmptyKpiBox text="Không tải được dữ liệu hiệu suất — thử đóng và mở lại hồ sơ." danger />
      ) : count === 0 ? (
        <EmptyKpiBox text={`Chưa có hoạt động nào trong ${period === 'week' ? '7 ngày qua' : 'tháng này'}.`} />
      ) : (
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <SummaryCard icon={<PackageIcon />} tone="brand" label={countLabel} value={count} />
          <SummaryCard icon={<WalletIcon />} tone="brand" label={revenueLabel} value={fmtVnd(revenue)} />
          <SummaryCard icon={<ItemsMiniIcon />} tone="neutral" label="món" value={itemCount} />
        </div>
      )}
    </>
  );
}

function EmptyKpiBox({ text, danger }) {
  return (
    <div style={{ marginTop: 12, padding: '14px 16px', textAlign: 'center', border: `1px dashed ${danger ? 'var(--danger)' : 'var(--border-strong)'}`, borderRadius: 'var(--radius-control)', fontSize: 13, color: danger ? 'var(--danger-text)' : 'var(--text-muted)' }}>
      {text}
    </div>
  );
}

function InfoBox({ label, value, mono }) {
  return (
    <div style={{ background: 'var(--surface-page)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-control)', padding: '12px 14px' }}>
      <span style={{ display: 'block', fontSize: 'var(--fs-caption)', color: 'var(--text-subtle)' }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 'var(--fs-body-sm)', fontVariantNumeric: mono ? 'tabular-nums' : undefined }}>{value}</span>
    </div>
  );
}

function DeleteStaffDialog({ ctx }) {
  const { staffRecords, deleteStaffId, setDeleteStaffId, setStaffRecords, flash } = ctx;
  const rec = staffRecords.find(s => s.id === deleteStaffId);
  if (!rec) return null;
  function cancel() { setDeleteStaffId(null); }
  function confirm() {
    setStaffRecords(recs => recs.filter(x => x.id !== deleteStaffId));
    setDeleteStaffId(null);
    flash('Đã xoá ' + rec.name + ' khỏi danh sách nhân viên.');
    if (supabaseEnabled) {
      deleteProfileRow(rec.id).catch(err => {
        console.error('[Supabase] Xoá hồ sơ thất bại:', err);
        flash('Không xoá được trên máy chủ — có thể xuất hiện lại sau khi tải lại trang.');
      });
    }
  }
  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 62 }} onClick={cancel}>
      <div role="alertdialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel panel-flush modal-pop" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ padding: 24 }}>
          <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 600 }}>Xoá {rec.name} khỏi hệ thống?</h3>
          <p style={{ marginTop: 8, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>Nhân viên sẽ mất toàn bộ quyền truy cập và bị xoá khỏi danh sách. Không thể hoàn tác.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0 24px 24px' }}>
          <button type="button" className="btn btn-secondary btn-md" onClick={cancel}>Huỷ</button>
          <button type="button" className="btn btn-danger btn-md" onClick={confirm}>Xoá nhân viên</button>
        </div>
      </div>
    </div>
  );
}

function PauseStaffDialog({ ctx }) {
  const { staffRecords, pauseStaffId, setPauseStaffId, setStaffRecords, flash } = ctx;
  const rec = staffRecords.find(s => s.id === pauseStaffId);
  if (!rec) return null;
  const willPause = rec.status === 'active';
  function cancel() { setPauseStaffId(null); }
  function confirm() {
    const next = willPause ? 'paused' : 'active';
    setStaffRecords(recs => recs.map(x => (x.id === rec.id ? { ...x, status: next } : x)));
    setPauseStaffId(null);
    flash(willPause ? 'Đã cho ' + rec.name + ' nghỉ tạm thời.' : 'Đã cho ' + rec.name + ' đi làm lại.');
    if (supabaseEnabled) {
      updateProfileRow(rec.id, { status: next }).catch(err => {
        console.error('[Supabase] Cập nhật trạng thái nhân viên thất bại:', err);
        flash('Không lưu được trạng thái lên máy chủ — thay đổi chỉ có trên trình duyệt này.');
      });
    }
  }
  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 62 }} onClick={cancel}>
      <div role="alertdialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel panel-flush modal-pop" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ padding: 24 }}>
          <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 600 }}>{willPause ? `Cho ${rec.name} nghỉ tạm thời?` : `Cho ${rec.name} đi làm lại?`}</h3>
          <p style={{ marginTop: 8, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>{willPause ? 'Nhân viên sẽ chuyển sang trạng thái tạm nghỉ, có thể cho đi làm lại bất cứ lúc nào.' : 'Nhân viên sẽ trở lại trạng thái đang làm việc bình thường.'}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0 24px 24px' }}>
          <button type="button" className="btn btn-secondary btn-md" onClick={cancel}>Huỷ</button>
          <button type="button" className="btn btn-primary btn-md" onClick={confirm}>{willPause ? 'Cho nghỉ' : 'Cho đi làm lại'}</button>
        </div>
      </div>
    </div>
  );
}
