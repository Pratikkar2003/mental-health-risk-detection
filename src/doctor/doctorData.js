// Prototype data layer for the Doctor Portal. In-memory only (no patient data is
// written to localStorage). Replace each function with an authenticated API call.
import { useEffect, useState } from 'react'

export const CONDITIONS = ['Depression', 'Anxiety', 'PTSD', 'Bipolar Disorder', 'Schizophrenia', 'Dementia']
export const PERMISSIONS = [
  ['report', 'Screening Report'], ['qa', 'Questionnaire & Answers'], ['history', 'Assessment History'],
  ['audio', 'Audio Analysis'], ['video', 'Video Analysis'], ['documents', 'Uploaded Medical Documents'],
]
export const riskOf = (s) => (s >= 70 ? 'High' : s >= 40 ? 'Moderate' : 'Low')
export const RISK_ICON = { Low: '✓', Moderate: '!', High: '⚠' }

const QS = [
  ['Over the past two weeks, how often have you felt down, low, or hopeless?', ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']],
  ['How often do you find it hard to relax or feel persistently on edge?', ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']],
  ['Have you experienced repeated, distressing memories of a stressful event?', ['Never', 'Rarely', 'Sometimes', 'Frequently']],
  ['How would you rate your sleep quality over the last month?', ['Very good', 'Fairly good', 'Fairly bad', 'Very bad']],
  ['Do you notice sudden shifts between high energy and low mood?', ['Never', 'Occasionally', 'Often', 'Very often']],
  ['How often do you find it difficult to concentrate on everyday tasks?', ['Not at all', 'Sometimes', 'Often', 'Nearly always']],
]
const mk = (id, date, mins, scores, picks, media = {}) => {
  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / 6)
  return {
    assessmentId: `ASMT-${id}`, reportId: `MI-${id}`, date, durationMin: mins, completed: true,
    overall, category: riskOf(overall), media,
    conditionScores: CONDITIONS.map((c, i) => ({ condition: c, score: scores[i], risk: riskOf(scores[i]) })),
    qa: QS.map(([q, o], i) => ({ q, a: o[picks[i]] })),
  }
}
const profile = (name, dob, age, contact, email, city, state, district, pin) =>
  ({ name, dob, age, contact, email, country: 'India', state, city, district, pincode: pin })

const patients = {
  'MND-20481': {
    patientId: 'MND-20481', shareCode: 'MND-RPT-82931',
    profile: profile('Rahul Sharma', '1998-03-14', 28, '+91 98xxxxxx21', 'rahul@example.com', 'Bhubaneswar', 'Odisha', 'Khordha', '751001'),
    assessments: [
      mk('20261006', '2026-10-06', 14, [72, 64, 31, 22, 12, 8], [2, 1, 1, 3, 0, 2], { audio: 'Good', video: 'Moderate' }),
      mk('20260918', '2026-09-18', 12, [58, 52, 28, 20, 10, 8], [1, 1, 1, 2, 0, 1]),
      mk('20260802', '2026-08-02', 13, [44, 36, 22, 18, 8, 6], [1, 0, 0, 2, 0, 1]),
    ],
    documents: [{ name: 'Medical Report.pdf', type: 'PDF', uploaded: '2026-10-04', status: 'Stored (not interpreted)' }],
  },
  'MND-20392': {
    patientId: 'MND-20392', shareCode: 'MND-RPT-40392',
    profile: profile('Ananya Patel', '1995-07-22', 31, '+91 97xxxxxx08', 'ananya@example.com', 'Ahmedabad', 'Gujarat', 'Ahmedabad', '380001'),
    assessments: [mk('20261002', '2026-10-02', 11, [24, 30, 12, 10, 6, 4], [0, 1, 0, 1, 0, 0])], documents: [],
  },
  'MND-20184': {
    patientId: 'MND-20184', shareCode: 'MND-RPT-20184',
    profile: profile('Amit Kumar', '1989-11-02', 36, '+91 99xxxxxx45', 'amit@example.com', 'Patna', 'Bihar', 'Patna', '800001'),
    assessments: [mk('20260928', '2026-09-28', 15, [78, 74, 52, 36, 18, 22], [3, 2, 2, 3, 1, 2])],
    documents: [{ name: 'Prior Psychiatric Summary.pdf', type: 'PDF', uploaded: '2026-09-27', status: 'Stored (not interpreted)' }],
  },
  'MND-20555': {
    patientId: 'MND-20555', shareCode: 'MND-RPT-20555',
    profile: profile('Sneha Rao', '2000-01-09', 26, '+91 96xxxxxx77', 'sneha@example.com', 'Hyderabad', 'Telangana', 'Hyderabad', '500001'),
    assessments: [mk('20261005', '2026-10-05', 12, [46, 50, 20, 14, 8, 6], [1, 2, 0, 2, 0, 1])], documents: [],
  },
  'MND-20610': { // exists, but has NOT shared with anyone
    patientId: 'MND-20610', shareCode: 'MND-RPT-11111',
    profile: profile('Private Patient', '', 0, '', '', '', '', '', ''), assessments: [], documents: [],
  },
}

export const DEMO_DOCTOR = { doctorId: 'DOC-1001', name: 'Dr. Sharma', email: 'dr.sharma@manodarshi.demo', verificationStatus: 'Verified' }
const doctors = { [DEMO_DOCTOR.email]: { ...DEMO_DOCTOR, specialization: 'Psychiatry', qualification: 'MD Psychiatry', registrationNumber: 'OD-12345', institution: 'City Mind Clinic', city: 'Bhubaneswar', state: 'Odisha' } }

let seq = 10
const A = (patientId, status, date, perms, by = 'patient') => ({ id: `ACC-${++seq}`, doctorEmail: DEMO_DOCTOR.email, patientId, status, requestedAt: date, permissions: perms, initiatedBy: by, grantedAt: status === 'authorized' ? date : null })
const ALL = ['report', 'qa', 'history']
let access = [
  A('MND-20481', 'authorized', '2026-10-06', ['report', 'qa', 'history', 'documents', 'audio', 'video']),
  A('MND-20392', 'authorized', '2026-10-02', ALL), A('MND-20184', 'authorized', '2026-09-28', ALL),
  A('MND-20555', 'pending', '2026-10-06', ALL),
]
let notes = [{ id: 1, doctorEmail: DEMO_DOCTOR.email, patientId: 'MND-20481', date: '2026-10-06', doctorName: 'Dr. Sharma', text: 'Patient reports persistent sleep difficulties. Further professional evaluation may be considered.' }]
let auditLog = []

const listeners = new Set()
const emit = () => listeners.forEach((l) => l())
export function useStore() {
  const [, tick] = useState(0)
  useEffect(() => { const l = () => tick((n) => n + 1); listeners.add(l); return () => listeners.delete(l) }, [])
}

// ---- Queries (always scoped to the signed-in doctor) ----
export const getDoctor = (email) => doctors[email.toLowerCase()]
export const accessFor = (doctorEmail) => access.filter((a) => a.doctorEmail === doctorEmail)
export const grantFor = (doctorEmail, patientId) => access.find((a) => a.doctorEmail === doctorEmail && a.patientId === patientId && a.status === 'authorized')
// Returns the patient ONLY if this doctor holds an authorized grant.
export function getAuthorizedPatient(doctorEmail, patientId) {
  const grant = grantFor(doctorEmail, patientId)
  return grant && patients[patientId] ? { patient: patients[patientId], grant } : null
}
export const notesFor = (doctorEmail, patientId) => notes.filter((n) => n.doctorEmail === doctorEmail && n.patientId === patientId)
export const getAudit = (doctorEmail) => auditLog.filter((l) => l.doctorEmail === doctorEmail)
const log = (doctorEmail, patientId, action) => { auditLog = [{ doctorEmail, patientId, action, at: new Date().toISOString() }, ...auditLog] }
export const logView = log

// ---- Mutations ----
export function registerDoctor(f) {
  const email = f.email.toLowerCase()
  if (doctors[email]) return { ok: false, message: 'An account with this email already exists.' }
  doctors[email] = { doctorId: `DOC-${1000 + Object.keys(doctors).length + 1}`, ...f, email, verificationStatus: 'Pending' }
  return { ok: true }
}
export function lookupForAccess(doctorEmail, patientId, code) {
  const p = patients[patientId.trim().toUpperCase()]
  if (!p || p.shareCode !== code.trim().toUpperCase()) return { found: false }
  if (grantFor(doctorEmail, p.patientId)) return { found: true, authorized: true, patientId: p.patientId }
  return { found: true, authorized: false, patientId: p.patientId }
}
export function doctorRequestAccess(doctorEmail, patientId) {
  access = [...access, { id: `ACC-${++seq}`, doctorEmail, patientId, status: 'awaiting_patient', requestedAt: new Date().toISOString().slice(0, 10), permissions: ALL, initiatedBy: 'doctor', grantedAt: null }]
  log(doctorEmail, patientId, 'Doctor sent access request'); emit()
}
export function respondToRequest(id, accept) {
  const today = new Date().toISOString().slice(0, 10)
  access = access.map((a) => a.id === id && a.status === 'pending' && a.initiatedBy === 'patient'
    ? { ...a, status: accept ? 'authorized' : 'declined', grantedAt: accept ? today : null } : a)
  const a = access.find((x) => x.id === id); if (a) log(a.doctorEmail, a.patientId, accept ? 'Access accepted' : 'Access declined'); emit()
}
export function addNote(doctorEmail, doctorName, patientId, text) {
  notes = [{ id: Date.now(), doctorEmail, patientId, date: new Date().toISOString().slice(0, 10), doctorName, text }, ...notes]
  log(doctorEmail, patientId, 'Clinical note added'); emit()
}

// ---- Called from the patient side (Result page) ----
// Creates a pending, patient-initiated request. The doctor sees data only after Accept.
export function patientShare({ doctorEmail, profile: pr, state, permissions }) {
  const patientId = `MND-${Math.floor(30000 + Math.random() * 60000)}`
  const { result, questions = [], answers = {}, completedAt, durationSeconds } = state
  const scores = result.conditionScores.map((c) => c.score)
  const asmt = {
    assessmentId: `ASMT-${Date.now()}`, reportId: `MI-${Date.now()}`, date: (completedAt ? new Date(completedAt) : new Date()).toISOString().slice(0, 10),
    durationMin: Math.max(1, Math.round((durationSeconds || 60) / 60)), completed: true, overall: result.overall, category: riskOf(result.overall),
    media: {}, conditionScores: result.conditionScores.map((c) => ({ condition: c.condition, score: c.score, risk: c.risk })),
    qa: questions.map((q) => ({ q: q.text, a: q.options?.[answers[q.id]] ?? String(answers[q.id] ?? '—') })),
  }
  patients[patientId] = { patientId, shareCode: `MND-RPT-${Math.floor(10000 + Math.random() * 89999)}`, profile: { ...pr }, assessments: [asmt], documents: [] }
  access = [...access, { id: `ACC-${++seq}`, doctorEmail: doctorEmail.trim().toLowerCase(), patientId, status: 'pending', requestedAt: new Date().toISOString().slice(0, 10), permissions, initiatedBy: 'patient', grantedAt: null }]
  emit(); return { patientId, scores }
}
export const patientName = (id) => patients[id]?.profile.name || id
export const patientBasic = (id) => patients[id]
export const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
