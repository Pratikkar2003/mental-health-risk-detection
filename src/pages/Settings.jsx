import { useState } from 'react'

export default function Settings() {
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    reportReminders: true,
    cameraDefault: false,
  })

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }))

  const options = [
    { key: 'emailNotifications', label: 'Email notifications', desc: 'Receive updates about your assessments and reports.' },
    { key: 'reportReminders', label: 'Report reminders', desc: 'Get reminded to review your latest screening report.' },
    { key: 'cameraDefault', label: 'Enable camera by default', desc: 'Automatically request camera/microphone access when starting a session.' },
  ]

  return (
    <div>
      <span className="eyebrow">Settings</span>
      <h1 style={{ margin: '8px 0 24px' }}>Preferences</h1>

      <div className="card settings-card">
        {options.map((opt) => (
          <div key={opt.key} className="settings-row">
            <div>
              <strong>{opt.label}</strong>
              <p style={{ marginBottom: 0, marginTop: 2 }}>{opt.desc}</p>
            </div>
            <button
              className={`switch ${prefs[opt.key] ? 'is-on' : ''}`}
              role="switch"
              aria-checked={prefs[opt.key]}
              onClick={() => toggle(opt.key)}
            >
              <span className="switch-knob" />
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .settings-card { padding: 8px 28px; max-width: 620px; margin: 0 auto; }
        .settings-row { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 18px 0; border-bottom: 1px solid var(--color-border); }
        .settings-row:last-child { border-bottom: none; }
        .switch {
          width: 44px; height: 26px; border-radius: var(--radius-pill);
          background: var(--color-border); border: none; position: relative; flex-shrink: 0;
          transition: background 0.15s;
        }
        .switch.is-on { background: var(--color-primary); }
        .switch-knob {
          position: absolute; top: 3px; left: 3px; width: 20px; height: 20px;
          border-radius: 50%; background: #fff; transition: transform 0.15s;
        }
        .switch.is-on .switch-knob { transform: translateX(18px); }
      `}</style>
    </div>
  )
}
