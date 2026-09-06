import React from 'react'

export const PurityScoreInput = ({ value = 98, onChange, error }) => {
  const numVal = typeof value === 'number' ? value : parseInt(value, 10) || 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label className="hc-input__label" style={{ marginBottom: 0 }}>
          Laboratory Purity Score (0 - 100%) *
        </label>
        <div
          style={{
            padding: 'var(--space-1) var(--space-3)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 900,
            fontSize: 'var(--text-lg)',
            background: 'var(--primary-soft)',
            color: 'var(--primary-dark)',
            border: '1px solid var(--primary-light)',
          }}
        >
          {numVal}%
        </div>
      </div>

      {/* Range Slider */}
      <input
        type="range"
        min="0"
        max="100"
        value={numVal}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
      />

      {/* Preset Quick Selectors */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>Quick Presets:</span>
        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
          {[99, 95, 90, 80, 50].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              style={{
                padding: '2px 8px',
                fontSize: 'var(--text-xs)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                background: numVal === preset ? 'var(--primary)' : 'var(--surface)',
                color: numVal === preset ? '#ffffff' : 'var(--text-primary)',
                border: numVal === preset ? '1px solid var(--primary-dark)' : '1px solid var(--border)',
                fontWeight: numVal === preset ? 700 : 500,
              }}
            >
              {preset}%
            </button>
          ))}
        </div>
      </div>

      {error && <p style={{ color: 'var(--danger)', fontSize: 'var(--text-xs)', margin: 0, fontWeight: 600 }}>{error}</p>}
    </div>
  )
}

export default PurityScoreInput
