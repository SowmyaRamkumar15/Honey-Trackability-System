import React from 'react'

export const RecentVerificationList = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No prior verification scans recorded.</p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: '192px', overflowY: 'auto', paddingRight: '4px' }}>
      {events.map((ev, idx) => (
        <div
          key={idx}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)', boxShadow: 'var(--shadow-xs)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-xs)' }}>
              {ev.result === 'VERIFIED' ? '✅' : ev.result === 'UNDER_REVIEW' ? '⚠️' : '❌'}
            </span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>{ev.result} Scan</span>
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {ev.scannedAt
              ? new Date(ev.scannedAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })
              : '—'}
          </span>
        </div>
      ))}
    </div>
  )
}

export default RecentVerificationList
