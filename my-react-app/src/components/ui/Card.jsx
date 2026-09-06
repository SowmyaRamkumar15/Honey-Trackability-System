import React from 'react'
import './Card.css'

/**
 * Card — Premium surface container with subtle depth.
 */
export const Card = ({ children, className = '', hover = true, padding = false, ...props }) => {
  const classes = [
    'hc-card',
    hover ? 'hc-card--hover' : '',
    padding ? 'hc-card--padding' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export default Card
