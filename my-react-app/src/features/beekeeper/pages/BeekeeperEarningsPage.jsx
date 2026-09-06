import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import PageHeader from '../../../components/layout/PageHeader'
import orderApi from '../../order/api/orderApi'
import MetricCard from '../../../components/ui/MetricCard'
import Alert from '../../../components/feedback/Alert'
import Button from '../../../components/ui/Button'
import DataTable from '../../../components/ui/DataTable'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import VoiceButton from '../../../components/common/VoiceButton'
import '../styles/beekeeper.css'

export const BeekeeperEarningsPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await orderApi.getBeekeeperOrders({ page: 0, size: 100 })
        const data = response?.data?.data || response?.data || response
        const list = Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data)
            ? data
            : []
        setOrders(list)
      } catch (err) {
        console.error('Failed to load orders for earnings:', err)
        setError(
          err?.response?.data?.message ||
            'Failed to load earnings records. Please check your backend connection.'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // Aggregate financial metrics
  const { metrics, chartData, completedOrders, pendingOrders } = useMemo(() => {
    let totalRevenue = 0
    let settledRevenue = 0
    let pendingRevenue = 0
    let totalHoneyKg = 0
    const completed = []
    const pending = []
    const dailyMap = {}

    // Initialize 7 days placeholder for continuous trend visualization
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      dailyMap[key] = 0
    }

    orders.forEach((order) => {
      const status = (order.orderStatus || order.status || '').toUpperCase()
      const isPaidOrDelivered = ['DELIVERED', 'PAID'].includes(status)
      const isInProgress = ['CONFIRMED', 'PACKED', 'SHIPPED'].includes(status)
      const orderTotal = Number(order.totalAmount || order.amount || 0)

      if (isPaidOrDelivered || isInProgress) {
        totalRevenue += orderTotal

        if (isPaidOrDelivered) {
          settledRevenue += orderTotal
          completed.push(order)
        } else {
          pendingRevenue += orderTotal
          pending.push(order)
        }

        // Daily grouping
        const rawDate = order.createdAt || order.orderDate || new Date().toISOString()
        const dateKey = new Date(rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        dailyMap[dateKey] = (dailyMap[dateKey] || 0) + orderTotal
      }

      // Calculate Honey Weight Sold
      if (Array.isArray(order.items)) {
        order.items.forEach((it) => {
          totalHoneyKg += Number(it.quantityKg || it.quantity || it.weightKg || 1)
        })
      }
    })

    const chartData = Object.entries(dailyMap).map(([date, revenue]) => ({
      date,
      revenue,
    }))

    const validOrderCount = completed.length + pending.length

    return {
      metrics: {
        totalRevenue,
        settledRevenue,
        pendingRevenue,
        totalOrders: validOrderCount,
        deliveredOrders: completed.length,
        pendingOrders: pending.length,
        totalHoneyKg,
        avgOrderValue: validOrderCount > 0 ? totalRevenue / validOrderCount : 0,
      },
      chartData,
      completedOrders: completed,
      pendingOrders: pending,
    }
  }, [orders])

  const maxChartVal = useMemo(() => {
    return Math.max(...chartData.map((x) => x.revenue), 1000)
  }, [chartData])

  return (
    <BeekeeperLayout>
      <div className="hc-bk-dashboard">
        {/* Page Header */}
        <PageHeader
          title="Earnings & Revenue"
          subtitle="Real-time marketplace payouts and financial ledger from your certified pure honey harvests."
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <VoiceButton textToSpeak="Beekeeper Revenue and Earnings ledger. View settled payouts and sales trends." size="sm" />
              <Link to="/my-products">
                <Button variant="primary" size="sm">
                  + New Listing
                </Button>
              </Link>
              <Link to="/beekeeper/orders">
                <Button variant="secondary" size="sm">
                  📦 Fulfill Orders
                </Button>
              </Link>
            </div>
          }
        />

        {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

        {/* Loading State */}
        {loading ? (
          <LoadingSpinner text="Computing honey sales, payouts, and revenue analytics..." />
        ) : (
          <>
            {/* KPI Stat Cards */}
            <div className="hc-bk-stats-grid">
              <MetricCard
                label="Total Revenue"
                value={`₹${metrics.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                subtext={`₹${metrics.settledRevenue.toLocaleString('en-IN')} settled · ₹${metrics.pendingRevenue.toLocaleString('en-IN')} pending`}
                icon="💵"
              />
              <MetricCard
                label="Marketplace Orders"
                value={metrics.totalOrders}
                subtext={`${metrics.deliveredOrders} delivered · ${metrics.pendingOrders} in transit`}
                icon="📦"
              />
              <MetricCard
                label="Honey Dispatched"
                value={`${metrics.totalHoneyKg.toFixed(1)} kg`}
                subtext="Certified authentic stock"
                icon="🍯"
              />
              <MetricCard
                label="Avg Order Value"
                value={`₹${Math.round(metrics.avgOrderValue)}`}
                subtext="Per consumer purchase"
                icon="📈"
              />
            </div>

            {/* Payout Direct Transfer Banner */}
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-2xl)', backgroundColor: 'var(--primary-soft)', border: '1px solid var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>🏦</span>
                <div>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--primary-dark)' }}>
                    KVIC Integrated Direct Bank Settlement
                  </h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Order funds are automatically escrowed via smart contract and credited directly to your registered bank account upon verified delivery.
                  </p>
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-full)', backgroundColor: '#fff', border: '1px solid var(--primary-light)', fontWeight: 700, color: 'var(--primary-dark)' }}>
                T+2 Settlement
              </span>
            </div>

            {/* Revenue Trend Chart */}
            <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    7-Day Revenue Velocity
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Direct marketplace earnings calculated from incoming and delivered consumer orders.
                  </p>
                </div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>
                  Daily Sales (INR)
                </span>
              </div>

              <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
                {chartData.map((d, idx) => {
                  const pct = Math.max(Math.round((d.revenue / maxChartVal) * 100), 6)
                  return (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        {d.revenue > 0 ? `₹${d.revenue}` : '—'}
                      </span>
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '40px',
                          height: `${pct}%`,
                          borderRadius: '4px 4px 0 0',
                          backgroundColor: d.revenue > 0 ? 'var(--primary)' : 'var(--border)',
                          transition: 'height 0.3s ease',
                        }}
                      />
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{d.date}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent Settled Transactions Table */}
            <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: '16px' }}>
                Recent Settled Transactions
              </h3>
              {completedOrders.length === 0 ? (
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textAlign: 'center', padding: '24px 0' }}>
                  No settled orders recorded yet. Payouts automatically appear here once customer deliveries are confirmed.
                </p>
              ) : (
                <DataTable>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th style={{ textAlign: 'right' }}>Settled Payout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedOrders.slice(0, 5).map((o) => (
                      <tr key={o.orderNumber || o.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>#{o.orderNumber}</td>
                        <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                          {new Date(o.createdAt || o.orderDate).toLocaleDateString('en-IN')}
                        </td>
                        <td>{o.deliveryAddress?.name || 'Consumer'}</td>
                        <td style={{ fontSize: 'var(--text-xs)' }}>
                          {Array.isArray(o.items) ? o.items.map((it) => `${it.productName || 'Honey'} (${it.quantityKg || 1}kg)`).join(', ') : '1 Item'}
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--success)' }}>
                          ₹{Number(o.totalAmount || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </DataTable>
              )}
            </div>
          </>
        )}
      </div>
    </BeekeeperLayout>
  )
}

export default BeekeeperEarningsPage
