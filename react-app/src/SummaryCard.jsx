// Thẻ tổng hợp dùng chung cho mọi trang quản trị — cùng một khối trị số, cùng bo góc,
// cùng vòng trang trí mờ ở góc, để các trang không mỗi nơi một kiểu thẻ khác nhau.
export const SUMMARY_TINTS = {
  green: ['#E7ECE5', '#2E3B35'],
  clay: ['#F3E7D2', '#A8792E'],
  blue: ['#DFE7EF', '#3F5C79'],
  red: ['#F6DED7', '#8E3421'],
  amber: ['#F7E9CC', '#8C5E14'],
  gray: ['#E4E9E4', '#4C5A50']
};

export default function SummaryCard({ icon, tone = 'green', label, value, hint, trend, trendGoodDirection = 'up', accent, accentColor = 'var(--accent)', negative }) {
  const [bg, fg] = SUMMARY_TINTS[tone] || SUMMARY_TINTS.green;
  const isGood = trend && (trendGoodDirection === 'up' ? trend.up : !trend.up);
  return (
    <div className="panel" style={{ position: 'relative', overflow: 'hidden', padding: '14px 16px', flex: '1 1 190px', minWidth: 160, borderRadius: 16 }}>
      <svg viewBox="0 0 120 120" style={{ position: 'absolute', top: -26, right: -26, width: 86, height: 86, color: fg, opacity: .06, pointerEvents: 'none' }}>
        <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeWidth="10" />
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <span style={{ width: 32, height: 32, borderRadius: 10, background: bg, color: fg, display: 'grid', placeItems: 'center', flex: '0 0 auto' }}>{icon}</span>
        {accent && <span style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor, boxShadow: '0 0 0 3px var(--surface-accent-soft)' }} />}
      </div>
      <div style={{ marginTop: 10, fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums', position: 'relative', color: negative ? 'var(--danger-text)' : 'var(--text-body)' }}>{value}</div>
      <div style={{ marginTop: 2, fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 500, position: 'relative' }}>{label}</div>
      {trend ? (
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, color: isGood ? '#2E7D4F' : 'var(--danger-text)', position: 'relative' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">{trend.up ? <path d="M4 17 20 3M13 3h7v7" /> : <path d="M4 7 20 21M13 21h7v-7" />}</svg>
          {trend.pct}% {trend.label || 'so với kỳ trước'}
        </div>
      ) : hint ? (
        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-subtle)', position: 'relative' }}>{hint}</div>
      ) : null}
    </div>
  );
}
