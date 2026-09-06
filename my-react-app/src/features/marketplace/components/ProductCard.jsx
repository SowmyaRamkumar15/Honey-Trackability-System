import React from 'react'
import { Link } from 'react-router-dom'
import PurityBadge from './PurityBadge'
import VerifiedBadge from './VerifiedBadge'
import Button from '../../../components/ui/Button'
import '../styles/marketplace.css'

/**
 * ProductCard — executive marketplace listing card with rich visual hierarchy.
 */
const ProductCard = ({ product }) => {
  if (!product) return null

  const {
    id,
    batchId,
    productName,
    flowerSource,
    region,
    pricePerKg,
    availableQuantityKg,
    imageUrl,
    verified,
    purityScore,
    beekeeper,
  } = product

  const defaultImg =
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80'

  const stockKg = Number(availableQuantityKg || 0)
  const isLowStock = stockKg > 0 && stockKg <= 10

  return (
    <div className="hc-prod-card">
      {/* Product Image & Badges Container */}
      <div className="hc-prod-card__img-wrap">
        <img
          src={imageUrl || defaultImg}
          alt={productName}
          className="hc-prod-card__img"
          onError={(e) => {
            e.target.src = defaultImg
          }}
        />

        {/* Floating Badges */}
        <div className="hc-prod-card__badges">
          <div className="hc-prod-card__badge-item">
            <VerifiedBadge verified={verified} batchId={batchId} />
          </div>
          {purityScore != null && (
            <div className="hc-prod-card__badge-item">
              <PurityBadge score={purityScore} size="sm" />
            </div>
          )}
        </div>
      </div>

      {/* Product Details Content */}
      <div className="hc-prod-card__body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {/* Floral source & Regional Origin */}
          <div className="hc-prod-card__meta">
            <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'var(--primary-soft)', color: 'var(--primary-dark)', border: '1px solid var(--primary-light)', fontWeight: 700, fontSize: '0.6875rem' }}>
              🍯 {flowerSource || 'Multiflora'}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.6875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              📍 {region || 'India'}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="hc-prod-card__title">
            <Link to={`/marketplace/product/${id}`}>
              {productName}
            </Link>
          </h3>

          {/* Beekeeper Signature */}
          {beekeeper && (
            <div className="hc-prod-card__beekeeper">
              <span>🧑‍🌾</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--text-xs)' }}>
                Harvested by <strong style={{ color: 'var(--text-primary)' }}>{beekeeper.name}</strong>
                {beekeeper.village ? ` (${beekeeper.village})` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Pricing & Stock Scarcity */}
        <div className="hc-prod-card__pricing">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span className="hc-prod-card__price">₹{Number(pricePerKg).toFixed(0)}</span>
            <span className="hc-prod-card__unit">/ kg</span>
          </div>

          <div className="hc-prod-card__stock">
            {isLowStock ? (
              <span style={{ color: 'var(--warning)', fontWeight: 700, background: 'var(--warning-soft)', padding: '3px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--warning-border)', fontSize: '0.6875rem' }}>
                ⚡ Only {stockKg} kg left
              </span>
            ) : (
              <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{stockKg} kg</strong> in stock
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div>
          <Link to={`/marketplace/product/${id}`} style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="sm" style={{ width: '100%', fontWeight: 'var(--font-bold)' }}>
              View Details & Proof →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
