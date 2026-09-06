import React from 'react'
import { Link } from 'react-router-dom'
import OrderTracking from './OrderTracking'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import '../styles/order.css'

const OrderCard = ({ order, onCancel, isCancelling }) => {
  if (!order) return null

  const {
    orderNumber,
    createdAt,
    totalAmount,
    paymentStatus,
    orderStatus,
    fulfillmentType,
    items,
  } = order

  const isConfirmed = orderStatus === 'CONFIRMED'

  return (
    <div className="hc-order-card">
      <div className="hc-order-grid-meta">
        <div>
          <span className="hc-order-meta-label">ORDER PLACED</span>
          <p className="hc-order-meta-val" style={{ margin: 0, fontSize: 'var(--text-xs)' }}>
            {createdAt ? new Date(createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'Recently'}
          </p>
        </div>

        <div>
          <span className="hc-order-meta-label">TOTAL</span>
          <p className="hc-order-meta-val" style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
            ₹{Number(totalAmount).toFixed(2)}
          </p>
        </div>

        <div>
          <span className="hc-order-meta-label">ORDER #</span>
          <p className="hc-order-meta-val" style={{ margin: 0, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
            {orderNumber}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          <Badge variant={paymentStatus === 'SUCCESS' ? 'success' : 'warning'} size="sm">
            {paymentStatus === 'SUCCESS' ? '✅ Paid' : paymentStatus}
          </Badge>
          <Badge variant="default" size="sm">
            {fulfillmentType === 'LOCAL_PICKUP' ? '🏪 Pickup' : '🚚 Delivery'}
          </Badge>
        </div>
      </div>

      <div style={{ padding: 'var(--space-2) 0' }}>
        <OrderTracking currentStatus={orderStatus} />
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
        {items?.map((item) => (
          <div key={item.id} style={{ padding: 'var(--space-1) 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>{item.productName}</strong>
              <span style={{ color: 'var(--text-secondary)', marginLeft: 'var(--space-2)' }}>
                ({Number(item.quantityKg).toFixed(1)} kg × ₹{Number(item.unitPrice).toFixed(2)})
              </span>
            </div>
            <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              ₹{Number(item.subtotal).toFixed(2)}
            </strong>
          </div>
        ))}
      </div>

      <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
        <Link to={`/orders/${orderNumber}`} style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="sm">
            View Full Details →
          </Button>
        </Link>

        {isConfirmed && onCancel && (
          <Button
            type="button"
            variant="danger"
            size="sm"
            disabled={isCancelling}
            onClick={() => onCancel(orderNumber)}
          >
            Cancel Order
          </Button>
        )}
      </div>
    </div>
  )
}

export default OrderCard
