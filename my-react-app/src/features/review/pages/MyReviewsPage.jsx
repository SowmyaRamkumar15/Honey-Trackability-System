import React, { useState, useEffect } from 'react'
import CustomerLayout from '../../../layouts/CustomerLayout'
import reviewApi from '../api/reviewApi'
import ReviewCard from '../components/ReviewCard'
import ReviewForm from '../components/ReviewForm'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import Alert from '../../../components/feedback/Alert'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import PageHeader from '../../../components/layout/PageHeader'
import '../styles/review.css'

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [editingReview, setEditingReview] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  const loadReviews = async (p = 0) => {
    setLoading(true)
    setError(null)
    try {
      const res = await reviewApi.getMyReviews(p, 10)
      const data = res.data?.data
      setReviews(data?.content || [])
      setTotalPages(data?.totalPages ?? 0)
      setPage(p)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews(0)
  }, [])

  const handleDelete = async (review) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return
    setDeletingId(review.id)
    setDeleteError(null)
    try {
      await reviewApi.deleteReview(review.id)
      loadReviews(page)
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Failed to delete review')
    } finally {
      setDeletingId(null)
    }
  }

  const handleEditSuccess = () => {
    setEditingReview(null)
    loadReviews(page)
  }

  return (
    <CustomerLayout>
      <div className="hc-review-page">
        <PageHeader
          title="My Reviews"
          subtitle="All honey products you have reviewed and rated"
        />

        {error && (
          <Alert type="danger" title="Error">
            {error}
          </Alert>
        )}

        {deleteError && (
          <Alert type="danger" title="Delete Error">
            {deleteError}
          </Alert>
        )}

        {loading ? (
          <LoadingSpinner message="Loading your reviews..." />
        ) : reviews.length === 0 ? (
          <EmptyState
            icon="⭐"
            title="No reviews yet"
            description="Purchase honey and leave a review after delivery to help build trust in the marketplace."
          />
        ) : (
          <div className="hc-review-list">
            {editingReview && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <ReviewForm
                  existingReview={editingReview}
                  productName={editingReview.productName}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditingReview(null)}
                />
              </div>
            )}

            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isOwn={true}
                onEdit={(r) => setEditingReview(r)}
                onDelete={(r) => handleDelete(r)}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 0}
              onClick={() => loadReviews(page - 1)}
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
              onClick={() => loadReviews(page + 1)}
            >
              Next →
            </Button>
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}

export default MyReviewsPage
