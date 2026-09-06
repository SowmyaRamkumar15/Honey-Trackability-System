import React from 'react'
import './DataTable.css'

/**
 * DataTable — Standardized Data Table wrapper component.
 * Prevents horizontal page overflow by using an overflow-x container.
 */
export const DataTable = ({ children, className = '' }) => {
  return (
    <div className={`hc-data-table-container ${className}`.trim()}>
      <table className="hc-data-table">
        {children}
      </table>
    </div>
  )
}

export default DataTable
