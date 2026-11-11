import { Link } from 'react-router-dom'
import heroVideo from '../videos/hero-brain.mp4'

const conditions = ['PTSD', 'Schizophrenia', 'Bipolar Disorder', 'Anxiety', 'Depression', 'Dementia']

const pillars = [
  { title: 'Questionnaire', desc: 'Age- and gender-adapted screening questions grounded in validated clinical instruments.' },
  { title: 'Facial Expression', desc: 'Computer vision reads affect and micro-expression patterns during your session.' },
  { title: 'Speech Analysis', desc: 'Voice tone, pace, and pause patterns are analyzed using speech processing models.' },
  { title: 'Behavioural Signals', desc: 'Response timing and interaction patterns add another layer of context.' },
]

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Mental health informatics · AI screening</span>
            <h1 className="hero-title">
              Early signals matter.<br />We help you notice them sooner.
            </h1>
            <p className="hero-lead">
              Manodarshi combines questionnaires, facial expression, speech, and behavioural analysis
              into a single Risk Assessment Score — so you and your clinician can act early.
            </p>
            <div className="row gap-16" style={{ flexWrap: 'wrap' }}>
              <Link to="/assessments" className="btn btn-primary">Start Assessment</Link>
              <Link to="/how-it-works" className="btn btn-secondary">See how it works</Link>
            </div>
            <p className="hero-disclaimer">
              Screening support only — not a medical diagnosis.
            </p>
          </div>

          <div className="hero-visual card">
            <div className="hero-video-frame">
              <video
                className="hero-video"
                src={heroVideo}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Screened conditions</span>
          <h2 style={{ marginTop: 8, marginBottom: 28 }}>Six conditions, one unified screening flow</h2>
          <div className="chip-row">
            {conditions.map((c) => (
              <span key={c} className="condition-chip">{c}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <span className="eyebrow">How signals are gathered</span>
          <h2 style={{ marginTop: 8, marginBottom: 32 }}>Four sources, fused into one score</h2>
          <div className="pillar-grid">
            {pillars.map((p, i) => (
              <div key={p.title} className="card pillar-card">
                <span className="pillar-index">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p style={{ marginBottom: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="section-tight">
        <div className="container">
          <div className="insight-strip">
            <span className="insight-mark" aria-hidden="true">&ldquo;</span>
            <p>
              Early identification is one of the strongest predictors of positive outcomes across
              most psychiatric and neurocognitive conditions.
            </p>
            <span className="insight-source">— World Health Organization, Mental Health Atlas</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band card">
          <div>
            <h2 style={{ marginBottom: 6 }}>Ready to check in with yourself?</h2>
            <p style={{ marginBottom: 0 }}>The full screening takes about 10–15 minutes.</p>
          </div>
          <Link to="/assessments" className="btn btn-primary">Start Assessment</Link>
        </div>
      </section>

      <style>{`
        .hero { padding: 64px 0 40px; }
        .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center; }
        .hero-title { font-size: var(--fs-display-xl); margin: 14px 0 18px; letter-spacing: -0.01em; }
        .hero-lead { font-size: var(--fs-body-lg); max-width: 480px; }
        .hero-disclaimer { font-size: var(--fs-caption); color: var(--color-text-secondary); margin-top: 16px; }
        .hero-visual.card {
          padding: 10px;
          position: relative;
          background: linear-gradient(155deg, #3A4442 0%, #1C2422 30%, #0D1211 55%, #1A211F 80%, #404A47 100%);
          border: none;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.12) inset,
            0 -1px 0 rgba(0, 0, 0, 0.5) inset,
            0 14px 32px rgba(0, 0, 0, 0.35);
        }
        .hero-video-frame {
          border-radius: 8px;
          overflow: hidden;
          aspect-ratio: 16 / 9;
          background: #0B1220;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.4) inset;
        }
        .hero-video-frame { border-radius: 12px; overflow: hidden; aspect-ratio: 16 / 9; background: #0B1220; }
        .hero-video { width: 100%; height: 100%; object-fit: cover; display: block; }

        .chip-row { display: flex; flex-wrap: wrap; gap: 10px; }
        .condition-chip {
          padding: 10px 18px; border-radius: var(--radius-pill);
          background: var(--color-primary-tint); color: var(--color-primary-dark);
          font-weight: 600; font-size: 0.92rem; border: 1px solid var(--color-primary-tint-2);
        }

        .section-alt { background: var(--color-surface-alt); }
        .pillar-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .pillar-card { padding: 26px 22px; }
        .pillar-index { font-family: var(--font-mono); color: var(--color-primary); font-size: 0.85rem; }

        .insight-strip {
          max-width: 640px; margin: 0 auto; text-align: center;
          padding: 0 20px;
        }
        .insight-mark {
          font-family: var(--font-display); font-size: 2.4rem; line-height: 1;
          color: var(--color-primary-tint-2); display: block; margin-bottom: 4px;
        }
        .insight-strip p {
          font-family: var(--font-display); font-style: italic; font-size: 1.05rem;
          color: var(--color-text-secondary); margin-bottom: 10px;
        }
        .insight-source {
          font-size: var(--fs-caption); color: var(--color-text-secondary); opacity: 0.8;
        }

        .cta-band {
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;
          padding: 36px 40px; background: var(--color-primary-tint);
        }

        @media (max-width: 920px) {
          .hero-grid { grid-template-columns: 1fr; }
          .pillar-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .pillar-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}