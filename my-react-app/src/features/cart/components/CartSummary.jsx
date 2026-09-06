import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import '../styles/cart.css'

const CartSummary = ({ subtotal, itemCount, onClear, disabled }) => {
  const deliveryEstimate = 0.0 // Free delivery
  const total = Number(subtotal) + deliveryEstimate

  return (
    <Card header={<h3>Order Summary</h3>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="hc-cart-summary-row">
          <span>Items ({itemCount}):</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
            ₹{Number(subtotal).toFixed(2)}
          </span>
        </div>

        <div className="hc-cart-summary-row">
          <span>Standard Delivery:</span>
          <span style={{ fontWeight: 700, color: 'var(--success)' }}>FREE</span>
        </div>

        <div className="hc-cart-summary-total">
          <span>Total Payable:</span>
          <span className="hc-cart-summary-price">₹{total.toFixed(2)}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <Link to="/checkout" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg" style={{ width: '100%' }}>
              Proceed to Checkout →
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            style={{ width: '100%', color: 'var(--text-muted)' }}
            onClick={onClear}
            disabled={disabled}
          >
            Clear Cart
          </Button>
        </div>

        <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            🔒 100% Secure Checkout • Direct Beekeeper Fair Pricing • Blockchain Purity Guarantee
          </p>
        </div>
      </div>
    </Card>
  )
}

export default CartSummary
