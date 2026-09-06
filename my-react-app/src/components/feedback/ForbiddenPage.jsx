import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROLE_ROUTES, ROLE_LABELS } from '../../constants/roles'
import Button from '../ui/Button'
import Card from '../ui/Card'
import AppShell from '../layout/AppShell'

export const ForbiddenPage = () => {
  const { role, isAuthenticated } = useSelector((state) => state.auth)

  const dashboardRoute = isAuthenticated && role ? ROLE_ROUTES[role] || '/' : '/login'
  const userRoleLabel = isAuthenticated && role ? ROLE_LABELS[role] || role : 'Guest'

  const content = (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)' }}>
      <Card style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--danger-soft)', border: '1px solid var(--danger-border)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginInline: 'auto' }}>
          🛡️
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', color: 'var(--text-primary)', margin: 0 }}>
            403 — Access Denied
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            You do not have permission to access this page. Your account role is logged in as{' '}
            <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--primary-dark)' }}>{userRoleLabel}</span>.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingTop: 'var(--space-2)' }}>
          <Link to={dashboardRoute} style={{ textDecoration: 'none' }}>
            <Button variant="primary" style={{ width: '100%', justifyContent: 'center', fontWeight: 'var(--font-bold)' }}>
              Go to Your Role Dashboard
            </Button>
          </Link>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Back to Home Page
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )

  if (isAuthenticated && role) {
    return (
      <AppShell stripLabel="Access Denied" stripVariant="default">
        {content}
      </AppShell>
    )
  }

  return content
}

export default ForbiddenPage
