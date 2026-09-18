// Minh hoạ món ăn dạng vẽ tay (SVG) dùng chung giữa trang chủ và trang Thực đơn —
// dự án chưa có ảnh món thật nên dùng minh hoạ trừu tượng thay cho ảnh chụp.
// "Cơm phần đậu hũ sả ớt" là ngoại lệ — đã có ảnh chụp thật, dùng DauHuSaOtArt bên dưới.

import dauHuSaOtPhoto from './assets/com-dau-hu-sa-ot.jpg';
import dauHuSotCaChuaPhoto from './assets/dau-hu-sot-ca-chua.jpg';
import canhChuaChayPhoto from './assets/canh-chua-chay.jpg';
import cheDauXanhPhoto from './assets/che-dau-xanh-nuoc-cot-dua.jpg';
import traDaoCamSaPhoto from './assets/tra-dao-cam-sa.png';
import namKhoTieuPhoto from './assets/com-nam-kho-tieu.jpg';
import namKhoToPhoto from './assets/nam-kho-to.webp';
import canhBiDoDauPhongPhoto from './assets/canh-bi-do-dau-phong.jpg';
import rauCauLaDuaPhoto from './assets/rau-cau-la-dua.jpg';
import nuocSamBiDaoPhoto from './assets/nuoc-sam-bi-dao.jpg';
import comChaGioChayPhoto from './assets/com-cha-gio-chay.webp';
import rauCuXaoThapCamPhoto from './assets/rau-cu-xao-thap-cam.jpeg';
import supNamBonMuaPhoto from './assets/sup-nam-bon-mua.webp';
import suaHatSenPhoto from './assets/sua-hat-sen.webp';

export function DauHuSaOtArt() {
  return <img src={dauHuSaOtPhoto} alt="Cơm phần đậu hũ sả ớt" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />;
}

export function DauHuSotCaChuaArt() {
  return <img src={dauHuSotCaChuaPhoto} alt="Đậu hũ sốt cà chua" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />;
}

export function CanhChuaChayArt() {
  return <img src={canhChuaChayPhoto} alt="Canh chua chay" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />;
}

export function CheDauXanhArt() {
  return <img src={cheDauXanhPhoto} alt="Chè đậu xanh nước cốt dừa" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />;
}

export function TraDaoCamSaArt() {
  return <img src={traDaoCamSaPhoto} alt="Trà đào cam sả" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />;
}

export function NamKhoTieuArt() {
  return <img src={namKhoTieuPhoto} alt="Cơm phần nấm kho tiêu" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />;
}

export function NamKhoToArt() {
  return <img src={namKhoToPhoto} alt="Nấm kho tộ" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />;
}

export function CanhBiDoDauPhongArt() {
  return <img src={canhBiDoDauPhongPhoto} alt="Canh bí đỏ nấu đậu phộng" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />;
}

export function RauCauLaDuaArt() {
  return <img src={rauCauLaDuaPhoto} alt="Rau câu lá dứa" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />;
}

export function NuocSamBiDaoArt() {
  return <img src={nuocSamBiDaoPhoto} alt="Nước sâm bí đao" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />;
}

export function ComChaGioChayArt() {
  return <img src={comChaGioChayPhoto} alt="Cơm phần chả giò chay" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />;
}

export function RauCuXaoThapCamArt() {
  return <img src={rauCuXaoThapCamPhoto} alt="Rau củ xào thập cẩm" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />;
}

export function SupNamBonMuaArt() {
  return <img src={supNamBonMuaPhoto} alt="Súp nấm bốn mùa" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />;
}

export function SuaHatSenArt() {
  return <img src={suaHatSenPhoto} alt="Sữa hạt sen" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />;
}

export function ThapCamArt() {
  return (
    <svg viewBox="0 0 220 260" width="100%" height="100%" role="img" aria-label="Cơm chay thập cẩm">
      <ellipse cx="110" cy="236" rx="86" ry="10" fill="var(--border-strong)" opacity=".2" />
      <path d="M18 140a92 92 0 0 0 184 0Z" fill="var(--surface-card)" stroke="var(--border-strong)" strokeWidth="2.5" />
      <ellipse cx="110" cy="140" rx="92" ry="16" fill="none" stroke="var(--border-strong)" strokeWidth="2.5" />
      <ellipse cx="110" cy="128" rx="58" ry="20" fill="var(--cream-50)" stroke="var(--border-strong)" strokeWidth="1.5" />
      <path d="M62 118c-9-7-24-6-30 3 10 5 23 3 30-3Z" fill="var(--green-700)" />
      <path d="M84 110c-3-9-14-14-24-11 5 8 15 13 24 11Z" fill="var(--green-300)" />
      <circle cx="132" cy="112" r="11" fill="var(--clay-600)" />
      <circle cx="150" cy="122" r="8" fill="var(--clay-300)" />
      <rect x="102" y="100" width="20" height="20" rx="3" fill="var(--cream-50)" stroke="var(--green-700)" strokeWidth="1.5" />
      <rect x="156" y="70" width="4" height="70" rx="2" fill="var(--green-700)" transform="rotate(18 158 105)" />
      <rect x="166" y="66" width="4" height="70" rx="2" fill="var(--green-700)" transform="rotate(18 168 101)" />
    </svg>
  );
}

export function SenHatDeArt() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" role="img" aria-label="Cơm sen hạt dẻ">
      <path d="M30 128a70 70 0 0 0 140 0Z" fill="var(--surface-card)" stroke="var(--border-strong)" strokeWidth="2.5" />
      <ellipse cx="100" cy="128" rx="70" ry="13" fill="none" stroke="var(--border-strong)" strokeWidth="2.5" />
      <ellipse cx="100" cy="118" rx="46" ry="16" fill="var(--cream-50)" stroke="var(--border-strong)" strokeWidth="1.5" />
      <circle cx="78" cy="112" r="6" fill="var(--clay-600)" />
      <circle cx="96" cy="108" r="6" fill="var(--clay-300)" />
      <circle cx="114" cy="114" r="6" fill="var(--clay-600)" />
      <circle cx="128" cy="120" r="5" fill="var(--clay-300)" />
      <g transform="translate(100 62)">
        <path d="M0 20C-14 10-14-10 0-20c14 10 14 30 0 40Z" fill="var(--clay-300)" opacity=".9" />
        <path d="M-22 18C-30 4-24-14-6-22c-4 16-4 30 6 40Z" fill="var(--clay-600)" opacity=".85" />
        <path d="M22 18C30 4 24-14 6-22c4 16 4 30-6 40Z" fill="var(--clay-600)" opacity=".85" />
        <circle cx="0" cy="2" r="5" fill="var(--green-700)" />
      </g>
    </svg>
  );
}

export function CanhArt() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" role="img" aria-label="Canh nấm rong biển">
      <path d="M26 118a74 74 0 0 0 148 0Z" fill="var(--surface-card)" stroke="var(--border-strong)" strokeWidth="2.5" />
      <ellipse cx="100" cy="118" rx="74" ry="14" fill="none" stroke="var(--border-strong)" strokeWidth="2.5" />
      <ellipse cx="100" cy="108" rx="66" ry="18" fill="var(--green-100)" />
      <path d="M52 104c10-10 22-10 30 0-10 6-22 6-30 0Z" fill="var(--green-700)" opacity=".85" />
      <path d="M96 100c8-12 22-14 32-6-9 8-23 10-32 6Z" fill="var(--green-700)" opacity=".65" />
      <circle cx="128" cy="108" r="12" fill="var(--clay-300)" stroke="var(--clay-700)" strokeWidth="1.25" />
      <path d="M128 100v16M121 108h14" stroke="var(--clay-700)" strokeWidth="1.25" />
      <circle cx="150" cy="98" r="8" fill="var(--clay-300)" stroke="var(--clay-700)" strokeWidth="1.25" />
      <path d="M108 66c-6-8 4-12-2-20" stroke="var(--green-300)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".7" />
      <path d="M126 62c-6-8 4-12-2-20" stroke="var(--green-300)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".5" />
    </svg>
  );
}

export function GoiCuonArt() {
  return (
    <svg viewBox="0 0 300 140" width="100%" height="100%" role="img" aria-label="Gỏi cuốn chay">
      <ellipse cx="150" cy="104" rx="130" ry="24" fill="var(--surface-card)" stroke="var(--border-strong)" strokeWidth="2" />
      <g transform="rotate(-8 90 74)">
        <rect x="46" y="58" width="88" height="30" rx="15" fill="var(--cream-50)" stroke="var(--green-700)" strokeWidth="1.5" />
        <ellipse cx="68" cy="73" rx="8" ry="5" fill="var(--green-300)" opacity=".8" />
        <ellipse cx="96" cy="73" rx="6" ry="9" fill="var(--clay-300)" opacity=".8" />
        <ellipse cx="114" cy="73" rx="5" ry="7" fill="var(--green-700)" opacity=".6" />
      </g>
      <g transform="rotate(-2 150 66)">
        <rect x="104" y="48" width="92" height="30" rx="15" fill="var(--cream-50)" stroke="var(--green-700)" strokeWidth="1.5" />
        <ellipse cx="128" cy="63" rx="7" ry="9" fill="var(--clay-300)" opacity=".85" />
        <ellipse cx="152" cy="63" rx="8" ry="5" fill="var(--green-300)" opacity=".8" />
        <ellipse cx="174" cy="63" rx="5" ry="7" fill="var(--green-700)" opacity=".6" />
      </g>
      <g transform="rotate(6 210 78)">
        <rect x="166" y="60" width="86" height="30" rx="15" fill="var(--cream-50)" stroke="var(--green-700)" strokeWidth="1.5" />
        <ellipse cx="188" cy="75" rx="6" ry="8" fill="var(--green-700)" opacity=".6" />
        <ellipse cx="212" cy="75" rx="8" ry="5" fill="var(--clay-300)" opacity=".85" />
      </g>
      <circle cx="252" cy="96" r="16" fill="var(--clay-600)" />
      <circle cx="252" cy="96" r="16" fill="none" stroke="var(--clay-700)" strokeWidth="1.5" />
    </svg>
  );
}

export function DrinkArt() {
  return (
    <svg viewBox="0 0 200 220" width="100%" height="100%" role="img" aria-label="Đồ uống, tráng miệng">
      <ellipse cx="102" cy="200" rx="56" ry="9" fill="var(--border-strong)" opacity=".2" />
      <path d="M64 72h76l-9 116a11 11 0 0 1-11 10H84a11 11 0 0 1-11-10Z" fill="var(--cream-50)" stroke="var(--border-strong)" strokeWidth="2.5" />
      <ellipse cx="102" cy="72" rx="38" ry="11" fill="none" stroke="var(--border-strong)" strokeWidth="2.5" />
      <ellipse cx="102" cy="98" rx="30" ry="10" fill="var(--green-100)" />
      <circle cx="90" cy="132" r="6" fill="var(--clay-300)" />
      <circle cx="112" cy="144" r="5" fill="var(--clay-600)" />
      <circle cx="98" cy="160" r="6" fill="var(--clay-300)" />
      <rect x="134" y="36" width="6" height="66" rx="3" fill="var(--green-700)" transform="rotate(14 137 69)" />
      <path d="M86 56c-6-8 4-12-2-20" stroke="var(--green-300)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

const DISH_ART = { thapcam: ThapCamArt, sen: SenHatDeArt, canh: CanhArt, goicuon: GoiCuonArt };

// Chọn minh hoạ theo danh mục/tên món — dùng cho cả trang chủ và trang Thực đơn,
// để mọi nơi hiển thị món ăn đều nhất quán về hình ảnh.
export function pickDishArt(item) {
  const name = (item.name || '').toLowerCase();
  if (name.includes('đậu hũ sả ớt')) return DauHuSaOtArt;
  if (name.includes('đậu hũ sốt cà chua')) return DauHuSotCaChuaArt;
  if (name.includes('canh chua chay')) return CanhChuaChayArt;
  if (name.includes('chè đậu xanh')) return CheDauXanhArt;
  if (name.includes('trà đào cam sả')) return TraDaoCamSaArt;
  if (name.includes('nấm kho tiêu')) return NamKhoTieuArt;
  if (name.includes('nấm kho tộ')) return NamKhoToArt;
  if (name.includes('canh bí đỏ')) return CanhBiDoDauPhongArt;
  if (name.includes('rau câu lá dứa')) return RauCauLaDuaArt;
  if (name.includes('nước sâm bí đao')) return NuocSamBiDaoArt;
  if (name.includes('chả giò chay')) return ComChaGioChayArt;
  if (name.includes('rau củ xào thập cẩm')) return RauCuXaoThapCamArt;
  if (name.includes('súp nấm bốn mùa')) return SupNamBonMuaArt;
  if (name.includes('sữa hạt sen')) return SuaHatSenArt;
  if (item.category === 'Canh & súp') return CanhArt;
  if (item.category === 'Tráng miệng' || item.category === 'Nước uống') return DrinkArt;
  if (name.includes('cuốn')) return GoiCuonArt;
  if (name.includes('sen')) return SenHatDeArt;
  return ThapCamArt;
}

export function Dish({ name, price, note, area, tall, wide, kind, art }) {
  const Art = art || DISH_ART[kind] || ThapCamArt;
  return (
    <div style={{ gridArea: area, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', flex: tall ? 1 : 'initial' }}>
        <div className="photo-card" style={{ height: tall ? '100%' : wide ? 140 : 180, padding: tall ? 20 : wide ? 14 : 16 }}>
          <Art />
        </div>
        <span style={{ position: 'absolute', right: 12, bottom: 12, background: 'var(--surface-card)', boxShadow: 'var(--shadow-card)', borderRadius: 999, padding: '5px 12px', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--text-accent)' }}>{price}</span>
      </div>
      <h3 style={{ fontSize: tall ? 18 : 16, fontWeight: 600, marginTop: 14 }}>{name}</h3>
      {note && <p style={{ marginTop: 6, fontSize: 'var(--fs-caption)', color: 'var(--text-subtle)' }}>{note}</p>}
    </div>
  );
}
