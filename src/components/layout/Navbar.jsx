import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import profileIcon from '../../Images/profile-icon.png'

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/assessments', label: 'Assessments' },
  { to: '/about', label: 'About Us' },
]

export default function Navbar() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = () => {
    setProfileMenuOpen(false)
    signOut()
    navigate('/welcome')
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/home" className="navbar-brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="14" fill="var(--color-primary-tint)" />
              <path d="M6,16 L11,16 L13,10 L16,21 L19,13 L21,16 L24,16" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="brand-name">Manodarshi</span>
        </Link>

        <nav className={`navbar-links ${open ? 'is-open' : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `navbar-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          {session?.mode === 'user' ? (
            <div className="profile-menu" ref={profileMenuRef}>
              <button
                className="btn btn-ghost btn-sm profile-trigger"
                onClick={() => setProfileMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
              >
                <img src={profileIcon} alt="" className="profile-icon" />
                {session.name}
                <span className={`profile-chevron ${profileMenuOpen ? 'is-open' : ''}`} aria-hidden="true">▾</span>
              </button>

              {profileMenuOpen && (
                <div className="profile-dropdown" role="menu">
                  <Link
                    to="/dashboard#profile"
                    className="profile-dropdown-item"
                    role="menuitem"
                    onClick={() => { setProfileMenuOpen(false); setOpen(false) }}
                  >
                    My Profile
                  </Link>
                  <button
                    className="profile-dropdown-item profile-dropdown-danger"
                    role="menuitem"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => navigate(session?.mode === 'guest' ? '/signin' : '/assessments')}>
              Start Assessment
            </button>
          )}
          <button className="navbar-burger" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <style>{`
        .navbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(248, 250, 249, 0.92);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--color-border);
        }
        .navbar-inner {
          height: var(--navbar-height);
          display: flex; align-items: center; justify-content: space-between; gap: 24px;
        }
        .navbar-brand { display: flex; align-items: center; gap: 10px; }
        .brand-name { font-family: var(--font-display); font-weight: 600; font-size: 1.25rem; color: var(--color-primary-dark); }
        .navbar-links { display: flex; align-items: center; gap: 6px; }
        .navbar-link {
          padding: 8px 12px; border-radius: var(--radius-pill);
          font-size: 0.94rem; font-weight: 500; color: var(--color-text-secondary);
          transition: background 0.15s, color 0.15s;
        }
        .navbar-link:hover { background: var(--color-primary-tint); color: var(--color-primary-dark); }
        .navbar-link.is-active { background: var(--color-primary-tint); color: var(--color-primary-dark); }
        .navbar-actions { display: flex; align-items: center; gap: 10px; }
        .navbar-burger { display: none; flex-direction: column; gap: 4px; background: none; border: none; padding: 6px; }
        .navbar-burger span { width: 20px; height: 2px; background: var(--color-text); border-radius: 2px; }

        .profile-menu { position: relative; }
        .profile-trigger { display: inline-flex; align-items: center; gap: 6px; }
        .profile-icon { width: 20px; height: 20px; flex-shrink: 0; object-fit: contain; }
        .profile-chevron {
          font-size: 0.65rem; color: var(--color-text-secondary);
          transition: transform 0.15s var(--ease-signal);
        }
        .profile-chevron.is-open { transform: rotate(180deg); }
        .profile-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-sm);
          box-shadow: var(--shadow-elevated); min-width: 180px; overflow: hidden; z-index: 110;
          animation: popIn 0.15s var(--ease-signal);
        }
        .profile-dropdown-item {
          display: block; width: 100%; text-align: left;
          padding: 11px 16px; font-size: 0.9rem; font-family: inherit;
          color: var(--color-text); background: none; border: none;
        }
        .profile-dropdown-item:hover { background: var(--color-primary-tint); color: var(--color-primary-dark); }
        .profile-dropdown-danger { color: var(--color-error); }
        .profile-dropdown-danger:hover { background: #FBE9E7; color: var(--color-error); }

        @media (max-width: 920px) {
          .navbar-links {
            position: absolute; top: var(--navbar-height); left: 0; right: 0;
            background: var(--color-surface); border-bottom: 1px solid var(--color-border);
            flex-direction: column; align-items: stretch; padding: 8px 20px 16px;
            display: none;
          }
          .navbar-links.is-open { display: flex; }
          .navbar-burger { display: flex; }
        }
      `}</style>
    </header>
  )
}