import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/cart.css'

const CartItem = ({ item, onUpdateQuantity, onRemove, disabled }) => {
  if (!item) return null

  const { id, productId, productName, imageUrl, quantityKg, unitPrice, subtotal, availableQuantityKg } = item

  const defaultImg =
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&auto=format&fit=crop&q=60'

  const maxStock = Number(availableQuantityKg || 10)

  const handleStep = (delta) => {
    const nextQty = Math.round((Number(quantityKg) + delta) * 10) / 10
    if (nextQty >= 0.5 && nextQty <= maxStock) {
      onUpdateQuantity(id, nextQty)
    }
  }

  return (
    <div className="hc-cart-item">
      <div className="hc-cart-item__info">
        <img
          src={imageUrl || defaultImg}
          alt={productName}
          className="hc-cart-item__img"
          onError={(e) => {
            e.target.src = defaultImg
          }}
        />
        <div style={{ minWidth: 0 }}>
          <h4 className="hc-cart-item__title">
            <Link to={`/marketplace/product/${productId}`}>{productName}</Link>
          </h4>
          <p className="hc-cart-item__price">
            ₹{Number(unitPrice).toFixed(2)} / kg
          </p>
        </div>
      </div>

      <div className="hc-cart-item__ctrls">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="hc-prod-qty-ctrl">
            <button
              type="button"
              className="hc-prod-qty-btn"
              style={{ width: '28px', height: '28px', fontSize: 'var(--text-sm)' }}
              onClick={() => handleStep(-0.5)}
              disabled={disabled || Number(quantityKg) <= 0.5}
            >
              −
            </button>
            <span style={{ minWidth: '60px', textAlign: 'center', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {Number(quantityKg).toFixed(1)} kg
            </span>
            <button
              type="button"
              className="hc-prod-qty-btn"
              style={{ width: '28px', height: '28px', fontSize: 'var(--text-sm)' }}
              onClick={() => handleStep(0.5)}
              disabled={disabled || Number(quantityKg) >= maxStock}
            >
              +
            </button>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Max {maxStock} kg</span>
        </div>

        <div className="hc-cart-item__total">
          ₹{Number(subtotal).toFixed(2)}
        </div>

        <div>
          <button
            type="button"
            style={{
              padding: 'var(--space-1) var(--space-2)',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: '1rem',
              transition: 'color var(--transition-fast)',
            }}
            onClick={() => onRemove(id)}
            disabled={disabled}
            title="Remove from cart"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem
