import React from 'react'
import { Link } from 'react-router-dom'
import NotificationItem from './NotificationItem'

export const NotificationDropdown = ({ items = [], unreadCount = 0, onMarkAllRead, onClose }) => {
  return (
    <div style={{
      position: 'absolute',
      right: 0,
      marginTop: '8px',
      width: '360px',
      maxWidth: '90vw',
      borderRadius: 'var(--radius-2xl)',
      border: '1px solid var(--border)',
      backgroundColor: 'var(--surface)',
      boxShadow: 'var(--shadow-xl)',
      zIndex: 50,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '32rem',
    }}>
      {/* Header */}
      <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '1rem' }}>🔔</span>
          <h3 style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', margin: 0 }}>Notifications</h3>
          {unreadCount > 0 && (
            <span style={{ backgroundColor: 'var(--primary-soft)', border: '1px solid var(--primary-light)', color: 'var(--primary-dark)', fontSize: '0.625rem', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 'var(--font-bold)' }}>
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 'var(--font-semibold)', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={onMarkAllRead}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List Content */}
      <div style={{ padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', overflowY: 'auto', flex: 1 }}>
        {items.length === 0 ? (
          <div style={{ padding: 'var(--space-8) 0', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '2rem', opacity: 0.5, display: 'block' }}>🔔</span>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>No notifications yet</p>
          </div>
        ) : (
          items.slice(0, 5).map((item) => (
            <NotificationItem key={item.id} notification={item} onCloseDropdown={onClose} />
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: 'var(--space-3)', borderTop: '1px solid var(--border-light)', textAlign: 'center', backgroundColor: 'var(--bg-soft)' }}>
        <Link
          to="/notifications"
          onClick={onClose}
          style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 'var(--font-bold)', textDecoration: 'none' }}
        >
          View All Notifications →
        </Link>
      </div>
    </div>
  )
}

export default NotificationDropdown
