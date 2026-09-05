import React from 'react'

export const DisputeTable = ({ disputes = [], onSelectDispute }) => {
  if (disputes.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-secondary">No customer disputes found.</p>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="badge badge--danger">OPEN</span>
      case 'INVESTIGATING':
        return <span className="badge badge--warning">INVESTIGATING</span>
      case 'RESOLVED':
        return <span className="badge badge--success">RESOLVED</span>
      case 'REJECTED':
        return <span className="badge badge--dark">REJECTED</span>
      default:
        return <span className="badge">{status}</span>
    }
  }

  return (
    <div className="overflow-x-auto card p-0">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Batch ID</th>
            <th>Order Ref</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {disputes.map((d) => (
            <tr key={d.id}>
              <td>#{d.id}</td>
              <td><code>{d.batchId}</code></td>
              <td><code>{d.orderNumber || 'N/A'}</code></td>
              <td>
                <strong className="block">{d.reason}</strong>
                {d.description && (
                  <span className="text-secondary text-xs truncate max-w-xs block">
                    {d.description}
                  </span>
                )}
              </td>
              <td>{getStatusBadge(d.status)}</td>
              <td>
                <span className="text-secondary text-xs">
                  {d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                </span>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn--outline btn--xs"
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
