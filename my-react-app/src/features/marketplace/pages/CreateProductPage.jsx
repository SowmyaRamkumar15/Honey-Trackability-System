import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import productApi from '../api/productApi'
import { FLOWER_SOURCES, HONEY_REGIONS } from '../constants/marketplaceConstants'
import Alert from '../../../components/feedback/Alert'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import PageHeader from '../../../components/layout/PageHeader'
import '../styles/marketplace.css'

const CreateProductPage = () => {
  const navigate = useNavigate()
  const [batches, setBatches] = useState([])
  const [loadingBatches, setLoadingBatches] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    batchId: '',
    productName: '',
    flowerSource: 'MULTIFLORA',
    region: 'Nilgiris, Tamil Nadu',
    pricePerKg: '',
    availableQuantityKg: '',
    description: '',
    imageUrl: '',
  })

  useEffect(() => {
    const loadBatches = async () => {
      setLoadingBatches(true)
      try {
        const res = await productApi.getEligibleBatches()
        const data = res.data?.data
        const eligibleList = data?.content || (Array.isArray(data) ? data : [])
        setBatches(eligibleList)
        if (eligibleList.length > 0) {
          const first = eligibleList[0]
          setFormData((prev) => ({
            ...prev,
            batchId: first.batchId,
            availableQuantityKg: first.quantityKg || '',
            productName: `${first.batchId} Pure Raw Honey`,
          }))
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load eligible batches')
      } finally {
        setLoadingBatches(false)
      }
    }
    loadBatches()
  }, [])

  const handleBatchSelect = (batchId) => {
    const selected = batches.find((b) => b.batchId === batchId)
    setFormData((prev) => ({
      ...prev,
      batchId,
      availableQuantityKg: selected?.quantityKg || '',
      productName: selected ? `${selected.batchId} Pure Raw Honey` : prev.productName,
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.batchId) {
      setError('Please select an eligible PURE honey batch.')
      return
    }

    if (!formData.productName.trim()) {
      setError('Product title is required.')
      return
    }

    if (!formData.pricePerKg || Number(formData.pricePerKg) <= 0) {
      setError('Price per kg must be greater than zero.')
      return
    }

    if (!formData.availableQuantityKg || Number(formData.availableQuantityKg) <= 0) {
      setError('Available quantity must be greater than zero.')
      return
    }

    setSubmitting(true)
    try {
      await productApi.createProduct({
        batchId: formData.batchId,
        productName: formData.productName.trim(),
        flowerSource: formData.flowerSource,
        region: formData.region,
        pricePerKg: Number(formData.pricePerKg),
        availableQuantityKg: Number(formData.availableQuantityKg),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim() || null,
      })
      navigate('/my-products')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create product listing')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <BeekeeperLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', width: '100%' }}>
        <PageHeader
          title="Create New Honey Listing"
          subtitle="List verified PURE honey batches directly on the HoneyChain marketplace."
        />

        {error && (
          <Alert type="danger" title="Error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="hc-create-prod-layout">
          {/* Main Form Column */}
          <div>
            <Card header={<h3>Product Listing Details</h3>}>
              {loadingBatches ? (
                <LoadingSpinner message="Loading eligible honey batches..." />
              ) : batches.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-8) 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ fontSize: '2.5rem' }}>⚠️</div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)' }}>No Eligible Batches Available</h3>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', maxWidth: '400px' }}>
                    Only batches certified <strong>PURE</strong> by a laboratory can be listed on the marketplace.
                  </p>
                  <div style={{ marginTop: 'var(--space-2)' }}>
                    <Link to="/batches/new" style={{ textDecoration: 'none' }}>
                      <Button variant="primary" size="sm">
                        + Log New Batch
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {/* Eligible Batch Selector */}
                  <div>
                    <label className="hc-input__label" htmlFor="batchId">
                      Select Verified Honey Batch <span style={{ color: 'var(--danger)' }}>*</span>
                    </label>
                    <select
                      id="batchId"
                      name="batchId"
                      className="hc-input__field"
                      value={formData.batchId}
                      onChange={(e) => handleBatchSelect(e.target.value)}
                      required
                    >
                      {batches.map((b) => (
                        <option key={b.batchId} value={b.batchId}>
                          {b.batchId} — {b.quantityKg} kg ({b.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Product Name */}
                  <Input
                    label="Product Listing Title"
                    id="productName"
                    name="productName"
                    required
                    placeholder="e.g. Pure Wildflower Raw Honey - Nilgiris"
                    value={formData.productName}
                    onChange={handleChange}
                    maxLength={120}
                  />

                  {/* Flower Source & Region */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                    <div>
                      <label className="hc-input__label" htmlFor="flowerSource">
                        Floral / Flower Source
                      </label>
                      <select
                        id="flowerSource"
                        name="flowerSource"
                        className="hc-input__field"
                        value={formData.flowerSource}
                        onChange={handleChange}
                      >
                        {FLOWER_SOURCES.filter((f) => f.value).map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="hc-input__label" htmlFor="region">
                        Harvest Region
                      </label>
                      <select
                        id="region"
                        name="region"
                        className="hc-input__field"
                        value={formData.region}
                        onChange={handleChange}
                      >
                        {HONEY_REGIONS.filter((r) => r.value).map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price Per KG & Quantity */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                    <Input
                      label="Price per KG (₹)"
                      id="pricePerKg"
                      name="pricePerKg"
                      type="number"
                      step="1"
                      min="1"
                      placeholder="e.g. 850"
                      value={formData.pricePerKg}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Listing Quantity (KG)"
                      id="availableQuantityKg"
                      name="availableQuantityKg"
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="e.g. 8.5"
                      value={formData.availableQuantityKg}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Image URL */}
                  <Input
                    label="Product Image URL (Optional)"
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={handleChange}
                  />

                  {/* Description */}
                  <div>
                    <label className="hc-input__label" htmlFor="description">
                      Description & Tasting Notes
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className="hc-input__field"
                      placeholder="Describe the aroma, flavor profile, floral notes, and harvest story..."
                      value={formData.description}
                      onChange={handleChange}
                      maxLength={1500}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)' }}>
                    <Link to="/my-products" style={{ textDecoration: 'none' }}>
                      <Button variant="secondary" size="sm">
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={submitting}
                    >
                      {submitting ? 'Publishing...' : 'Publish to Marketplace →'}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>

          {/* Sidebar Guidelines Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="hc-cust-banner">
              <div>
                <div className="hc-cust-banner__title">💰 Direct Beekeeper Pricing</div>
                <div className="hc-cust-banner__desc">
                  On HoneyChain, you keep 100% of your listed retail price without intermediary cuts. Fair transparent pricing rewards genuine beekeepers.
                </div>
              </div>
            </div>

            <div className="hc-cust-banner" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div>
                <div className="hc-cust-banner__title" style={{ color: 'var(--text-primary)' }}>🛡️ Blockchain Verification Badge</div>
                <div className="hc-cust-banner__desc">
                  Your listing automatically displays lab purity certificates and QR scan passports to build instant consumer trust.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BeekeeperLayout>
  )
}

export default CreateProductPage
