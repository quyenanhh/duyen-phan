import { useEffect, useState } from 'react';
import { MENU_CATEGORIES, MENU_STATUS_STYLE } from './data.js';
import { fmtVnd } from './utils.js';
import { SearchIcon, CheckIcon } from './icons.jsx';
import SiteHeader from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';
import { pickDishArt } from './dishArt.jsx';
import { supabaseEnabled, listVisibleMenuItems } from './lib/menuApi.js';

const SORTS = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price-asc', label: 'Giá thấp → cao' },
  { value: 'price-desc', label: 'Giá cao → thấp' },
  { value: 'name-asc', label: 'Tên A → Z' }
];

// Thứ tự nhóm danh mục ưu tiên — danh mục nào không có trong danh sách này (nếu quản
// lý thêm danh mục mới sau này) vẫn hiển thị, chỉ xếp sau cùng theo bảng chữ cái.
function orderCategories(categoriesPresent) {
  const known = MENU_CATEGORIES.filter(c => categoriesPresent.includes(c));
  const extra = categoriesPresent.filter(c => !MENU_CATEGORIES.includes(c)).sort((a, b) => a.localeCompare(b, 'vi'));
  return [...known, ...extra];
}

export default function MenuPage({ ctx }) {
  const { theme, menuRecords } = ctx;
  const themeClass = theme === 'dark' ? 'dark-mode' : '';

  const [items, setItems] = useState(null); // null = đang tải
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAvailable, setShowAvailable] = useState(true);
  const [showSoldout, setShowSoldout] = useState(true);
  const [priceBounds, setPriceBounds] = useState(null); // [min, max] toàn thực đơn
  const [priceRange, setPriceRange] = useState(null); // [min, max] đang chọn
  const [sort, setSort] = useState('default');

  useEffect(() => {
    let cancelled = false;
    if (!supabaseEnabled) {
      setItems(menuRecords.filter(m => m.visible !== false));
      return;
    }
    listVisibleMenuItems()
      .then(data => { if (!cancelled) setItems(data); })
      .catch(err => {
        console.error('[Supabase] Không tải được thực đơn công khai, dùng dữ liệu đã có:', err);
        if (!cancelled) {
          setItems(menuRecords.filter(m => m.visible !== false));
          setLoadError(true);
        }
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const prices = items.map(m => m.price);
    const bounds = [Math.min(...prices), Math.max(...prices)];
    setPriceBounds(bounds);
    setPriceRange(bounds);
  }, [items]);

  const loading = items === null;
  const totalCount = items ? items.length : 0;

  const q = query.trim().toLowerCase();
  const [rangeLo, rangeHi] = priceRange || [0, Infinity];
  const filtered = (items || []).filter(m => {
    const matchesQuery = !q || m.name.toLowerCase().includes(q) || (m.desc || '').toLowerCase().includes(q);
    const matchesCategory = !categoryFilter || m.category === categoryFilter;
    const matchesStatus = m.status === 'soldout' ? showSoldout : showAvailable;
    const matchesPrice = m.price >= rangeLo && m.price <= rangeHi;
    return matchesQuery && matchesCategory && matchesStatus && matchesPrice;
  });

  const categoriesPresent = [...new Set((items || []).map(m => m.category))];
  const orderedCategories = orderCategories(categoriesPresent);
  const catRank = Object.fromEntries(orderedCategories.map((c, i) => [c, i]));

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'name-asc') return a.name.localeCompare(b.name, 'vi');
    const ca = catRank[a.category] ?? 999, cb = catRank[b.category] ?? 999;
    return ca !== cb ? ca - cb : a.name.localeCompare(b.name, 'vi');
  });

  const filtersActive = !!categoryFilter || !showAvailable || !showSoldout || query.trim() ||
    (priceBounds && priceRange && (priceRange[0] !== priceBounds[0] || priceRange[1] !== priceBounds[1]));

  function clearAll() {
    setQuery(''); setCategoryFilter(''); setShowAvailable(true); setShowSoldout(true);
    if (priceBounds) setPriceRange(priceBounds);
  }

  return (
    <div className={`landing-scope ${themeClass}`} style={{ background: 'var(--surface-page)', minHeight: '100vh' }}>
      <SiteHeader ctx={ctx} active="menu" />

      <section style={{ padding: '48px 0 28px' }}>
        <div className="wrap">
          <div style={{ fontSize: 13, color: 'var(--text-subtle)' }}>Trang chủ / <span style={{ color: 'var(--text-brand)', fontWeight: 600 }}>Thực đơn đầy đủ</span></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 10 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 38, lineHeight: 1.15, letterSpacing: '-0.02em', fontWeight: 600, color: 'var(--text-brand)' }}>Thực đơn đầy đủ</h1>
              <p style={{ marginTop: 8, fontSize: 'var(--fs-body-lg)', color: 'var(--text-muted)' }}>
                {loading ? 'Đang tải danh sách món…' : `${totalCount} món chay đang phục vụ, cập nhật trực tiếp từ hệ thống.`}
              </p>
            </div>
            <label className="field-wrap" style={{ width: 320 }}>
              <span className="field" style={{ borderRadius: 'var(--radius-pill)', height: 48, padding: '0 18px' }}>
                <SearchIcon style={{ color: 'var(--text-subtle)', flex: '0 0 auto' }} />
                <input placeholder="Tìm món, ví dụ: canh chua, trà đào…" value={query} onChange={e => setQuery(e.target.value)} />
              </span>
            </label>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 96px' }}>
        <div className="wrap" style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          <aside style={{ flex: '0 0 260px', position: 'sticky', top: 96 }}>
            <div className="panel" style={{ padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Bộ lọc</h3>
                {filtersActive && <a onClick={clearAll} style={{ fontSize: 12.5, fontWeight: 600, cursor: 'pointer', color: 'var(--text-accent)' }}>Xoá tất cả</a>}
              </div>

              <h4 style={{ marginTop: 20, fontSize: 12, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Danh mục</h4>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <FilterChk checked={!categoryFilter} onClick={() => setCategoryFilter('')}>Tất cả</FilterChk>
                {orderCategories(MENU_CATEGORIES).map(c => (
                  <FilterChk key={c} checked={categoryFilter === c} onClick={() => setCategoryFilter(c)}>{c}</FilterChk>
                ))}
              </div>

              {priceBounds && priceBounds[0] < priceBounds[1] && (
                <>
                  <h4 style={{ marginTop: 22, fontSize: 12, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Khoảng giá</h4>
                  <div style={{ marginTop: 16, position: 'relative', height: 16 }}>
                    <div className="range-track" />
                    <div className="range-fill" style={{
                      left: `${((priceRange[0] - priceBounds[0]) / (priceBounds[1] - priceBounds[0])) * 100}%`,
                      right: `${100 - ((priceRange[1] - priceBounds[0]) / (priceBounds[1] - priceBounds[0])) * 100}%`
                    }} />
                    <input type="range" className="range-thumb" min={priceBounds[0]} max={priceBounds[1]} value={priceRange[0]}
                      onChange={e => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])} />
                    <input type="range" className="range-thumb" min={priceBounds[0]} max={priceBounds[1]} value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12.5, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                    <span>{fmtVnd(priceRange[0])}</span>
                    <span>{fmtVnd(priceRange[1])}</span>
                  </div>
                </>
              )}

              <h4 style={{ marginTop: 22, fontSize: 12, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Tình trạng</h4>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <FilterChk checked={showAvailable} onClick={() => setShowAvailable(v => !v)}>Còn món</FilterChk>
                <FilterChk checked={showSoldout} onClick={() => setShowSoldout(v => !v)}>Hết món</FilterChk>
              </div>
            </div>
          </aside>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{loading ? 'Đang tải…' : `${sorted.length} món`}</span>
              <label className="field-wrap" style={{ width: 200 }}>
                <span className="field"><select value={sort} onChange={e => setSort(e.target.value)}>
                  {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select></span>
              </label>
            </div>

            <div style={{ marginTop: 20 }}>
              {loading && <MenuSkeleton />}

              {!loading && totalCount === 0 && (
                <EmptyMenuState text="Hiện chưa có món ăn trong thực đơn." />
              )}

              {!loading && totalCount > 0 && sorted.length === 0 && (
                <EmptyMenuState text="Không tìm thấy món phù hợp. Thử đổi bộ lọc hoặc từ khoá." onClear={clearAll} />
              )}

              {!loading && sorted.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 22 }}>
                  {sorted.map(m => <MenuDishCard key={m.id} item={m} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter ctx={ctx} />
    </div>
  );
}

function FilterChk({ checked, onClick, children }) {
  return (
    <label className="chk" onClick={onClick} style={{ fontSize: 13.5 }}>
      <span className="chk-box" style={{ background: checked ? 'var(--brand)' : 'var(--surface-card)', border: `1px solid ${checked ? 'var(--brand)' : 'var(--border-strong)'}` }}>
        {checked && <CheckIcon />}
      </span>
      {children}
    </label>
  );
}

function MenuDishCard({ item }) {
  const Art = pickDishArt(item);
  const isSoldout = item.status === 'soldout';
  const [stBg, stColor, stLabel] = MENU_STATUS_STYLE[item.status] || MENU_STATUS_STYLE.available;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative' }}>
        <div className="photo-card" style={{ height: 180, padding: 16, opacity: isSoldout ? .6 : 1 }}><Art /></div>
        <span className="badge" style={{ position: 'absolute', left: 10, top: 10, background: stBg, color: stColor }}><span className="dot" />{stLabel}</span>
        <span style={{ position: 'absolute', right: 12, bottom: 12, background: 'var(--surface-card)', boxShadow: 'var(--shadow-card)', borderRadius: 999, padding: '5px 12px', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--text-accent)' }}>{fmtVnd(item.price)}</span>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>{item.name}</h3>
      {item.desc && <p style={{ marginTop: 6, fontSize: 'var(--fs-caption)', color: 'var(--text-subtle)' }}>{item.desc}</p>}
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 22 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="photo-card" style={{ height: 180, background: 'var(--surface-sunken)' }} />
          <div style={{ height: 16, width: '70%', background: 'var(--surface-sunken)', borderRadius: 4, marginTop: 14 }} />
          <div style={{ height: 12, width: '90%', background: 'var(--surface-sunken)', borderRadius: 4, marginTop: 8 }} />
        </div>
      ))}
    </div>
  );
}

function EmptyMenuState({ text, onClear }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-card)' }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-subtle)', margin: '0 auto' }}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
      <p style={{ marginTop: 16, fontSize: 'var(--fs-body-lg)', color: 'var(--text-muted)' }}>{text}</p>
      {onClear && <button type="button" className="btn btn-secondary btn-md" style={{ marginTop: 16 }} onClick={onClear}>Xoá bộ lọc</button>}
    </div>
  );
}
