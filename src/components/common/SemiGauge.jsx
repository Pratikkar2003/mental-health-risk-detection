const RISK_COLORS = {
  Low: '#287D55',
  Mild: '#287D55',
  Moderate: '#A86500',
  High: '#B42318',
  'Very High': '#B42318',
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) }
}

// Arc from startAngle down to endAngle (both in 0-180, startAngle > endAngle), sweeping over the top.
function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle)
  const end = polarToCartesian(cx, cy, r, endAngle)
  return `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`
}

export default function SemiGauge({ score = 0, category = 'Low', width = 260 }) {
  const cx = 130
  const cy = 118
  const r = 100
  const strokeW = 20

  const needleAngle = 180 - (Math.min(Math.max(score, 0), 100) / 100) * 180
  const needleTip = polarToCartesian(cx, cy, r - strokeW / 2 - 6, needleAngle)
  const color = RISK_COLORS[category] || '#0F5C5E'

  return (
    <div style={{ width, margin: '0 auto', textAlign: 'center' }}>
      <svg viewBox="0 0 260 150" width={width} height={(width * 150) / 260}>
        {/* background segments: low / moderate / high */}
        <path d={describeArc(cx, cy, r, 180, 108)} fill="none" stroke="#287D55" strokeWidth={strokeW} strokeLinecap="round" />
        <path d={describeArc(cx, cy, r, 108, 54)} fill="none" stroke="#A86500" strokeWidth={strokeW} strokeLinecap="round" />
        <path d={describeArc(cx, cy, r, 54, 0)} fill="none" stroke="#B42318" strokeWidth={strokeW} strokeLinecap="round" />

        {/* needle */}
        <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y} stroke="var(--color-text)" strokeWidth="3" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="7" fill="var(--color-text)" />

        <text x={cx - r - 4} y={cy + 18} fontFamily="var(--font-body)" fontSize="11" fill="var(--color-text-secondary)">Low</text>
        <text x={cx + r - 22} y={cy + 18} fontFamily="var(--font-body)" fontSize="11" fill="var(--color-text-secondary)">Very High</text>
      </svg>

      <div className="semi-gauge-score">
        <span style={{ fontSize: '2.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>{score}</span>
        <span style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}> / 100</span>
      </div>
      <div style={{ fontWeight: 700, letterSpacing: '0.04em', color, marginTop: 2 }}>
        {category.toUpperCase()} RISK
      </div>
    </div>
  )
}
