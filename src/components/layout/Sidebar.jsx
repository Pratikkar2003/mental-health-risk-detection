import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: '⌂' },
  { to: '/dashboard/assessments', label: 'My Assessments', icon: '📝' },
  { to: '/dashboard/reports', label: 'My Reports', icon: '📄' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
  { to: '/help', label: 'Help & Support', icon: '❓' },
]

export default function Sidebar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}
          >
            <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button className="sidebar-link sidebar-signout" onClick={() => { signOut(); navigate('/welcome') }}>
        <span className="sidebar-icon" aria-hidden="true">↪</span>
        Sign Out
      </button>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          flex-shrink: 0;
          border-right: 1px solid var(--color-border);
          padding: 24px 12px;
          display: flex; flex-direction: column; justify-content: space-between;
          position: sticky;
          top: var(--navbar-height);
          height: calc(100vh - var(--navbar-height));
          overflow-y: auto;
        }
        .sidebar-nav { display: flex; flex-direction: column; gap: 2px; }
        .sidebar-link {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 14px; border-radius: var(--radius-sm);
          font-size: 0.94rem; font-weight: 500; color: var(--color-text-secondary);
          background: none; border: none; text-align: left; width: 100%;
          transition: background 0.15s, color 0.15s;
        }
        .sidebar-link:hover { background: var(--color-primary-tint); color: var(--color-primary-dark); }
        .sidebar-link.is-active { background: var(--color-primary); color: #fff; }
        .sidebar-icon { width: 20px; text-align: center; }
        .sidebar-signout { color: var(--color-error); margin-top: 12px; }
        .sidebar-signout:hover { background: #FBE9E7; }

        @media (max-width: 920px) {
          .sidebar { display: none; }
        }
      `}</style>
    </aside>
  )
}