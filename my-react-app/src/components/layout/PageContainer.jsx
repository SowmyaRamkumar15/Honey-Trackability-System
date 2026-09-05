import React from 'react'

/**
 * PageContainer — Reusable application-wide content container.
 * Enforces 1440px max-width, margin-inline auto, and responsive 32px padding on desktop.
 */
export const PageContainer = ({ children, maxWidth = '1440px', className = '' }) => {
  const maxWClass =
    maxWidth === '720px'
      ? 'max-w-3xl'
      : maxWidth === '960px'
      ? 'max-w-5xl'
      : maxWidth === '1280px'
      ? 'max-w-7xl'
      : 'max-w-[1440px]'

  return (
    <div className={`w-full ${maxWClass} mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 ${className}`}>
      {children}
    </div>
  )
}

export default PageContainer
