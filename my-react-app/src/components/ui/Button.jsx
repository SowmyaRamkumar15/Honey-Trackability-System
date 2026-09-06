import React from 'react'
import './Button.css'

const VARIANTS = {
  primary: 'hc-btn--primary',
  secondary: 'hc-btn--secondary',
  ghost: 'hc-btn--ghost',
  danger: 'hc-btn--danger',
  success: 'hc-btn--success',
}

const SIZES = {
  xs: 'hc-btn--xs',
  sm: 'hc-btn--sm',
  md: 'hc-btn--md',
  lg: 'hc-btn--lg',
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props
}) => {
  const variantClass = VARIANTS[variant] || VARIANTS.primary
  const sizeClass = SIZES[size] || SIZES.md

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`hc-btn ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="hc-btn__spinner">
          <span className="hc-btn__spinner-icon" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
