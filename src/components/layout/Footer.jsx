import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="row gap-8">
            <svg width="24" height="24" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="14" fill="var(--color-primary-tint)" />
              <path d="M6,16 L11,16 L13,10 L16,21 L19,13 L21,16 L24,16" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary-dark)' }}>Manodarshi</strong>
          </div>
          <p style={{ marginTop: 10, maxWidth: 280 }}>
            AI-assisted mental health screening and assessment support.
          </p>
        </div>

        <div>
          <h4 className="footer-heading">Product</h4>
          <ul className="footer-list">
            <li><Link to="/assessments">Assessments</Link></li>
            <li><Link to="/how-it-works">How It Works &amp; Resources</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Company</h4>
          <ul className="footer-list">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/help">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© 2026 Manodarshi. All rights reserved.</p>
        <p className="footer-disclaimer">
          Disclaimer: The platform provides screening/assessment support and does not provide a medical diagnosis.
        </p>
      </div>

      <style>{`
        .footer { background: var(--color-primary-dark); color: #DCEBEA; padding: 56px 0 28px; margin-top: auto; }
        .footer-grid { display: grid; grid-template-columns: 1.4fr repeat(2, 1fr); gap: 32px; }
        .footer p { color: #B9D6D3; }
        .footer-heading { color: #fff; font-family: var(--font-body); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 14px; }
        .footer-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .footer-list a { color: #C9E2E0; font-size: 0.92rem; }
        .footer-list a:hover { color: #fff; }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.14); margin-top: 40px; padding-top: 20px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
        .footer-bottom p { margin: 0; font-size: 0.82rem; color: #9FC4C1; }
        .footer-disclaimer { max-width: 460px; text-align: right; }

        @media (max-width: 780px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .footer-bottom { flex-direction: column; }
          .footer-disclaimer { text-align: left; }
        }
      `}</style>
    </footer>
  )
}