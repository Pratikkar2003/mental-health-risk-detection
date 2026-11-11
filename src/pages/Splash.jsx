import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/welcome'), 2600)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="splash" onClick={() => navigate('/welcome')}>
      <svg width="88" height="88" viewBox="0 0 88 88" className="splash-mark">
        <circle cx="44" cy="44" r="42" fill="var(--color-primary-tint)" />
        <path
          className="signal-line"
          d="M14,44 L28,44 L34,26 L42,62 L50,18 L58,58 L64,44 L74,44"
          style={{ color: 'var(--color-primary)' }}
        />
      </svg>
      <h1 className="splash-title">Manodarshi</h1>
      <p className="splash-tag">Early screening, gently done.</p>

      <style>{`
        .splash {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 8px;
          background: var(--color-bg); cursor: pointer;
        }
        .splash-mark { margin-bottom: 6px; }
        .splash-title { font-size: 2.4rem; margin: 0; letter-spacing: -0.01em; }
        .splash-tag { color: var(--color-text-secondary); font-size: 1rem; }
      `}</style>
    </div>
  )
}
