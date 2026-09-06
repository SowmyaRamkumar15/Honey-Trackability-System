import React, { useState } from 'react'
import reviewApi from '../api/reviewApi'
import RatingStars from './RatingStars'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import '../styles/review.css'

/**
 * ReviewForm — inline form for creating or editing a review.
 */
const ReviewForm = ({ orderItemId, existingReview, onSuccess, onCancel, productName }) => {
  const [rating, setRating] = useState(existingReview?.rating ?? 0)
  const [comment, setComment] = useState(existingReview?.comment ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const isEditing = !!existingReview

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5 stars.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      let res
      if (isEditing) {
        res = await reviewApi.updateReview(existingReview.id, { rating, comment: comment.trim() || null })
      } else {
        res = await reviewApi.createReview({ orderItemId, rating, comment: comment.trim() || null })
      }
      onSuccess?.(res.data?.data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          <h4 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
            {isEditing ? '✏️ Edit Your Review' : '⭐ Rate Your Purchase'}
          </h4>
          {productName && (
            <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{productName}</p>
          )}
        </div>

        <div>
          <label className="hc-input__label">
            Your Rating
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <RatingStars value={rating} onChange={setRating} size="lg" />
            {rating > 0 && (
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--primary-dark)' }}>
                {['', '😕 Poor', '😐 Fair', '🙂 Good', '😊 Great', '🤩 Excellent!'][rating]}
              </span>
            )}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
            <label htmlFor="review-comment" className="hc-input__label" style={{ marginBottom: 0 }}>
              Your Review <span style={{ textTransform: 'none', fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              {comment.length} / 1000
            </span>
          </div>
          <textarea
            id="review-comment"
            className="hc-input__field"
            placeholder="Share your experience with this honey — taste, aroma, packaging, purity…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        {error && (
          <Alert type="danger" title="Review Error">
            {error}
          </Alert>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={submitting || rating === 0}
          >
            {submitting
              ? 'Submitting…'
              : isEditing
              ? 'Update Review'
              : 'Submit Review'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}

export default ReviewForm
