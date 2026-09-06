import React from 'react'
import RatingStars from './RatingStars'
import Button from '../../../components/ui/Button'
import '../styles/review.css'

/**
 * ReviewCard — displays a single review with rating, display name, date, comment.
 */
const ReviewCard = ({ review, isOwn = false, onEdit, onDelete }) => {
  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : ''

  const initial = review.displayName?.charAt(0).toUpperCase() || 'V'

  return (
    <article className="hc-review-card">
      <div className="hc-review-card__header">
        <div className="hc-review-card__user">
          <div className="hc-review-card__avatar">
            {initial}
          </div>
          <div>
            <p className="hc-review-card__name" style={{ margin: 0 }}>
              {review.displayName || 'Verified Buyer'}
            </p>
            <p className="hc-review-card__date" style={{ margin: '2px 0 0' }}>
              {formattedDate}
            </p>
          </div>
        </div>
        <RatingStars value={review.rating} size="sm" />
      </div>

      {review.comment && (
        <p className="hc-review-card__comment">
          {review.comment}
        </p>
      )}

      {review.productName && (
        <div className="hc-review-card__badge">
          <span>🍯</span>
          <span>{review.productName}</span>
        </div>
      )}

      {isOwn && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border)', marginTop: 'var(--space-1)' }}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(review)}
          >
            ✏️ Edit
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(review)}
          >
            🗑 Delete
          </Button>
        </div>
      )}
    </article>
  )
}

export default ReviewCard
