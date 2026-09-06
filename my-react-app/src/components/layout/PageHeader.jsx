import React from 'react'
import './PageHeader.css'

/**
 * PageHeader — Standardized Page Header component.
 */
export const PageHeader = ({ title, subtitle, actions, className = '' }) => {
  return (
    <div className={`hc-page-header ${className}`.trim()}>
      <div className="hc-page-header__content">
        <h1 className="hc-page-header__title">
          {title}
        </h1>
        {subtitle && (
          <p className="hc-page-header__subtitle">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="hc-page-header__actions">
          {actions}
        </div>
      )}
    </div>
  )
}

export default PageHeader
