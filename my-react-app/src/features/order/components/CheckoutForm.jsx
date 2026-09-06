import React, { useState } from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import '../styles/order.css'

const CheckoutForm = ({ totalAmount, onSubmit, loading, error, initialAddress = null }) => {
  const [fulfillmentType, setFulfillmentType] = useState('DELIVERY')
  const [address, setAddress] = useState({
    name: initialAddress?.name || '',
    line1: initialAddress?.line1 || '',
    line2: initialAddress?.line2 || '',
    city: initialAddress?.city || '',
    state: initialAddress?.state || '',
    postalCode: initialAddress?.postalCode || '',
  })
  const [paymentMode, setPaymentMode] = useState('mock')

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      fulfillmentType,
      deliveryAddress: fulfillmentType === 'DELIVERY' ? address : null,
      paymentMode,
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Fulfillment Type */}
      <Card header={<h3>1. Fulfillment Method</h3>}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          <label
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              border: fulfillmentType === 'DELIVERY' ? '2px solid var(--primary)' : '1px solid var(--border)',
              background: fulfillmentType === 'DELIVERY' ? 'var(--primary-soft)' : 'var(--surface)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <input
              type="radio"
              name="fulfillmentType"
              value="DELIVERY"
              checked={fulfillmentType === 'DELIVERY'}
              onChange={() => setFulfillmentType('DELIVERY')}
              style={{ marginTop: '2px', accentColor: 'var(--primary)' }}
            />
            <div>
              <strong style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                🚚 Standard Doorstep Delivery
              </strong>
              <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Direct from beekeeper cluster to your home address
              </p>
            </div>
          </label>

          <label
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              border: fulfillmentType === 'LOCAL_PICKUP' ? '2px solid var(--primary)' : '1px solid var(--border)',
              background: fulfillmentType === 'LOCAL_PICKUP' ? 'var(--primary-soft)' : 'var(--surface)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <input
              type="radio"
              name="fulfillmentType"
              value="LOCAL_PICKUP"
              checked={fulfillmentType === 'LOCAL_PICKUP'}
              onChange={() => setFulfillmentType('LOCAL_PICKUP')}
              style={{ marginTop: '2px', accentColor: 'var(--primary)' }}
            />
            <div>
              <strong style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                🏪 Local Apiary Pickup
              </strong>
              <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Pick up directly from the beekeeper's registered farm/cluster
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* Delivery Address (only for DELIVERY) */}
      {fulfillmentType === 'DELIVERY' && (
        <Card header={<h3>2. Delivery Address</h3>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
              id="addr-name"
              label="Recipient Full Name"
              name="name"
              required
              placeholder="e.g. Priyan Sharma"
              value={address.name}
              onChange={handleAddressChange}
            />

            <Input
              id="addr-line1"
              label="Street Address / Line 1"
              name="line1"
              required
              placeholder="House / Flat No., Street Name"
              value={address.line1}
              onChange={handleAddressChange}
            />

            <Input
              id="addr-line2"
              label="Address Line 2 (Optional)"
              name="line2"
              placeholder="Landmark, Area, Colony"
              value={address.line2}
              onChange={handleAddressChange}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
              <Input
                id="addr-city"
                label="City"
                name="city"
                required
                placeholder="e.g. Pune"
                value={address.city}
                onChange={handleAddressChange}
              />

              <Input
                id="addr-state"
                label="State"
                name="state"
                required
                placeholder="e.g. Maharashtra"
                value={address.state}
                onChange={handleAddressChange}
              />

              <Input
                id="addr-postalCode"
                label="Postal Code"
                name="postalCode"
                required
                placeholder="e.g. 411001"
                value={address.postalCode}
                onChange={handleAddressChange}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Payment Selection */}
      <Card header={<h3>3. Payment Mode</h3>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <label
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--primary-light)',
              background: 'var(--primary-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <input
                type="radio"
                name="paymentMode"
                value="mock"
                checked={paymentMode === 'mock'}
                onChange={() => setPaymentMode('mock')}
                style={{ accentColor: 'var(--primary)' }}
              />
              <div>
                <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', display: 'block' }}>
                  ⚡ Instant Mock Payment (UPI / Cards / NetBanking)
                </strong>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Auto-approves for instant simulated testing
                </span>
              </div>
            </div>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--success)', background: 'rgba(22, 163, 74, 0.1)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
              Instant
            </span>
          </label>
        </div>
      </Card>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading}
        style={{ width: '100%' }}
      >
        {loading ? 'Processing Order...' : `Pay ₹${Number(totalAmount).toFixed(2)} & Confirm Order`}
      </Button>
    </form>
  )
}

export default CheckoutForm
