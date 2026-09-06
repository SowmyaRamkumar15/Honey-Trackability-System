import React from 'react'
import Badge from '../../../components/ui/Badge'
import EmptyState from '../../../components/ui/EmptyState'

export const DisputeTable = ({ disputes = [], onSelectDispute }) => {
  if (disputes.length === 0) {
    return (
      <EmptyState
        icon="⚖️"
        title="No Customer Disputes"
        description="There are currently no active customer disputes found."
      />
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="danger">OPEN</Badge>
      case 'INVESTIGATING':
        return <Badge variant="warning">INVESTIGATING</Badge>
      case 'RESOLVED':
        return <Badge variant="success">RESOLVED</Badge>
      case 'REJECTED':
        return <Badge variant="neutral">REJECTED</Badge>
      default:
        return <Badge variant="neutral">{status}</Badge>
    }
  }

  return (
    <div className="hc-table-container">
      <table className="hc-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Batch ID</th>
            <th>Order Ref</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Submitted</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {disputes.map((d) => (
            <tr key={d.id}>
              <td style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--text-muted)' }}>
                #{d.id}
              </td>
              <td style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 'var(--font-semibold)' }}>
                {d.batchId}
              </td>
              <td style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)' }}>
                {d.orderNumber || 'N/A'}
              </td>
              <td>
                <strong style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                  {d.reason}
                </strong>
                {d.description && (
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', maxWidth: 260, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.description}
                  </span>
                )}
              </td>
              <td>{getStatusBadge(d.status)}</td>
              <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                {d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN') : 'N/A'}
              </td>
              <td style={{ textAlign: 'right' }}>
                <button
                  type="button"
                  className="hc-button hc-button--secondary hc-button--sm"
                  onClick={() => onSelectDispute?.(d)}
                >
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DisputeTable
