import React from 'react'
import { Link } from 'react-router-dom'
import CustomerLayout from '../../../layouts/CustomerLayout'
import useOrders from '../hooks/useOrders'
import OrderCard from '../components/OrderCard'
import Alert from '../../../components/feedback/Alert'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import PageHeader from '../../../components/layout/PageHeader'
import '../styles/order.css'

const OrdersPage = () => {
  const { orders, loading, error, cancellingId, cancelOrder } = useOrders()

  return (
    <CustomerLayout>
      <div className="hc-order-page">
        <PageHeader
          title="My Honey Orders"
          subtitle="Track status and view history of your artisan honey purchases."
          actions={
            <Link to="/marketplace" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="sm">
                🍯 Browse Marketplace
              </Button>
            </Link>
          }
        />

        {error && <Alert type="danger" title="Orders Error">{error}</Alert>}

        {loading ? (
          <LoadingSpinner message="Loading your order history..." />
        ) : orders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No Orders Placed Yet"
            description="You haven't ordered any verified honey yet. Explore our verified marketplace to place your first order."
            action={
              <Link to="/marketplace" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="md">
                  Explore Verified Honey
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="hc-order-list">
            {orders.map((order) => (
              <OrderCard
                key={order.orderNumber}
                order={order}
                onCancel={cancelOrder}
                isCancelling={cancellingId === order.orderNumber}
              />
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}

export default OrdersPage
