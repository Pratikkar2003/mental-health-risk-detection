import { useNavigate } from 'react-router-dom'

const conditions = [
  { name: 'Depression', blurb: 'Persistent low mood, loss of interest, and changes in energy or sleep.' },
  { name: 'Anxiety', blurb: 'Excessive worry, restlessness, and physical tension.' },
  { name: 'PTSD', blurb: 'Distress linked to past traumatic or stressful events.' },
  { name: 'Bipolar Disorder', blurb: 'Marked shifts between high-energy and low-mood periods.' },
  { name: 'Schizophrenia', blurb: 'Changes in perception, thought patterns, or social functioning.' },
  { name: 'Dementia', blurb: 'Memory, orientation, and cognitive-function changes over time.' },
]

export default function Assessments() {
  const navigate = useNavigate()

  return (
    <div className="container section">
      <span className="eyebrow">Assessments</span>
      <h1 style={{ margin: '10px 0 14px' }}>Start your unified screening session</h1>
      <p style={{ maxWidth: 620, marginBottom: 20 }}>
        One session screens across all six conditions below. It takes about 10–15 minutes and
        includes a short questionnaire with optional audio/video capture.
      </p>

      <div className="cond-grid">
        {conditions.map((c) => (
          <div key={c.name} className="card cond-card">
            <h3 style={{ marginBottom: 6 }}>{c.name}</h3>
            <p style={{ marginBottom: 0 }}>{c.blurb}</p>
          </div>
        ))}
      </div>

      <div className="card start-band">
        <div>
          <h2 style={{ marginBottom: 6 }}>Begin the unified assessment</h2>
          <p style={{ marginBottom: 0 }}>Find a quiet, well-lit space if you'd like to enable camera and microphone.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/assessments/session')}>
          Start Assessment
        </button>
      </div>

      <style>{`
        .cond-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 36px; }
        .cond-card { padding: 22px 24px; }
        .start-band {
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;
          padding: 32px 36px; background: var(--color-primary-tint); border-color: var(--color-primary-tint-2);
        }
        @media (max-width: 920px) { .cond-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .cond-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
