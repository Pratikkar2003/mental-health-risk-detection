export default function LegalPage({ title, children }) {
  return (
    <div className="container section legal-page">
      <span className="eyebrow">Legal</span>
      <h1 style={{ margin: '10px 0 20px' }}>{title}</h1>
      <div className="card legal-card">{children}</div>

      <style>{`
        .legal-card { padding: 30px 32px; max-width: 720px; }
        .legal-card p { color: var(--color-text-secondary); }
      `}</style>
    </div>
  )
}
