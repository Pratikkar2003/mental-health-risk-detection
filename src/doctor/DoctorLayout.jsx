import { Link, NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useDoctor } from './DoctorContext'
import { useStore, accessFor } from './doctorData'

export function DoctorProtectedRoute({ children }) {
  const { doctor } = useDoctor()
  return doctor ? children : <Navigate to="/doctor/signin" replace />
}

const NAV = [
  ['/doctor', 'Dashboard', true],
  ['/doctor/patients', 'Patient List', false, 1],
  ['/doctor/access', 'Access Patient', false, 1],
  ['/doctor/assessments', 'Recent Assessments', false, 1],
  ['/doctor/assessments?view=history', 'Assessment History', false, 1, true],
  ['/doctor/shared', 'Shared Reports'],
  ['/doctor/requests', 'Access Requests'],
  ['/doctor/notes', 'Clinical Notes'],
  ['/doctor/resources', 'Resources'],
  ['/doctor/settings', 'Settings'],
  ['/doctor/help', 'Help & Support'],
]

export default function DoctorLayout() {
  const { doctor, signOut } = useDoctor()
  const navigate = useNavigate()
  useStore()
  const pending = accessFor(doctor.email).filter((a) => a.status === 'pending').length
  const group = (t) => <div className="dsb-group">{t}</div>

  return (
    <div className="dshell">
      <header className="dhead">
        <Link to="/doctor" className="dbrand" aria-label="Manodarshi Doctor Portal home">
          <svg width="30" height="30" viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="16" fill="var(--color-primary-tint)" /><path d="M7,18 L12,18 L14,11 L17,24 L20,9 L23,18 L27,18" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span>Manodarshi <small>Doctor Portal</small></span>
        </Link>
        <div className="dhead-right">
          <Link to="/doctor/requests" className="dbell" aria-label={`Notifications: ${pending} pending access requests`}>🔔{pending > 0 && <b>{pending}</b>}</Link>
          <details className="dmenu">
            <summary>{doctor.name} <span className={`vbadge ${doctor.verificationStatus}`}>{doctor.verificationStatus}</span></summary>
            <div className="dmenu-pop card">
              <Link to="/doctor/settings">Profile & Settings</Link>
              <button onClick={() => { signOut(); navigate('/welcome') }}>Sign Out</button>
            </div>
          </details>
        </div>
      </header>
      <div className="dbody">
        <nav className="dsb" aria-label="Doctor navigation">
          {NAV.map(([to, label, end, indent, q], i) => (
            <div key={to}>
              {i === 1 && group('Patients')}{i === 3 && group('Assessments')}{i === 5 && <div className="dsb-gap" />}
              {q ? <Link className="dsb-link indent" to={to}>{label}</Link>
                : <NavLink end={end} to={to} className={({ isActive }) => `dsb-link ${indent ? 'indent' : ''} ${isActive ? 'is-active' : ''}`}>{label}{label === 'Access Requests' && pending > 0 ? ` (${pending})` : ''}</NavLink>}
            </div>
          ))}
          <button className="dsb-link dsb-out" onClick={() => { signOut(); navigate('/welcome') }}>Sign Out</button>
        </nav>
        <main className="dmain" id="doctor-main">
          {doctor.verificationStatus !== 'Verified' && <div className="dnote warn" role="status"><strong>! Verification pending.</strong> Patient access is disabled until your registration is verified.</div>}
          <Outlet />
        </main>
      </div>
      <style>{`
        .dshell { min-height: 100vh; display: flex; flex-direction: column; background: var(--color-bg); }
        .dhead { height: 64px; background: var(--color-surface); border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: sticky; top: 0; z-index: 20; }
        .dbrand { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 600; color: var(--color-primary-dark); font-size: 1.15rem; }
        .dbrand small { font-family: var(--font-body); font-size: var(--fs-caption); color: var(--color-text-secondary); font-weight: 500; margin-left: 6px; }
        .dhead-right { display: flex; align-items: center; gap: 18px; }
        .dbell { position: relative; font-size: 1.2rem; padding: 6px; }
        .dbell b { position: absolute; top: -2px; right: -4px; background: var(--color-error); color: #fff; font-size: 0.65rem; border-radius: 999px; padding: 1px 6px; }
        .dmenu { position: relative; } .dmenu summary { cursor: pointer; font-weight: 600; color: var(--color-primary-dark); list-style: none; }
        .dmenu-pop { position: absolute; right: 0; top: 36px; min-width: 190px; padding: 8px; display: flex; flex-direction: column; z-index: 30; }
        .dmenu-pop a, .dmenu-pop button { text-align: left; background: none; border: none; padding: 9px 12px; border-radius: var(--radius-sm); color: var(--color-text); font-size: var(--fs-small); }
        .dmenu-pop a:hover, .dmenu-pop button:hover { background: var(--color-primary-tint); }
        .vbadge { font-size: var(--fs-caption); padding: 2px 8px; border-radius: 999px; margin-left: 6px; border: 1px solid; }
        .vbadge.Verified { color: var(--color-success); } .vbadge.Pending { color: var(--color-warning); }
        .dbody { display: flex; flex: 1; align-items: flex-start; }
        .dsb { width: var(--sidebar-width); flex-shrink: 0; border-right: 1px solid var(--color-border); padding: 18px 12px; position: sticky; top: 64px; height: calc(100vh - 64px); overflow-y: auto; }
        .dsb-group { font-size: var(--fs-caption); color: var(--color-text-secondary); font-weight: 600; padding: 12px 14px 4px; }
        .dsb-gap { height: 8px; }
        .dsb-link { display: block; width: 100%; text-align: left; background: none; border: none; padding: 10px 14px; border-radius: var(--radius-sm); font-size: 0.93rem; font-weight: 500; color: var(--color-text-secondary); }
        .dsb-link.indent { padding-left: 28px; }
        .dsb-link:hover { background: var(--color-primary-tint); color: var(--color-primary-dark); }
        .dsb-link.is-active { background: var(--color-primary); color: #fff; }
        .dsb-out { color: var(--color-error); margin-top: 12px; }
        .dmain { flex: 1; min-width: 0; padding: 28px 28px 60px; max-width: 1100px; }
        @media (max-width: 920px) { .dbody { flex-direction: column; } .dsb { width: 100%; height: auto; position: static; display: flex; flex-wrap: wrap; gap: 4px; border-right: none; border-bottom: 1px solid var(--color-border); padding: 8px; } .dsb-group, .dsb-gap { display: none; } .dsb-link, .dsb-link.indent { width: auto; padding: 8px 12px; } .dmain { padding: 20px 16px 48px; } }
        /* shared doctor-portal primitives */
        .dgrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 16px; margin: 20px 0 28px; }
        .dstat { padding: 18px 20px; } .dstat strong { display: block; font-family: var(--font-display); font-size: 2rem; color: var(--color-primary-dark); } .dstat span { color: var(--color-text-secondary); font-size: var(--fs-small); }
        .dtable-wrap { overflow-x: auto; } .dtable { width: 100%; border-collapse: collapse; font-size: var(--fs-small); }
        .dtable th { text-align: left; padding: 11px 14px; border-bottom: 1px solid var(--color-border); color: var(--color-text-secondary); font-weight: 600; background: var(--color-surface-alt); }
        .dtable td { padding: 11px 14px; border-bottom: 1px solid var(--color-border); vertical-align: top; color: var(--color-text); }
        .risk { display: inline-flex; gap: 5px; align-items: center; font-weight: 600; font-size: var(--fs-small); padding: 2px 10px; border-radius: 999px; border: 1px solid currentColor; }
        .risk.Low { color: var(--color-success); } .risk.Moderate { color: var(--color-warning); } .risk.High { color: var(--color-error); }
        .dnote { padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: var(--color-secondary-tint); font-size: var(--fs-small); margin-bottom: 18px; color: var(--color-text); }
        .dnote.warn { border-color: var(--color-warning); }
        .dpad { padding: 22px; margin-bottom: 20px; } .dtabs { display: flex; gap: 4px; flex-wrap: wrap; border-bottom: 1px solid var(--color-border); margin: 20px 0; }
        .dtab { background: none; border: none; padding: 10px 16px; font-weight: 600; color: var(--color-text-secondary); border-bottom: 3px solid transparent; }
        .dtab[aria-selected="true"] { color: var(--color-primary-dark); border-bottom-color: var(--color-primary); }
        .dtab:disabled { opacity: .5; cursor: not-allowed; }
        @media print { .dhead, .dsb, .no-print { display: none !important; } .dmain { padding: 0; max-width: none; } }
      `}</style>
    </div>
  )
}
