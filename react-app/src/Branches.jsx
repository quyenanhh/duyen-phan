import { BRANCH_STATUS_STYLE } from './data.js';
import { SearchIcon, XIcon, TrashIcon, EditIcon, PowerIcon, MapPinIcon, PersonIcon } from './icons.jsx';
import SummaryCard from './SummaryCard.jsx';
import { supabaseEnabled, insertBranch, updateBranchRow, deleteBranchRow } from './lib/branchesApi.js';

export default function Branches({ ctx }) {
  const {
    branchRecords, branchQuery, setBranchQuery, branchFilterStatus, setBranchFilterStatus,
    setBranchAddOpen, setBranchAddForm, setBranchAddErrors, setBranchProfileId, setDeleteBranchId, setToggleBranchId
  } = ctx;

  const branchCount = branchRecords.length;
  const openCount = branchRecords.filter(b => b.status === 'open').length;
  const staffTotal = branchRecords.reduce((sum, b) => sum + (b.staffCount || 0), 0);

  const q = branchQuery.trim().toLowerCase();
  const filtered = branchRecords.filter(b => {
    const matchesQuery = !q || b.name.toLowerCase().includes(q) || b.address.toLowerCase().includes(q) || b.manager.toLowerCase().includes(q);
    const matchesStatus = !branchFilterStatus || b.status === branchFilterStatus;
    return matchesQuery && matchesStatus;
  });

  function openAdd() {
    setBranchAddForm({ id: null, name: '', address: '', manager: '', phone: '', hours: '' });
    setBranchAddErrors({});
    setBranchAddOpen(true);
  }
  function openEdit(b, e) {
    e.stopPropagation();
    setBranchAddForm({ id: b.id, name: b.name, address: b.address, manager: b.manager, phone: b.phone, hours: b.hours });
    setBranchAddErrors({});
    setBranchAddOpen(true);
  }

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Chi nhánh</h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{branchCount} chi nhánh trong hệ thống</div>
        </div>
        <button type="button" className="btn btn-primary btn-md" onClick={openAdd}>+ Thêm chi nhánh</button>
      </div>

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <SummaryCard icon={<StoreIcon />} tone="green" label="Tổng chi nhánh" value={branchCount} />
          <SummaryCard icon={<CheckCircleIcon />} tone="blue" label="Đang mở" value={`${openCount} / ${branchCount}`} />
          <SummaryCard icon={<PersonIcon />} tone="clay" label="Tổng nhân sự" value={staffTotal} />
        </div>

        <section className="panel panel-flush">
          <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
            <label className="field-wrap" style={{ width: 280 }}>
              <label>Tìm kiếm</label>
              <span className="field"><SearchIcon style={{ color: 'var(--text-subtle)', flex: '0 0 auto' }} /><input placeholder="Tên, địa chỉ hoặc quản lý" value={branchQuery} onChange={e => setBranchQuery(e.target.value)} /></span>
            </label>
            <label className="field-wrap" style={{ width: 180 }}>
              <label>Trạng thái</label>
              <span className="field"><select value={branchFilterStatus} onChange={e => setBranchFilterStatus(e.target.value)}>
                <option value="">Tất cả trạng thái</option>
                <option value="open">Đang mở</option>
                <option value="closed">Tạm đóng</option>
              </select></span>
            </label>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)', paddingBottom: 10 }}>{filtered.length} / {branchCount} chi nhánh</span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>Không tìm thấy chi nhánh nào khớp với bộ lọc.</div>
          ) : (
            <table style={{ width: '100%', fontSize: 'var(--fs-body-sm)' }}>
              <thead><tr><th>Chi nhánh</th><th>Trạng thái</th><th>Quản lý</th><th>Điện thoại</th><th>Giờ mở cửa</th><th style={{ textAlign: 'right' }}>Nhân sự</th><th style={{ textAlign: 'right' }}>Thao tác</th></tr></thead>
              <tbody>
                {filtered.map(b => {
                  const [stBg, stColor, stLabel] = BRANCH_STATUS_STYLE[b.status] || BRANCH_STATUS_STYLE.open;
                  const toggleLabel = b.status === 'open' ? 'Tạm đóng cửa' : 'Mở cửa lại';
                  return (
                    <tr className="row" key={b.id} style={{ cursor: 'pointer' }} onClick={() => setBranchProfileId(b.id)}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.name}</div>
                        <div style={{ marginTop: 2, fontSize: 12, color: 'var(--text-muted)' }}>{b.address}</div>
                      </td>
                      <td><span className="badge" style={{ background: stBg, color: stColor }}><span className="dot" />{stLabel}</span></td>
                      <td>{b.manager}</td>
                      <td>{b.phone}</td>
                      <td>{b.hours}</td>
                      <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{b.staffCount}</td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button type="button" className="icon-btn" style={{ width: 30, height: 30 }} title="Sửa chi nhánh" onClick={e => openEdit(b, e)}><EditIcon size={14} /></button>
                        <button type="button" className="icon-btn" style={{ width: 30, height: 30, color: 'var(--text-accent)' }} title={toggleLabel} onClick={e => { e.stopPropagation(); setToggleBranchId(b.id); }}><PowerIcon size={14} /></button>
                        <button type="button" className="icon-btn" style={{ width: 30, height: 30, color: 'var(--danger)' }} title="Xoá chi nhánh" onClick={e => { e.stopPropagation(); setDeleteBranchId(b.id); }}><TrashIcon size={14} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <BranchAddDialog ctx={ctx} />
      <BranchProfileDialog ctx={ctx} />
      <DeleteBranchDialog ctx={ctx} />
      <ToggleBranchDialog ctx={ctx} />
    </div>
  );
}

function BranchAddDialog({ ctx }) {
  const { branchAddOpen, setBranchAddOpen, branchAddForm, setBranchAddForm, branchAddErrors, setBranchAddErrors, setBranchRecords, flash } = ctx;
  if (!branchAddOpen) return null;
  const isEdit = !!branchAddForm.id;

  function close() { setBranchAddOpen(false); }
  function setField(key) { return e => { setBranchAddForm({ ...branchAddForm, [key]: e.target.value }); setBranchAddErrors({ ...branchAddErrors, [key]: null }); }; }
  async function submit() {
    const errs = {};
    if (!branchAddForm.name.trim()) errs.name = 'Nhập tên chi nhánh';
    if (!branchAddForm.address.trim()) errs.address = 'Nhập địa chỉ';
    if (!branchAddForm.manager.trim()) errs.manager = 'Nhập tên quản lý phụ trách';
    if (!branchAddForm.phone.trim()) errs.phone = 'Nhập số điện thoại';
    if (!branchAddForm.hours.trim()) errs.hours = 'Nhập giờ mở cửa';
    if (Object.keys(errs).length) { setBranchAddErrors(errs); return; }

    const payload = {
      name: branchAddForm.name.trim(), address: branchAddForm.address.trim(), manager: branchAddForm.manager.trim(),
      phone: branchAddForm.phone.trim(), hours: branchAddForm.hours.trim()
    };

    if (isEdit) {
      setBranchRecords(recs => recs.map(b => (b.id === branchAddForm.id ? { ...b, ...payload } : b)));
      setBranchAddOpen(false);
      flash('Đã cập nhật chi nhánh ' + payload.name + '.');
      if (supabaseEnabled) {
        try { await updateBranchRow(branchAddForm.id, payload); }
        catch (err) { console.error('[Supabase] Cập nhật chi nhánh thất bại:', err); flash('Không lưu được lên máy chủ — thay đổi chỉ có trên trình duyệt này.'); }
      }
    } else {
      setBranchAddOpen(false);
      const localRec = { id: Date.now(), ...payload, opened: new Date().toLocaleDateString('vi-VN'), status: 'open', staffCount: 0 };
      if (supabaseEnabled) {
        try {
          const created = await insertBranch(localRec);
          setBranchRecords(recs => [created, ...recs]);
          flash('Đã thêm chi nhánh ' + created.name + ' vào hệ thống.');
        } catch (err) {
          console.error('[Supabase] Thêm chi nhánh thất bại:', err);
          setBranchRecords(recs => [localRec, ...recs]);
          flash('Không lưu được lên máy chủ — đã thêm tạm trên trình duyệt này.');
        }
      } else {
        setBranchRecords(recs => [localRec, ...recs]);
        flash('Đã thêm chi nhánh ' + localRec.name + ' vào hệ thống.');
      }
    }
  }

  const borderFor = k => (branchAddErrors[k] ? 'var(--danger)' : 'var(--border-strong)');

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 60 }} onClick={close}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel panel-flush modal-pop" style={{ width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '24px 24px 0' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 600 }}>{isEdit ? 'Sửa chi nhánh' : 'Thêm chi nhánh'}</h3>
            <p style={{ marginTop: 6, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>{isEdit ? 'Cập nhật thông tin chi nhánh.' : 'Nhập thông tin chi nhánh mới vào hệ thống.'}</p>
          </div>
          <button type="button" className="icon-btn" style={{ width: 32, height: 32 }} onClick={close}><XIcon /></button>
        </div>
        <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label className="field-wrap">
            <label>Tên chi nhánh</label>
            <span className="field" style={{ borderColor: borderFor('name') }}><input placeholder="Quận 8 — Tùng Thiện Vương" value={branchAddForm.name} onChange={setField('name')} /></span>
            {branchAddErrors.name && <span className="err-msg">{branchAddErrors.name}</span>}
          </label>
          <label className="field-wrap">
            <label>Địa chỉ</label>
            <span className="field" style={{ borderColor: borderFor('address') }}><input placeholder="Số nhà, đường, phường, quận" value={branchAddForm.address} onChange={setField('address')} /></span>
            {branchAddErrors.address && <span className="err-msg">{branchAddErrors.address}</span>}
          </label>
          <label className="field-wrap">
            <label>Quản lý phụ trách</label>
            <span className="field" style={{ borderColor: borderFor('manager') }}><input placeholder="Nguyễn Văn A" value={branchAddForm.manager} onChange={setField('manager')} /></span>
            {branchAddErrors.manager && <span className="err-msg">{branchAddErrors.manager}</span>}
          </label>
          <label className="field-wrap">
            <label>Số điện thoại</label>
            <span className="field" style={{ borderColor: borderFor('phone') }}><input placeholder="028 xxxx xxxx" value={branchAddForm.phone} onChange={setField('phone')} /></span>
            {branchAddErrors.phone && <span className="err-msg">{branchAddErrors.phone}</span>}
          </label>
          <label className="field-wrap">
            <label>Giờ mở cửa</label>
            <span className="field" style={{ borderColor: borderFor('hours') }}><input placeholder="06:30 – 21:00" value={branchAddForm.hours} onChange={setField('hours')} /></span>
            {branchAddErrors.hours && <span className="err-msg">{branchAddErrors.hours}</span>}
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 24 }}>
          <button type="button" className="btn btn-secondary btn-md" onClick={close}>Huỷ</button>
          <button type="button" className="btn btn-primary btn-md" onClick={submit}>{isEdit ? 'Lưu thay đổi' : 'Thêm chi nhánh'}</button>
        </div>
      </div>
    </div>
  );
}

function BranchProfileDialog({ ctx }) {
  const { branchRecords, branchProfileId, setBranchProfileId } = ctx;
  const b = branchRecords.find(x => x.id === branchProfileId);
  if (!b) return null;
  const [stBg, stColor, stLabel] = BRANCH_STATUS_STYLE[b.status] || BRANCH_STATUS_STYLE.open;
  function close() { setBranchProfileId(null); }

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 60 }} onClick={close}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel panel-flush modal-pop" style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ background: 'var(--green-100)', padding: '28px 56px 28px 28px', position: 'relative' }}>
          <button type="button" className="icon-btn" style={{ width: 32, height: 32, position: 'absolute', top: 16, right: 16, background: 'var(--surface-card)' }} onClick={close}><XIcon /></button>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ flex: '0 0 auto', width: 48, height: 48, borderRadius: 12, background: 'var(--surface-card)', display: 'grid', placeItems: 'center', color: 'var(--brand)' }}><MapPinIcon size={22} /></span>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.3 }}>{b.name}</div>
              <span className="badge" style={{ background: stBg, color: stColor, width: 'fit-content' }}><span className="dot" />{stLabel}</span>
            </div>
          </div>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <InfoBox label="Địa chỉ" value={b.address} span2 />
            <InfoBox label="Quản lý phụ trách" value={b.manager} />
            <InfoBox label="Số điện thoại" value={b.phone} />
            <InfoBox label="Giờ mở cửa" value={b.hours} />
            <InfoBox label="Ngày khai trương" value={b.opened} />
            <InfoBox label="Nhân sự" value={b.staffCount + ' người'} span2 />
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1-5h16l1 5" /><path d="M4 9v10h16V9" /><path d="M9 21v-6h6v6" /></svg>; }
function CheckCircleIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.5 2.5 4.5-5" /></svg>; }
function InfoBox({ label, value, span2 }) {
  return (
    <div style={{ gridColumn: span2 ? 'span 2' : undefined, background: 'var(--surface-page)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-control)', padding: '12px 14px' }}>
      <span style={{ display: 'block', fontSize: 'var(--fs-caption)', color: 'var(--text-subtle)' }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 'var(--fs-body-sm)' }}>{value}</span>
    </div>
  );
}

function DeleteBranchDialog({ ctx }) {
  const { branchRecords, deleteBranchId, setDeleteBranchId, setBranchRecords, flash } = ctx;
  const rec = branchRecords.find(b => b.id === deleteBranchId);
  if (!rec) return null;
  function cancel() { setDeleteBranchId(null); }
  function confirm() {
    setBranchRecords(recs => recs.filter(x => x.id !== deleteBranchId));
    setDeleteBranchId(null);
    flash('Đã xoá chi nhánh ' + rec.name + ' khỏi hệ thống.');
    if (supabaseEnabled) {
      deleteBranchRow(rec.id).catch(err => {
        console.error('[Supabase] Xoá chi nhánh thất bại:', err);
        flash('Không xoá được trên máy chủ — chi nhánh có thể xuất hiện lại sau khi tải lại trang.');
      });
    }
  }
  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 62 }} onClick={cancel}>
      <div role="alertdialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel panel-flush modal-pop" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ padding: 24 }}>
          <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 600 }}>Xoá {rec.name} khỏi hệ thống?</h3>
          <p style={{ marginTop: 8, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>Toàn bộ dữ liệu chi nhánh sẽ bị xoá. Không thể hoàn tác.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0 24px 24px' }}>
          <button type="button" className="btn btn-secondary btn-md" onClick={cancel}>Huỷ</button>
          <button type="button" className="btn btn-danger btn-md" onClick={confirm}>Xoá chi nhánh</button>
        </div>
      </div>
    </div>
  );
}

function ToggleBranchDialog({ ctx }) {
  const { branchRecords, toggleBranchId, setToggleBranchId, setBranchRecords, flash } = ctx;
  const rec = branchRecords.find(b => b.id === toggleBranchId);
  if (!rec) return null;
  const willClose = rec.status === 'open';
  function cancel() { setToggleBranchId(null); }
  function confirm() {
    const next = willClose ? 'closed' : 'open';
    setBranchRecords(recs => recs.map(x => (x.id === rec.id ? { ...x, status: next } : x)));
    setToggleBranchId(null);
    flash(willClose ? 'Đã tạm đóng cửa ' + rec.name + '.' : 'Đã mở cửa lại ' + rec.name + '.');
    if (supabaseEnabled) {
      updateBranchRow(rec.id, { status: next }).catch(err => {
        console.error('[Supabase] Cập nhật trạng thái chi nhánh thất bại:', err);
        flash('Không lưu được trạng thái lên máy chủ — thay đổi chỉ có trên trình duyệt này.');
      });
    }
  }
  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 62 }} onClick={cancel}>
      <div role="alertdialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel panel-flush modal-pop" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ padding: 24 }}>
          <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 600 }}>{willClose ? `Tạm đóng cửa ${rec.name}?` : `Mở cửa lại ${rec.name}?`}</h3>
          <p style={{ marginTop: 8, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>{willClose ? 'Chi nhánh sẽ chuyển sang trạng thái tạm đóng, có thể mở cửa lại bất cứ lúc nào.' : 'Chi nhánh sẽ trở lại hoạt động bình thường.'}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0 24px 24px' }}>
          <button type="button" className="btn btn-secondary btn-md" onClick={cancel}>Huỷ</button>
          <button type="button" className="btn btn-primary btn-md" onClick={confirm}>{willClose ? 'Tạm đóng cửa' : 'Mở cửa lại'}</button>
        </div>
      </div>
    </div>
  );
}
