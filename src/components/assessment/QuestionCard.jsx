export default function QuestionCard({ question, index, total, value, onAnswer }) {
  return (
    <div className="card question-card">
      <span className="eyebrow">Question {index + 1} of {total}</span>
      <h3 style={{ margin: '10px 0 22px' }}>{question.text}</h3>
      <div className="option-list">
        {question.options.map((option, i) => (
          <button
            key={option}
            className={`option-item ${value === i ? 'is-selected' : ''}`}
            onClick={() => onAnswer(i)}
          >
            <span className="option-radio" aria-hidden="true" />
            {option}
          </button>
        ))}
      </div>

      <style>{`
        .question-card { padding: 28px 30px; }
        .option-list { display: flex; flex-direction: column; gap: 10px; }
        .option-item {
          display: flex; align-items: center; gap: 12px;
          text-align: left; padding: 14px 16px;
          border: 1px solid var(--color-border); border-radius: var(--radius-sm);
          background: #fff; font-size: 0.98rem; color: var(--color-text);
          transition: border-color 0.15s, background 0.15s;
        }
        .option-item:hover { border-color: var(--color-primary); }
        .option-item.is-selected { border-color: var(--color-primary); background: var(--color-primary-tint); font-weight: 600; }
        .option-radio {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid var(--color-border); flex-shrink: 0;
        }
        .option-item.is-selected .option-radio {
          border-color: var(--color-primary);
          background: radial-gradient(circle, var(--color-primary) 45%, transparent 50%);
        }
      `}</style>
    </div>
  )
}
