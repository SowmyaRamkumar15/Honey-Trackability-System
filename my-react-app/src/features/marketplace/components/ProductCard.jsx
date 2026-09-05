import React from 'react'
import { Link } from 'react-router-dom'
import PurityBadge from './PurityBadge'
import VerifiedBadge from './VerifiedBadge'

/**
 * ProductCard — marketplace listing card.
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
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=60'

  return (
    <div className="card product-card">
      <div className="product-card__image-wrap">
        <img
          src={imageUrl || defaultImg}
          alt={productName}
          className="product-card__image"
          onError={(e) => {
            e.target.src = defaultImg
          }}
        />
        <div className="product-card__badges">
          {verified && <VerifiedBadge verified={verified} batchId={batchId} />}
          {purityScore != null && <PurityBadge score={purityScore} size="sm" />}
        </div>
      </div>

      <div className="product-card__content">
        <div className="product-card__meta">
          <span className="product-card__flower">{flowerSource || 'Multiflora'}</span>
          <span className="product-card__region">📍 {region || 'India'}</span>
        </div>

        <h3 className="product-card__title">
          <Link to={`/marketplace/product/${id}`}>{productName}</Link>
        </h3>

        {beekeeper && (
          <p className="product-card__beekeeper">
            🧑‍🌾 <strong>{beekeeper.name}</strong> • {beekeeper.village}
          </p>
        )}

        <div className="product-card__footer">
          <div className="product-card__price-wrap">
            <span className="product-card__price">₹{Number(pricePerKg).toFixed(0)}</span>
            <span className="product-card__unit">/ kg</span>
          </div>

          <div className="product-card__stock">
            <span className="product-card__stock-val">{availableQuantityKg} kg</span> left
          </div>
        </div>

        <div className="product-card__actions">
          <Link
            to={`/marketplace/product/${id}`}
            className="btn btn--primary btn--sm btn--full"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
