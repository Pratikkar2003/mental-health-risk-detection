import { useMemo } from 'react'
import StarRating from '../common/StarRating'
import { getFeedback, initials, colorForName, timeAgo } from '../../utils/feedback'

function FeedbackCard({ item }) {
  const timeText = item.timestamp ? timeAgo(item.timestamp) : item.timeLabel

  return (
    <div className="feedback-card card">
      <StarRating value={item.rating} size={16} />
      <p className="feedback-message">{item.message}</p>
      <div className="feedback-person">
        <span className="feedback-avatar" style={{ background: colorForName(item.name) }}>
          {initials(item.name)}
        </span>
        <div>
          <div className="feedback-name">{item.name}</div>
          <div className="feedback-time">{timeText}</div>
        </div>
      </div>
    </div>
  )
}

export default function FeedbackCarousel() {
  // Duplicate the list so the CSS marquee loop is seamless.
  const feedback = useMemo(() => getFeedback(), [])
  const track = useMemo(() => [...feedback, ...feedback], [feedback])

  if (!feedback.length) return null

  return (
    <section className="section feedback-section">
      <div className="container">
        <span className="eyebrow">What people are saying</span>
        <h2 style={{ marginTop: 8, marginBottom: 28 }}>Feedback from people who've used Manodarshi</h2>
      </div>

      <div className="feedback-viewport">
        <div className="feedback-track" style={{ '--feedback-count': feedback.length }}>
          {track.map((item, i) => (
            <FeedbackCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>

      <style>{`
        .feedback-section { overflow: hidden; background: #0D5C5C;; }
        .feedback-section .eyebrow { color: #fff; opacity: 0.85; }
        .feedback-section h2 { color: #fff; }
        .feedback-viewport {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
        }
        .feedback-track {
          display: flex;
          gap: 20px;
          width: max-content;
          padding: 4px 0 8px;
          animation: feedback-scroll 42s linear infinite;
        }
        .feedback-track:hover { animation-play-state: paused; }

        .feedback-card {
          width: 320px; flex-shrink: 0;
          padding: 24px 26px; display: flex; flex-direction: column; gap: 14px;
        }
        .feedback-message {
          font-size: 0.92rem; color: var(--color-text); margin: 0;
          line-height: 1.6; min-height: 84px;
        }
        .feedback-person { display: flex; align-items: center; gap: 12px; margin-top: auto; }
        .feedback-avatar {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 700; font-size: 0.8rem; font-family: var(--font-mono);
        }
        .feedback-name { font-weight: 600; font-size: 0.9rem; color: var(--color-text); }
        .feedback-time { font-size: var(--fs-caption); color: var(--color-text-secondary); }

        @keyframes feedback-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% / 2)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .feedback-track { animation: none; overflow-x: auto; }
        }
        @media (max-width: 560px) {
          .feedback-card { width: 260px; padding: 20px; }
        }
      `}</style>
    </section>
  )
}