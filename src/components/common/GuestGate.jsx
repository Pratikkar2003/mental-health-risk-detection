import { useNavigate } from 'react-router-dom'

export default function GuestGate({ onDismiss }) {
  const navigate = useNavigate()

  return (
    <div className="toast-overlay" role="dialog" aria-modal="true">
      <div className="toast-card" style={{ maxWidth: 420 }}>
        <div className="toast-icon" style={{ background: 'var(--color-primary-tint)', color: 'var(--color-primary)' }}>
          🔒
        </div>
        <h3 style={{ marginBottom: '0.3em' }}>Sign in to continue</h3>
        <p style={{ marginBottom: '1.4em' }}>
          Guests can browse Home, How It Works &amp; Resources, and About Us. Creating a free account
          unlocks assessments, personal reports, and your dashboard.
        </p>
        <div className="stack gap-12">
          <button className="btn btn-primary btn-block" onClick={() => navigate('/signup')}>
            Create an account
          </button>
          <button className="btn btn-secondary btn-block" onClick={() => navigate('/signin')}>
            Sign in
          </button>
          <button className="btn btn-ghost btn-block" onClick={onDismiss}>
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}