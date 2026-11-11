import { useState } from 'react'
import StarRating from './StarRating'
import { addFeedback } from '../../utils/feedback'

export default function FeedbackPopup({ name, onClose }) {
  const [step, setStep] = useState('form') // 'form' | 'thanks'
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a star rating before submitting.')
      return
    }
    if (!message.trim()) {
      setError('Please share a few words about your experience.')
      return
    }
    addFeedback({ name, rating, title: title.trim(), message: message.trim() })
    setError('')
    setStep('thanks')
  }

  return (
    <div className="feedback-overlay" role="dialog" aria-modal="true">
      <div className="feedback-modal card">
        {step === 'form' ? (
          <>
            <div className="feedback-modal-header">
              <h3 style={{ margin: 0 }}>Write a Review</h3>
              <button className="feedback-close" aria-label="Close" onClick={onClose}>&times;</button>
            </div>

            <div className="feedback-brand-row">
              <span className="feedback-brand-mark" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 30 30">
                  <circle cx="15" cy="15" r="14" fill="var(--color-primary-tint)" />
                  <path d="M6,16 L11,16 L13,10 L16,21 L19,13 L21,16 L24,16" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <div className="feedback-brand-name">Manodarshi</div>
                <div className="feedback-brand-tag">Mental health screening &amp; assessment</div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="feedback-stars-row">
                <StarRating value={rating} onChange={setRating} size={30} />
                <span className="feedback-stars-hint">Tap to leave a rating</span>
              </div>

              <label className="feedback-label" htmlFor="feedback-title">What impressed you the most?</label>
              <input
                id="feedback-title"
                className="feedback-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Review title (optional)"
              />

              <label className="feedback-label" htmlFor="feedback-message">Describe your experience</label>
              <textarea
                id="feedback-message"
                className="feedback-textarea"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how the assessment went for you…"
              />

              {error && <p className="field-error" style={{ marginTop: 6 }}>{error}</p>}

              <button type="submit" className="btn btn-primary btn-block feedback-submit">
                Submit
              </button>
              <button type="button" className="btn btn-ghost btn-block" onClick={onClose}>
                Maybe later
              </button>
            </form>
          </>
        ) : (
          <div className="feedback-thanks">
            <div className="feedback-thanks-icon" aria-hidden="true">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="28" fill="var(--color-success)" />
                <path d="M18 30l7 7 14-15" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ margin: '14px 0 6px' }}>Thank you!</h3>
            <p style={{ marginBottom: 22 }}>
              Thanks for sharing your thoughts. We appreciate your feedback.
            </p>
            <button className="btn btn-primary btn-block" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>

      <style>{`
        .feedback-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(15, 34, 33, 0.4);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn 0.15s var(--ease-signal);
        }
        .feedback-modal {
          width: 100%; max-width: 400px; padding: 26px 28px;
          animation: popIn 0.2s var(--ease-signal);
        }
        .feedback-modal-header { display: flex; align-items: flex-start; justify-content: space-between; }
        .feedback-close {
          background: none; border: none; font-size: 1.4rem; line-height: 1;
          color: var(--color-text-secondary); padding: 0 2px;
        }
        .feedback-close:hover { color: var(--color-text); }

        .feedback-brand-row { display: flex; align-items: center; gap: 10px; margin: 16px 0 20px; }
        .feedback-brand-name { font-weight: 700; font-size: 0.92rem; }
        .feedback-brand-tag { font-size: var(--fs-caption); color: var(--color-text-secondary); }

        .feedback-stars-row { text-align: center; margin-bottom: 20px; }
        .feedback-stars-row .star-rating { justify-content: center; }
        .feedback-stars-hint { display: block; margin-top: 8px; font-size: var(--fs-small); color: var(--color-text-secondary); }

        .feedback-label { display: block; font-size: 0.85rem; font-weight: 600; margin: 0 0 6px; }
        .feedback-input, .feedback-textarea {
          width: 100%; font-family: inherit; font-size: 0.9rem;
          border: 1px solid var(--color-border); border-radius: var(--radius-sm);
          padding: 10px 12px; margin-bottom: 16px; resize: vertical;
        }
        .feedback-input:focus, .feedback-textarea:focus {
          border-color: var(--color-primary); outline: none;
          box-shadow: 0 0 0 3px var(--color-primary-tint);
        }
        .feedback-submit { margin-bottom: 8px; }

        .feedback-thanks { text-align: center; padding: 8px 4px; }
        .feedback-thanks-icon { display: flex; justify-content: center; }
      `}</style>
    </div>
  )
}