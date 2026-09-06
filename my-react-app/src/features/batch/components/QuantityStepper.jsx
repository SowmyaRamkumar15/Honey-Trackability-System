import React from 'react'
import '../styles/batch.css'

export const QuantityStepper = ({
  value = 5.0,
  onChange,
  min = 0.5,
  max = 1000.0,
  step = 0.5,
  error = null,
}) => {
  const currentVal = typeof value === 'number' ? value : parseFloat(value) || 0.0

  const handleDecrement = () => {
    const next = Math.max(min, +(currentVal - step).toFixed(2))
    onChange(next)
  }

  const handleIncrement = () => {
    const next = Math.min(max, +(currentVal + step).toFixed(2))
    onChange(next)
  }

  const handleDirectInput = (e) => {
    const val = parseFloat(e.target.value)
    if (!isNaN(val)) {
      onChange(val)
    } else if (e.target.value === '') {
      onChange('')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
        Harvest Quantity (KG) *
      </label>

      {/* Stepper Control */}
      <div className="hc-stepper">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={currentVal <= min}
          className="hc-stepper-btn"
          aria-label="Decrease quantity"
        >
          −
        </button>

        <div className="hc-stepper-display">
          <input
            type="number"
            step="0.1"
            min={min}
            max={max}
            value={value}
            onChange={handleDirectInput}
            className="hc-stepper-input"
          />
          <span style={{ color: 'var(--primary-dark)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>KG</span>
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={currentVal >= max}
          className="hc-stepper-btn"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Quick Preset Buttons */}
      <div className="hc-stepper-presets">
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)' }}>Quick:</span>
        {[1, 5, 10, 25, 50].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`hc-preset-pill ${currentVal === preset ? 'hc-preset-pill--active' : ''}`}
          >
            {preset}kg
          </button>
        ))}
      </div>

      {error && <p style={{ color: 'var(--danger)', fontSize: 'var(--text-xs)', margin: '4px 0 0 0' }}>{error}</p>}
    </div>
  )
}

export default QuantityStepper
