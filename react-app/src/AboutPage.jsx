import SiteHeader from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';
import { LeafIcon } from './icons.jsx';
import { Reveal } from './reveal.jsx';

const TIMELINE = [
  { year: '2016', title: 'Khai trương quán đầu tiên', desc: 'Một quán nhỏ ở Quận 3, TP.HCM, chỉ bán cơm phần buổi trưa.' },
  { year: '2019', title: 'Mở thêm 4 chi nhánh', desc: 'Mở rộng sang Quận 1, Tân Bình, Thủ Đức và Phú Nhuận — vẫn giữ cách nấu như ngày đầu.' },
  { year: '2023', title: 'Chuẩn hoá quy trình bếp', desc: 'Xây quy trình chọn rau củ theo mùa và định lượng nấu vừa đủ cho từng chi nhánh.' },
  { year: 'Hiện tại', title: '12 chi nhánh tại TP.HCM', desc: 'Mỗi chi nhánh vẫn tự nấu tại chỗ mỗi ngày, không bếp trung tâm.' }
];

export default function AboutPage({ ctx }) {
  const { theme } = ctx;
  const themeClass = theme === 'dark' ? 'dark-mode' : '';

  return (
    <div className={`landing-scope ${themeClass}`} style={{ background: 'var(--surface-page)', minHeight: '100vh' }}>
      <SiteHeader ctx={ctx} active="about" />

      <section style={{ padding: '64px 0 0' }}>
        <div className="wrap" style={{ textAlign: 'center' }}>
          <p className="eyebrow">Về chúng tôi</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 44, lineHeight: 1.15, letterSpacing: '-0.02em', fontWeight: 600, marginTop: 12, color: 'var(--text-brand)', maxWidth: 720, marginLeft: 'auto', marginRight: 'auto', textWrap: 'balance' }}>
            Duyên phần, cái duyên của một bữa cơm
          </h1>
          <p style={{ marginTop: 18, fontSize: 'var(--fs-body-lg)', lineHeight: 1.65, color: 'var(--text-muted)', maxWidth: '52ch', marginLeft: 'auto', marginRight: 'auto' }}>
            Bắt đầu từ một quán nhỏ ở Quận 3 năm 2016, chúng tôi vẫn giữ một nguyên tắc: nấu đủ ăn trong ngày, không để thừa.
          </p>
        </div>
      </section>

      <section style={{ padding: '64px 0' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <Reveal>
            <div className="photo-card" style={{ height: 380, padding: 24 }}><KitchenArt /></div>
          </Reveal>
          <Reveal delay={.1}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 600, letterSpacing: '-0.01em' }}>Triết lý ẩm thực</h2>
            <p style={{ marginTop: 16, fontSize: 'var(--fs-body-lg)', lineHeight: 1.65, color: 'var(--text-muted)' }}>
              Không mở rộng vội, không thêm món cho có. Mỗi chi nhánh mới chỉ ra đời khi bếp cũ đã vững.
            </p>
            <p style={{ marginTop: 16, fontSize: 'var(--fs-body-lg)', lineHeight: 1.65, color: 'var(--text-muted)' }}>
              Rau củ chọn theo mùa, gạo lứt và đậu hũ làm mỗi sáng tại từng chi nhánh — không bếp trung tâm, không nấu sẵn để đông lạnh.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: 'var(--surface-accent-soft)', padding: '80px 0' }}>
        <div className="wrap">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 600, letterSpacing: '-0.01em', textAlign: 'center' }}>Giá trị cốt lõi</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginTop: 40 }}>
            <ValueCard icon={<LeafIcon size={20} />} title="Theo mùa" desc="Rau củ chọn theo vụ, không ép trái nghịch mùa, đặt trực tiếp từ nông trại." />
            <ValueCard icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" /><path d="M7 8V5a1 1 0 0 1 1-1" /><path d="M12 7V4" /><path d="M17 8V5a1 1 0 0 0-1-1" /></svg>} title="Vừa đủ" desc="Mỗi bếp nấu theo số phần đã đặt, hạn chế thức ăn dư mỗi ngày." />
            <ValueCard icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" /></svg>} title="Tử tế" desc="Không bột ngọt, không rút ngắn công đoạn nấu để tiết kiệm thời gian." />
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div className="wrap">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 600, letterSpacing: '-0.01em', textAlign: 'center' }}>Chặng đường phát triển</h2>
          <div style={{ maxWidth: 640, margin: '48px auto 0', display: 'flex', flexDirection: 'column' }}>
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.08} style={{ display: 'flex', gap: 24 }}>
                <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--brand)', flex: '0 0 auto' }} />
                  {i < TIMELINE.length - 1 && <span style={{ width: 2, flex: 1, background: 'var(--border)', marginTop: 4 }} />}
                </div>
                <div style={{ paddingBottom: 40 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-accent)', letterSpacing: '.04em' }}>{t.year}</span>
                  <h3 style={{ marginTop: 4, fontSize: 18, fontWeight: 600 }}>{t.title}</h3>
                  <p style={{ marginTop: 6, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)', lineHeight: 1.6 }}>{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter ctx={ctx} />
    </div>
  );
}

function ValueCard({ icon, title, desc }) {
  return (
    <div className="panel" style={{ padding: 28, textAlign: 'center' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', background: 'var(--surface-brand-soft)', color: 'var(--brand)' }}>{icon}</span>
      <h3 style={{ marginTop: 16, fontSize: 17, fontWeight: 600 }}>{title}</h3>
      <p style={{ marginTop: 8, fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

function KitchenArt() {
  return (
    <svg viewBox="0 0 240 300" width="100%" height="100%" style={{ maxHeight: 380 }} role="img" aria-label="Người nấu trong bếp">
      <rect x="0" y="0" width="240" height="220" fill="var(--surface-page)" opacity=".5" />
      <rect x="24" y="40" width="46" height="58" rx="6" fill="none" stroke="var(--border-strong)" strokeWidth="2" />
      <ellipse cx="47" cy="58" rx="12" ry="16" fill="var(--clay-300)" opacity=".7" />
      <ellipse cx="47" cy="82" rx="12" ry="14" fill="var(--green-300)" opacity=".7" />
      <rect x="10" y="210" width="220" height="90" fill="var(--clay-100)" />
      <rect x="10" y="210" width="220" height="10" fill="var(--clay-300)" />
      <ellipse cx="145" cy="218" rx="46" ry="12" fill="var(--green-900)" />
      <ellipse cx="145" cy="214" rx="46" ry="12" fill="none" stroke="var(--green-700)" strokeWidth="3" />
      <path d="M126 176c-8-10 4-16-4-28M146 172c-8-10 4-16-4-28M164 178c-8-10 4-16-4-28" stroke="var(--green-300)" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".75" />
      <path d="M170 150v-30a44 44 0 0 1 44 0" fill="none" stroke="var(--green-700)" strokeWidth="4" strokeLinecap="round" />
      <path d="M84 300v-56a34 34 0 0 1 68 0v56Z" fill="var(--green-700)" />
      <circle cx="118" cy="196" r="24" fill="var(--clay-300)" />
      <path d="M94 196a24 24 0 0 1 48 0Z" fill="var(--green-800)" />
      <rect x="130" y="150" width="10" height="46" rx="4" fill="var(--clay-600)" transform="rotate(28 135 173)" />
    </svg>
  );
}
