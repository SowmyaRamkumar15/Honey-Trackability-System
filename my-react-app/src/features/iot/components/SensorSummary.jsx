import React from 'react'

export const SensorSummary = ({ temperature, humidity, beeActivity, checkedAt }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
      {/* Temperature */}
      <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <span style={{ fontWeight: 'var(--font-semibold)' }}>🌡️ Internal Temp</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>Normal: 32–37°C</span>
        </div>
        <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', margin: 0 }}>
          {temperature != null ? `${Number(temperature).toFixed(1)}°C` : '—'}
        </p>
      </div>

      {/* Humidity */}
      <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <span style={{ fontWeight: 'var(--font-semibold)' }}>💧 Hive Humidity</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>Normal: 45–70%</span>
        </div>
        <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', margin: 0 }}>
          {humidity != null ? `${Number(humidity).toFixed(1)}%` : '—'}
        </p>
      </div>

      {/* Bee Activity */}
      <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <span style={{ fontWeight: 'var(--font-semibold)' }}>🐝 Bee Activity</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>Healthy: ≥70/100</span>
        </div>
        <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', margin: 0 }}>
          {beeActivity != null ? `${beeActivity}/100` : '—'}
        </p>
      </div>
    </div>
  )
}

export default SensorSummary
