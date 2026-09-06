import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ROLES } from '../../../constants/roles'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import CustomerLayout from '../../../layouts/CustomerLayout'
import AdminLayout from '../../../layouts/AdminLayout'
import LabLayout from '../../../layouts/LabLayout'
import PageHeader from '../../../components/layout/PageHeader'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import NotificationList from '../components/NotificationList'
import useNotifications from '../hooks/useNotifications'
import '../styles/notifications.css'

export const NotificationsPage = () => {
  const { role } = useSelector((state) => state.auth)
  const { items, loading, error, fetchNotifications, markAllRead, clearError } = useNotifications()

  useEffect(() => {
    fetchNotifications({ page: 0, size: 30 })
  }, [fetchNotifications])

  const RoleLayout =
    role === ROLES.CUSTOMER
      ? CustomerLayout
      : role === ROLES.ADMIN || role === ROLES.KVIC_OFFICER
      ? AdminLayout
      : role === ROLES.LAB
      ? LabLayout
      : BeekeeperLayout

  return (
    <RoleLayout>
      <div className="hc-notif-page">
        {/* Page Header */}
        <PageHeader
          title="Notifications Center"
          subtitle="Stay informed on lab quality tests, IoT hive alerts, marketplace orders, and profile status updates."
        />

        {error && <Alert type="error" message={error} onClose={clearError} />}

        {loading && items.length === 0 ? (
          <LoadingSpinner text="Loading notifications..." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
            {/* Main Notifications Feed */}
            <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
              <NotificationList items={items} onMarkAllRead={markAllRead} loading={loading} />
            </div>

            {/* Sidebar Preferences & Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '20px', borderRadius: 'var(--radius-2xl)', backgroundColor: 'var(--primary-soft)', border: '1px solid var(--primary-light)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.25rem' }}>⚙️</span>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    Notification Channels
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-xs)' }}>
                  <div className="hc-hive-item-row">
                    <span>IoT Health Alerts</span>
                    <strong style={{ color: 'var(--primary-dark)' }}>Immediate</strong>
                  </div>
                  <div className="hc-hive-item-row">
                    <span>Lab Test Approvals</span>
                    <strong style={{ color: 'var(--primary-dark)' }}>Real-time</strong>
                  </div>
                  <div className="hc-hive-item-row">
                    <span>Marketplace Orders</span>
                    <strong style={{ color: 'var(--primary-dark)' }}>Push & SMS</strong>
                  </div>
                </div>
              </div>

              <div style={{ padding: '20px', borderRadius: 'var(--radius-2xl)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.25rem' }}>🛡️</span>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    Cryptographic Verification
                  </h3>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  System alerts are triggered directly by on-chain events and verified IoT threshold monitors.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleLayout>
  )
}

export default NotificationsPage
