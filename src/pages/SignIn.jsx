import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/common/Toast'

export default function SignIn() {
  const { signIn, signInWithProvider } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [toast, setToast] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = signIn(form)
    if (result.ok) {
      setToast({ type: 'success', title: 'Successfully logged in', message: 'Redirecting to your homepage…' })
    } else {
      setToast({ type: 'error', title: 'Invalid data', message: result.message })
    }
  }

  const closeToast = () => {
    const wasSuccess = toast?.type === 'success'
    setToast(null)
    if (wasSuccess) navigate('/home')
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <span className="eyebrow">Sign In</span>
        <h1 style={{ margin: '10px 0 24px' }}>Welcome back</h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="identifier">Username / Contact Number / Email ID</label>
            <input
              id="identifier"
              type="text"
              required
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Submit</button>
        </form>

        <div className="auth-divider"><span>or sign in through</span></div>

        <div className="stack gap-12">
          <button className="btn btn-secondary btn-block" onClick={() => { signInWithProvider('Google'); navigate('/home') }}>
            Continue with Google
          </button>
          <button className="btn btn-secondary btn-block" onClick={() => { signInWithProvider('Facebook'); navigate('/home') }}>
            Continue with Facebook
          </button>
        </div>

        <p style={{ marginTop: 22, textAlign: 'center' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>

      {toast && <Toast {...toast} onClose={closeToast} />}

      <style>{`
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: var(--color-bg); }
        .auth-card { max-width: 420px; width: 100%; padding: 38px 34px; }
        .auth-divider { display: flex; align-items: center; gap: 10px; margin: 22px 0; color: var(--color-text-secondary); font-size: 0.85rem; }
        .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--color-border); }
      `}</style>
    </div>
  )
}
