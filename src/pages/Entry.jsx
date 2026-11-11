import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Entry() {
  const navigate = useNavigate()
  const { continueAsGuest } = useAuth()

  return (
    <div className="entry">
      <div className="entry-card card">
        <span className="eyebrow">Welcome</span>
        <h1 style={{ margin: '10px 0 6px' }}>How would you like to continue?</h1>
        <p style={{ marginBottom: 26 }}>
          Sign in to save assessments and receive full reports, continue as a guest to explore
          the platform first, or sign in as a doctor to review patient screenings.
        </p>
        <div className="stack gap-12">
          <button className="btn btn-primary btn-block" onClick={() => navigate('/signin')}>
            Continue as User
          </button>
          <button
            className="btn btn-secondary btn-block"
            onClick={() => navigate('/doctor/signin')}
          >
            Continue as Doctor
          </button>
          <button
            className="btn btn-secondary btn-block"
            onClick={() => {
              continueAsGuest()
              navigate('/home')
            }}
          >
            Continue as Guest
          </button>
        </div>
      </div>

      <style>{`
        .entry {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 24px; background: var(--color-bg);
        }
        .entry-card { max-width: 420px; width: 100%; padding: 40px 34px; }
      `}</style>
    </div>
  )
}