import { MENU_CATEGORIES, MENU_STATUS_STYLE } from './data.js';
import { fmtVnd } from './utils.js';
import { SearchIcon, XIcon, TrashIcon, EditIcon, EyeIcon, EyeOffIcon, PowerIcon } from './icons.jsx';
import { pickDishArt } from './dishArt.jsx';
import { supabaseEnabled, insertMenuItem, updateMenuItemRow, deleteMenuItemRow } from './lib/menuApi.js';
import SummaryCard from './SummaryCard.jsx';

export default function Menu({ ctx }) {
  const {
    menuRecords, menuQuery, setMenuQuery, menuFilterCategory, setMenuFilterCategory, menuFilterStatus, setMenuFilterStatus,
    setMenuAddOpen, setMenuAddForm, setMenuAddErrors, setDeleteMenuId, setMenuRecords, flash
  } = ctx;

  const menuCount = menuRecords.length;
  const availableCount = menuRecords.filter(m => m.status === 'available').length;
  const soldoutCount = menuCount - availableCount;

  const q = menuQuery.trim().toLowerCase();
  const filtered = menuRecords.filter(m => {
    const matchesQuery = !q || m.name.toLowerCase().includes(q);
    const matchesCategory = !menuFilterCategory || m.category === menuFilterCategory;
    const matchesStatus = !menuFilterStatus || m.status === menuFilterStatus;
    return matchesQuery && matchesCategory && matchesStatus;
  });

  function openAdd() {
    setMenuAddForm({ id: null, name: '', category: '', price: '', status: 'available', desc: '', visible: true });
    setMenuAddErrors({});
    setMenuAddOpen(true);
  }
  function openEdit(m) {
    setMenuAddForm({ id: m.id, name: m.name, category: m.category, price: String(m.price), status: m.status, desc: m.desc, visible: m.visible !== false });
    setMenuAddErrors({});
    setMenuAddOpen(true);
  }
  function toggleStatus(m) {
    const next = m.status === 'available' ? 'soldout' : 'available';
    setMenuRecords(recs => recs.map(x => (x.id === m.id ? { ...x, status: next } : x)));
    flash(next === 'soldout' ? 'Đã đánh dấu hết hàng: ' + m.name : 'Đã mở bán lại: ' + m.name);
    if (supabaseEnabled) {
      updateMenuItemRow(m.id, { status: next }).catch(err => {
        console.error('[Supabase] Cập nhật trạng thái món thất bại:', err);
        flash('Không lưu được trạng thái lên máy chủ — thay đổi chỉ có trên trình duyệt này.');
      });
    }
  }
  function toggleVisible(m) {
    const next = !(m.visible !== false);
    setMenuRecords(recs => recs.map(x => (x.id === m.id ? { ...x, visible: next } : x)));
    flash(next ? 'Đã hiện ' + m.name + ' trên thực đơn công khai.' : 'Đã ẩn ' + m.name + ' khỏi thực đơn công khai.');
    if (supabaseEnabled) {
      updateMenuItemRow(m.id, { visible: next }).catch(err => {
        console.error('[Supabase] Cập nhật hiển thị món thất bại:', err);
        flash('Không lưu được lên máy chủ — thay đổi chỉ có trên trình duyệt này.');
      });
    }
  }

  return (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--surface-page)' }}>
      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Thực đơn</h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{menuCount} món trong thực đơn</div>
        </div>
        <button type="button" className="btn btn-primary btn-md" onClick={openAdd}>+ Thêm món</button>
      </div>

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <SummaryCard icon={<ListSmallIcon />} tone="neutral" label="Tổng số món" value={menuCount} />
          <SummaryCard icon={<CheckCircleIcon />} tone="brand" label="Đang bán" value={availableCount} />
          <SummaryCard icon={<XCircleIcon />} tone="warn" label="Hết hàng" value={soldoutCount} accent={soldoutCount > 0} accentColor="var(--danger)" />
        </div>

        <section className="panel panel-flush">
          <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
            <label className="field-wrap" style={{ width: 240 }}>
              <label>Tìm kiếm</label>
              <span className="field"><SearchIcon style={{ color: 'var(--text-subtle)', flex: '0 0 auto' }} /><input placeholder="Tên món" value={menuQuery} onChange={e => setMenuQuery(e.target.value)} /></span>
            </label>
            <label className="field-wrap" style={{ width: 200 }}>
              <label>Danh mục</label>
              <span className="field"><select value={menuFilterCategory} onChange={e => setMenuFilterCategory(e.target.value)}>
                <option value="">Tất cả danh mục</option>
                {MENU_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select></span>
            </label>
            <label className="field-wrap" style={{ width: 180 }}>
              <label>Trạng thái</label>
              <span className="field"><select value={menuFilterStatus} onChange={e => setMenuFilterStatus(e.target.value)}>
                <option value="">Tất cả trạng thái</option>
                <option value="available">Còn hàng</option>
                <option value="soldout">Hết hàng</option>
              </select></span>
            </label>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)', paddingBottom: 10 }}>{filtered.length} / {menuCount} món</span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>Không tìm thấy món phù hợp.</div>
          ) : (
            <table style={{ width: '100%', fontSize: 'var(--fs-body-sm)' }}>
              <thead><tr><th>Món</th><th>Danh mục</th><th style={{ textAlign: 'right' }}>Giá</th><th>Trạng thái</th><th>Hiển thị</th><th style={{ textAlign: 'right' }}>Thao tác</th></tr></thead>
              <tbody>
                {filtered.map(m => {
                  const Art = pickDishArt(m);
                  const [stBg, stColor, stLabel] = MENU_STATUS_STYLE[m.status] || MENU_STATUS_STYLE.available;
                  const isSoldout = m.status === 'soldout';
                  const isVisible = m.visible !== false;
                  const toggleTitle = isSoldout ? 'Mở bán lại' : 'Đánh dấu hết hàng';
                  return (
                    <tr className="row" key={m.id} style={{ cursor: 'pointer' }} onClick={() => openEdit(m)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="photo-card" style={{ width: 40, height: 40, flex: '0 0 auto', padding: 6, opacity: isSoldout ? .55 : 1 }}><Art /></div>
                          <span style={{ fontWeight: 600 }}>{m.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{m.category}</td>
                      <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtVnd(m.price)}</td>
                      <td><span className="badge" style={{ background: stBg, color: stColor }}><span className="dot" />{stLabel}</span></td>
                      <td>{isVisible ? <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Công khai</span> : <span className="badge" style={{ background: '#F0EBE3', color: '#8A948F' }}>Đã ẩn</span>}</td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button type="button" className="icon-btn" style={{ width: 30, height: 30 }} title="Sửa món" onClick={e => { e.stopPropagation(); openEdit(m); }}><EditIcon size={14} /></button>
                        <button type="button" className="icon-btn" style={{ width: 30, height: 30, color: 'var(--text-accent)' }} title={toggleTitle} onClick={e => { e.stopPropagation(); toggleStatus(m); }}><PowerIcon size={14} /></button>
                        <button type="button" className="icon-btn" style={{ width: 30, height: 30, color: isVisible ? 'var(--text-muted)' : 'var(--brand)' }} title={isVisible ? 'Ẩn khỏi thực đơn công khai' : 'Hiện trên thực đơn công khai'} onClick={e => { e.stopPropagation(); toggleVisible(m); }}>
                          {isVisible ? <EyeIcon size={14} /> : <EyeOffIcon size={14} />}
                        </button>
                        <button type="button" className="icon-btn" style={{ width: 30, height: 30, color: 'var(--danger)' }} title="Xoá món" onClick={e => { e.stopPropagation(); setDeleteMenuId(m.id); }}><TrashIcon size={14} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <MenuAddDialog ctx={ctx} />
      <DeleteMenuDialog ctx={ctx} />
    </div>
  );
}

function ListSmallIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" /></svg>;
}
function CheckCircleIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 5-5" /></svg>;
}
function XCircleIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m9.5 9.5 5 5M14.5 9.5l-5 5" /></svg>;
}

function MenuAddDialog({ ctx }) {
  const { menuAddOpen, setMenuAddOpen, menuAddForm, setMenuAddForm, menuAddErrors, setMenuAddErrors, setMenuRecords, flash } = ctx;
  if (!menuAddOpen) return null;
  const isEdit = !!menuAddForm.id;

  function close() { setMenuAddOpen(false); }
  function setField(key) { return e => { setMenuAddForm({ ...menuAddForm, [key]: e.target.value }); setMenuAddErrors({ ...menuAddErrors, [key]: null }); }; }
  async function submit() {
    const errs = {};
    if (!menuAddForm.name.trim()) errs.name = 'Nhập tên món';
    if (!menuAddForm.category) errs.category = 'Chọn danh mục';
    const priceNum = Number(menuAddForm.price);
    if (!menuAddForm.price || !Number.isFinite(priceNum) || priceNum <= 0) errs.price = 'Nhập giá hợp lệ';
    if (Object.keys(errs).length) { setMenuAddErrors(errs); return; }

    const payload = { name: menuAddForm.name.trim(), category: menuAddForm.category, price: priceNum, status: menuAddForm.status || 'available', desc: menuAddForm.desc.trim(), visible: menuAddForm.visible !== false };

    if (isEdit) {
      setMenuRecords(recs => recs.map(m => (m.id === menuAddForm.id ? { ...m, ...payload } : m)));
      setMenuAddOpen(false);
      flash('Đã cập nhật món ' + payload.name + '.');
      if (supabaseEnabled) {
        try { await updateMenuItemRow(menuAddForm.id, payload); }
        catch (err) { console.error('[Supabase] Cập nhật món thất bại:', err); flash('Không lưu được lên máy chủ — thay đổi chỉ có trên trình duyệt này.'); }
      }
    } else {
      setMenuAddOpen(false);
      const localRec = { id: Date.now(), ...payload };
      if (supabaseEnabled) {
        try {
          const created = await insertMenuItem(payload);
          setMenuRecords(recs => [created, ...recs]);
          flash('Đã thêm món ' + created.name + ' vào thực đơn.');
        } catch (err) {
          console.error('[Supabase] Thêm món thất bại:', err);
          setMenuRecords(recs => [localRec, ...recs]);
          flash('Không lưu được lên máy chủ — đã thêm tạm trên trình duyệt này.');
        }
      } else {
        setMenuRecords(recs => [localRec, ...recs]);
        flash('Đã thêm món ' + localRec.name + ' vào thực đơn.');
      }
    }
  }

  const borderFor = k => (menuAddErrors[k] ? 'var(--danger)' : 'var(--border-strong)');

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 60 }} onClick={close}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel panel-flush modal-pop" style={{ width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '24px 24px 0' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 600 }}>{isEdit ? 'Sửa món' : 'Thêm món'}</h3>
            <p style={{ marginTop: 6, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>{isEdit ? 'Cập nhật thông tin món trong thực đơn.' : 'Nhập thông tin món mới vào thực đơn.'}</p>
          </div>
          <button type="button" className="icon-btn" style={{ width: 32, height: 32 }} onClick={close}><XIcon /></button>
        </div>
        <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label className="field-wrap">
            <label>Ảnh món</label>
            <DishPreview name={menuAddForm.name} category={menuAddForm.category} />
          </label>
          <label className="field-wrap">
            <label>Tên món</label>
            <span className="field" style={{ borderColor: borderFor('name') }}><input placeholder="Cơm phần đậu hũ sả ớt" value={menuAddForm.name} onChange={setField('name')} /></span>
            {menuAddErrors.name && <span className="err-msg">{menuAddErrors.name}</span>}
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Danh mục</label>
              <span className="field" style={{ borderColor: borderFor('category') }}><select value={menuAddForm.category} onChange={setField('category')}>
                <option value="">— Chọn danh mục —</option>
                {MENU_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select></span>
              {menuAddErrors.category && <span className="err-msg">{menuAddErrors.category}</span>}
            </label>
            <label className="field-wrap" style={{ flex: 1 }}>
              <label>Giá (₫)</label>
              <span className="field" style={{ borderColor: borderFor('price') }}><input inputMode="numeric" placeholder="45000" value={menuAddForm.price} onChange={setField('price')} /></span>
              {menuAddErrors.price && <span className="err-msg">{menuAddErrors.price}</span>}
            </label>
          </div>
          <label className="field-wrap">
            <label>Trạng thái</label>
            <span className="field"><select value={menuAddForm.status} onChange={setField('status')}>
              <option value="available">Còn hàng</option>
              <option value="soldout">Hết hàng</option>
            </select></span>
          </label>
          <label className="chk" style={{ marginTop: 4 }}>
            <span className="chk-box" style={{ background: menuAddForm.visible !== false ? 'var(--brand)' : 'var(--surface-card)', border: `1px solid ${menuAddForm.visible !== false ? 'var(--brand)' : 'var(--border-strong)'}` }}
              onClick={() => setMenuAddForm({ ...menuAddForm, visible: !(menuAddForm.visible !== false) })}>
              {menuAddForm.visible !== false && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-on-brand)' }}><path d="M20 6 9 17l-5-5" /></svg>}
            </span>
            <span onClick={() => setMenuAddForm({ ...menuAddForm, visible: !(menuAddForm.visible !== false) })} style={{ cursor: 'pointer' }}>Hiển thị món này trên thực đơn công khai (/menu)</span>
          </label>
          <label className="field-wrap">
            <label>Mô tả ngắn</label>
            <textarea rows={3} placeholder="Mô tả thành phần chính của món" value={menuAddForm.desc} onChange={setField('desc')}
              style={{ width: '100%', resize: 'vertical', padding: '10px 12px', borderRadius: 'var(--radius-control)', border: '1px solid var(--border-strong)', fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-body-sm)', color: 'var(--text-body)', background: 'var(--surface-card)' }} />
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 24 }}>
          <button type="button" className="btn btn-secondary btn-md" onClick={close}>Huỷ</button>
          <button type="button" className="btn btn-primary btn-md" onClick={submit}>{isEdit ? 'Lưu thay đổi' : 'Thêm món'}</button>
        </div>
      </div>
    </div>
  );
}

function DeleteMenuDialog({ ctx }) {
  const { menuRecords, deleteMenuId, setDeleteMenuId, setMenuRecords, flash } = ctx;
  const rec = menuRecords.find(m => m.id === deleteMenuId);
  if (!rec) return null;
  function cancel() { setDeleteMenuId(null); }
  function confirm() {
    setMenuRecords(recs => recs.filter(x => x.id !== deleteMenuId));
    setDeleteMenuId(null);
    flash('Đã xoá ' + rec.name + ' khỏi thực đơn.');
    if (supabaseEnabled) {
      deleteMenuItemRow(rec.id).catch(err => {
        console.error('[Supabase] Xoá món thất bại:', err);
        flash('Không xoá được trên máy chủ — món có thể xuất hiện lại sau khi tải lại trang.');
      });
    }
  }
  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(46,42,34,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 62 }} onClick={cancel}>
      <div role="alertdialog" aria-modal="true" onClick={e => e.stopPropagation()} className="panel panel-flush modal-pop" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ padding: 24 }}>
          <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 600 }}>Xoá {rec.name} khỏi thực đơn?</h3>
          <p style={{ marginTop: 8, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)' }}>Món sẽ không còn hiển thị trong thực đơn. Không thể hoàn tác.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0 24px 24px' }}>
          <button type="button" className="btn btn-secondary btn-md" onClick={cancel}>Huỷ</button>
          <button type="button" className="btn btn-danger btn-md" onClick={confirm}>Xoá món</button>
        </div>
      </div>
    </div>
  );
}

function DishPreview({ name, category }) {
  const Art = pickDishArt({ name: name || '', category: category || '' });
  return (
    <div>
      <div className="photo-card" style={{ width: '100%', height: 140, padding: 20 }}><Art /></div>
      <span style={{ display: 'block', marginTop: 8, fontSize: 11.5, fontStyle: 'italic', color: 'var(--text-subtle)', textAlign: 'center' }}>Minh hoạ tự động theo danh mục — chưa hỗ trợ tải ảnh thật</span>
    </div>
  );
}
