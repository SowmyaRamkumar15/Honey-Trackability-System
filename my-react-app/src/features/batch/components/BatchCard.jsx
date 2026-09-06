import React from 'react'
import { Link } from 'react-router-dom'
import BatchStatusBadge from './BatchStatusBadge'
import SyncStatusBadge from './SyncStatusBadge'
import '../styles/batch.css'

export const BatchCard = ({ batch }) => {
  const isLocal = Boolean(batch._isLocal || batch.localId)

  return (
    <div className={`hc-batch-card ${isLocal ? 'hc-batch-card--local' : ''}`}>
      {/* Top Header */}
      <div>
        <div className="hc-batch-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            {batch.photoUrl ? (
              <img
                src={batch.photoUrl}
                alt={batch.batchId || batch.localId}
                className="hc-batch-photo"
              />
            ) : (
              <div className="hc-batch-icon">
                🍯
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <p className="hc-batch-card-id">
                {batch.batchId || batch.localId}
              </p>
              <p className="hc-batch-hive-info">
                {batch.hiveCode || 'Hive'} {batch.clusterName ? `· ${batch.clusterName}` : ''}
              </p>
            </div>
          </div>
          {isLocal ? (
            <SyncStatusBadge status={batch.syncStatus} lastError={batch.lastError} />
          ) : (
            <BatchStatusBadge status={batch.status} />
          )}
        </div>

        {/* Metrics Grid */}
        <div className="hc-batch-meta-grid">
          <div className="hc-batch-meta-item">
            <span className="hc-batch-meta-label">Harvest Date</span>
            <span className="hc-batch-meta-val">
              {batch.harvestDate
                ? new Date(batch.harvestDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : '—'}
            </span>
          </div>
          <div className="hc-batch-meta-item">
            <span className="hc-batch-meta-label">Harvest Yield</span>
            <span className="hc-batch-meta-val hc-batch-meta-val--yield">
              {batch.quantityKg} KG
            </span>
          </div>
        </div>

        {isLocal && batch.lastError && (
          <div className="hc-batch-error-box">
            ⚠ {batch.lastError}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="hc-batch-card-footer">
        <span className="hc-batch-date-text">
          {isLocal ? 'Offline Record' : 'Registered'}{' '}
          {batch.createdAt
            ? new Date(batch.createdAt).toLocaleDateString('en-IN')
            : '—'}
        </span>
        {!isLocal ? (
          <Link to={`/beekeeper/batches/${batch.batchId}`}>
            <button
              type="button"
              className="hc-btn hc-btn--secondary hc-btn--xs"
            >
              Batch Passport →
            </button>
          </Link>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--primary-dark)', fontWeight: 600 }}>
            Will sync online 💾
          </span>
        )}
      </div>
    </div>
  )
}

export default BatchCard
