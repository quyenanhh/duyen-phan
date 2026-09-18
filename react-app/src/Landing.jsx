import { useEffect, useState } from 'react';
import { LeafIcon } from './icons.jsx';
import { fmtVnd } from './utils.js';
import SiteHeader from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';
import { Reveal, useInView } from './reveal.jsx';
import { Dish, pickDishArt } from './dishArt.jsx';
import { MENU_CATEGORIES } from './data.js';
import heroQuanPhoto from './assets/hero-quan.jpg';
import rauCu2Photo from './assets/rau-cu-2.jpg';
import rauCu1Photo from './assets/rau-cu-1.jpg';

// Lấy nhiều món tiêu biểu hơn thẳng từ thực đơn thật (Supabase khi đã cấu hình, hoặc dữ
// liệu mẫu MENU_ITEMS khi chưa) — luân phiên qua từng danh mục (mỗi vòng lấy 1 món/danh
// mục) để trang chủ giới thiệu đa dạng món, không chỉ vài món cố định viết cứng.
const SHOWCASE_MAX = 12;
function menuShowcase(records) {
  const available = records.filter(m => m.status !== 'soldout');
  const pool = available.length ? available : records;

  const byCategory = {};
  pool.forEach(m => {
    const cat = m.category || 'Khác';
    (byCategory[cat] = byCategory[cat] || []).push(m);
  });
  const categories = [
    ...MENU_CATEGORIES.filter(c => byCategory[c]),
    ...Object.keys(byCategory).filter(c => !MENU_CATEGORIES.includes(c))
  ];

  const picked = [];
  for (let round = 0; picked.length < SHOWCASE_MAX; round++) {
    let addedAny = false;
    for (const cat of categories) {
      const list = byCategory[cat];
      if (list && list[round]) {
        picked.push(list[round]);
        addedAny = true;
        if (picked.length >= SHOWCASE_MAX) break;
      }
    }
    if (!addedAny) break;
  }
  return picked;
}

const LEAF_D = 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 1 5 1 6 0 8.7-8 12-9 12Z';

export default function Landing({ ctx }) {
  const { theme, goMenu, goBranchesPublic, menuRecords } = ctx;
  const themeClass = theme === 'dark' ? 'dark-mode' : '';

  return (
    <div className={`landing-scope ${themeClass}`} style={{ background: 'var(--surface-page)', transition: 'background var(--dur-base) var(--ease-out)' }}>

      <SiteHeader ctx={ctx} active="landing" />

      <div>
        <section style={{ padding: '96px 0 0', position: 'relative', overflow: 'hidden' }}>
          <svg className="float-slow" viewBox="0 0 700 700" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', left: -80, top: -60, width: 420, height: 420, zIndex: 0, color: 'var(--brand)', opacity: .06, pointerEvents: 'none' }}>
            <g fill="currentColor" stroke="none">
              <path transform="translate(60,40) rotate(-24) scale(1.4)" d={LEAF_D} />
              <path transform="translate(200,300) rotate(160) scale(1.1)" d={LEAF_D} />
            </g>
          </svg>
          <div className="wrap" style={{ position: 'relative', textAlign: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px 6px 6px', borderRadius: 999, background: 'var(--surface-brand-soft)', border: '1px solid var(--border)', opacity: 0, animation: 'riseIn .6s var(--ease-out) both' }}>
              <span style={{ width: 24, height: 24, flex: '0 0 auto', borderRadius: '50%', background: 'var(--surface-card)', color: 'var(--brand)', display: 'grid', placeItems: 'center' }}><LeafIcon size={13} /></span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-brand)' }}>Cơm chay thuần Việt · phục vụ từ 2016</span>
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 56, lineHeight: 1.1, letterSpacing: '-0.02em', fontWeight: 600, marginTop: 26, color: 'var(--text-brand)', textWrap: 'balance', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', opacity: 0, animation: 'riseIn .6s .08s var(--ease-out) both' }}>
              Cơm chay lành mạnh, trọn vị yêu thương
            </h1>
            <p style={{ marginTop: 20, fontSize: 'var(--fs-body-lg)', lineHeight: 1.65, color: 'var(--text-muted)', maxWidth: '48ch', marginLeft: 'auto', marginRight: 'auto', opacity: 0, animation: 'riseIn .6s .14s var(--ease-out) both' }}>
              Rau củ theo mùa, gạo lứt và đậu hũ làm mỗi sáng. Vừa đủ cho một ngày, không dư thừa.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 32, justifyContent: 'center', opacity: 0, animation: 'riseIn .6s .2s var(--ease-out) both' }}>
              <a onClick={goMenu} className="btn btn-primary btn-lg" style={{ cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v8a2 2 0 0 0 2 2v10" /><path d="M4 2v4" /><path d="M7 2v4" /><path d="M20 2c-2 1-3 3-3 6 0 2 1 3 2 3v11" /></svg>
                Xem thực đơn
              </a>
              <a href="#dat-ban" className="btn btn-secondary btn-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>
                Đặt bàn ngay
              </a>
            </div>
          </div>

          <Reveal delay={.24} style={{ position: 'relative', marginTop: 56 }}>
            <div className="wrap" style={{ position: 'relative' }}>
              <div className="photo-card" style={{ height: 420, padding: 0 }}>
                <img src={heroQuanPhoto} alt="Không gian quán Duyên Phần" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="float-badge" style={{ position: 'absolute', left: 40, bottom: 20 }}>
                <span style={{ width: 40, height: 40, flex: '0 0 auto', borderRadius: 10, background: 'var(--surface-brand-soft)', color: 'var(--brand)', display: 'grid', placeItems: 'center' }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1-5h16l1 5" /><path d="M4 9v10h16V9" /><path d="M9 21v-6h6v6" /></svg>
                </span>
                <span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 600, lineHeight: 1.1 }}>12 chi nhánh</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>TP.HCM &amp; Hà Nội</span>
                </span>
              </div>
            </div>
          </Reveal>
        </section>

        <div className="wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', paddingTop: 80, paddingBottom: 56 }}>
          <Stat icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1-5h16l1 5" /><path d="M4 9v10h16V9" /><path d="M9 21v-6h6v6" /></svg>} value="12" label="chi nhánh" />
          <Divider />
          <Stat icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>} value="9 năm" label="nấu chay mỗi ngày" />
          <Divider />
          <Stat icon={<LeafIcon size={26} />} value="48" label="món theo mùa" />
        </div>
      </div>

      <section style={{ padding: '64px 32px 0', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 26, lineHeight: 1.5, letterSpacing: '-0.01em', fontWeight: 500, fontStyle: 'italic', color: 'var(--text-body)', maxWidth: 640, margin: '0 auto', textWrap: 'balance' }}>
          "Một bữa cơm ngon không cần phô trương, chỉ cần đủ, đúng mùa, và nấu bằng sự tử tế."
        </p>
      </section>

      <section id="vi-sao-chon" style={{ background: 'var(--surface-accent-soft)', padding: '80px 0', marginTop: 56, position: 'relative', overflow: 'hidden' }}>
        <svg className="float-slow" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, color: 'var(--brand)', opacity: .06 }}>
          <g fill="currentColor" stroke="none">
            <path transform="translate(1040,60) rotate(24) scale(2.1)" d={LEAF_D} />
            <path transform="translate(60,400) rotate(200) scale(1.3)" d={LEAF_D} />
          </g>
        </svg>
        <div className="wrap" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '.95fr 1.05fr', gap: 64, alignItems: 'center' }}>
          <Reveal>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 38, fontWeight: 600, letterSpacing: '-0.01em', textWrap: 'balance' }}>Một bữa cơm chay, nấu bằng sự tử tế</h2>
            <p style={{ marginTop: 16, fontSize: 'var(--fs-body-lg)', lineHeight: 1.65, color: 'var(--text-muted)', maxWidth: '42ch' }}>
              Không thêm món cho có, không nấu dư để bỏ. Ba điều chúng tôi giữ từ ngày đầu:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 30 }}>
              <Benefit icon={<LeafIcon size={18} />} title="Rau củ theo mùa" desc="Đặt trực tiếp từ nông trại Đà Lạt và Long Khánh mỗi sáng." />
              <Benefit icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" /><path d="M7 8V5a1 1 0 0 1 1-1" /><path d="M12 7V4" /><path d="M17 8V5a1 1 0 0 0-1-1" /></svg>} title="Nấu vừa đủ" desc="Mỗi bếp nấu theo số phần đã đặt, hạn chế thức ăn dư." />
              <Benefit icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.5-1.5 3-3.5 3-6a4.5 4.5 0 0 0-8-2.8A4.5 4.5 0 0 0 2 8c0 2.5 1.5 4.5 3 6l7 7Z" /></svg>} title="Giá phải chăng" desc="Cơm phần từ 45.000₫, phần chay miễn phí mỗi rằm." />
            </div>
            <a onClick={goMenu} className="btn btn-primary btn-lg" style={{ marginTop: 32, cursor: 'pointer' }}>Xem thực đơn</a>
          </Reveal>
          <Reveal delay={.12} style={{ position: 'relative', height: 440 }}>
            <div style={{ position: 'absolute', width: '64%', height: 260, left: 0, top: 6, transform: 'rotate(-3deg)' }}>
              <div className="photo-card" style={{ height: '100%', padding: 0 }}>
                <img src={rauCu2Photo} alt="Rau củ tươi theo mùa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div style={{ position: 'absolute', width: '56%', height: 230, right: 0, bottom: 6, transform: 'rotate(4deg)' }}>
              <div className="photo-card" style={{ height: '100%', padding: 0 }}>
                <img src={rauCu1Photo} alt="Rau củ tươi theo mùa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div className="float-badge" style={{ position: 'absolute', left: 4, bottom: 12 }}>
              <span style={{ width: 36, height: 36, flex: '0 0 auto', borderRadius: '50%', background: 'var(--surface-brand-soft)', color: 'var(--brand)', display: 'grid', placeItems: 'center' }}><LeafIcon size={16} /></span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>100% thuần chay</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="cach-dat-mon" style={{ padding: '96px 0' }}>
        <div className="wrap">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 34, fontWeight: 600, letterSpacing: '-0.01em', textAlign: 'center', textWrap: 'balance' }}>Đặt một phần cơm chay chỉ trong bốn bước</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, marginTop: 48 }}>
            <Reveal delay={0}><Step index="01" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" /></svg>} title="Xem thực đơn" desc="Món chay theo ngày, cập nhật mỗi sáng sớm." /></Reveal>
            <Reveal delay={.08}><Step index="02" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></svg>} title="Chọn món" desc="Ghép phần theo khẩu vị, từ canh đến món chính." /></Reveal>
            <Reveal delay={.16}><Step index="03" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" /></svg>} title="Đặt bàn hoặc đặt món" desc="Gọi trực tiếp chi nhánh hoặc nhờ nhân viên đặt giúp." /></Reveal>
            <Reveal delay={.24}><Step index="04" icon={<LeafIcon size={20} />} title="Thưởng thức" desc="Ăn khi còn nóng, đúng vị nhà nấu mỗi ngày." /></Reveal>
          </div>
        </div>
      </section>

      <section id="thuc-don" style={{ background: 'var(--surface-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '96px 0' }}>
        <div className="wrap">
          <p className="eyebrow">Thực đơn</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 38, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 10 }}>Những món chúng tôi tự hào</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24, marginTop: 36 }}>
            {menuShowcase(menuRecords).map((m, i) => (
              <Reveal key={m.id} delay={Math.min(i, 6) * 0.06}>
                <Dish art={pickDishArt(m)} name={m.name} price={fmtVnd(m.price)} note={m.desc} />
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a onClick={goMenu} className="link-arrow" style={{ cursor: 'pointer' }}>
              Xem thực đơn đầy đủ
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </section>

      <section id="cau-chuyen" style={{ padding: '96px 0' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '.9fr 1.1fr', gap: 64, alignItems: 'center' }}>
          <Reveal style={{ position: 'relative' }}>
            <div className="photo-card" style={{ height: 420, padding: 24 }}>
              <KitchenArt />
            </div>
            <div className="float-badge" style={{ position: 'absolute', right: -16, top: -16 }}>
              <span>
                <span style={{ display: 'block', fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 600, lineHeight: 1.1 }}>Từ 2016</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Quận 3, TP.HCM</span>
              </span>
            </div>
          </Reveal>
          <Reveal delay={.12}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 38, fontWeight: 600, letterSpacing: '-0.01em', textWrap: 'balance' }}>Duyên phần, cái duyên của một bữa cơm</h2>
            <p style={{ marginTop: 22, fontSize: 'var(--fs-body-lg)', lineHeight: 1.65, color: 'var(--text-muted)' }}>
              Bắt đầu từ một quán nhỏ ở Quận 3 năm 2016, chúng tôi vẫn giữ một nguyên tắc: nấu đủ ăn trong ngày, không để thừa.
            </p>
            <p style={{ marginTop: 16, fontSize: 'var(--fs-body-lg)', lineHeight: 1.65, color: 'var(--text-muted)' }}>
              Không mở rộng vội, không thêm món cho có. Mỗi chi nhánh mới chỉ ra đời khi bếp cũ đã vững.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 32 }}>
              <CoreValue title="Theo mùa" desc="Rau củ chọn theo vụ, không ép trái nghịch mùa." />
              <CoreValue title="Vừa đủ" desc="Nấu theo số phần đã đặt, không dư để bỏ." />
              <CoreValue title="Tử tế" desc="Không bột ngọt, không rút ngắn công đoạn nấu." />
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: 'var(--surface-inverse)', padding: '88px 0' }}>
        <Reveal className="wrap" style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: 'var(--accent)' }}><LeafIcon size={26} /></span>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 26, lineHeight: 1.55, letterSpacing: '-0.01em', fontWeight: 500, fontStyle: 'italic', color: 'var(--text-on-brand)', marginTop: 18, textWrap: 'balance' }}>
            "Ăn chay năm năm nhưng đây là nơi hiếm hoi tôi ăn hết cả phần mà không thấy ngán. Vị vừa, không bột ngọt."
          </p>
          <div style={{ marginTop: 22, fontSize: 14, fontWeight: 600, color: 'var(--text-on-brand)' }}>Trần Bảo Ngọc</div>
          <div style={{ fontSize: 13, color: 'rgba(248,249,247,.7)' }}>Khách quen chi nhánh Quận 3, TP.HCM</div>
        </Reveal>
      </section>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, maxWidth: 200, margin: '0 auto', padding: '48px 0' }}>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ color: 'var(--text-accent)', flex: '0 0 auto' }}><LeafIcon /></span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <section id="dat-ban" style={{ padding: '0 0 96px', textAlign: 'center' }}>
        <Reveal className="wrap" style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 34, fontWeight: 600, letterSpacing: '-0.01em' }}>Đặt bàn cho hôm nay</h2>
          <p style={{ marginTop: 14, fontSize: 'var(--fs-body-lg)', lineHeight: 1.6, color: 'var(--text-muted)' }}>Chọn chi nhánh gần bạn, giữ bàn chỉ trong một phút.</p>
          <a onClick={goBranchesPublic} className="btn btn-primary btn-lg" style={{ marginTop: 28, cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>
            Đặt bàn ngay
          </a>
        </Reveal>
      </section>

      <SiteFooter ctx={ctx} />
    </div>
  );
}

function Stat({ icon, value, label }) {
  const [ref, inView] = useInView();
  const match = value.match(/^(\d+)(.*)$/);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView || !match) return;
    const target = parseInt(match[1], 10);
    const start = performance.now();
    const dur = 900;
    let raf;
    function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      setCount(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 40px' }}>
      <span className="icon-badge" style={{ color: 'var(--text-accent)', flex: '0 0 auto' }}>{icon}</span>
      <span>
        <span style={{ display: 'block', fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 600, lineHeight: 1, color: 'var(--text-brand)' }}>{match ? `${count}${match[2]}` : value}</span>
        <span style={{ fontSize: 'var(--fs-label)', color: 'var(--text-muted)' }}>{label}</span>
      </span>
    </div>
  );
}
function Divider() {
  return <span style={{ width: 1, alignSelf: 'stretch', background: 'var(--border)' }} />;
}
function Benefit({ icon, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', textAlign: 'left' }}>
      <span className="icon-badge" style={{ flex: '0 0 auto', width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-card)', color: 'var(--brand)', display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-card)' }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{title}</div>
        <div style={{ marginTop: 4, fontSize: 'var(--fs-body-sm)', lineHeight: 1.6, color: 'var(--text-muted)' }}>{desc}</div>
      </div>
    </div>
  );
}
function Step({ index, icon, title, desc }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="icon-badge" style={{ position: 'relative', width: 64, height: 64, margin: '0 auto', borderRadius: '50%', background: 'var(--surface-brand-soft)', color: 'var(--brand)', display: 'grid', placeItems: 'center' }}>
        {icon}
        <span style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: 'var(--surface-card)', border: '1px solid var(--border)', fontSize: 10, fontWeight: 700, color: 'var(--text-accent)', display: 'grid', placeItems: 'center' }}>{index}</span>
      </div>
      <div style={{ fontWeight: 600, fontSize: 16, marginTop: 16 }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 'var(--fs-body-sm)', lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: '26ch', marginLeft: 'auto', marginRight: 'auto' }}>{desc}</div>
    </div>
  );
}
function CoreValue({ title, desc }) {
  return (
    <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 14 }}>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 'var(--fs-caption)', color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
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
