import { useMemo, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import RiskGauge from '../components/common/RiskGauge'
import SemiGauge from '../components/common/SemiGauge'
import FeedbackPopup from '../components/common/FeedbackPopup'
import ShareWithDoctor from '../doctor/ShareWithDoctor'

const RISK_COLORS = {
  Low: '#287D55',
  Moderate: '#A86500',
  High: '#B42318',
}

function formatDuration(seconds) {
  if (!seconds) return 'Not recorded'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m} Minute${m === 1 ? '' : 's'} ${s} Second${s === 1 ? '' : 's'}`
}

function BrandMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34">
      <circle cx="17" cy="17" r="16" fill="var(--color-primary-tint)" />
      <path d="M7,18 L12,18 L14,11 L17,24 L20,9 L23,18 L27,18" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Result() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { session } = useAuth()

  const reportId = useMemo(() => `MI-2026-${Math.floor(100000 + Math.random() * 900000)}`, [])
  const assessmentId = useMemo(() => `ASMT-2026-${Math.floor(100000 + Math.random() * 900000)}`, [])
  const [showFeedback, setShowFeedback] = useState(true)

  if (!state?.result) {
    return (
      <div className="container section text-center">
        <h2>No assessment result found</h2>
        <p>Please complete an assessment first to view your report.</p>
        <Link to="/assessments" className="btn btn-primary">Go to Assessments</Link>
      </div>
    )
  }

  const { result, questions, answers, completedAt, durationSeconds, mediaAvailable } = state
  const profile = session?.profile || {}
  const completedDate = new Date(completedAt)
  const generatedDate = new Date()
  const medicalReportCount = (profile.medicalReports || []).length

  const patientRows = [
    ['Full Name', profile.name || session?.name || '—'],
    ['Date of Birth', profile.dob || '—'],
    ['Age', profile.age ? `${profile.age} Years` : '—'],
    ['Contact Number', profile.contact || '—'],
    ['Email', profile.email || session?.identifier || '—'],
    ['Country', profile.country || '—'],
    ['State', profile.state || '—'],
    ['City', profile.city || '—'],
    ['District', profile.district || '—'],
    ['PIN Code', profile.pincode || '—'],
    ['Assessment ID', assessmentId],
    ['Medical Reports on File', medicalReportCount > 0 ? `${medicalReportCount} document${medicalReportCount === 1 ? '' : 's'}` : 'None'],
  ]

  const questionsAnswered = Object.keys(answers).length
  const completenessScore = (mediaAvailable ? 1 : 0) + (questionsAnswered === questions.length ? 1 : 0) + (medicalReportCount > 0 ? 1 : 0)
  const dataQuality = completenessScore >= 3 ? 'High' : completenessScore >= 2 ? 'Good' : completenessScore >= 1 ? 'Moderate' : 'Limited'

  return (
    <div className="report-wrap">
      <ShareWithDoctor state={state} profile={{ ...profile, name: profile.name || session?.name, email: profile.email || session?.identifier }} />
      <div className="container report-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/home')}>Back to Home</button>
        <button className="btn btn-primary" onClick={() => window.print()}>Download Report PDF</button>
      </div>

      <div className="container">
        <div className="report-sheet">

          {/* ============ PAGE 1 ============ */}
          <div className="report-page">
            <div className="report-header">
              <div className="report-brand">
                <BrandMark />
                <div>
                  <div className="report-brand-name">MANODARSHI</div>
                  <div className="report-brand-tag">AI-Assisted Mental Health<br />Screening &amp; Assessment</div>
                </div>
              </div>
              <div className="report-badge">CLINICAL SCREENING REPORT</div>
              <div className="report-meta">
                <div><span>Report ID</span><strong>{reportId}</strong></div>
                <div><span>Assessment Date</span><strong>{completedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></div>
                <div><span>Assessment Time</span><strong>{completedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></div>
                <div><span>Report Generated</span><strong>{generatedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} {generatedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></div>
                <div><span>Assessment Version</span><strong>v1.0</strong></div>
              </div>
            </div>
            <div className="report-rule" />

            <div className="report-grid-2">
              <section className="report-card">
                <h3 className="report-section-title"><span className="sec-icon">&#9679;</span> 1. Patient / User Information</h3>
                <table className="patient-table">
                  <tbody>
                    {patientRows.map(([label, value]) => (
                      <tr key={label}>
                        <td className="patient-label">{label}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="report-info-box">
                  <div><span>Assessment Type</span><strong>AI-Assisted Mental Health Screening</strong></div>
                  <div><span>Assessment Mode</span><strong>Questionnaire + Audio/Video Analysis</strong></div>
                  <div><span>Completion Status</span><strong>Completed</strong></div>
                  <div><span>Assessment Duration</span><strong>{formatDuration(durationSeconds)}</strong></div>
                </div>
              </section>

              <section className="report-card">
                <h3 className="report-section-title"><span className="sec-icon">&#9679;</span> 2. Assessment Overview</h3>
                <div className="overview-box">
                  <div className="overview-label">Overall screening risk</div>
                  <SemiGauge score={result.overall} category={result.overallCategory} width={230} />
                  <p className="overview-note">
                    This score represents an automated screening/risk estimate based on the information
                    provided and behavioural signals captured during the assessment.
                    <br /><strong>This is NOT a medical diagnosis.</strong>
                  </p>
                </div>
                <div className="observations-box">
                  <div className="observations-title">Key observations</div>
                  <ul className="observations-list">
                    {result.keyObservations.map((obs) => (
                      <li key={obs}>{obs}</li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            <section className="report-card">
              <h3 className="report-section-title"><span className="sec-icon">&#9679;</span> 3. Condition-Specific Screening Results</h3>
              <table className="cond-table">
                <thead>
                  <tr>
                    <th>Condition</th>
                    <th>Screening Score (0-100)</th>
                    <th>Estimated Risk (%)</th>
                    <th>Risk Level</th>
                    <th>Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  {result.conditionScores.map((c) => (
                    <tr key={c.condition}>
                      <td className="cond-name">{c.condition}</td>
                      <td>
                        <div className="cond-score-cell">
                          <span>{c.score}</span>
                          <div className="mini-bar-track">
                            <div className="mini-bar-fill" style={{ width: `${c.score}%`, background: RISK_COLORS[c.risk] }} />
                          </div>
                        </div>
                      </td>
                      <td>{c.score}%</td>
                      <td><span className="risk-tag" style={{ color: RISK_COLORS[c.risk] }}>{c.risk}</span></td>
                      <td className="cond-interp">{c.interpretation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="table-footnote">
                Note: Higher scores indicate greater presence of features related to the condition. These are screening indicators only.
              </p>
            </section>
          </div>

          {/* ============ PAGE 2 ============ */}
          <div className="report-page">
            <div className="report-mini-header">
              <div className="report-brand">
                <BrandMark size={26} />
                <strong>MANODARSHI</strong>
              </div>
              <span>Report ID: {reportId}</span>
              <span>Page 2 of 2</span>
            </div>
            <div className="report-rule" />

            <div className="report-grid-2">
              <div className="stack gap-16">
                <section className="report-card">
                  <h3 className="report-section-title"><span className="sec-icon">&#9679;</span> 4. Questionnaire Responses</h3>
                  <table className="qa-table">
                    <thead>
                      <tr><th>No.</th><th>Question</th><th>Answer</th></tr>
                    </thead>
                    <tbody>
                      {questions.map((q, i) => (
                        <tr key={q.id}>
                          <td>{i + 1}</td>
                          <td>{q.text}</td>
                          <td>{q.options[answers[q.id]] ?? 'Not answered'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>

                <section className="report-card">
                  <h3 className="report-section-title"><span className="sec-icon">&#9679;</span> 5. Clinical Screening Summary</h3>
                  <table className="summary-table">
                    <tbody>
                      <tr><td className="patient-label">Emotional Indicators</td><td>{result.clinicalSummary.emotional}</td></tr>
                      <tr><td className="patient-label">Behavioral Indicators</td><td>{result.clinicalSummary.behavioural}</td></tr>
                      <tr><td className="patient-label">Cognitive Indicators</td><td>{result.clinicalSummary.cognitive}</td></tr>
                      <tr><td className="patient-label">Speech / Voice Indicators</td><td>{result.clinicalSummary.speech}</td></tr>
                      <tr><td className="patient-label">Facial / Visual Indicators</td><td>{result.clinicalSummary.facial}</td></tr>
                    </tbody>
                  </table>
                  <p className="table-footnote">
                    * Indicators are derived from questionnaire responses and AI analysis of audio/video signals (where available).
                  </p>
                </section>
              </div>

              <div className="stack gap-16">
                <section className="report-card">
                  <h3 className="report-section-title"><span className="sec-icon">&#9679;</span> 6. Risk Visualization</h3>
                  <div className="risk-viz">
                    <div className="risk-viz-gauge">
                      <div className="overview-label">Overall risk</div>
                      <RiskGauge score={result.overall} category={result.overallCategory} size={140} showSignal={false} />
                    </div>
                    <div className="risk-viz-bars">
                      <div className="overview-label">Condition screening profile</div>
                      {result.conditionScores.map((c) => (
                        <div className="viz-bar-row" key={c.condition}>
                          <span className="viz-bar-label">{c.condition}</span>
                          <div className="viz-bar-track">
                            <div className="viz-bar-fill" style={{ width: `${c.score}%`, background: RISK_COLORS[c.risk] }} />
                          </div>
                          <span className="viz-bar-pct">{c.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="report-card">
                  <h3 className="report-section-title"><span className="sec-icon">&#9679;</span> 7. Recommended Clinical Follow-Up</h3>
                  <ul className="followup-list">
                    {result.followUp.map((f) => (
                      <li key={f.label} className={f.recommended ? 'is-recommended' : ''}>
                        <span className="followup-check">{f.recommended ? '\u2713' : '\u2013'}</span>
                        {f.label}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="report-card">
                  <h3 className="report-section-title"><span className="sec-icon">&#9679;</span> 8. Data &amp; Analysis Information</h3>
                  <table className="summary-table">
                    <tbody>
                      <tr><td className="patient-label">Assessment Duration</td><td>{formatDuration(durationSeconds)}</td></tr>
                      <tr><td className="patient-label">Questionnaire Completion</td><td>{questionsAnswered} / {questions.length}</td></tr>
                      <tr><td className="patient-label">Audio Recording</td><td>{mediaAvailable ? 'Available (Quality: Good)' : 'Not Available'}</td></tr>
                      <tr><td className="patient-label">Video Recording</td><td>{mediaAvailable ? 'Available (Quality: Good)' : 'Not Available'}</td></tr>
                      <tr><td className="patient-label">Medical Records Reviewed</td><td>{medicalReportCount > 0 ? `${medicalReportCount} document${medicalReportCount === 1 ? '' : 's'} provided` : 'None provided'}</td></tr>
                      <tr><td className="patient-label">Model / Analysis Version</td><td>Manodarshi AI v1.0</td></tr>
                      <tr><td className="patient-label">Confidence / Data Quality</td><td>{dataQuality}</td></tr>
                      <tr><td className="patient-label">Notes</td><td>{mediaAvailable ? 'No significant data quality issues.' : 'Audio/video capture was not available for this session.'}</td></tr>
                    </tbody>
                  </table>
                </section>
              </div>
            </div>

            <div className="report-footer-grid">
              <div className="footer-box footer-disclaimer-box">
                <div className="footer-box-title">&#9888; Disclaimer</div>
                <p>
                  This report is an AI-assisted screening and risk-assessment document and does not
                  constitute a medical diagnosis, treatment recommendation, or substitute for evaluation
                  by a qualified healthcare professional. Interpretation should be made by a licensed
                  clinician in the context of clinical history and examination.
                </p>
              </div>
              <div className="footer-box footer-important-box">
                <div className="footer-box-title">&#10003; Important</div>
                <p>
                  If you are experiencing a mental health crisis or have thoughts of self-harm, please
                  seek immediate help from a qualified professional or emergency services in your area.
                </p>
              </div>
              <div className="footer-box footer-copyright-box">
                <BrandMark size={30} />
                <p>
                  &copy; 2026 Manodarshi. All rights reserved.<br />
                  This report is intended for authorized use only. Unauthorized reproduction or
                  distribution is strictly prohibited.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showFeedback && (
        <FeedbackPopup
          name={session?.profile?.name || session?.name}
          onClose={() => setShowFeedback(false)}
        />
      )}

      <style>{`
        .report-actions { display: flex; justify-content: flex-end; gap: 12px; padding: 24px 0 0; }
        .report-sheet { padding: 24px 0 64px; }
        .report-page {
          background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-md);
          padding: 28px 30px; margin-top: 20px; box-shadow: var(--shadow-soft);
        }

        .report-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .report-brand { display: flex; align-items: center; gap: 10px; }
        .report-brand-name { font-family: var(--font-display); font-weight: 700; font-size: 1.2rem; color: var(--color-primary-dark); letter-spacing: 0.02em; }
        .report-brand-tag { font-size: 11px; color: var(--color-text-secondary); line-height: 1.3; }
        .report-badge {
          background: var(--color-primary-dark); color: #fff; font-weight: 700; font-size: 0.82rem;
          letter-spacing: 0.04em; padding: 10px 20px; border-radius: var(--radius-sm); align-self: center;
        }
        .report-meta { display: flex; flex-direction: column; gap: 3px; font-size: 12.5px; min-width: 220px; }
        .report-meta div { display: flex; justify-content: space-between; gap: 14px; }
        .report-meta span { color: var(--color-text-secondary); }
        .report-meta strong { color: var(--color-text); font-weight: 600; }

        .report-rule { height: 3px; background: var(--color-primary); border-radius: 2px; margin: 14px 0 20px; position: relative; }

        .report-mini-header { display: flex; align-items: center; gap: 16px; font-size: 0.9rem; color: var(--color-text-secondary); }
        .report-mini-header .report-brand strong { font-family: var(--font-display); color: var(--color-primary-dark); }
        .report-mini-header span:last-child { margin-left: auto; }

        .report-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; margin-bottom: 20px; }

        .report-card {
          border: 1px solid var(--color-border); border-radius: var(--radius-md);
          padding: 18px 20px; background: var(--color-surface); margin-bottom: 20px;
        }
        .report-grid-2 .report-card { margin-bottom: 0; }
        .report-section-title {
          font-size: 0.98rem; color: var(--color-primary-dark); display: flex; align-items: center; gap: 8px;
          margin-bottom: 14px; font-family: var(--font-body); font-weight: 700;
        }
        .sec-icon { font-size: 8px; color: var(--color-primary); }

        .patient-table, .summary-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
        .patient-table td, .summary-table td { padding: 8px 4px; border-bottom: 1px solid var(--color-border); vertical-align: top; }
        .patient-label { color: var(--color-text-secondary); width: 42%; font-weight: 500; }

        .report-info-box {
          margin-top: 14px; padding: 12px 14px; background: var(--color-surface-alt); border-radius: var(--radius-sm);
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; font-size: 0.82rem;
        }
        .report-info-box div { display: flex; flex-direction: column; gap: 2px; }
        .report-info-box span { color: var(--color-text-secondary); font-size: 11px; }
        .report-info-box strong { font-weight: 600; }

        .overview-box { text-align: center; padding-bottom: 14px; border-bottom: 1px solid var(--color-border); margin-bottom: 14px; }
        .overview-label { font-size: 11px; font-weight: 700; letter-spacing: 0.05em; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 6px; }
        .overview-note { font-size: 0.78rem; color: var(--color-text-secondary); margin: 10px 0 0; text-align: left; }

        .observations-title { font-size: 0.85rem; font-weight: 700; margin-bottom: 8px; }
        .observations-list { margin: 0; padding-left: 18px; font-size: 0.85rem; color: var(--color-text-secondary); }
        .observations-list li { margin-bottom: 6px; }

        .cond-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .cond-table th {
          text-align: left; background: var(--color-primary-dark); color: #fff; font-weight: 600;
          padding: 10px 12px; font-size: 0.78rem;
        }
        .cond-table th:first-child { border-radius: 6px 0 0 6px; }
        .cond-table th:last-child { border-radius: 0 6px 6px 0; }
        .cond-table td { padding: 10px 12px; border-bottom: 1px solid var(--color-border); vertical-align: middle; }
        .cond-name { font-weight: 600; }
        .cond-score-cell { display: flex; align-items: center; gap: 8px; }
        .cond-score-cell span { min-width: 20px; font-weight: 600; }
        .mini-bar-track { flex: 1; height: 7px; background: var(--color-border); border-radius: var(--radius-pill); overflow: hidden; max-width: 110px; }
        .mini-bar-fill { height: 100%; border-radius: var(--radius-pill); }
        .risk-tag { font-weight: 700; font-size: 0.8rem; }
        .cond-interp { color: var(--color-text-secondary); font-size: 0.8rem; }
        .table-footnote { font-size: 11px; color: var(--color-text-secondary); margin: 10px 0 0; }

        .qa-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
        .qa-table th { text-align: left; color: var(--color-text-secondary); font-size: 11px; padding: 6px 6px; border-bottom: 1px solid var(--color-border); }
        .qa-table td { padding: 8px 6px; border-bottom: 1px solid var(--color-border); vertical-align: top; }
        .qa-table td:first-child { width: 24px; color: var(--color-text-secondary); }
        .qa-table td:last-child { color: var(--color-text-secondary); white-space: nowrap; font-weight: 500; }

        .risk-viz { display: flex; flex-direction: column; gap: 18px; }
        .risk-viz-gauge { text-align: center; }
        .viz-bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .viz-bar-label { width: 110px; font-size: 0.78rem; flex-shrink: 0; }
        .viz-bar-track { flex: 1; height: 9px; background: var(--color-border); border-radius: var(--radius-pill); overflow: hidden; }
        .viz-bar-fill { height: 100%; border-radius: var(--radius-pill); }
        .viz-bar-pct { width: 34px; text-align: right; font-size: 0.78rem; font-weight: 600; }

        .followup-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; font-size: 0.85rem; }
        .followup-list li { display: flex; align-items: flex-start; gap: 8px; }
        .followup-check { color: var(--color-success); font-weight: 700; flex-shrink: 0; }

        .report-footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-top: 6px; }
        .footer-box { border-radius: var(--radius-sm); padding: 14px 16px; font-size: 0.76rem; }
        .footer-box p { margin: 6px 0 0; color: inherit; opacity: 0.92; }
        .footer-box-title { font-weight: 700; font-size: 0.8rem; }
        .footer-disclaimer-box { background: #FBE9E7; color: #6B231B; }
        .footer-important-box { background: var(--color-primary-tint); color: var(--color-primary-dark); }
        .footer-copyright-box { background: var(--color-primary-dark); color: #DCEBEA; display: flex; gap: 10px; align-items: flex-start; }
        .footer-copyright-box p { color: #B9D6D3; }

        @media (max-width: 860px) {
          .report-grid-2 { grid-template-columns: 1fr; }
          .report-footer-grid { grid-template-columns: 1fr; }
          .report-header { flex-direction: column; }
        }

        @media print {
          .navbar, .footer, .report-actions { display: none !important; }
          .report-page {
            box-shadow: none; border: none; margin: 0; padding: 16px 4px;
            page-break-after: always;
          }
          body { background: #fff; }
        }
      `}</style>
    </div>
  )
}
