import { useState } from 'react'

function Star({ filled, size, onClick, onMouseEnter, interactive }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      <path
        d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
        fill={filled ? '#F5B400' : 'none'}
        stroke={filled ? '#F5B400' : 'var(--color-border)'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function StarRating({ value = 0, onChange, size = 20, max = 5 }) {
  const interactive = typeof onChange === 'function'
  const [hoverValue, setHoverValue] = useState(0)
  const displayValue = interactive && hoverValue ? hoverValue : value

  return (
    <div
      className="star-rating"
      role={interactive ? 'radiogroup' : undefined}
      aria-label={interactive ? 'Rating' : `${value} out of ${max} stars`}
      onMouseLeave={interactive ? () => setHoverValue(0) : undefined}
      style={{ display: 'inline-flex', gap: 4 }}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <Star
          key={n}
          size={size}
          filled={n <= displayValue}
          interactive={interactive}
          onClick={interactive ? () => onChange(n) : undefined}
          onMouseEnter={interactive ? () => setHoverValue(n) : undefined}
        />
      ))}
    </div>
  )
}