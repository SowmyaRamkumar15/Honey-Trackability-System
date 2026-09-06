import React, { useState } from 'react'
import NotificationItem from './NotificationItem'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'

export const NotificationList = ({ items = [], onMarkAllRead, loading }) => {
  const [filter, setFilter] = useState('ALL') // 'ALL' | 'UNREAD'

  const filteredItems = items.filter((i) => {
    if (filter === 'UNREAD') return !i.isRead
    return true
  })

  const unreadCount = items.filter((i) => !i.isRead).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Filter Tabs & Bulk Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {[
            { key: 'ALL', label: `All (${items.length})` },
            { key: 'UNREAD', label: `Unread (${unreadCount})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-xl)',
                fontSize: 'var(--text-xs)',
                fontWeight: filter === key ? 'var(--font-bold)' : 'var(--font-semibold)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                backgroundColor: filter === key ? 'var(--primary)' : 'var(--bg-muted)',
                color: filter === key ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: filter === key ? '0 2px 4px rgba(217,119,6,0.25)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <Button variant="ghost" size="xs" onClick={onMarkAllRead}>
            ✓ Mark All as Read
          </Button>
        )}
      </div>

      {/* Item List */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No Notifications Found"
          description={
            filter === 'UNREAD'
              ? 'You have read all your notifications.'
              : 'You will receive notifications here for orders, lab results, and hive alerts.'
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {filteredItems.map((item) => (
            <NotificationItem key={item.id} notification={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationList
