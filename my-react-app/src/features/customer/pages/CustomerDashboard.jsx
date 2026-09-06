import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CustomerLayout from '../../../layouts/CustomerLayout'
import Card from '../../../components/ui/Card'
import PageHeader from '../../../components/layout/PageHeader'
import MetricCard from '../../../components/ui/MetricCard'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import DataTable from '../../../components/ui/DataTable'
import EmptyState from '../../../components/ui/EmptyState'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import { useAuth } from '../../auth/hooks/useAuth'
import customerApi from '../api/customerApi'
import disputeApi from '../api/disputeApi'
import orderApi from '../../order/api/orderApi'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/customer.css'

export const CustomerDashboard = () => {
  const { phoneNumber } = useAuth()
  const { t } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [profileComplete, setProfileComplete] = useState(true)
  const [orders, setOrders] = useState([])
  const [disputesCount, setDisputesCount] = useState(0)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [profileRes, statusRes, ordersRes, disputesRes] = await Promise.allSettled([
        customerApi.getProfile(),
        customerApi.getProfileStatus(),
        orderApi.getMyOrders({ page: 0, size: 5 }),
        disputeApi.getMyDisputes(),
      ])

      if (profileRes.status === 'fulfilled' && profileRes.value?.data?.data) {
        setProfile(profileRes.value.data.data)
      }
      if (statusRes.status === 'fulfilled' && statusRes.value?.data?.data) {
        setProfileComplete(statusRes.value.data.data.profileComplete ?? true)
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.data) {
        const orderData = ordersRes.value.data.data?.content || ordersRes.value.data?.content || ordersRes.value.data || []
        setOrders(Array.isArray(orderData) ? orderData : [])
      }
      if (disputesRes.status === 'fulfilled' && disputesRes.value?.data) {
        const dispData = disputesRes.value.data.data?.content || disputesRes.value.data?.data || disputesRes.value.data || []
        setDisputesCount(Array.isArray(dispData) ? dispData.length : 0)
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false)
    }
  }

  const activeOrders = orders.filter(
    (o) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PROCESSING' || o.status === 'SHIPPED'
  ).length

  const getOrderStatusVariant = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'success'
      case 'CANCELLED':
        return 'danger'
      case 'SHIPPED':
      case 'CONFIRMED':
        return 'info'
      case 'PENDING':
      case 'PROCESSING':
      default:
        return 'warning'
    }
  }

  const orderColumns = [
    {
      key: 'orderNumber',
      header: 'Order #',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
          {row.orderNumber || `#${row.id}`}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => (
        <span style={{ color: 'var(--text-secondary)' }}>
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'Recent'}
        </span>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      render: (row) => <span>{row.items?.length || 1} item(s)</span>,
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
          ₹{Number(row.totalAmount ?? row.totalPrice ?? 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={getOrderStatusVariant(row.status)} size="sm">
          {row.status || 'PROCESSING'}
        </Badge>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: (row) => (
        <Link to={`/orders/${row.orderNumber || row.id}`}>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <CustomerLayout>
      <div className="hc-cust-page">
        <PageHeader
          title="Customer Portal"
          subtitle={`Welcome back${profile?.fullName ? `, ${profile.fullName}` : ''} | Account: ${phoneNumber || 'Customer'}`}
          actions={
            <Link to="/marketplace">
              <Button variant="primary">🛍️ Browse Honey</Button>
            </Link>
          }
        />

        {!profileComplete && (
          <div className="hc-cust-banner">
            <div>
              <div className="hc-cust-banner__title">Complete Your Delivery Profile</div>
              <div className="hc-cust-banner__desc">
                Add your shipping address and contact name to enable quick one-click checkout.
              </div>
            </div>
            <Link to="/customer/profile">
              <Button variant="secondary" size="sm">
                Complete Profile →
              </Button>
            </Link>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="hc-cust-kpi-grid">
          <MetricCard
            icon="🛒"
            label="Total Orders"
            value={loading ? '...' : orders.length.toString()}
            subtext="Placed to date"
          />
          <MetricCard
            icon="📦"
            label="Active Shipments"
            value={loading ? '...' : activeOrders.toString()}
            subtext="In transit / processing"
          />
          <MetricCard
            icon="⚖️"
            label="Disputes"
            value={loading ? '...' : disputesCount.toString()}
            subtext="Submitted cases"
          />
          <MetricCard
            icon="✨"
            label="Profile Status"
            value={profileComplete ? 'Complete' : 'Pending'}
            subtext={profileComplete ? 'Verified buyer' : 'Action needed'}
          />
        </div>

        {/* Quick Navigation Hub */}
        <div className="hc-cust-hub-grid">
          <div className="hc-cust-hub-card">
            <div>
              <div className="hc-cust-hub-card__icon">🍯</div>
              <h3 className="hc-cust-hub-card__title">Traceable Marketplace</h3>
              <p className="hc-cust-hub-card__desc">
                Explore 100% lab-verified raw honey directly from certified beekeepers with blockchain traceability.
              </p>
            </div>
            <div className="hc-cust-hub-card__action">
              <Link to="/marketplace" className="hc-cust-hub-card__link">
                Explore Marketplace →
              </Link>
            </div>
          </div>

          <div className="hc-cust-hub-card">
            <div>
              <div className="hc-cust-hub-card__icon">🔍</div>
              <h3 className="hc-cust-hub-card__title">Verify Honey Batch</h3>
              <p className="hc-cust-hub-card__desc">
                Scan your jar's QR code or enter a batch ID to inspect lab purity tests, pollen composition, and hive origin.
              </p>
            </div>
            <div className="hc-cust-hub-card__action">
              <Link to="/" className="hc-cust-hub-card__link">
                Verify Batch →
              </Link>
            </div>
          </div>

          <div className="hc-cust-hub-card">
            <div>
              <div className="hc-cust-hub-card__icon">🛡️</div>
              <h3 className="hc-cust-hub-card__title">Dispute & Support</h3>
              <p className="hc-cust-hub-card__desc">
                Need assistance with an order or test discrepancy? File a dispute with full transparent resolution tracking.
              </p>
            </div>
            <div className="hc-cust-hub-card__action">
              <Link to="/customer/disputes" className="hc-cust-hub-card__link">
                Manage Disputes →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <Card
          header={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)' }}>Recent Orders</h3>
                <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Your latest purchases and live fulfillment status
                </p>
              </div>
              <Link to="/orders">
                <Button variant="ghost" size="sm">
                  View All Orders →
                </Button>
              </Link>
            </div>
          }
        >
          {loading ? (
            <LoadingSpinner message="Loading orders..." />
          ) : orders.length === 0 ? (
            <EmptyState
              icon="🛍️"
              title="No orders placed yet"
              description="Browse pure certified honey batches in our marketplace."
              action={
                <Link to="/marketplace">
                  <Button variant="primary" size="sm">
                    Start Shopping
                  </Button>
                </Link>
              }
            />
          ) : (
            <DataTable columns={orderColumns} data={orders.slice(0, 5)} keyField="id" />
          )}
        </Card>
      </div>
    </CustomerLayout>
  )
}

export default CustomerDashboard
