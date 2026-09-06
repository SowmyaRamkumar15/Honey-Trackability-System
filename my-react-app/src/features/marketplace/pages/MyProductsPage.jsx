import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import productApi from '../api/productApi'
import PurityBadge from '../components/PurityBadge'
import VerifiedBadge from '../components/VerifiedBadge'
import PageHeader from '../../../components/layout/PageHeader'
import MetricCard from '../../../components/ui/MetricCard'
import Alert from '../../../components/feedback/Alert'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import DataTable from '../../../components/ui/DataTable'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import VoiceButton from '../../../components/common/VoiceButton'
import '../styles/marketplace.css'

const MyProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const loadMyProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await productApi.getMyProducts({ page: 0, size: 50 })
      const data = res.data?.data
      if (data?.content) {
        setProducts(data.content)
      } else if (Array.isArray(data)) {
        setProducts(data)
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load product listings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMyProducts()
  }, [loadMyProducts])

  const handleToggleStatus = async (productId, currentActive) => {
    setTogglingId(productId)
    try {
      await productApi.setProductStatus(productId, !currentActive)
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isActive: !currentActive } : p))
      )
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update listing status')
    } finally {
      setTogglingId(null)
    }
  }

  // Aggregate Metrics
  const { activeCount, totalStockKg, avgPrice } = useMemo(() => {
    let active = 0
    let stock = 0
    let priceSum = 0

    products.forEach((p) => {
      if (p.isActive) active += 1
      stock += Number(p.availableQuantityKg || 0)
      priceSum += Number(p.pricePerKg || 0)
    })

    return {
      activeCount: active,
      totalStockKg: stock,
      avgPrice: products.length > 0 ? priceSum / products.length : 0,
    }
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filterStatus === 'ACTIVE' && !p.isActive) return false
      if (filterStatus === 'INACTIVE' && p.isActive) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = (p.productName || '').toLowerCase().includes(q)
        const matchFlower = (p.flowerSource || '').toLowerCase().includes(q)
        const matchBatch = (p.batchId || '').toLowerCase().includes(q)
        return matchName || matchFlower || matchBatch
      }
      return true
    })
  }, [products, filterStatus, searchQuery])

  return (
    <BeekeeperLayout>
      <div className="hc-market-page">
        {/* Page Header */}
        <PageHeader
          title="Marketplace Products"
          subtitle="Manage direct-to-consumer honey listings created from certified pure and lab-tested batches."
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <VoiceButton textToSpeak="Marketplace Listings. Manage your public pure honey listings and stock levels." size="sm" />
              <Link to="/beekeeper/products/new">
                <Button variant="primary">
                  <span>+ Create New Listing</span>
                </Button>
              </Link>
            </div>
          }
        />

        {/* Stats Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          <MetricCard
            label="Total Products"
            value={products.length.toString()}
            icon="🍯"
            subtext="Configured listings"
          />
          <MetricCard
            label="Active for Sale"
            value={activeCount.toString()}
            icon="🟢"
            subtext="Live on marketplace"
          />
          <MetricCard
            label="Available Stock"
            value={`${totalStockKg.toFixed(1)} kg`}
            icon="📦"
            subtext="Certified inventory"
          />
          <MetricCard
            label="Avg Retail Price"
            value={`₹${Math.round(avgPrice)}/kg`}
            icon="💵"
            subtext="Consumer rate"
          />
        </div>

        {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

        {/* Filter and Search Bar */}
        <div className="hc-market-filters">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setFilterStatus('ALL')}
              className={`hc-btn hc-btn--xs ${filterStatus === 'ALL' ? 'hc-btn--primary' : 'hc-btn--secondary'}`}
            >
              All ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('ACTIVE')}
              className={`hc-btn hc-btn--xs ${filterStatus === 'ACTIVE' ? 'hc-btn--primary' : 'hc-btn--secondary'}`}
            >
              Active ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('INACTIVE')}
              className={`hc-btn hc-btn--xs ${filterStatus === 'INACTIVE' ? 'hc-btn--primary' : 'hc-btn--secondary'}`}
            >
              Inactive ({products.length - activeCount})
            </button>
          </div>

          <div style={{ flex: 1, minWidth: '220px', maxWidth: '360px', marginLeft: 'auto' }}>
            <input
              type="text"
              placeholder="Search by name, flower, batch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hc-input"
              style={{ width: '100%', padding: '6px 12px', fontSize: 'var(--text-xs)' }}
            />
          </div>
        </div>

        {/* Product Table / Content */}
        {loading ? (
          <LoadingSpinner text="Loading marketplace product listings..." />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon="🍯"
            title={products.length === 0 ? 'No Product Listings Yet' : 'No Listings Match Search'}
            description={
              products.length === 0
                ? 'List your lab-tested, verified pure honey batches to sell directly to conscious consumers with zero middlemen.'
                : 'Try adjusting your search query or filter criteria.'
            }
            action={
              <Link to="/beekeeper/products/new">
                <Button variant="primary">
                  + Create First Product Listing
                </Button>
              </Link>
            }
          />
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Batch ID</th>
                <th>Price / kg</th>
                <th>Available Stock</th>
                <th>Verification</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const isUpdating = togglingId === p.id
                const isOutOfStock = Number(p.availableQuantityKg) <= 0
                const isLowStock = Number(p.availableQuantityKg) > 0 && Number(p.availableQuantityKg) <= 10

                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.productName}
                            style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', objectFit: 'cover', border: '1px solid var(--border)' }}
                          />
                        ) : (
                          <div className="hc-batch-icon" style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}>
                            🍯
                          </div>
                        )}
                        <div>
                          <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: 'var(--text-sm)' }}>
                            {p.productName}
                          </strong>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                            {p.flowerSource || 'Multiflora'} {p.region ? `· ${p.region}` : ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      <Link
                        to={`/beekeeper/batches/${p.batchId}`}
                        style={{ color: 'var(--primary-dark)', fontWeight: 700, textDecoration: 'none' }}
                      >
                        🏷️ {p.batchId}
                      </Link>
                    </td>

                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      ₹{Number(p.pricePerKg).toFixed(2)}
                      <span style={{ fontSize: '0.6875rem', fontWeight: 400, color: 'var(--text-muted)', display: 'block' }}>per kg</span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: isOutOfStock ? 'var(--danger)' : isLowStock ? 'var(--primary)' : 'var(--success)',
                        }}
                      >
                        {p.availableQuantityKg} kg
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <VerifiedBadge verified={p.verified} batchId={p.batchId} />
                        {p.purityScore != null && <PurityBadge score={p.purityScore} size="sm" />}
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          backgroundColor: p.isActive ? 'var(--success-soft)' : 'var(--bg-muted)',
                          color: p.isActive ? 'var(--success)' : 'var(--text-secondary)',
                          border: `1px solid ${p.isActive ? 'var(--success-border)' : 'var(--border)'}`,
                        }}
                      >
                        {p.isActive ? 'Active' : 'Paused'}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleToggleStatus(p.id, p.isActive)}
                        className={`hc-btn hc-btn--xs ${p.isActive ? 'hc-btn--secondary' : 'hc-btn--primary'}`}
                      >
                        {isUpdating ? 'Updating...' : p.isActive ? 'Deactivate' : 'Publish Live'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </DataTable>
        )}
      </div>
    </BeekeeperLayout>
  )
}

export default MyProductsPage
