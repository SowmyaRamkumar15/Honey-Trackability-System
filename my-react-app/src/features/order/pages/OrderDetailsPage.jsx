import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import CustomerLayout from '../../../layouts/CustomerLayout'
import orderApi from '../api/orderApi'
import OrderTracking from '../components/OrderTracking'
import Alert from '../../../components/feedback/Alert'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import PageHeader from '../../../components/layout/PageHeader'
import ReviewForm from '../../review/components/ReviewForm'
import RatingStars from '../../review/components/RatingStars'
import reviewApi from '../../review/api/reviewApi'
import '../styles/order.css'

// --- Per-item review panel shown on DELIVERED orders ---
const OrderItemReviewPanel = ({ item }) => {
  const [existingReview, setExistingReview] = useState(undefined)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleteError, setDeleteError] = useState(null)

  const loadReview = async () => {
    setLoading(true)
    try {
      const res = await reviewApi.getReviewByOrderItem(item.id)
      setExistingReview(res.data?.data || null)
    } catch {
      setExistingReview(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReview()
  }, [item.id])

  const handleSuccess = (review) => {
    setExistingReview(review)
    setShowForm(false)
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete your review for this item?')) return
    setDeleteError(null)
    try {
      await reviewApi.deleteReview(existingReview.id)
      setExistingReview(null)
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Failed to delete review')
    }
  }

  if (loading) return <div style={{ height: '32px', background: 'var(--background)', borderRadius: 'var(--radius-sm)', marginTop: 'var(--space-2)' }} />

  return (
    <div style={{ marginTop: 'var(--space-2)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border)' }}>
      {deleteError && (
        <Alert type="danger" title="Review Error">
          {deleteError}
        </Alert>
      )}

      {existingReview ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <RatingStars value={existingReview.rating} size="sm" />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>Your review</span>
          </div>
          {existingReview.comment && (
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              "{existingReview.comment}"
            </p>
          )}
          {showForm ? (
            <ReviewForm
              existingReview={existingReview}
              productName={item.productName}
              onSuccess={handleSuccess}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(true)}>
                ✏️ Edit Review
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                🗑 Delete
              </Button>
            </div>
          )}
        </div>
      ) : showForm ? (
        <ReviewForm
          orderItemId={item.id}
          productName={item.productName}
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setShowForm(true)}>
          ⭐ Rate This Honey
        </Button>
      )}
    </div>
  )
}

const OrderDetailsPage = () => {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const loadOrder = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await orderApi.getMyOrderByNumber(orderNumber)
      setOrder(res.data?.data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrder()
  }, [orderNumber])

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be restored.')) return

    setCancelling(true)
    try {
      await orderApi.cancelOrder(orderNumber)
      await loadOrder()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <CustomerLayout>
        <LoadingSpinner message="Loading order details..." />
      </CustomerLayout>
    )
  }

  if (error || !order) {
    return (
      <CustomerLayout>
        <div style={{ maxWidth: '800px', margin: 'var(--space-8) auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Alert type="danger" title="Error">
            {error || 'Order not found'}
          </Alert>
          <Link to="/orders" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="sm">
              ← Back to My Orders
            </Button>
          </Link>
        </div>
      </CustomerLayout>
    )
  }

  const {
    totalAmount,
    paymentStatus,
    paymentId,
    orderStatus,
    fulfillmentType,
    deliveryAddress,
    items,
    createdAt,
  } = order

  const isConfirmed = orderStatus === 'CONFIRMED'
  const isDelivered = orderStatus === 'DELIVERED'

  return (
    <CustomerLayout>
      <div className="hc-order-page">
        {/* Breadcrumbs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/orders" style={{ color: 'inherit', textDecoration: 'none' }}>My Orders</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{orderNumber}</span>
        </nav>

        <PageHeader
          title="Order Details"
          subtitle={`Reference: ${orderNumber} • Placed on ${new Date(createdAt).toLocaleString('en-IN')}`}
          actions={
            isConfirmed && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={cancelling}
                onClick={handleCancel}
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            )
          }
        />

        {/* Tracking Stepper Card */}
        <Card header={<h3>Fulfillment Status</h3>}>
          <OrderTracking currentStatus={orderStatus} />
        </Card>

        {/* Order Items Table */}
        <Card header={<h3>Ordered Honey Items</h3>}>
          <div style={{ overflowX: 'auto' }}>
            <table className="hc-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th style={{ textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{item.productName}</strong>
                      {item.batchId && (
                        <span style={{ fontSize: '11px', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                          Batch: {item.batchId}
                        </span>
                      )}
                      {isDelivered && <OrderItemReviewPanel item={item} />}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      ₹{Number(item.unitPrice).toFixed(2)}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {Number(item.quantityKg).toFixed(1)} kg
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      ₹{Number(item.subtotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)', marginTop: 'var(--space-4)' }}>
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                <span>Payment Status:</span>
                <span style={{ fontWeight: 700, color: paymentStatus === 'SUCCESS' ? 'var(--success)' : 'var(--warning)' }}>
                  {paymentStatus === 'SUCCESS' ? '✅ Paid' : paymentStatus}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                <span>Fulfillment Type:</span>
                <span style={{ fontWeight: 600 }}>
                  {fulfillmentType === 'LOCAL_PICKUP' ? 'Local Apiary Pickup' : 'Doorstep Delivery'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border)', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-base)' }}>
                <span>Total Amount:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-dark)' }}>
                  ₹{Number(totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Delivery Address Card */}
        {deliveryAddress && (
          <Card header={<h3>Delivery Address</h3>}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', marginBottom: '4px' }}>
                {deliveryAddress.name}
              </strong>
              <div>{deliveryAddress.line1}</div>
              {deliveryAddress.line2 && <div>{deliveryAddress.line2}</div>}
              <div>
                {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.postalCode}
              </div>
            </div>
          </Card>
        )}
      </div>
    </CustomerLayout>
  )
}

export default OrderDetailsPage
