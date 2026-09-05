import React, { useEffect } from 'react'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import Card from '../../../components/ui/Card'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import NotificationList from '../components/NotificationList'
import useNotifications from '../hooks/useNotifications'

export const NotificationsPage = () => {
  const { items, loading, error, fetchNotifications, markAllRead, clearError } = useNotifications()

  useEffect(() => {
    fetchNotifications({ page: 0, size: 30 })
  }, [fetchNotifications])

  return (
    <BeekeeperLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-['Outfit'] flex items-center gap-3">
            <span>🔔</span> Notifications Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Stay informed on lab quality tests, IoT hive alerts, marketplace orders, and profile status updates.
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={clearError} />}

        {loading && items.length === 0 ? (
          <LoadingSpinner text="Loading notifications..." />
        ) : (
          <Card className="p-6">
            <NotificationList items={items} onMarkAllRead={markAllRead} loading={loading} />
          </Card>
        )}
      </div>
    </BeekeeperLayout>
  )
}

export default NotificationsPage
