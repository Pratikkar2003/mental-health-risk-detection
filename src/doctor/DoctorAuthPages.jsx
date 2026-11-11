import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDoctor } from './DoctorContext'
import { registerDoctor, DEMO_DOCTOR } from './doctorData'

export function DoctorSignIn() {
  const { signIn } = useDoctor()
  const navigate = useNavigate()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [error, setError] = useState('')
  const submit = (e) => {
    e.preventDefault()
    const r = signIn(form)
    r.ok ? navigate('/doctor') : setError(r.message)
  }
  return (
    <div className="dauth">
      <div className="card dauth-card">
        <span className="eyebrow">Doctor Sign In</span>
        <h1 style={{ margin: '10px 0 24px' }}>Doctor Portal</h1>
        <form onSubmit={submit} noValidate>
          <div className="field"><label htmlFor="did">Professional Email / Doctor ID</label>
            <input id="did" required value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} /></div>
          <div className="field"><label htmlFor="dpw">Password</label>
            <input id="dpw" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          {error && <p role="alert" className="field-error" style={{ marginBottom: 12 }}>{error}</p>}
          <button className="btn btn-primary btn-block" type="submit">Sign In</button>
        </form>
        <p style={{ marginTop: 16, fontSize: 'var(--fs-small)' }}>
          <button className="btn-link" onClick={() => setError('Password reset is not available in this prototype.')}>Forgot password?</button>
        </p>
        <p style={{ fontSize: 'var(--fs-small)' }}>Prototype demo account: <strong>{DEMO_DOCTOR.email}</strong> with any password of 4+ characters.</p>
        <p>New to Manodarshi? <Link to="/doctor/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Register as Doctor</Link></p>
        <Link to="/welcome" className="btn btn-ghost btn-sm">Back</Link>
      </div>
      <DAuthStyle />
    </div>
  )
}

const FIELDS = [['name', 'Full Name'], ['email', 'Professional Email', 'email'], ['contact', 'Contact Number'], ['registrationNumber', 'Medical Registration Number'],
  ['qualification', 'Qualification'], ['specialization', 'Specialization'], ['institution', 'Hospital / Clinic / Institution'], ['city', 'City'], ['state', 'State'],
  ['password', 'Password', 'password'], ['confirm', 'Confirm Password', 'password']]

export function DoctorRegister() {
  const [form, setForm] = useState({})
  const [msg, setMsg] = useState(null)
  const submit = (e) => {
    e.preventDefault()
    if (FIELDS.some(([k]) => !form[k])) return setMsg({ bad: true, text: 'Please complete all fields.' })
    if (form.password.length < 8) return setMsg({ bad: true, text: 'Password must be at least 8 characters.' })
    if (form.password !== form.confirm) return setMsg({ bad: true, text: 'Passwords do not match.' })
    const { confirm, password, ...rest } = form
    const r = registerDoctor(rest)
    setMsg(r.ok ? { text: 'Registration received. Verification Status: Pending. You can sign in; patient access stays disabled until you are verified.' } : { bad: true, text: r.message })
  }
  return (
    <div className="dauth">
      <div className="card dauth-card" style={{ maxWidth: 640 }}>
        <span className="eyebrow">Doctor Registration</span>
        <h1 style={{ margin: '10px 0 8px' }}>Register as Doctor</h1>
        <p><strong>Verification Status: Pending</strong>. Verification is simulated in this prototype.</p>
        <form onSubmit={submit} noValidate>
          <div className="field-row">
            {FIELDS.map(([k, label, type]) => (
              <div className="field" key={k}><label htmlFor={`r-${k}`}>{label}</label>
                <input id={`r-${k}`} type={type || 'text'} value={form[k] || ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
            ))}
          </div>
          {msg && <p role="alert" className={msg.bad ? 'field-error' : ''} style={{ marginBottom: 12, color: msg.bad ? undefined : 'var(--color-success)' }}>{msg.text}</p>}
          <button className="btn btn-primary btn-block" type="submit">Submit Registration</button>
        </form>
        <p style={{ marginTop: 16 }}><Link to="/doctor/signin" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Back to Doctor Sign In</Link></p>
      </div>
      <DAuthStyle />
    </div>
  )
}

const DAuthStyle = () => (
  <style>{`
    .dauth { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: var(--color-bg); }
    .dauth-card { max-width: 420px; width: 100%; padding: 36px 32px; }
    .btn-link { background: none; border: none; padding: 0; color: var(--color-primary); font-weight: 600; text-decoration: underline; font-size: inherit; }
  `}</style>
)
