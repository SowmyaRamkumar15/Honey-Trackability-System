import React from 'react'
import { Link } from 'react-router-dom'
import HiveStatusBadge from './HiveStatusBadge'

export const HiveCard = ({ hive, onDeactivate, onActivate, deactivating = false }) => {
  const isActive = hive.status === 'ACTIVE'
  const isAlert = hive.status === 'ALERT'

  return (
    <div className={`hive-card${isAlert ? ' hive-card--alert' : ''}`}>
      {/* Header */}
      <div className="hive-card__header">
        <div className="hive-card__identity">
          <span style={{ fontSize: '1.5rem' }}>🐝</span>
          <div>
            <p className="hive-card__code">{hive.hiveCode}</p>
            <p className="hive-card__name">{hive.clusterName}</p>
          </div>
        </div>
        <HiveStatusBadge status={hive.status} />
      </div>

      {/* Details */}
      <div className="hive-card__meta">
        <div className="hive-card__meta-row">
          <span>📅</span>
          <span>Installed: {hive.installedDate
            ? new Date(hive.installedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—'}</span>
        </div>
        {hive.latitude && hive.longitude ? (
          <div className="hive-card__meta-row">
            <span>📍</span>
            <span className="font-mono">{hive.latitude}°N, {hive.longitude}°E</span>
          </div>
        ) : (
          <div className="hive-card__meta-row">
            <span>📍</span>
            <span style={{ fontStyle: 'italic' }}>Location not set</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="hive-card__actions">
        <Link to={`/beekeeper/hives/${hive.id}/health`} style={{ flex: 1 }}>
          <button className="btn btn--success btn--xs btn--full">
            <span>📡</span> Health
          </button>
        </Link>
        <Link to={`/beekeeper/hives/${hive.id}`} style={{ flex: 1 }}>
          <button className="btn btn--secondary btn--xs btn--full">
            View
          </button>
        </Link>
        <Link to={`/beekeeper/hives/${hive.id}`} state={{ edit: true }} style={{ flex: 1 }}>
          <button className="btn btn--secondary btn--xs btn--full">
            Edit
          </button>
        </Link>
        {!isAlert && (
          <button
            onClick={() => isActive
              ? onDeactivate && onDeactivate(hive.id)
              : onActivate && onActivate(hive.id)
            }
            disabled={deactivating}
            className={`btn btn--xs btn--full ${isActive ? 'btn--danger' : 'btn--success'}`}
            style={{ flex: 1 }}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </button>
        )}
      </div>
    </div>
  )
}

export default HiveCard
