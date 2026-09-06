import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import MainLayout from '../../../layouts/MainLayout'
import productApi from '../api/productApi'
import cartApi from '../../cart/api/cartApi'
import { fetchCart } from '../../cart/cartSlice'
import PurityBadge from '../components/PurityBadge'
import VerifiedBadge from '../components/VerifiedBadge'
import Alert from '../../../components/feedback/Alert'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import ReviewList from '../../review/components/ReviewList'
import useReviews from '../../review/hooks/useReviews'
import '../styles/marketplace.css'

const ProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, role } = useSelector((state) => state.auth)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1.0)
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartSuccess, setCartSuccess] = useState(false)
  const [cartError, setCartError] = useState(null)

  // Reviews (live from backend)
  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
    page: reviewPage,
    totalPages: reviewTotalPages,
    totalElements: totalReviews,
    setPage: setReviewPage,
  } = useReviews(id)

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      try {
        const res = await productApi.getProduct(id)
        const data = res.data?.data
        setProduct(data)
        if (data?.availableQuantityKg && Number(data.availableQuantityKg) < 1.0) {
          setQuantity(Number(data.availableQuantityKg))
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load product details')
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  const handleQuantityChange = (delta) => {
    if (!product) return
    const max = Number(product.availableQuantityKg || 1)
    const newQty = Math.round((quantity + delta) * 10) / 10
    if (newQty >= 0.5 && newQty <= max) {
      setQuantity(newQty)
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (role !== 'CUSTOMER') {
      setCartError('Only registered Customer accounts can purchase products.')
      return
    }

    setAddingToCart(true)
    setCartSuccess(false)
    setCartError(null)

    try {
      await cartApi.addItem({
        productId: Number(id),
        quantityKg: quantity,
      })
      dispatch(fetchCart())
      setCartSuccess(true)
    } catch (err) {
      setCartError(err?.response?.data?.message || 'Failed to add item to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: 'var(--space-10) 0' }}>
          <LoadingSpinner message="Loading product details..." />
        </div>
      </MainLayout>
    )
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div style={{ maxWidth: '800px', margin: 'var(--space-8) auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Alert type="danger" title="Product Error">
            {error || 'Product not found'}
          </Alert>
          <Link to="/marketplace" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="sm">
              ← Back to Marketplace
            </Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  const defaultImg =
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'

  const maxStock = Number(product.availableQuantityKg || 0)
  const isOutOfStock = maxStock <= 0
  const subtotal = Math.round(Number(product.pricePerKg) * quantity * 100) / 100

  return (
    <MainLayout>
      <div className="hc-market-page" style={{ paddingBottom: 'var(--space-10)' }}>
        {/* Breadcrumbs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/marketplace" style={{ color: 'inherit', textDecoration: 'none' }}>Marketplace</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.productName}</span>
        </nav>

        {/* Main Details Grid */}
        <div className="hc-prod-detail-layout">
          {/* Left Column: Image & Blockchain Proof */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <Card style={{ padding: 'var(--space-3)', overflow: 'hidden' }}>
              <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--primary-soft)' }}>
                <img
                  src={product.imageUrl || defaultImg}
                  alt={product.productName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = defaultImg
                  }}
                />
              </div>
            </Card>

            {/* Authenticity & Blockchain Proof Card */}
            <Card header={<h4>🔒 Authenticity & Verification Proof</h4>}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
                <div style={{ background: 'var(--background)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--space-1)' }}>
                    Lab Purity Score
                  </span>
                  <PurityBadge score={product.purityScore} size="lg" />
                </div>

                <div style={{ background: 'var(--background)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--space-1)' }}>
                    Blockchain Status
                  </span>
                  <VerifiedBadge verified={product.verified} batchId={product.batchId} />
                </div>
              </div>

              {product.batchId && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <Link to={`/verify/${product.batchId}`} style={{ textDecoration: 'none' }}>
                    <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                      🔗 Inspect Public Blockchain Certificate
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Info, Beekeeper Story & Purchase */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Header / Pricing */}
            <Card>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <span style={{ padding: '2px 10px', background: 'var(--primary-soft)', color: 'var(--primary-dark)', borderRadius: 'var(--radius-full)', border: '1px solid var(--primary-light)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                  🍯 {product.flowerSource || 'Multiflora'}
                </span>
                <span style={{ padding: '2px 10px', background: 'var(--background)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  📍 {product.region || 'India'}
                </span>
                {product.harvestDate && (
                  <span style={{ padding: '2px 10px', background: 'var(--background)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                    🗓️ Harvested {product.harvestDate}
                  </span>
                )}
              </div>

              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 var(--space-3)' }}>
                {product.productName}
              </h1>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', padding: 'var(--space-3) 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ₹{Number(product.pricePerKg).toFixed(0)}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>per kg (pure raw honey)</span>
              </div>

              <div style={{ marginTop: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>
                  Description
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {product.description ||
                    '100% natural, unadulterated artisan honey harvested directly from certified sustainable beekeepers.'}
                </p>
              </div>
            </Card>

            {/* Beekeeper Story Card */}
            {product.beekeeper && (
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  {product.beekeeper.photoUrl ? (
                    <img
                      src={product.beekeeper.photoUrl}
                      alt={product.beekeeper.name}
                      style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-soft)', border: '1px solid var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      🐝
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Harvested by</span>
                    <h4 style={{ margin: '2px 0 0', fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: 700 }}>
                      {product.beekeeper.name}
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      📍 {product.beekeeper.village || 'Certified Apiary'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Purchase Form */}
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-4)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Stock Availability:
                </span>
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: isOutOfStock ? 'rgba(220, 38, 38, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                    color: isOutOfStock ? 'var(--danger)' : 'var(--success)',
                  }}
                >
                  {isOutOfStock ? 'Out of Stock' : `${maxStock} kg available in harvest`}
                </span>
              </div>

              {!isOutOfStock && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="hc-input__label">Select Quantity (kg):</label>
                  <div className="hc-prod-qty-ctrl">
                    <button
                      type="button"
                      className="hc-prod-qty-btn"
                      onClick={() => handleQuantityChange(-0.5)}
                      disabled={quantity <= 0.5}
                    >
                      −
                    </button>
                    <span className="hc-prod-qty-val">{quantity.toFixed(1)} kg</span>
                    <button
                      type="button"
                      className="hc-prod-qty-btn"
                      onClick={() => handleQuantityChange(0.5)}
                      disabled={quantity >= maxStock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div style={{ background: 'var(--primary-soft)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-light)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary-dark)' }}>Calculated Subtotal:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--primary-dark)' }}>
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              {cartSuccess && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <Alert type="success" title="Added to Cart">
                    Added {quantity.toFixed(1)} kg of {product.productName} to your cart!
                  </Alert>
                  <div style={{ marginTop: 'var(--space-2)' }}>
                    <Link to="/cart" style={{ textDecoration: 'none' }}>
                      <Button variant="primary" size="sm">
                        🛒 View Cart & Checkout
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {cartError && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <Alert type="danger" title="Cart Error">
                    {cartError}
                  </Alert>
                </div>
              )}

              <Button
                type="button"
                variant="primary"
                size="lg"
                style={{ width: '100%' }}
                disabled={isOutOfStock || addingToCart}
                onClick={handleAddToCart}
              >
                {addingToCart ? 'Adding to Cart...' : isOutOfStock ? 'Out of Stock' : '🛒 Add to Cart'}
              </Button>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ paddingTop: 'var(--space-6)' }}>
          <ReviewList
            reviews={reviews}
            loading={reviewsLoading}
            error={reviewsError}
            page={reviewPage}
            totalPages={reviewTotalPages}
            totalElements={totalReviews}
            onPageChange={setReviewPage}
            averageRating={product?.rating ? Number(product.rating) : 0}
            totalReviews={product?.reviewCount ?? 0}
          />
        </div>
      </div>
    </MainLayout>
  )
}

export default ProductDetailsPage
