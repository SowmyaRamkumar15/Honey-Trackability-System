import React from 'react'

/**
 * PageHeader — Standardized Page Header component.
 * Desktop (>=768px): Title + Subtitle on LEFT with full natural width, Actions on RIGHT.
 * Mobile (<768px): Stacked layout cleanly aligned to the left.
 */
export const PageHeader = ({ title, subtitle, actions, className = '' }) => {
  return (
    <div className={`page-header flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 text-left w-full ${className}`}>
      <div className="page-header__content min-w-0 flex-1 space-y-1">
        <h1 className="page-header__title text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
          {title}
        </h1>
        {subtitle && (
          <p className="page-header__subtitle text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="page-header__actions flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0 justify-start md:justify-end">
          {actions}
        </div>
      )}
    </div>
  )
}

export default PageHeader
