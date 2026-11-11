export default function Toast({ type = 'success', title, message, onClose }) {
  if (!title) return null
  return (
    <div className="toast-overlay" role="alertdialog" aria-modal="true" onClick={onClose}>
      <div className="toast-card" onClick={(e) => e.stopPropagation()}>
        <div className={`toast-icon ${type}`}>{type === 'success' ? '✓' : '!'}</div>
        <h3 style={{ marginBottom: '0.3em' }}>{title}</h3>
        {message && <p style={{ marginBottom: '1.2em' }}>{message}</p>}
        <button className="btn btn-primary btn-block" onClick={onClose}>
          Okay
        </button>
      </div>
    </div>
  )
}
