import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import '../styles/lab.css'

export const PendingTestCard = ({ batch }) => {
  return (
    <div className="hc-lab-card">
      <div>
        {/* Card Header */}
        <div className="hc-lab-card-header">
          <div className="hc-lab-card-avatar-box">
            <div className="hc-lab-card-avatar">
              🧪
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="hc-lab-batch-id" title={batch.batchId}>
                {batch.batchId}
              </p>
              <p className="hc-lab-beekeeper-meta" title={`${batch.beekeeperName || 'Registered Apiary'} · ${batch.village || 'Regional Cluster'}`}>
                {batch.beekeeperName || 'Registered Apiary'} · <span style={{ color: 'var(--text-secondary)' }}>{batch.village || 'Regional Cluster'}</span>
              </p>
            </div>
          </div>
          <Badge variant="warning" size="sm">
            Pending Test
          </Badge>
        </div>

        {/* Batch Info Grid */}
        <div className="hc-lab-meta-grid">
          <div className="hc-lab-meta-cell">
            <span className="hc-lab-meta-title">Source Hive</span>
            <span className="hc-lab-meta-value" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {batch.hiveCode || 'Active Hive'} {batch.clusterName ? `(${batch.clusterName})` : ''}
            </span>
          </div>
          <div className="hc-lab-meta-cell">
            <span className="hc-lab-meta-title">Quantity</span>
            <span className="hc-lab-meta-value" style={{ color: 'var(--primary-dark)', fontFamily: 'var(--font-mono)' }}>
              {batch.quantityKg != null ? `${batch.quantityKg.toFixed(1)} KG` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {batch.submittedAt ? `Submitted ${new Date(batch.submittedAt).toLocaleDateString('en-IN')}` : 'Submitted for QA'}
        </span>
        <Link to={`/lab/tests/${batch.batchId}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
          <Button variant="primary" size="sm">
            Perform Analysis →
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default PendingTestCard
