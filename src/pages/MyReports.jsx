import { Link } from 'react-router-dom'

export default function MyReports() {
  return (
    <div>
      <span className="eyebrow">My Reports</span>
      <h1 style={{ margin: '8px 0 6px' }}>Your screening reports</h1>
      <p style={{ marginBottom: 28 }}>Downloadable reports from completed assessments will appear here.</p>

      <div className="card empty-state">
        <div className="empty-icon" aria-hidden="true">📄</div>
        <h3 style={{ marginBottom: 6 }}>No reports yet</h3>
        <p style={{ marginBottom: 18 }}>Complete an assessment to generate your first report.</p>
        <Link to="/assessments" className="btn btn-primary">Start Assessment</Link>
      </div>

      <style>{`
        .empty-state { padding: 56px 24px; text-align: center; }
        .empty-icon { font-size: 2.4rem; margin-bottom: 10px; }
      `}</style>
    </div>
  )
}
