import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { session } = useAuth()
  const profile = session?.profile || {}

  const fields = [
    ['Name', profile.name || session?.name],
    ['Date of Birth', profile.dob],
    ['Age', profile.age],
    ['Contact Number', profile.contact],
    ['Email', profile.email || session?.identifier],
    ['Country', profile.country],
    ['State', profile.state],
    ['City', profile.city],
    ['District', profile.district],
    ['Pin Code', profile.pincode],
  ]

  return (
    <div>
      <span className="eyebrow">My Profile</span>
      <h1 style={{ margin: '8px 0 24px' }}>Profile details</h1>

      <div className="card profile-card">
        {fields.map(([label, value]) => (
          <div key={label} className="profile-row">
            <span className="profile-label">{label}</span>
            <span className="profile-value">{value || '—'}</span>
          </div>
        ))}
      </div>

      <style>{`
        .profile-card { padding: 8px 28px; max-width: 560px; }
        .profile-row { display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--color-border); gap: 20px; }
        .profile-row:last-child { border-bottom: none; }
        .profile-label { color: var(--color-text-secondary); font-size: var(--fs-small); }
        .profile-value { font-weight: 600; text-align: right; }
      `}</style>
    </div>
  )
}
