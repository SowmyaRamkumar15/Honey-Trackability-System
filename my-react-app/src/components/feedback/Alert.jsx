import React from 'react'
import './Alert.css'

export const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  if (!message) return null

  return (
    <div className={`hc-alert hc-alert--${type} ${className}`.trim()}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="hc-alert__close" aria-label="Close alert">✕</button>
      )}
    </div>
  )
}

export default Alert
