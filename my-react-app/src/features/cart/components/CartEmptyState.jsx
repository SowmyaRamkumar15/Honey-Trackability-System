import React from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../../../components/ui/EmptyState'
import Button from '../../../components/ui/Button'

const CartEmptyState = () => {
  return (
    <EmptyState
      icon="🛒"
      title="Your Cart is Empty"
      description="You haven't added any authentic artisan honey to your cart yet. Explore our marketplace to find 100% lab-tested, blockchain-verified honey."
      action={
        <Link to="/marketplace" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md">
            🍯 Explore Marketplace
          </Button>
        </Link>
      }
    />
  )
}

export default CartEmptyState
