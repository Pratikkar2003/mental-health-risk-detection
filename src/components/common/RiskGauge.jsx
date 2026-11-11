const RISK_COLORS = {
  Low: 'var(--color-success)',
  Mild: 'var(--color-primary)',
  Moderate: 'var(--color-warning)',
  High: 'var(--color-error)',
  'Very High': 'var(--color-error)',
}

export default function RiskGauge({ score = 0, category = 'Low', size = 200, showSignal = true }) {
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(score, 100) / 100) * circumference
  const color = RISK_COLORS[category] || 'var(--color-primary)'

  return (
    <div style={{ width: size, margin: '0 auto', textAlign: 'center' }}>
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <circle cx="100" cy="100" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="14" />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,0.61,0.36,1)' }}
        />
        {/* signature bio-signal waveform inside the ring */}
        {showSignal && (
          <path
            className="signal-line"
            d="M40,100 L65,100 L75,80 L85,120 L95,60 L105,140 L115,100 L160,100"
            style={{ color }}
          />
        )}
        <text x="100" y="105" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="30" fontWeight="600" fill="var(--color-text)">
          {score}
        </text>
        <text x="100" y="128" textAnchor="middle" fontFamily="var(--font-body)" fontSize="12" fill="var(--color-text-secondary)">
          / 100
        </text>
      </svg>
      <div className="eyebrow" style={{ color, marginTop: 4 }}>{category} risk</div>
    </div>
  )
}
