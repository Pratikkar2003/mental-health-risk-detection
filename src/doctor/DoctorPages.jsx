import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDoctor } from './DoctorContext'
import { useStore, accessFor, patientBasic, lookupForAccess, doctorRequestAccess, respondToRequest, notesFor, PERMISSIONS, fmt, riskOf, RISK_ICON, getAudit } from './doctorData'

export const Risk = ({ level }) => <span className={`risk ${level}`}><span aria-hidden="true">{RISK_ICON[level]}</span>{level}</span>
const Head = ({ title, sub }) => (<><h1 style={{ margin: '0 0 6px' }}>{title}</h1>{sub && <p style={{ marginBottom: 18 }}>{sub}</p>}</>)

// Rows for every assessment of every patient this doctor is authorized for.
function useAuthorized() {
  const { doctor } = useDoctor(); useStore()
  const grants = accessFor(doctor.email).filter((a) => a.status === 'authorized')
  const rows = grants.flatMap((g) => (patientBasic(g.patientId)?.assessments || []).map((a) => ({ ...a, grant: g, patient: patientBasic(g.patientId) })))
  rows.sort((a, b) => b.date.localeCompare(a.date))
  return { doctor, grants, rows, all: accessFor(doctor.email) }
}

function PatientTable({ rows }) {
  const nav = useNavigate()
  if (!rows.length) return <p>No authorized patients yet. Use <Link to="/doctor/access" style={{ color: 'var(--color-primary)' }}>Access Patient</Link> or wait for a patient to share a report.</p>
  return (
    <div className="dtable-wrap"><table className="dtable">
      <caption className="sr-only" style={{ position: 'absolute', left: -9999 }}>Authorized patients</caption>
      <thead><tr><th>Patient</th><th>Patient ID</th><th>Latest Assessment</th><th>Risk Level</th><th>Action</th></tr></thead>
      <tbody>{rows.map((r) => (
        <tr key={r.patient.patientId}><td>{r.patient.profile.name}</td><td>{r.patient.patientId}</td><td>{fmt(r.date)}</td><td><Risk level={r.category} /></td>
          <td><button className="btn btn-secondary btn-sm" onClick={() => nav(`/doctor/patients/${r.patient.patientId}`)}>View</button></td></tr>))}
      </tbody></table></div>
  )
}
const latestPerPatient = (rows) => Object.values(Object.fromEntries([...rows].reverse().map((r) => [r.patient.patientId, r])))

export function DoctorDashboard() {
  const { doctor, rows, grants, all } = useAuthorized()
  const pending = all.filter((a) => a.status === 'pending').length
  const latest = latestPerPatient(rows)
  const stats = [['Authorized Patients', grants.length], ['Shared Reports', rows.length], ['Recent Assessments', rows.filter((r) => Date.now() - new Date(r.date) < 30 * 864e5).length], ['Pending Requests', pending]]
  return (<>
    <Head title={`Welcome, ${doctor.name}`} sub="You can only see patients who have explicitly shared a report with you." />
    <div className="dgrid">{stats.map(([l, n]) => <div className="card dstat" key={l}><strong>{n}</strong><span>{l}</span></div>)}</div>
    <p className="no-print" style={{ fontSize: 'var(--fs-small)' }}>These figures are dashboard counts only, not medical findings.</p>
    <h2>Recent Patients</h2><div className="card"><PatientTable rows={latest.slice(0, 8)} /></div>
  </>)
}

export function PatientList() {
  const { rows } = useAuthorized()
  return (<><Head title="Patient List" sub="Patients who have authorized access for you." /><div className="card"><PatientTable rows={latestPerPatient(rows)} /></div></>)
}

export function AccessPatient() {
  const { doctor } = useDoctor(); const nav = useNavigate(); useStore()
  const [f, setF] = useState({ id: '', code: '' }); const [res, setRes] = useState(null); const [sent, setSent] = useState(false)
  const verified = doctor.verificationStatus === 'Verified'
  const search = (e) => { e.preventDefault(); setSent(false); setRes(lookupForAccess(doctor.email, f.id, f.code)) }
  return (<>
    <Head title="Access Patient Report" sub="Enter both the Patient ID and the share code the patient gave you. Names, phone numbers and emails cannot be used to look up patients." />
    <form className="card dpad" onSubmit={search} style={{ maxWidth: 480 }}>
      <div className="field"><label htmlFor="pid">Patient ID</label><input id="pid" required placeholder="MND-20481" value={f.id} onChange={(e) => setF({ ...f, id: e.target.value })} /></div>
      <div className="field"><label htmlFor="pcode">Report / Share Code</label><input id="pcode" required placeholder="MND-RPT-82931" value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} /></div>
      <button className="btn btn-primary" type="submit" disabled={!verified}>Request Access</button>
      {!verified && <p className="field-error" style={{ marginTop: 8 }}>Available after your account is verified.</p>}
    </form>
    <div aria-live="polite" style={{ maxWidth: 480 }}>
      {res && (!res.found ? <div className="dnote warn">! No match. Check the Patient ID and share code.</div>
        : res.authorized ? <div className="dnote"><strong style={{ color: 'var(--color-success)' }}>✓ Access Authorized</strong><br /><button className="btn btn-primary btn-sm" style={{ marginTop: 10 }} onClick={() => nav(`/doctor/patients/${res.patientId}`)}>View Patient</button></div>
        : <div className="dnote warn">Access has not been authorized by this patient.<br />
            {sent ? <strong>✓ Request sent. Awaiting the patient's consent.</strong> : <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={() => { doctorRequestAccess(doctor.email, res.patientId); setSent(true) }}>Send Access Request</button>}</div>)}
    </div>
  </>)
}

export function AccessRequests() {
  const { all } = useAuthorized()
  const label = { pending: 'Pending', authorized: 'Accepted', declined: 'Declined', awaiting_patient: 'Awaiting patient consent' }
  const items = [...all].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
  return (<><Head title="Access Requests" sub="Accept or decline information patients have offered to share." />
    {!items.length && <p>No requests yet.</p>}
    <div className="stack gap-16">{items.map((a) => { const p = patientBasic(a.patientId); const mine = a.status === 'pending' && a.initiatedBy === 'patient'
      return (<section className="card dpad" key={a.id} aria-label={`Request from ${p?.profile.name}`} style={{ marginBottom: 0 }}>
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}><strong>Patient: {p?.profile.name || '—'}</strong><span>{label[a.status]}</span></div>
        <p style={{ margin: '6px 0' }}>Patient ID: {a.patientId} · Request Date: {fmt(a.requestedAt)}</p>
        <p style={{ marginBottom: 6 }}><strong>Shared Information:</strong></p>
        <ul style={{ margin: '0 0 14px', paddingLeft: 18 }}>{PERMISSIONS.filter(([k]) => a.permissions.includes(k)).map(([k, l]) => <li key={k}>✓ {l}</li>)}</ul>
        {mine && <div className="row gap-12"><button className="btn btn-primary btn-sm" onClick={() => respondToRequest(a.id, true)}>Accept</button><button className="btn btn-secondary btn-sm" onClick={() => respondToRequest(a.id, false)}>Decline</button></div>}
      </section>) })}</div></>)
}

export function Assessments() {
  const [q] = useSearchParams(); const { rows } = useAuthorized(); const nav = useNavigate(); const hist = q.get('view') === 'history'
  const list = hist ? rows : rows.filter((r) => Date.now() - new Date(r.date) < 30 * 864e5)
  return (<><Head title={hist ? 'Assessment History' : 'Recent Assessments'} sub={hist ? 'All assessments shared with you.' : 'Assessments from the last 30 days.'} />
    <div className="card dtable-wrap"><table className="dtable"><thead><tr><th>Date</th><th>Patient</th><th>Assessment ID</th><th>Score</th><th>Screening Category</th><th>Report</th></tr></thead>
      <tbody>{list.map((r) => <tr key={r.assessmentId}><td>{fmt(r.date)}</td><td>{r.patient.profile.name}</td><td>{r.assessmentId}</td><td>{r.overall}/100</td><td><Risk level={r.category} /></td>
        <td><button className="btn btn-secondary btn-sm" onClick={() => nav(`/doctor/patients/${r.patient.patientId}?tab=report&a=${r.assessmentId}`)}>View</button></td></tr>)}</tbody></table>
      {!list.length && <p style={{ padding: 16 }}>No assessments to show.</p>}</div></>)
}

export function SharedReports() {
  const { rows } = useAuthorized(); const nav = useNavigate()
  const shared = rows.filter((r) => r.grant.permissions.includes('report'))
  return (<><Head title="Shared Reports" sub="Screening reports patients have shared with you." />
    <div className="card dtable-wrap"><table className="dtable"><thead><tr><th>Report ID</th><th>Patient</th><th>Date</th><th>Action</th></tr></thead>
      <tbody>{shared.map((r) => <tr key={r.reportId}><td>{r.reportId}</td><td>{r.patient.profile.name}</td><td>{fmt(r.date)}</td>
        <td><button className="btn btn-secondary btn-sm" onClick={() => nav(`/doctor/patients/${r.patient.patientId}?tab=report&a=${r.assessmentId}`)}>View Report</button></td></tr>)}</tbody></table></div></>)
}

export function AllNotes() {
  const { doctor, grants } = useAuthorized()
  const notes = grants.flatMap((g) => notesFor(doctor.email, g.patientId))
  return (<><Head title="Clinical Notes" sub="Your private notes. They never appear in a patient's report." />
    {!notes.length && <p>No notes yet. Add notes from a patient's Clinical Notes tab.</p>}
    {notes.map((n) => <div className="card dpad" key={n.id}><strong>{fmt(n.date)} — {n.doctorName}</strong> · {patientBasic(n.patientId)?.profile.name}<p style={{ margin: '6px 0 0' }}>{n.text}</p></div>)}</>)
}

export const DoctorResources = () => (<><Head title="Resources" sub="Reference material for screening support." />
  <div className="card dpad"><p>Manodarshi provides screening and risk-assessment support, not diagnosis. Standardized instruments such as PHQ-9, GAD-7 and PCL-5 are commonly used in clinical follow-up. See the public <Link to="/how-it-works#resources" style={{ color: 'var(--color-primary)' }}>Resources</Link> page for patient-facing material.</p></div></>)

export function DoctorSettings() {
  const { doctor } = useDoctor(); const log = getAudit(doctor.email)
  return (<><Head title="Settings & Profile" />
    <div className="card dpad"><dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '8px 20px' }}>
      {[['Name', doctor.name], ['Email', doctor.email], ['Doctor ID', doctor.doctorId], ['Verification Status', doctor.verificationStatus]].map(([k, v]) => <><dt style={{ fontWeight: 600 }}>{k}</dt><dd style={{ margin: 0 }}>{v}</dd></>)}</dl></div>
    <h2>Access activity (this session)</h2>
    <div className="card dpad">{log.length ? log.map((l, i) => <div key={i}>{new Date(l.at).toLocaleString()} — {l.patientId}: {l.action}</div>) : <p style={{ margin: 0 }}>No activity recorded yet.</p>}</div></>)
}

export const DoctorHelp = () => (<><Head title="Help & Support" />
  <div className="card dpad"><p>Patients must share a report with you before you can see it. If a patient cannot find their Patient ID or share code, ask them to open their latest result in Manodarshi. For support, use the Help & Support page of the main site.</p></div></>)
