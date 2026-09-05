import React from 'react'
import ProductCard from './ProductCard'

/**
 * ProductGrid — renders product cards or loading/empty state.
 */
const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="product-grid product-grid--loading">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="card product-card-skeleton">
            <div className="skeleton skeleton--image"></div>
            <div className="skeleton skeleton--text"></div>
            <div className="skeleton skeleton--title"></div>
            <div className="skeleton skeleton--price"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert--danger">
        <span className="alert__icon">⚠️</span>
        <div className="alert__body">
          <h4 className="alert__title">Error Loading Marketplace</h4>
          <p className="alert__message">{error}</p>
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">🍯</div>
        <h3 className="empty-state__title">No Verified Honey Found</h3>
        <p className="empty-state__description">
          Try changing your filter settings or search term to discover authentic artisan honey.
        </p>
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export default ProductGrid
