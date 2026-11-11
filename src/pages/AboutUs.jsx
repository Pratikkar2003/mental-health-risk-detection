export default function AboutUs() {
  return (
    <div className="container section about-page">
      <span className="eyebrow">About Us</span>
      <h1 style={{ margin: '10px 0 14px' }}>Manodarshi</h1>
      <p style={{ maxWidth: 680, fontSize: 'var(--fs-body-lg)' }}>
        A unified framework for the early detection of psychiatric and neurocognitive disorders —
        built to make mental-health screening more accessible, more informative, and less
        stigmatized.
      </p>

      <div className="about-grid">
        <div className="card about-card">
          <h3>Our purpose</h3>
          <p style={{ marginBottom: 0 }}>
            PTSD, Schizophrenia, Bipolar Disorder, Anxiety, Depression, and Dementia affect millions
            of people worldwide, and early identification meaningfully improves outcomes. Manodarshi
            provides an accessible, reliable first step toward professional care.
          </p>
        </div>
        <div className="card about-card">
          <h3>Our methodology</h3>
          <p style={{ marginBottom: 0 }}>
            The platform analyzes questionnaire responses, facial expressions, speech
            characteristics, behavioural patterns, and relevant clinical records, using Machine
            Learning, Computer Vision, Speech Processing, NLP, and OCR to generate a Risk Assessment
            Score and screening report.
          </p>
        </div>
        <div className="card about-card">
          <h3>Domain</h3>
          <p style={{ marginBottom: 0 }}>Mental health informatics, Artificial Intelligence.</p>
        </div>
        <div className="card about-card">
          <h3>Our commitment</h3>
          <p style={{ marginBottom: 0 }}>
            Manodarshi supports early awareness and timely professional consultation. It is a
            screening aid, never a replacement for a qualified clinician's diagnosis.
          </p>
        </div>
      </div>

      <style>{`
        .about-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-top: 36px; }
        .about-card { padding: 26px 28px; }
        @media (max-width: 720px) { .about-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
