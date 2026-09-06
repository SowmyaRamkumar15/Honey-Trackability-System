import React from 'react'
import './PageContainer.css'

/**
 * PageContainer — Reusable application-wide content container.
 */
export const PageContainer = ({ children, maxWidth = '1280px', className = '' }) => {
  const sizeClass =
    maxWidth === '720px' || maxWidth === '768px'
      ? 'hc-page-container--sm'
      : maxWidth === '960px' || maxWidth === '1024px'
      ? 'hc-page-container--md'
      : 'hc-page-container--lg'

  return (
    <div className={`hc-page-container ${sizeClass} ${className}`.trim()}>
      {children}
    </div>
  )
}

export default PageContainer
