import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/common/Toast'
import composeIcon from '../Images/compose.png'

const FIELD_CONFIG = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'dob', label: 'Date of Birth', type: 'date' },
  { key: 'age', label: 'Age', type: 'readonly' },
  { key: 'contact', label: 'Contact Number', type: 'tel' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'country', label: 'Country', type: 'text' },
  { key: 'state', label: 'State', type: 'text' },
  { key: 'city', label: 'City', type: 'text' },
  { key: 'district', label: 'District', type: 'text' },
  { key: 'pincode', label: 'Pin Code', type: 'text' },
]

function calculateAge(dobString) {
  if (!dobString) return ''
  const dob = new Date(dobString)
  if (Number.isNaN(dob.getTime())) return ''

  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())

  if (!hasHadBirthdayThisYear) {
    age -= 1
  }

  return age >= 0 ? String(age) : ''
}

export default function Dashboard() {
  const { session, updateProfile } = useAuth()
  const { hash } = useLocation()
  const profile = session?.profile || {}

  const [isEditing, setIsEditing] = useState(false)
  const [formValues, setFormValues] = useState({})
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (hash === '#profile') {
      document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])

  const displayValue = (key) => {
    if (key === 'name') return profile.name || session?.name || ''
    if (key === 'email') return profile.email || session?.identifier || ''
    return profile[key] || ''
  }

  const startEditing = () => {
    const initial = {}
    FIELD_CONFIG.forEach(({ key }) => {
      initial[key] = displayValue(key)
    })
    setFormValues(initial)
    setIsEditing(true)
  }

  const cancelEditing = () => setIsEditing(false)

  const handleFieldChange = (key) => (e) => {
    setFormValues((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const handleDobChange = (e) => {
    const dob = e.target.value
    setFormValues((prev) => ({ ...prev, dob, age: calculateAge(dob) }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    updateProfile(formValues)
    setIsEditing(false)
    setToast({ type: 'success', title: 'Profile updated', message: 'Your changes have been saved.' })
  }

  return (
    <div>
      {/* ============ DASHBOARD OVERVIEW ============ */}
      <span className="eyebrow">Dashboard</span>
      <h1 style={{ margin: '8px 0 6px' }}>Welcome back, {session?.name || 'there'}</h1>
      <p style={{ marginBottom: 32 }}>Here's a quick look at your screening activity.</p>

      <div className="stat-grid">
        <div className="card stat-card">
          <span className="stat-label">Assessments completed</span>
          <span className="stat-value">0</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Reports available</span>
          <span className="stat-value">0</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Last assessment</span>
          <span className="stat-value stat-value-sm">Not started</span>
        </div>
      </div>

      <div className="card cta-card">
        <div>
          <h3 style={{ marginBottom: 6 }}>Start your first assessment</h3>
          <p style={{ marginBottom: 0 }}>Takes about 10–15 minutes, with optional audio/video capture.</p>
        </div>
        <Link to="/assessments" className="btn btn-primary">Start Assessment</Link>
      </div>

      {/* ============ PROFILE ============ */}
      <div id="profile" className="profile-section">
        <div className="profile-section-header">
          <div>
            <span className="eyebrow">My Profile</span>
            <h2 style={{ margin: '8px 0 0' }}>Profile details</h2>
          </div>
          {!isEditing && (
            <button className="btn btn-secondary btn-sm edit-profile-btn" onClick={startEditing}>
              <img src={composeIcon} alt="" className="edit-profile-icon" />
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form className="card profile-card" onSubmit={handleSave}>
            {FIELD_CONFIG.map(({ key, label, type }) => (
              <div key={key} className="profile-edit-row">
                <label htmlFor={`profile-${key}`} className="profile-label">{label}</label>
                {type === 'readonly' ? (
                  <input
                    id={`profile-${key}`}
                    type="text"
                    value={formValues[key] || ''}
                    readOnly
                    placeholder="Auto-filled"
                    className="profile-input field-readonly"
                  />
                ) : (
                  <input
                    id={`profile-${key}`}
                    type={type}
                    value={formValues[key] || ''}
                    onChange={key === 'dob' ? handleDobChange : handleFieldChange(key)}
                    className="profile-input"
                  />
                )}
              </div>
            ))}

            <div className="profile-edit-actions">
              <button type="button" className="btn btn-secondary" onClick={cancelEditing}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="card profile-card">
            {FIELD_CONFIG.map(({ key, label }) => (
              <div key={key} className="profile-row">
                <span className="profile-label">{label}</span>
                <span className="profile-value">{displayValue(key) || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <style>{`
        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
        .stat-card { padding: 22px 24px; display: flex; flex-direction: column; gap: 8px; }
        .stat-label { font-size: var(--fs-small); color: var(--color-text-secondary); }
        .stat-value { font-family: var(--font-display); font-size: 2rem; color: var(--color-primary-dark); }
        .stat-value-sm { font-size: 1.1rem; }
        .cta-card {
          display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
          padding: 26px 28px; background: var(--color-primary-tint); border-color: var(--color-primary-tint-2);
        }

        .profile-section { margin-top: 48px; padding-top: 40px; border-top: 1px solid var(--color-border); }
        .profile-section-header {
          max-width: 560px; margin: 0 auto 20px;
          display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
        }

        .edit-profile-btn { display: inline-flex; align-items: center; gap: 6px; }
        .edit-profile-icon { width: 15px; height: 15px; flex-shrink: 0; object-fit: contain; }

        .profile-card { padding: 8px 28px; max-width: 560px; margin: 0 auto; }
        .profile-row { display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--color-border); gap: 20px; }
        .profile-row:last-child { border-bottom: none; }
        .profile-label { color: var(--color-text-secondary); font-size: var(--fs-small); }
        .profile-value { font-weight: 600; text-align: right; }

        .profile-edit-row { padding: 14px 0; border-bottom: 1px solid var(--color-border); }
        .profile-edit-row:last-of-type { border-bottom: none; }
        .profile-edit-row .profile-label { display: block; margin-bottom: 6px; font-weight: 600; color: var(--color-text); }
        .profile-input {
          width: 100%; font-family: inherit; font-size: 0.92rem;
          padding: 9px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);
        }
        .profile-input:focus {
          border-color: var(--color-primary); outline: none;
          box-shadow: 0 0 0 3px var(--color-primary-tint);
        }
        .field-readonly { background: var(--color-surface-alt); color: var(--color-text-secondary); cursor: default; }
        .profile-edit-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 20px; }

        @media (max-width: 720px) {
          .stat-grid { grid-template-columns: 1fr; }
          .profile-section-header { flex-direction: column; }
        }
      `}</style>
    </div>
  )
}