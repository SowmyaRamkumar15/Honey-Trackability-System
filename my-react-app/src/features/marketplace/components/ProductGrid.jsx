import React from 'react'
import ProductCard from './ProductCard'
import EmptyState from '../../../components/ui/EmptyState'
import Alert from '../../../components/feedback/Alert'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import '../styles/marketplace.css'

/**
 * ProductGrid — renders luxury product cards or polished loading/empty state.
 */
const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div style={{ padding: 'var(--space-10) 0' }}>
        <LoadingSpinner message="Loading verified honey products..." />
      </div>
    )
  }

  if (error) {
    return (
      <Alert type="danger" title="Marketplace Error">
        {error}
      </Alert>
    )
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon="🍯"
        title="No Verified Honey Matching Your Filters"
        description="We couldn't find any batches matching your current search criteria. Try choosing another floral source or clearing filters."
      />
    )
  }

  return (
    <div className="hc-market-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export default ProductGrid
