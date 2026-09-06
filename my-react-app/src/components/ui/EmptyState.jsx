import React from 'react'
import './EmptyState.css'

/**
 * EmptyState — Standardized Empty State Component.
 */
export const EmptyState = ({
  icon = '🐝',
  title = 'No items found',
  description = 'There are no records to display at this time.',
  action = null,
  className = '',
}) => {
  return (
    <div className={`hc-empty-state ${className}`.trim()}>
      <div className="hc-empty-icon">
        {icon}
      </div>
      <div className="hc-empty-body">
        <h3 className="hc-empty-title">
          {title}
        </h3>
        {description && (
          <p className="hc-empty-description">
            {description}
          </p>
        )}
      </div>
      {action && <div className="hc-empty-action">{action}</div>}
    </div>
  )
}

export default EmptyState
