import SiteHeader from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';

const PIN_D = 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z';

export default function BranchesPage({ ctx }) {
  const { theme, branchRecords } = ctx;
  const themeClass = theme === 'dark' ? 'dark-mode' : '';

  return (
    <div className={`landing-scope ${themeClass}`} style={{ background: 'var(--surface-page)', minHeight: '100vh' }}>
      <SiteHeader ctx={ctx} active="branches" />

      <section style={{ padding: '64px 0 32px' }}>
        <div className="wrap">
          <p className="eyebrow">Chi nhánh</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 42, lineHeight: 1.15, letterSpacing: '-0.02em', fontWeight: 600, marginTop: 10, color: 'var(--text-brand)' }}>{branchRecords.length} chi nhánh đang phục vụ</h1>
          <p style={{ marginTop: 12, fontSize: 'var(--fs-body-lg)', color: 'var(--text-muted)', maxWidth: '56ch' }}>
            Chọn chi nhánh gần bạn nhất — xem địa chỉ, giờ mở cửa và chỉ đường trực tiếp trên bản đồ.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 0 96px' }}>
        <div className="wrap">
          {branchRecords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 24px', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-card)', color: 'var(--text-muted)' }}>Đang cập nhật danh sách chi nhánh.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {branchRecords.map(b => <BranchCard key={b.id || b.name} branch={b} />)}
            </div>
          )}
        </div>
      </section>

      <SiteFooter ctx={ctx} />
    </div>
  );
}

function BranchCard({ branch }) {
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`;
  return (
    <div className="panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <span style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--surface-brand-soft)', color: 'var(--brand)', display: 'grid', placeItems: 'center', flex: '0 0 auto' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d={PIN_D} /><circle cx="12" cy="10" r="3" /></svg>
      </span>
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 600 }}>{branch.name}</h3>
        <p style={{ marginTop: 6, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)', lineHeight: 1.5 }}>{branch.address}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border-soft)' }}>
        <span style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--text-subtle)' }}>{branch.hours}</span>
        <a href={mapHref} target="_blank" rel="noreferrer" className="btn btn-secondary btn-md">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d={PIN_D} /><circle cx="12" cy="10" r="3" /></svg>
          Chỉ đường
        </a>
      </div>
    </div>
  );
}
