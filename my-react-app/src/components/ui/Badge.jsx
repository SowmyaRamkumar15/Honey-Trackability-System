import React from 'react'
import './Badge.css'

const VARIANT_MAP = {
  primary: 'hc-badge--primary',
  secondary: 'hc-badge--secondary',
  success: 'hc-badge--success',
  warning: 'hc-badge--warning',
  danger: 'hc-badge--danger',
  error: 'hc-badge--error',
  info: 'hc-badge--info',
  purple: 'hc-badge--purple',
  outline: 'hc-badge--outline',
}

export const Badge = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const sizeClass = size === 'sm' ? 'hc-badge--sm' : size === 'lg' ? 'hc-badge--lg' : ''
  const variantClass = VARIANT_MAP[variant] || 'hc-badge--primary'

  return (
    <span className={`hc-badge ${variantClass} ${sizeClass} ${className}`.trim()} {...props}>
      {children}
    </span>
  )
}

export default Badge
