import React from 'react'
import '../styles/order.css'

const STAGES = [
  { key: 'CONFIRMED', label: 'Confirmed', icon: '📝' },
  { key: 'PACKED', label: 'Packed', icon: '📦' },
  { key: 'SHIPPED', label: 'In Transit', icon: '🚚' },
  { key: 'DELIVERED', label: 'Delivered', icon: '🏠' },
]

export const OrderTracking = ({ currentStatus }) => {
  if (currentStatus === 'CANCELLED') {
    return (
      <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.2)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span style={{ fontSize: '1.5rem' }}>❌</span>
        <div>
          <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--danger)', display: 'block' }}>Order Cancelled</strong>
          <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>This customer order was cancelled and inventory was restored.</p>
        </div>
      </div>
    )
  }

  const currentIdx = STAGES.findIndex((s) => s.key === currentStatus)

  return (
    <div className="hc-order-tracking">
      {STAGES.map((stage, idx) => {
        const isCompleted = currentIdx >= idx
        const isCurrent = currentIdx === idx

        return (
          <React.Fragment key={stage.key}>
            <div className={`hc-track-step ${isCurrent ? 'hc-track-step--active' : isCompleted ? 'hc-track-step--done' : ''}`}>
              <div className="hc-track-step__icon">
                {isCompleted && !isCurrent ? '✓' : stage.icon}
              </div>
              <span className="hc-track-step__label">
                {stage.label}
              </span>
            </div>

            {idx < STAGES.length - 1 && (
              <div className={`hc-track-line ${currentIdx > idx ? 'hc-track-line--done' : currentIdx === idx ? 'hc-track-line--active' : ''}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default OrderTracking
