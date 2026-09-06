import React from 'react'
import { Link } from 'react-router-dom'
import HiveStatusBadge from './HiveStatusBadge'
import '../styles/hive.css'

export const HiveCard = ({ hive, onDeactivate, onActivate, deactivating = false }) => {
  const isActive = hive.status === 'ACTIVE'
  const isAlert = hive.status === 'ALERT'

  return (
    <div className={`hc-hive-item-card ${isAlert ? 'hc-hive-item-card--alert' : ''}`}>
      <div>
        {/* Header */}
        <div className="hc-hive-item-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="hc-hive-icon">
              🐝
            </div>
            <div>
              <p className="hc-hive-item-code">
                {hive.hiveCode}
              </p>
              <p className="hc-hive-item-cluster">
                {hive.clusterName || 'Apiary Colony'}
              </p>
            </div>
          </div>
          <HiveStatusBadge status={hive.status} />
        </div>

        {/* Details / Metadata */}
        <div className="hc-hive-item-details">
          <div className="hc-hive-item-row">
            <span className="hc-hive-item-label">
              <span>📅</span> Installed
            </span>
            <span className="hc-hive-item-value">
              {hive.installedDate
                ? new Date(hive.installedDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : '—'}
            </span>
          </div>
          <div className="hc-hive-item-row">
            <span className="hc-hive-item-label">
              <span>📍</span> Coordinates
            </span>
            {hive.latitude && hive.longitude ? (
              <span className="hc-hive-item-coords">
                {Number(hive.latitude).toFixed(3)}°N, {Number(hive.longitude).toFixed(3)}°E
              </span>
            ) : (
              <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Not configured</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="hc-hive-item-actions">
        <Link to={`/beekeeper/hives/${hive.id}/health`} style={{ flex: 1 }}>
          <button
            type="button"
            className="hc-btn hc-btn--secondary hc-btn--sm"
            style={{ width: '100%' }}
          >
            <span>📡</span> Health
          </button>
        </Link>
        <Link to={`/beekeeper/hives/${hive.id}`} style={{ flex: 1 }}>
          <button
            type="button"
            className="hc-btn hc-btn--secondary hc-btn--sm"
            style={{ width: '100%' }}
          >
            Inspect
          </button>
        </Link>
        {!isAlert ? (
          <button
            type="button"
            onClick={() =>
              isActive
                ? onDeactivate && onDeactivate(hive.id)
                : onActivate && onActivate(hive.id)
            }
            disabled={deactivating}
            className={`hc-btn hc-btn--sm ${isActive ? 'hc-btn--danger' : 'hc-btn--success'}`}
            style={{ flex: 1 }}
          >
            {isActive ? 'Pause' : 'Activate'}
          </button>
        ) : (
          <Link to={`/beekeeper/hives/${hive.id}/health`} style={{ flex: 1 }}>
            <button
              type="button"
              className="hc-btn hc-btn--primary hc-btn--sm"
              style={{ width: '100%' }}
            >
              Resolve
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default HiveCard
