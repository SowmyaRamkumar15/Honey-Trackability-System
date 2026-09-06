import React from 'react'
import './LoadingSpinner.css'

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  return (
    <div className="hc-spinner-wrap">
      <div className={`hc-spinner hc-spinner--${size}`} />
      {text && <p className="hc-spinner__text">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
