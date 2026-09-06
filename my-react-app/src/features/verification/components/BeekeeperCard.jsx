import React from 'react'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import '../styles/verification.css'

export const BeekeeperCard = ({ beekeeper, harvestDate, hiveCode, clusterName, quantityKg, batchPhotoUrl }) => {
  return (
    <Card
      header={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)' }}>
            👨‍🌾 Beekeeper & Origin Details
          </h3>
          <Badge variant="warning" size="sm">
            Certified Apiary
          </Badge>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Beekeeper Profile Info */}
        <div className="hc-verify-profile">
          {beekeeper?.photoUrl ? (
            <img
              src={beekeeper.photoUrl}
              alt={beekeeper.name}
              className="hc-verify-avatar"
            />
          ) : (
            <div className="hc-verify-avatar">
              🐝
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Produced By</p>
            <p style={{ margin: '2px 0 0', color: 'var(--text-primary)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>{beekeeper?.name || 'Local Beekeeper'}</p>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>📍</span> {beekeeper?.village || 'India'}
            </p>
          </div>
        </div>

        {/* Harvest Attributes Grid */}
        <div className="hc-verify-meta-grid">
          <div className="hc-verify-meta-item">
            <label>Harvest Date</label>
            <val>
              {harvestDate ? new Date(harvestDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
            </val>
          </div>
          <div className="hc-verify-meta-item">
            <label>Harvest Weight</label>
            <val style={{ fontFamily: 'var(--font-mono)' }}>{quantityKg} KG</val>
          </div>
          <div className="hc-verify-meta-item">
            <label>Source Hive</label>
            <val style={{ fontFamily: 'var(--font-mono)' }}>{hiveCode || 'Registered Hive'}</val>
          </div>
          <div className="hc-verify-meta-item">
            <label>Apiary Cluster</label>
            <val>{clusterName || 'Regional Cluster'}</val>
          </div>
        </div>

        {/* Harvest Photo Thumbnail if available */}
        {batchPhotoUrl && (
          <div style={{ paddingTop: 'var(--space-2)' }}>
            <p style={{ margin: '0 0 var(--space-2)', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Harvest Photo Documentation:</p>
            <img
              src={batchPhotoUrl}
              alt="Honey Harvest"
              style={{ width: '100%', height: '160px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--border)' }}
            />
          </div>
        )}
      </div>
    </Card>
  )
}

export default BeekeeperCard
