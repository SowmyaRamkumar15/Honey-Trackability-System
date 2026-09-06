import React, { useState } from 'react'

export const PredictionExplanation = ({ explanation, details }) => {
  const [open, setOpen] = useState(false)

  if (!explanation && !details) return null

  return (
    <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-light)' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--primary-dark)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
      >
        <span>{open ? '▼' : '►'}</span> Why this prediction?
      </button>

      {open && (
        <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)', lineHeight: 1.6 }}>
          <p style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-3)', margin: '0 0 var(--space-3) 0' }}>{explanation}</p>

          {details && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Hive Health Status:</span>
                <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.6875rem', fontWeight: 'var(--font-bold)', backgroundColor: 'var(--success-soft)', color: 'var(--success)', border: '1px solid var(--success-border)' }}>
                  {details.healthStatus}
                </span>
              </div>

              {details.historicalDataPoints > 0 ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Harvest History:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-dark)', fontWeight: 'var(--font-semibold)' }}>
                    {details.historicalDataPoints} harvests (avg {details.averageHistoricalYield} kg)
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Harvest History:</span>
                  <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No prior harvests (using baseline)</span>
                </div>
              )}

              {details.beeActivity !== null && details.beeActivity !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Bee Activity:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-dark)', fontWeight: 'var(--font-semibold)' }}>{details.beeActivity}%</span>
                </div>
              )}

              {details.temperature && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Temperature / Humidity:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-dark)', fontWeight: 'var(--font-semibold)' }}>
                    {details.temperature}°C / {details.humidity}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PredictionExplanation
