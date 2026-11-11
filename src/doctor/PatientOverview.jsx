import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import { useDoctor } from './DoctorContext'
import { useStore, getAuthorizedPatient, notesFor, addNote, logView, fmt, CONDITIONS } from './doctorData'
import { Risk } from './DoctorPages'

const TABS = [['overview', 'Overview', null], ['report', 'Report', 'report'], ['qa', 'Questions & Answers', 'qa'], ['history', 'Assessment History', 'history'], ['documents', 'Documents', 'documents'], ['notes', 'Clinical Notes', null]]
const DISCLAIMER = 'This score represents an automated screening/risk estimate and is not a medical diagnosis.'
const C = { a: '#0F5C5E', b: '#40566F', c: '#A86500' }

export default function PatientOverview() {
  const { patientId } = useParams(); const { doctor } = useDoctor(); const [q, setQ] = useSearchParams(); useStore()
  const data = getAuthorizedPatient(doctor.email, patientId)
  const verified = doctor.verificationStatus === 'Verified'
  useEffect(() => { if (data && verified) logView(doctor.email, patientId, 'Opened patient record') }, [patientId]) // audit
  if (!data || !verified) return (
    <div className="card dpad" role="alert"><h2>Access not authorized</h2><p>You do not have patient-granted access to this record{!verified ? ' (your account is not yet verified)' : ''}.</p>
      <Link to="/doctor/access" className="btn btn-primary btn-sm">Access Patient</Link></div>)

  const { patient, grant } = data
  const can = (p) => !p || grant.permissions.includes(p)
  const asmts = [...patient.assessments].sort((a, b) => b.date.localeCompare(a.date))
  const sel = asmts.find((a) => a.assessmentId === q.get('a')) || asmts[0]
  const tab = TABS.find(([k, , p]) => k === q.get('tab') && can(p)) ? q.get('tab') : 'overview'
  const setTab = (k) => setQ({ tab: k, ...(q.get('a') ? { a: q.get('a') } : {}) })
  const p = patient.profile

  return (<>
    <div className="no-print"><Link to="/doctor/patients" style={{ color: 'var(--color-primary)', fontSize: 'var(--fs-small)' }}>← Patient List</Link></div>
    <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, margin: '10px 0' }}>
      <div><h1 style={{ margin: 0 }}>{p.name}</h1><p style={{ margin: 0 }}>Patient ID: {patient.patientId} · Age: {p.age} · Latest Assessment: {sel ? fmt(sel.date) : '—'}</p></div>
      <div className="row gap-12 no-print">
        <button className="btn btn-secondary btn-sm" disabled={!can('report')} onClick={() => setTab('report')}>View Latest Report</button>
        <button className="btn btn-primary btn-sm" disabled={!can('report')} onClick={() => { setTab('report'); setTimeout(() => window.print(), 150) }}>Download Report</button>
      </div>
    </div>
    <div className="dtabs no-print" role="tablist" aria-label="Patient sections">
      {TABS.map(([k, l, perm]) => <button key={k} role="tab" className="dtab" aria-selected={tab === k} disabled={!can(perm)} title={!can(perm) ? 'Not shared by the patient' : ''} onClick={() => setTab(k)}>{l}</button>)}
    </div>
    {!sel ? <p>No assessments have been shared yet.</p> : <>
      {tab === 'overview' && <Overview p={p} sel={sel} grant={grant} can={can} />}
      {tab === 'report' && <Report p={p} sel={sel} patientId={patient.patientId} can={can} />}
      {tab === 'qa' && <QA sel={sel} />}
      {tab === 'history' && <History asmts={asmts} />}
      {tab === 'documents' && <Docs patient={patient} />}
      {tab === 'notes' && <Notes doctor={doctor} patientId={patientId} sel={sel} />}
    </>}
  </>)
}

const Scores = ({ sel }) => (
  <div className="card dtable-wrap"><table className="dtable"><thead><tr><th>Condition</th><th style={{ textAlign: 'right' }}>Screening Score</th><th>Screening Category</th></tr></thead>
    <tbody>{sel.conditionScores.map((c) => <tr key={c.condition}><td>{c.condition}</td><td style={{ textAlign: 'right' }}>{c.score}/100</td><td><Risk level={c.risk} /></td></tr>)}</tbody></table></div>)

const Summary = ({ sel }) => (
  <div className="card dpad"><div className="row gap-16" style={{ flexWrap: 'wrap' }}>
    <div><span style={{ fontSize: 'var(--fs-small)' }}>Overall Screening Score</span>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: 'var(--color-primary-dark)' }}>{sel.overall} / 100</div><Risk level={sel.category} /> <span style={{ fontWeight: 600 }}>Screening Risk</span></div>
    <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '4px 16px', fontSize: 'var(--fs-small)' }}>
      {[['Assessment Date', fmt(sel.date)], ['Duration', `${sel.durationMin} min`], ['Questions', sel.qa.length], ['Completion', sel.completed ? 'Completed' : 'Incomplete'], ['Assessment ID', sel.assessmentId]].map(([k, v]) => <><dt style={{ fontWeight: 600 }}>{k}</dt><dd style={{ margin: 0 }}>{v}</dd></>)}</dl></div>
    <p style={{ margin: '14px 0 0', fontSize: 'var(--fs-small)' }}>{DISCLAIMER}</p></div>)

const Media = ({ sel, grant }) => {
  const rows = [['Audio Recording', 'audio'], ['Video Recording', 'video']].filter(([, k]) => grant.permissions.includes(k))
  if (!rows.length) return null
  return <div className="card dpad"><h3>Recordings</h3>{rows.map(([l, k]) => <p key={k} style={{ margin: '0 0 6px' }}>{l}: {sel.media[k] ? `Available · Quality: ${sel.media[k]}` : 'Not available'}</p>)}
    <p style={{ margin: 0, fontSize: 'var(--fs-small)' }}>No validated audio/video analysis exists in this prototype, so no behavioural findings are shown.</p></div>
}

function Overview({ p, sel, grant, can }) {
  const info = [['Full Name', p.name], ['Date of Birth', p.dob], ['Age', p.age], ['Contact Number', p.contact], ['Email', p.email], ['Country', p.country], ['State', p.state], ['City', p.city], ['District', p.district], ['PIN Code', p.pincode]]
  return (<div className="stack gap-16">
    {can('report') && <><Summary sel={sel} /><h2 style={{ margin: 0 }}>Condition Screening Results</h2><Scores sel={sel} /></>}
    <Media sel={sel} grant={grant} />
    <div className="card dpad"><h3>Patient Information</h3><dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
      {info.map(([k, v]) => <div key={k}><dt style={{ fontSize: 'var(--fs-caption)', color: 'var(--color-text-secondary)' }}>{k}</dt><dd style={{ margin: 0 }}>{v || '—'}</dd></div>)}</dl></div></div>)
}

function Report({ p, sel, patientId, can }) {
  return (<div className="stack gap-16">
    <div className="card dpad"><div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
      <div><strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-primary-dark)' }}>MANODARSHI</strong><div style={{ fontSize: 'var(--fs-small)' }}>Screening Report · Report ID {sel.reportId}</div></div>
      <button className="btn btn-primary btn-sm no-print" onClick={() => window.print()}>Download PDF</button></div>
      <p style={{ margin: '10px 0 0', fontSize: 'var(--fs-small)' }}>Patient: {p.name} ({patientId}) · Age {p.age} · {p.city}, {p.state}</p></div>
    <Summary sel={sel} /><Scores sel={sel} />
    {can('qa') && <><h2 style={{ margin: 0 }}>Questions & Answers</h2><QA sel={sel} /></>}
    <div className="card dpad"><h3>Recommended follow-up</h3><p style={{ margin: 0 }}>Clinical interview and review of history by a qualified professional; consider standardized tools (e.g. PHQ-9, GAD-7, PCL-5) as clinically indicated.</p></div>
    <p style={{ fontSize: 'var(--fs-small)' }}>Disclaimer: Manodarshi is a screening support tool and does not provide a medical diagnosis. © Manodarshi 2026.</p></div>)
}

function QA({ sel }) {
  const [open, setOpen] = useState(null)
  return (<div className="card dtable-wrap"><table className="dtable"><thead><tr><th style={{ width: 60 }}>No.</th><th>Question</th><th>Patient Answer</th></tr></thead>
    <tbody>{sel.qa.map((r, i) => <tr key={i}><td>{String(i + 1).padStart(2, '0')}</td>
      <td><button className="btn-link" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} style={{ textAlign: 'left', textDecoration: 'none', color: 'var(--color-text)', fontWeight: 500 }}>
        {open === i ? r.q : r.q.length > 60 ? r.q.slice(0, 60) + '… (expand)' : r.q}</button></td><td><strong>{r.a}</strong></td></tr>)}</tbody></table></div>)
}

function History({ asmts }) {
  const [picked, setPicked] = useState([]); const [cmp, setCmp] = useState(false)
  const asc = useMemo(() => [...asmts].reverse(), [asmts])
  const chosen = asc.filter((a) => picked.includes(a.assessmentId))
  const toggle = (id) => { setCmp(false); setPicked((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])) }
  return (<div className="stack gap-16">
    <div className="card dtable-wrap"><table className="dtable"><thead><tr><th>Compare</th><th>Date</th><th>Score</th><th>Screening Category</th></tr></thead>
      <tbody>{asmts.map((a) => <tr key={a.assessmentId}><td><input type="checkbox" aria-label={`Select ${fmt(a.date)} for comparison`} checked={picked.includes(a.assessmentId)} onChange={() => toggle(a.assessmentId)} /></td>
        <td>{fmt(a.date)}</td><td>{a.overall}/100</td><td><Risk level={a.category} /></td></tr>)}</tbody></table></div>
    <div className="card dpad"><h3>Screening Score Trend</h3>
      <div style={{ height: 240 }}><ResponsiveContainer><LineChart data={asc.map((a) => ({ date: fmt(a.date), Score: a.overall }))}><CartesianGrid stroke="#D9E2E1" /><XAxis dataKey="date" /><YAxis domain={[0, 100]} /><Tooltip /><Line dataKey="Score" stroke={C.a} strokeWidth={2} /></LineChart></ResponsiveContainer></div></div>
    <div><button className="btn btn-primary btn-sm" disabled={chosen.length < 2} onClick={() => setCmp(true)}>Compare Assessments</button> {chosen.length < 2 && <span style={{ fontSize: 'var(--fs-small)' }}>Select at least two.</span>}</div>
    {cmp && <div className="card dpad"><h3>Comparison</h3>
      <div style={{ height: 280 }}><ResponsiveContainer><BarChart data={CONDITIONS.map((c) => ({ c, ...Object.fromEntries(chosen.map((a) => [fmt(a.date), a.conditionScores.find((x) => x.condition === c).score])) }))}><CartesianGrid stroke="#D9E2E1" /><XAxis dataKey="c" /><YAxis domain={[0, 100]} /><Tooltip /><Legend />
        {chosen.map((a, i) => <Bar key={a.assessmentId} dataKey={fmt(a.date)} fill={[C.a, C.b, C.c][i % 3]} />)}</BarChart></ResponsiveContainer></div>
      <p style={{ fontSize: 'var(--fs-small)', margin: '10px 0 0' }}>Overall: {chosen.map((a) => `${fmt(a.date)} ${a.overall}`).join(' → ')}. Changes in screening score are not a measure of clinical improvement or deterioration.</p></div>}</div>)
}

const Docs = ({ patient }) => (
  <div className="card dtable-wrap"><table className="dtable"><thead><tr><th>File name</th><th>Type</th><th>Uploaded</th><th>Status</th><th>Action</th></tr></thead>
    <tbody>{patient.documents.map((d) => <tr key={d.name}><td>{d.name}</td><td>{d.type}</td><td>{fmt(d.uploaded)}</td><td>{d.status}</td>
      <td><button className="btn btn-secondary btn-sm" disabled title="File storage is not connected in this prototype">View</button> <button className="btn btn-secondary btn-sm" disabled>Download</button></td></tr>)}</tbody></table>
    {!patient.documents.length && <p style={{ padding: 16 }}>The patient has not uploaded any documents.</p>}</div>)

function Notes({ doctor, patientId, sel }) {
  const [text, setText] = useState(''); const list = notesFor(doctor.email, patientId)
  return (<div className="stack gap-16"><div className="dnote">🔒 <strong>Private Clinical Notes</strong>. Visible only to you; never added to the patient's report.</div>
    <div className="card dpad"><div className="field"><label htmlFor="note">Add clinical observation</label><textarea id="note" rows={4} value={text} onChange={(e) => setText(e.target.value)} /></div>
      <button className="btn btn-primary btn-sm" disabled={!text.trim()} onClick={() => { addNote(doctor.email, doctor.name, patientId, text.trim()); setText('') }}>Save Note</button></div>
    {list.map((n) => <div className="card dpad" key={n.id}><strong>{fmt(n.date)} — {n.doctorName}</strong><p style={{ margin: '6px 0 0' }}>{n.text}</p></div>)}</div>)
}
