import React from 'react'
import { Link } from 'react-router-dom'
import CustomerLayout from '../../../layouts/CustomerLayout'
import useCart from '../hooks/useCart'
import CartItem from '../components/CartItem'
import CartSummary from '../components/CartSummary'
import CartEmptyState from '../components/CartEmptyState'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import PageHeader from '../../../components/layout/PageHeader'
import '../styles/cart.css'

const CartPage = () => {
  const {
    items,
    subtotal,
    itemCount,
    loading,
    error,
    updateQuantity,
    removeItem,
    emptyCart,
  } = useCart()

  const isEmpty = !items || items.length === 0

  return (
    <CustomerLayout>
      <div className="hc-cart-page">
        <PageHeader
          title="Shopping Cart"
          subtitle={!isEmpty ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart` : 'Review your pure honey items'}
          actions={
            <Link to="/marketplace" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" size="sm">
                ← Continue Shopping
              </Button>
            </Link>
          }
        />

        {error && <Alert type="danger" title="Cart Error">{error}</Alert>}

        {loading && isEmpty ? (
          <LoadingSpinner message="Loading cart..." />
        ) : isEmpty ? (
          <CartEmptyState />
        ) : (
          <div className="hc-cart-layout">
            {/* Items List */}
            <div>
              <Card>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                      disabled={loading}
                    />
                  ))}
                </div>
              </Card>
            </div>

            {/* Cart Summary */}
            <div>
              <CartSummary
                subtotal={subtotal}
                itemCount={itemCount}
                onClear={emptyCart}
                disabled={loading}
              />
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}

export default CartPage
