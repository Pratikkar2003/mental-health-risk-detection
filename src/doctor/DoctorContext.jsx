import { createContext, useContext, useState } from 'react'
import { getDoctor } from './doctorData'

// Separate from the patient AuthContext so the User/Guest flow is untouched.
// Only a minimal identity is kept, in sessionStorage (cleared when the tab closes).
// Patient data is never stored in the browser.
const Ctx = createContext(null)
const KEY = 'manodarshi.doctor'

export function DoctorProvider({ children }) {
  const [doctor, setDoctor] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(KEY)) } catch { return null }
  })
  const save = (d) => { setDoctor(d); d ? sessionStorage.setItem(KEY, JSON.stringify(d)) : sessionStorage.removeItem(KEY) }

  const signIn = ({ identifier, password }) => {
    if (!identifier || !password || password.length < 4) return { ok: false, message: 'Enter your professional email / Doctor ID and a password of at least 4 characters.' }
    const d = getDoctor(identifier.includes('@') ? identifier : '')
    if (!d) return { ok: false, message: 'No doctor account found. Register as a doctor first, or use the demo account shown below.' }
    save({ doctorId: d.doctorId, name: d.name, email: d.email, verificationStatus: d.verificationStatus })
    return { ok: true }
  }
  return <Ctx.Provider value={{ doctor, signIn, signOut: () => save(null) }}>{children}</Ctx.Provider>
}
export const useDoctor = () => useContext(Ctx)
