import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import anxietyImg from '../Images/Anxiety.jpg'
import depressionImg from '../Images/1066772-common-causes-of-depression-5ae727a7875db900375789d5.png'
import ptsdImg from '../Images/PTSD.jpg'
import bipolarImg from '../Images/Bipolar-disorder-Symptoms.png'
import dementiaImg from '../Images/dementia-symptoms.webp'
import schizophreniaImg from '../Images/images.jpeg'

const steps = [
  { title: 'Complete the questionnaire', desc: 'Answer 5–10 questions tailored to your age and gender, covering mood, sleep, cognition, and behaviour.' },
  { title: 'Audio & video recording', desc: 'With your permission, your camera and microphone capture the session for facial expression and speech analysis.' },
  { title: 'Multi-modal analysis', desc: 'Machine learning, computer vision, speech processing, NLP, and OCR (for any uploaded records) are fused into one model.' },
  { title: 'Report generation', desc: 'A Risk Assessment Score and detailed screening report are generated, visualized with graphs and charts.' },
]

const articles = [
  { title: 'Anxiety', subtitle: 'Understanding anxiety vs. everyday stress', image: anxietyImg, link: 'https://www.apa.org/topics/stress/anxiety-difference' },
  { title: 'Depression', subtitle: 'Recognizing early signs of depression', image: depressionImg, link: 'https://www.mayoclinic.org/diseases-conditions/depression/symptoms-causes/syc-20356007' },
  { title: 'PTSD', subtitle: 'What trauma responses can look like', image: ptsdImg, link: 'https://www.mayoclinic.org/diseases-conditions/post-traumatic-stress-disorder/symptoms-causes/syc-20355967' },
  { title: 'Bipolar Disorder', subtitle: 'Living with mood shifts: a caregiver primer', image: bipolarImg, link: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3958651/' },
  { title: 'Dementia', subtitle: 'Cognitive changes to watch for with age', image: dementiaImg, link: 'https://my.clevelandclinic.org/health/diseases/9170-dementia' },
  { title: 'Schizophrenia', subtitle: 'Supporting a loved one through psychosis', image: schizophreniaImg, link: 'https://medicine.yale.edu/news-article/caring-for-a-loved-one-through-psychosis-a-guide-for-parents-and-caregivers/' },
]

const faqs = [
  { q: 'Is Manodarshi a substitute for a doctor?', a: 'No. Manodarshi is a screening support tool. Any result should be reviewed with a qualified mental-health professional.' },
  { q: 'Is my recorded video or audio stored permanently?', a: 'Recordings are used only to generate your screening analysis. You control camera/microphone access at any time.' },
  { q: 'Can I take the assessment without video?', a: 'Yes. You can complete the questionnaire-only flow if you prefer not to share camera or microphone access.' },
]

export default function HowItWorks() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash === '#resources') {
      document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])

  return (
    <div>
      {/* ============ HOW IT WORKS ============ */}
      <div className="container section">
        <span className="eyebrow">How it works</span>
        <h1 style={{ margin: '10px 0 14px' }}>From conversation to a clear screening report</h1>
        <p style={{ maxWidth: 620, marginBottom: 44 }}>
          Manodarshi walks you through a short, structured session and turns it into a report you can
          bring to a mental-health professional.
        </p>

        <div className="steps-list">
          {steps.map((step, i) => (
            <div key={step.title} className="card step-row">
              <span className="step-number">{i + 1}</span>
              <div>
                <h3 style={{ marginBottom: 6 }}>{step.title}</h3>
                <p style={{ marginBottom: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card note-card">
          <strong>A note on privacy:</strong>
          <p style={{ marginTop: 6, marginBottom: 0 }}>
            Recordings and responses are used only to generate your screening report. You can decline
            camera/microphone access and still complete the questionnaire-only flow.
          </p>
        </div>
      </div>

      {/* ============ RESOURCES ============ */}
      <div id="resources" className="container section resources-section">
        <span className="eyebrow">Resources</span>
        <h2 style={{ margin: '10px 0 14px' }}>Learn, understand, and prepare</h2>
        <p style={{ maxWidth: 620, marginBottom: 40 }}>
          Educational articles and frequently asked questions to help you understand what the
          screening covers and what to expect.
        </p>

        <div className="article-grid">
          {articles.map((a) => (
            <div key={a.title} className="card article-card">
              <div className="article-media">
                <img src={a.image} alt={a.title} loading="lazy" />
              </div>
              <div className="article-body">
                <h3 style={{ margin: '0 0 6px' }}>{a.title}</h3>
                <p className="article-subtitle">{a.subtitle}</p>
                <a className="article-link" href={a.link} target="_blank" rel="noopener noreferrer">
                  Read more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ margin: '48px 0 20px' }}>Frequently asked questions</h2>
        <div className="faq-list">
          {faqs.map((f) => (
            <details key={f.q} className="card faq-item">
              <summary>{f.q}</summary>
              <p style={{ marginTop: 10, marginBottom: 0 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <style>{`
        .steps-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
        .step-row { display: flex; gap: 20px; align-items: flex-start; padding: 24px 26px; }
        .step-number {
          flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%;
          background: var(--color-primary); color: #fff; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono);
        }
        .note-card { padding: 22px 26px; background: var(--color-primary-tint); border-color: var(--color-primary-tint-2); }

        .resources-section { border-top: 1px solid var(--color-border); padding-top: 64px; }

        .article-subtitle { margin: 0 0 10px; font-size: 0.9rem; line-height: 1.5; color: var(--color-text-secondary); }
        .article-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .article-card { padding: 0; overflow: hidden; display: flex; flex-direction: column; }
        .article-media { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: var(--color-surface-alt); }
        .article-media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.25s var(--ease-signal); }
        .article-card:hover .article-media img { transform: scale(1.04); }
        .article-body { padding: 18px 20px 20px; flex: 1; display: flex; flex-direction: column; }
        .article-link {
          margin-top: auto; display: inline-flex; align-items: center; gap: 6px;
          font-weight: 600; font-size: 0.9rem; color: var(--color-primary);
          transition: gap 0.15s;
        }
        .article-link:hover { gap: 10px; color: var(--color-primary-dark); }

        .faq-list { display: flex; flex-direction: column; gap: 10px; }
        .faq-item { padding: 18px 22px; }
        .faq-item summary { cursor: pointer; font-weight: 600; }

        @media (max-width: 920px) { .article-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .article-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}