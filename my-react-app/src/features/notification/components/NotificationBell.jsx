import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import useNotifications from '../hooks/useNotifications'
import NotificationDropdown from './NotificationDropdown'

export const NotificationBell = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { items, unreadCount, markAllRead } = useNotifications(isAuthenticated)
  const [isOpen, setIsOpen] = useState(false)
  const bellRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!isAuthenticated) return null

  return (
    <div style={{ position: 'relative' }} ref={bellRef}>
      <button
        type="button"
        id="nav-notification-bell"
        style={{
          position: 'relative',
          padding: '8px',
          fontSize: '1.25rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--transition-fast)',
        }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        title="Notifications"
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-contrast)',
            fontWeight: 'var(--font-black)',
            fontSize: '0.625rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--surface)',
            boxShadow: 'var(--shadow-xs)',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          items={items}
          unreadCount={unreadCount}
          onMarkAllRead={markAllRead}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default NotificationBell
