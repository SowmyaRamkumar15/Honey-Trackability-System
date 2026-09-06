import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import CustomerLayout from '../../../layouts/CustomerLayout'
import useCart from '../../cart/hooks/useCart'
import { resetCartState } from '../../cart/cartSlice'
import orderApi from '../api/orderApi'
import customerApi from '../../customer/api/customerApi'
import CheckoutForm from '../components/CheckoutForm'
import Alert from '../../../components/feedback/Alert'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import PageHeader from '../../../components/layout/PageHeader'
import '../styles/order.css'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, subtotal, itemCount } = useCart()

  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderError, setOrderError] = useState(null)
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [initialAddress, setInitialAddress] = useState(null)

  useEffect(() => {
    customerApi.getProfile()
      .then((res) => {
        const p = res.data?.data
        if (p && p.fullName) {
          setInitialAddress({
            name: p.fullName || '',
            line1: p.address || '',
            line2: '',
            city: p.city || '',
            state: p.state || '',
            postalCode: p.pincode || '',
          })
        }
      })
      .catch(() => {})
  }, [])

  const handleCheckout = async (checkoutData) => {
    setPlacingOrder(true)
    setOrderError(null)

    try {
      const res = await orderApi.checkout(checkoutData)
      const order = res.data?.data
      setConfirmedOrder(order)
      dispatch(resetCartState())
    } catch (err) {
      setOrderError(err?.response?.data?.message || 'Checkout could not be completed')
    } finally {
      setPlacingOrder(false)
    }
  }

  // Success Confirmation Screen
  if (confirmedOrder) {
    return (
      <CustomerLayout>
        <div style={{ maxWidth: '640px', margin: 'var(--space-8) auto' }}>
          <Card>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-lg)', background: 'rgba(22, 163, 74, 0.1)', border: '1px solid rgba(22, 163, 74, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                🎉
              </div>
              <span style={{ display: 'inline-flex', padding: '2px 12px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 700, background: 'rgba(22, 163, 74, 0.1)', color: 'var(--success)' }}>
                ✅ Payment & Order Confirmed
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 800, margin: 0 }}>
                Thank you for supporting Indian Beekeepers!
              </h1>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', maxWidth: '400px', margin: 0, lineHeight: 1.6 }}>
                Your order <code style={{ fontWeight: 700, color: 'var(--primary-dark)', background: 'var(--primary-soft)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>{confirmedOrder.orderNumber}</code> has been confirmed and dispatched to the beekeeper for packing.
              </p>

              <div style={{ width: '100%', padding: 'var(--space-4)', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Order Reference:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{confirmedOrder.orderNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Payment Status:</span>
                  <span style={{ color: 'var(--success)', fontWeight: 700 }}>✅ SUCCESS</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Amount Paid:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>₹{Number(confirmedOrder.totalAmount).toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Fulfillment:</span>
                  <span style={{ fontWeight: 600 }}>{confirmedOrder.fulfillmentType === 'LOCAL_PICKUP' ? 'Local Apiary Pickup' : 'Standard Doorstep Delivery'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
                <Link to={`/orders/${confirmedOrder.orderNumber}`} style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="md">
                    📦 Track Order Progress
                  </Button>
                </Link>
                <Link to="/marketplace" style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="md">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </CustomerLayout>
    )
  }

  return (
    <CustomerLayout>
      <div className="hc-order-page">
        <PageHeader
          title="Checkout & Payment"
          subtitle="Complete your authentic honey purchase with direct beekeeper fulfillment."
        />

        {orderError && <Alert type="danger" title="Checkout Error">{orderError}</Alert>}

        <div className="hc-checkout-layout">
          <CheckoutForm
            totalAmount={subtotal}
            onSubmit={handleCheckout}
            loading={placingOrder}
            error={orderError}
            initialAddress={initialAddress}
          />
        </div>
      </div>
    </CustomerLayout>
  )
}

export default CheckoutPage
