import React from 'react'

export const AdminStatCard = ({ icon, label, value, subtext, color = 'amber' }) => {
  return (
    <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-xs)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', transition: 'all var(--transition-normal)' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--primary-soft)', border: '1px solid var(--primary-light)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
          {label}
        </p>
        <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
          {value}
        </h3>
        {subtext && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  )
}

export default AdminStatCard
