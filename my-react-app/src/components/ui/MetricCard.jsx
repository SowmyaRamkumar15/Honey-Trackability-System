import React from 'react'
import './MetricCard.css'

/**
 * MetricCard — Standardized Premium Dashboard KPI Metric Card.
 */
export const MetricCard = ({ icon, label, value, subtext, trend, className = '' }) => {
  return (
    <div className={`hc-metric-card ${className}`.trim()}>
      <div>
        <div className="hc-metric-header">
          <span className="hc-metric-label">{label}</span>
          {icon && <span className="hc-metric-icon">{icon}</span>}
        </div>
        <div className="hc-metric-value">{value}</div>
      </div>
      {(subtext || trend) && (
        <div className="hc-metric-footer">
          {subtext && <span className="hc-metric-subtext">{subtext}</span>}
          {trend && <span className="hc-metric-trend">{trend}</span>}
        </div>
      )}
    </div>
  )
}

export default MetricCard
