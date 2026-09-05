import React from 'react'

/**
 * MetricCard — Standardized Premium Dashboard KPI Metric Card.
 * Clean alignment, balanced proportions, modern status indicator.
 */
export const MetricCard = ({ icon, label, value, subtext, trend, className = '' }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-blue-400/80 transition-all duration-200 flex flex-col justify-between h-full min-h-[135px] text-left group ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 line-clamp-1">
            {label}
          </span>
          {icon && (
            <span className="w-8 h-8 rounded-lg bg-blue-50/80 border border-blue-100 flex items-center justify-center text-base shrink-0 group-hover:bg-blue-100/80 transition-colors">
              {icon}
            </span>
          )}
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
          {value}
        </div>
      </div>
      {(subtext || trend) && (
        <div className="mt-3.5 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-500 gap-2">
          {subtext && <span className="truncate">{subtext}</span>}
          {trend && <span className="font-semibold text-blue-700 shrink-0">{trend}</span>}
        </div>
      )}
    </div>
  )
}

export default MetricCard
