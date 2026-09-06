import React from 'react'
import useNetworkStatus from '../hooks/useNetworkStatus'
import useBatchSync from '../hooks/useBatchSync'

export const OfflineBatchIndicator = () => {
  const { isOnline } = useNetworkStatus()
  const { pendingCount, isSyncing, syncNow } = useBatchSync()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '6px 14px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)' }}>
      {/* Network Status Badge */}
      {isOnline ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: 'var(--font-semibold)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)', display: 'inline-block' }} />
          Online
        </span>
      ) : (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontWeight: 'var(--font-semibold)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger)', display: 'inline-block' }} />
          Offline
        </span>
      )}

      {/* Sync Queue Counter & Manual Sync Trigger */}
      {pendingCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', paddingLeft: 'var(--space-2)', borderLeft: '1px solid var(--border)' }}>
          {isSyncing ? (
            <span style={{ color: 'var(--info)', fontWeight: 'var(--font-medium)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🔄 Syncing ({pendingCount})...
            </span>
          ) : (
            <span style={{ color: 'var(--warning)', fontWeight: 'var(--font-medium)' }}>
              🔴 {pendingCount} pending draft{pendingCount > 1 ? 's' : ''}
            </span>
          )}

          {isOnline && !isSyncing && (
            <button
              type="button"
              style={{ padding: '2px 8px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary)', color: 'var(--primary-contrast)', fontWeight: 'var(--font-bold)', fontSize: '0.6875rem', border: 'none', cursor: 'pointer' }}
              onClick={syncNow}
            >
              Sync Now ⚡
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default OfflineBatchIndicator
