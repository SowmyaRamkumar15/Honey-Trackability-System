import React from 'react'
import '../styles/review.css'

/**
 * RatingStars — Renders 5 stars either interactively (click to select) or read-only.
 */
const RatingStars = ({ value = 0, onChange, size = 'md', showValue = false }) => {
  const isInteractive = typeof onChange === 'function'

  const fontSize = size === 'sm' ? 'var(--text-sm)' : size === 'lg' ? 'var(--text-2xl)' : 'var(--text-lg)'

  return (
    <span className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value
        return (
          <button
            key={star}
            type="button"
            className={`rating-star ${filled ? 'rating-star--filled' : ''} ${isInteractive ? 'rating-star--interactive' : ''}`}
            style={{ fontSize }}
            onClick={isInteractive ? () => onChange(star) : undefined}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            tabIndex={isInteractive ? 0 : -1}
          >
            {filled ? '★' : '☆'}
          </button>
        )
      })}
      {showValue && value > 0 && (
        <span style={{ fontWeight: 700, color: 'var(--primary)', marginLeft: 'var(--space-1)', fontSize }}>
          {Number(value).toFixed(1)}
        </span>
      )}
    </span>
  )
}

export default RatingStars
