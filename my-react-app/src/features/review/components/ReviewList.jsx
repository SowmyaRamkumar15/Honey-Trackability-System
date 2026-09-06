import React from 'react'
import RatingStars from './RatingStars'
import ReviewCard from './ReviewCard'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import '../styles/review.css'

/**
 * ReviewSummary — shows average rating, star breakdown, and total count.
 */
const ReviewSummary = ({ averageRating = 0, totalReviews = 0 }) => {
  if (totalReviews === 0) {
    return (
      <div style={{ padding: 'var(--space-5)', textAlign: 'center', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: 'var(--space-4)', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
          {Number(averageRating).toFixed(1)}
        </div>
        <div style={{ marginTop: 'var(--space-1)' }}>
          <RatingStars value={Math.round(averageRating)} size="sm" />
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
          {totalReviews} review{totalReviews !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}

/**
 * ReviewList — paginated list of reviews for a product.
 */
const ReviewList = ({
  reviews = [],
  loading = false,
  error = null,
  page = 0,
  totalPages = 0,
  onPageChange,
  averageRating = 0,
  totalReviews = 0,
}) => {
  return (
    <Card header={<h3>Customer Reviews</h3>}>
      <ReviewSummary averageRating={averageRating} totalReviews={totalReviews} />

      {loading && (
        <div style={{ padding: 'var(--space-6) 0' }}>
          <LoadingSpinner message="Loading reviews..." />
        </div>
      )}

      {error && (
        <Alert type="danger" title="Review Error">
          {error}
        </Alert>
      )}

      {!loading && !error && reviews.length === 0 && totalReviews === 0 && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: 'var(--text-xs)', marginTop: 'var(--space-4)' }}>
          No reviews yet for this product.
        </p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 0}
            onClick={() => onPageChange?.(page - 1)}
          >
            ← Prev
          </Button>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange?.(page + 1)}
          >
            Next →
          </Button>
        </div>
      )}
    </Card>
  )
}

export { ReviewSummary }
export default ReviewList
