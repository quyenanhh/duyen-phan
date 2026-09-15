// Thẻ tổng hợp dùng chung cho mọi trang quản trị — cùng một khối trị số, cùng bo góc,
// để các trang không mỗi nơi một kiểu thẻ khác nhau. Chỉ 3 tông màu có chủ đích:
// "brand" cho số liệu bình thường, "warn" cho thứ cần chú ý, "neutral" cho số liệu phụ/chi phí.
export const SUMMARY_TINTS = {
  brand: ['#E7ECE5', '#3E4C3E'],
  warn: ['#F6DED7', '#8E3421'],
  neutral: ['#F1EAE0', '#7A6A54']
};

export default function SummaryCard({ icon, tone = 'brand', label, value, hint, trend, trendGoodDirection = 'up', accent, accentColor = 'var(--danger)', negative }) {
  const [bg, fg] = SUMMARY_TINTS[tone] || SUMMARY_TINTS.brand;
  const isGood = trend && (trendGoodDirection === 'up' ? trend.up : !trend.up);
  return (
    <div className="panel" style={{ position: 'relative', overflow: 'hidden', padding: '20px 22px', flex: '1 1 240px', maxWidth: 320, minWidth: 200, borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div aria-hidden style={{ position: 'absolute', right: -2, bottom: -6, width: 34, height: 34, transform: 'scale(3.2)', transformOrigin: 'bottom right', color: fg, opacity: .07, pointerEvents: 'none' }}>
        {icon}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, position: 'relative' }}>
        <span style={{ width: 44, height: 44, borderRadius: 12, background: bg, color: fg, display: 'grid', placeItems: 'center', flex: '0 0 auto' }}>{icon}</span>
        <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, overflowWrap: 'anywhere', fontVariantNumeric: 'tabular-nums', color: negative ? 'var(--danger-text)' : 'var(--text-body)' }}>{value}</div>
          <div style={{ marginTop: 3, fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
        </div>
        {accent && <span style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor, flex: '0 0 auto', marginTop: 6 }} />}
      </div>
      {trend ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 600, color: isGood ? '#2E7D4F' : 'var(--danger-text)', paddingTop: 10, borderTop: '1px solid var(--border-soft)', position: 'relative' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">{trend.up ? <path d="M4 17 20 3M13 3h7v7" /> : <path d="M4 7 20 21M13 21h7v-7" />}</svg>
          {trend.pct}% {trend.label || 'so với kỳ trước'}
        </div>
      ) : hint ? (
        <div style={{ fontSize: 12.5, color: 'var(--text-subtle)', paddingTop: 10, borderTop: '1px solid var(--border-soft)', position: 'relative' }}>{hint}</div>
      ) : null}
    </div>
  );
}
