import React from 'react'
import './Input.css'

export const Input = ({
  label,
  id,
  type = 'text',
  error,
  helperText,
  className = '',
  required,
  ...props
}) => {
  return (
    <div className="hc-field">
      {label && (
        <label htmlFor={id} className="hc-label">
          {label}
          {required && <span className="hc-label__required">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        required={required}
        className={`hc-input ${error ? 'hc-input--error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="hc-field__error">⚠ {error}</p>}
      {helperText && !error && <p className="hc-field__hint">{helperText}</p>}
    </div>
  )
}

export default Input
