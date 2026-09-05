import React from 'react'

/**
 * RatingStars — Renders 5 stars either interactively (click to select) or read-only.
 *
 * Props:
 *   value     – current rating (1–5)
 *   onChange  – callback(rating) when user clicks a star; omit for read-only
 *   size      – 'sm' | 'md' | 'lg'  (default 'md')
 *   showValue – display numeric rating next to stars (default false)
 */
const RatingStars = ({ value = 0, onChange, size = 'md', showValue = false }) => {
  const isInteractive = typeof onChange === 'function'

  const sizeMap = { sm: '1.1rem', md: '1.4rem', lg: '1.9rem' }
  const fontSize = sizeMap[size] || sizeMap.md

  return (
    <span className="rating-stars" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value
        return (
          <button
            key={star}
            type="button"
            className={`rating-star${filled ? ' rating-star--filled' : ''}${isInteractive ? ' rating-star--interactive' : ''}`}
            style={{
              background: 'none',
              border: 'none',
              padding: '0 1px',
              fontSize,
              cursor: isInteractive ? 'pointer' : 'default',
              color: filled ? '#D97706' : '#94A3B8',
              lineHeight: 1,
              transition: 'color 0.15s',
            }}
            onClick={isInteractive ? () => onChange(star) : undefined}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            tabIndex={isInteractive ? 0 : -1}
          >
            {filled ? '★' : '☆'}
          </button>
        )
      })}
      {showValue && value > 0 && (
        <span
          className="rating-stars__value"
          style={{ fontSize: fontSize, fontWeight: 700, color: '#D97706', marginLeft: '4px' }}
        >
          {Number(value).toFixed(1)}
        </span>
      )}
    </span>
  )
}

export default RatingStars
