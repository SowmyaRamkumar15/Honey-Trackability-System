import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../hooks/useNotifications'

const TYPE_CONFIG = {
  LAB_RESULT:    { icon: '🔬', color: '#4338CA', bg: '#EEF2FF', border: '#C7D2FE', label: 'Lab Test' },
  HIVE_ALERT:    { icon: '🐝', color: '#92400E', bg: '#FFFBEB', border: '#FDE68A', label: 'Hive Alert' },
  NEW_ORDER:     { icon: '📦', color: '#065F46', bg: '#ECFDF5', border: '#A7F3D0', label: 'New Order' },
  ORDER_STATUS:  { icon: '🚚', color: '#1E40AF', bg: '#EFF6FF', border: '#BFDBFE', label: 'Delivery' },
  BATCH_SYNC:    { icon: '🔄', color: '#5B21B6', bg: '#F5F3FF', border: '#DDD6FE', label: 'Sync' },
  QR_GENERATED:  { icon: '🏷️', color: '#0F766E', bg: '#F0FDFA', border: '#99F6E4', label: 'Passport' },
  PROFILE_STATUS:{ icon: '👤', color: '#92400E', bg: '#FFFBEB', border: '#FDE68A', label: 'KVIC' },
  DISPUTE_UPDATE:{ icon: '⚖️', color: '#9F1239', bg: '#FFF1F2', border: '#FECDD3', label: 'Dispute' },
  SYSTEM:        { icon: '📢', color: '#374151', bg: '#F9FAFB', border: '#E5E7EB', label: 'System' },
}

export const NotificationItem = ({ notification, onCloseDropdown }) => {
  const navigate = useNavigate()
  const { markAsRead } = useNotifications()

  if (!notification) return null

  const { id, title, message, type, isRead, createdAt, relatedEntityType, relatedEntityId } = notification
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.SYSTEM

  const handleClick = async () => {
    if (!isRead) {
      markAsRead(id)
    }

    if (onCloseDropdown) {
      onCloseDropdown()
    }

    if (relatedEntityType && relatedEntityId) {
      switch (relatedEntityType.toUpperCase()) {
        case 'BATCH':
          navigate(`/beekeeper/batches/${relatedEntityId}`)
          break
        case 'ORDER':
          navigate(`/beekeeper/orders`)
          break
        case 'HIVE':
          navigate(`/hives/${relatedEntityId}/health`)
          break
        case 'PROFILE':
          navigate(`/beekeeper/profile`)
          break
        case 'DISPUTE':
          navigate(`/admin/disputes`)
          break
        default:
          break
      }
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-2xl)',
        border: `1px solid ${isRead ? 'var(--border)' : '#BFDBFE'}`,
        transition: 'all var(--transition-fast)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        boxShadow: 'var(--shadow-xs)',
        backgroundColor: isRead ? 'var(--surface)' : '#EFF6FF',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-xs)'}
    >
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-xl)',
        border: `1px solid ${config.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'var(--text-xl)',
        flexShrink: 0,
        backgroundColor: config.bg,
        boxShadow: 'var(--shadow-xs)',
      }}>
        {config.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 'var(--font-bold)',
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${config.border}`,
              backgroundColor: config.bg,
              color: config.color,
              whiteSpace: 'nowrap',
            }}>
              {config.label}
            </span>
            <h4 style={{
              fontSize: 'var(--text-sm)',
              letterSpacing: '-0.01em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: isRead ? 'var(--text-secondary)' : 'var(--text-primary)',
              fontWeight: isRead ? 'var(--font-semibold)' : 'var(--font-extrabold)',
              margin: 0,
            }}>
              {title}
            </h4>
          </div>
          {!isRead && (
            <span style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#2563EB',
              flexShrink: 0,
              boxShadow: '0 0 6px rgba(37,99,235,0.4)',
              animation: 'pulse 2s infinite',
            }} title="Unread notification" />
          )}
        </div>

        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {message}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-2)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border)', fontSize: '11px' }}>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 'var(--font-medium)' }}>
            {createdAt ? new Date(createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
          </span>
          {relatedEntityType && (
            <span style={{ color: 'var(--primary)', fontWeight: 'var(--font-bold)', transition: 'transform var(--transition-fast)' }}>
              View details →
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationItem
