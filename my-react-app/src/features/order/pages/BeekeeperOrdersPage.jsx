import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import PageHeader from '../../../components/layout/PageHeader'
import orderApi from '../api/orderApi'
import OrderTracking from '../components/OrderTracking'
import Alert from '../../../components/feedback/Alert'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import MetricCard from '../../../components/ui/MetricCard'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import VoiceButton from '../../../components/common/VoiceButton'
import '../styles/order.css'

const BeekeeperOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingNum, setUpdatingNum] = useState(null)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await orderApi.getBeekeeperOrders({ page: 0, size: 50 })
      const data = res.data?.data
      if (data?.content) {
        setOrders(data.content)
      } else if (Array.isArray(data)) {
        setOrders(data)
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load customer orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const handleStatusUpdate = async (orderNumber, nextStatus) => {
    setUpdatingNum(orderNumber)
    try {
      await orderApi.updateOrderStatus(orderNumber, nextStatus)
      await loadOrders()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update order status')
    } finally {
      setUpdatingNum(null)
    }
  }

  // Aggregate Metrics
  const { confirmedCount, packedCount, shippedCount, deliveredCount, totalValue } = useMemo(() => {
    let confirmed = 0
    let packed = 0
    let shipped = 0
    let delivered = 0
    let value = 0

    orders.forEach((o) => {
      const status = (o.orderStatus || '').toUpperCase()
      if (status === 'CONFIRMED') confirmed += 1
      else if (status === 'PACKED') packed += 1
      else if (status === 'SHIPPED') shipped += 1
      else if (status === 'DELIVERED') delivered += 1
      value += Number(o.totalAmount || 0)
    })

    return {
      confirmedCount: confirmed,
      packedCount: packed,
      shippedCount: shipped,
      deliveredCount: delivered,
      totalValue: value,
    }
  }, [orders])

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const status = (o.orderStatus || '').toUpperCase()
      if (filterStatus !== 'ALL' && status !== filterStatus) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchNum = (o.orderNumber || '').toLowerCase().includes(q)
        const matchName = (o.deliveryAddress?.name || '').toLowerCase().includes(q)
        const matchCity = (o.deliveryAddress?.city || '').toLowerCase().includes(q)
        return matchNum || matchName || matchCity
      }
      return true
    })
  }, [orders, filterStatus, searchQuery])

  return (
    <BeekeeperLayout>
      <div className="hc-order-page">
        {/* Page Header */}
        <PageHeader
          title="Fulfillment Orders"
          subtitle="Manage incoming purchases for your honey products and progress their fulfillment stages."
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <VoiceButton textToSpeak="Customer orders and fulfillment portal. Review incoming orders, package jars, and mark orders for shipment." size="sm" />
              <Link to="/my-products">
                <Button variant="secondary" size="sm">
                  🍯 Manage Listings
                </Button>
              </Link>
            </div>
          }
        />

        {/* Stats Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          <MetricCard
            label="Total Orders"
            value={orders.length.toString()}
            icon="📦"
            subtext={`₹${totalValue.toLocaleString('en-IN')} total volume`}
          />
          <MetricCard
            label="To Pack"
            value={confirmedCount.toString()}
            icon="🟡"
            subtext="Ready for packaging"
          />
          <MetricCard
            label="In Transit"
            value={shippedCount.toString()}
            icon="🚚"
            subtext="En route to customers"
          />
          <MetricCard
            label="Fulfilled"
            value={deliveredCount.toString()}
            icon="🟢"
            subtext="Successfully delivered"
          />
        </div>

        {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

        {/* Filter and Search Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '12px 16px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { label: 'All', value: 'ALL', count: orders.length },
              { label: 'To Pack', value: 'CONFIRMED', count: confirmedCount },
              { label: 'Packed', value: 'PACKED', count: packedCount },
              { label: 'In Transit', value: 'SHIPPED', count: shippedCount },
              { label: 'Delivered', value: 'DELIVERED', count: deliveredCount },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilterStatus(tab.value)}
                className={`hc-btn hc-btn--xs ${filterStatus === tab.value ? 'hc-btn--primary' : 'hc-btn--secondary'}`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div style={{ flex: 1, minWidth: '220px', maxWidth: '340px', marginLeft: 'auto' }}>
            <input
              type="text"
              placeholder="Search order #, customer, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hc-input"
              style={{ width: '100%', padding: '6px 12px', fontSize: 'var(--text-xs)' }}
            />
          </div>
        </div>

        {/* Orders List Content */}
        {loading ? (
          <LoadingSpinner text="Loading incoming customer orders..." />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            icon="📦"
            title={orders.length === 0 ? 'No Orders Received Yet' : 'No Orders Match Filter'}
            description={
              orders.length === 0
                ? 'When customers purchase your listed honey batches from the marketplace, their orders will appear here for packing and dispatch.'
                : 'Try clearing the filter or search query.'
            }
          />
        ) : (
          <div className="hc-order-list">
            {filteredOrders.map((order) => {
              const {
                orderNumber,
                createdAt,
                totalAmount,
                orderStatus,
                fulfillmentType,
                deliveryAddress,
                items,
              } = order

              const isUpdating = updatingNum === orderNumber

              return (
                <div key={orderNumber} className="hc-order-card">
                  {/* Order Top Header */}
                  <div className="hc-order-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="hc-batch-icon">
                        📦
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
                            #{orderNumber}
                          </span>
                          <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.6875rem', fontWeight: 700, backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                            {fulfillmentType === 'LOCAL_PICKUP' ? '🏪 Pickup' : '🚚 Direct Delivery'}
                          </span>
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Received {createdAt ? new Date(createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recently'}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>Total Payout</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                          ₹{Number(totalAmount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Lifecycle Strip */}
                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-xl)' }}>
                    <OrderTracking currentStatus={orderStatus} />
                  </div>

                  {/* Items Ordered List */}
                  {Array.isArray(items) && items.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
                          <div>
                            <strong style={{ color: 'var(--text-primary)' }}>{item.productName}</strong>
                            <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>Qty: {item.quantityKg} kg</span>
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                            ₹{Number(item.pricePerKg * item.quantityKg).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Delivery / Shipping Meta */}
                  {deliveryAddress && (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>📍 Ship to:</span>
                      <strong>{deliveryAddress.name}</strong>
                      <span>({deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.postalCode})</span>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                    {orderStatus === 'CONFIRMED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleStatusUpdate(orderNumber, 'PACKED')}
                      >
                        {isUpdating ? 'Updating...' : 'Mark as Packed 📦'}
                      </Button>
                    )}
                    {orderStatus === 'PACKED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleStatusUpdate(orderNumber, 'SHIPPED')}
                      >
                        {isUpdating ? 'Updating...' : 'Dispatch / Mark Shipped 🚚'}
                      </Button>
                    )}
                    {orderStatus === 'SHIPPED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleStatusUpdate(orderNumber, 'DELIVERED')}
                      >
                        {isUpdating ? 'Updating...' : 'Confirm Delivery ✅'}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </BeekeeperLayout>
  )
}

export default BeekeeperOrdersPage
