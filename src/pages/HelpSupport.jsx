export default function HelpSupport() {
  return (
    <div>
      <span className="eyebrow">Help &amp; Support</span>
      <h1 style={{ margin: '8px 0 6px' }}>We're here to help</h1>
      <p style={{ marginBottom: 28, maxWidth: 560 }}>
        Reach out with questions about your assessments, reports, account, or the platform itself.
      </p>

      <div className="card contact-card">
        <div className="field">
          <label htmlFor="subject">Subject</label>
          <input id="subject" placeholder="What's this about?" />
        </div>
        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea id="message" rows={5} placeholder="Tell us more…" />
        </div>
        <button className="btn btn-primary">Send Message</button>
      </div>

      <div className="card crisis-card">
        <strong>In a crisis?</strong>
        <p style={{ marginTop: 6, marginBottom: 0 }}>
          If you or someone you know is in immediate danger, please contact local emergency
          services or a crisis helpline right away. This platform is not equipped for emergencies.
        </p>
      </div>

      <style>{`
        .contact-card { padding: 26px 28px; max-width: 560px; margin: 0 auto 20px; }
        .crisis-card { padding: 20px 24px; max-width: 560px; margin: 0 auto; background: #FBE9E7; border-color: #F3C7C1; }
      `}</style>
    </div>
  )
}
