import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'manodarshi.session'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [session])

  // Mocked sign-in: in a real app this hits your auth API.
  const signIn = ({ identifier, password }) => {
    if (!identifier || !password || password.length < 4) {
      return { ok: false, message: 'Please enter a valid username/email and password.' }
    }
    setSession({
      mode: 'user',
      name: identifier.split('@')[0] || identifier,
      identifier,
    })
    return { ok: true }
  }

  const signInWithProvider = (provider) => {
    setSession({ mode: 'user', name: `${provider} User`, identifier: `${provider.toLowerCase()}@manodarshi.app` })
    return { ok: true }
  }

  // Mocked sign-up
  const signUp = (formData) => {
    const required = ['name', 'dob', 'age', 'contact', 'email']
    for (const field of required) {
      if (!formData[field]) {
        return { ok: false, message: 'Please complete all required fields correctly.' }
      }
    }
    const { medicalReportFiles, ...profile } = formData
    setSession({ mode: 'user', name: formData.name, identifier: formData.email, profile })
    return { ok: true }
  }

const continueAsGuest = () => {
setSession({ mode: 'guest', name: 'Guest' })
}

// Used by the Dashboard's "Edit Profile" flow to persist changes.
// Keeps session.name/identifier in sync if name/email were edited.
const updateProfile = (updates) => {
  setSession((prev) => {
    if (!prev) return prev
    const nextProfile = { ...prev.profile, ...updates }
    return {
      ...prev,
      name: nextProfile.name || prev.name,
      identifier: nextProfile.email || prev.identifier,
      profile: nextProfile,
    }
  })
  return { ok: true }
}

const signOut = () => setSession(null)

const value = {
  session,
  isAuthenticated: session?.mode === 'user',
  isGuest: session?.mode === 'guest',
  signIn,
  signInWithProvider,
  signUp,
  continueAsGuest,
  updateProfile,
  signOut,
}
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
