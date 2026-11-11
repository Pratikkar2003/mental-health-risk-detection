import { useState } from 'react'
import { PERMISSIONS, patientShare } from './doctorData'

// Patient-side consent card. Shown on the existing Result page (hidden when printing).
export default function ShareWithDoctor({ state, profile }) {
  const [email, setEmail] = useState('')
  const [perms, setPerms] = useState(['report', 'qa', 'history'])
  const [done, setDone] = useState(null); const [hidden, setHidden] = useState(false); const [err, setErr] = useState('')
  if (hidden) return null
  const send = () => {
    if (!/^\S+@\S+\.\S+$/.test(email) && !/^DOC-\d+$/i.test(email)) return setErr('Enter a valid doctor email or Doctor ID.')
    setDone(patientShare({ doctorEmail: email, profile, state, permissions: perms }))
  }
  return (
    <div className="container no-print"><section className="card share" aria-labelledby="share-h">
      <h3 id="share-h">Would you like to share this assessment with your doctor?</h3>
      {done ? <p role="status" style={{ margin: 0 }}>✓ Access request sent to {email}. Your Patient ID is <strong>{done.patientId}</strong>. Nothing is visible to the doctor until they accept, and only the items you selected will be shared.</p> : <>
        <div className="field"><label htmlFor="doc-email">Doctor Email / Doctor ID</label><input id="doc-email" value={email} onChange={(e) => { setEmail(e.target.value); setErr('') }} />{err && <span className="field-error" role="alert">{err}</span>}</div>
        <fieldset style={{ border: 0, padding: 0, margin: '0 0 14px' }}><legend style={{ fontWeight: 600, fontSize: 'var(--fs-small)', marginBottom: 6 }}>Information to share</legend>
          {PERMISSIONS.map(([k, l]) => <label key={k} style={{ display: 'block', fontSize: 'var(--fs-small)' }}><input type="checkbox" checked={perms.includes(k)} onChange={() => setPerms((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))} /> {l}</label>)}</fieldset>
        <div className="row gap-12"><button className="btn btn-primary btn-sm" onClick={send}>Send Access Request</button><button className="btn btn-secondary btn-sm" onClick={() => setHidden(true)}>Maybe Later</button></div></>}
      <style>{`.share { padding: 22px; margin-top: 20px; max-width: 560px; margin-left: auto; margin-right: auto; }`}</style>
    </section></div>
  )
}
