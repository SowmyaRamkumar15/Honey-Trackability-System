import React from 'react'
import './StatusButtonGroup.css'

const STATUS_OPTIONS = [
  {
    id: 'PURE',
    label: 'PURE',
    subtitle: 'Honey meets required purity standards.',
    variant: 'pure',
  },
  {
    id: 'UNDER_REVIEW',
    label: 'UNDER REVIEW',
    subtitle: 'Additional review is required.',
    variant: 'review',
  },
  {
    id: 'FAILED',
    label: 'FAILED',
    subtitle: 'Honey did not meet required standards.',
    variant: 'failed',
  },
]

export const StatusButtonGroup = ({
  value,
  onChange,
  disabled = false,
  error = null,
}) => {
  return (
    <div className="hc-status-group-wrap">
      <label className="hc-status-group-label" id="lab-status-group-label">
        <span>Honey Test Status</span>
        <span className="hc-status-group-req" title="Required">*</span>
      </label>

      <div
        className="hc-status-button-group"
        role="radiogroup"
        aria-labelledby="lab-status-group-label"
      >
        {STATUS_OPTIONS.map(({ id, label, subtitle, variant }) => {
          const isSelected = value === id

          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => !disabled && onChange && onChange(id)}
              onKeyDown={(e) => {
                if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
                  e.preventDefault()
                  onChange && onChange(id)
                }
              }}
              className={`hc-status-btn hc-status-btn--${variant} ${
                isSelected ? 'hc-status-btn--selected' : ''
              }`.trim()}
            >
              <div className="hc-status-btn__header">
                <span className="hc-status-btn__indicator">
                  {isSelected && (
                    <svg
                      className="hc-status-btn__check-icon"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="12"
                      height="12"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                <span className="hc-status-btn__label">{label}</span>
              </div>
              <p className="hc-status-btn__subtitle">{subtitle}</p>
            </button>
          )
        })}
      </div>

      {error && <p className="hc-status-group-error">{error}</p>}
    </div>
  )
}

export default StatusButtonGroup
