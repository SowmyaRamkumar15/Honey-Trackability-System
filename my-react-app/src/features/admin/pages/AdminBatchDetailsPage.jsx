import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import AdminLayout from '../../../layouts/AdminLayout'
import Badge from '../../../components/ui/Badge'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'
import '../styles/admin.css'

export const AdminBatchDetailsPage = () => {
  const { batchId } = useParams()
  const [batch, setBatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminApi.getBatchDetails(batchId)
      .then((res) => setBatch(res.data?.data))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load batch details'))
      .finally(() => setLoading(false))
  }, [batchId])

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: 'var(--space-16) 0', textAlign: 'center' }}>
          <LoadingSpinner text="Loading batch audit details..." />
        </div>
      </AdminLayout>
    )
  }

  if (error || !batch) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Alert type="danger" message={error || 'Batch not found'} />
          <Link to="/admin/batches" className="hc-button hc-button--secondary hc-button--sm" style={{ display: 'inline-flex', width: 'fit-content' }}>
            ← Back to Batches List
          </Link>
        </div>
      </AdminLayout>
    )
  }

  const getBatchStatusBadge = (status) => {
    if (status === 'PURE') return <Badge variant="success">{status}</Badge>
    if (status === 'FAILED') return <Badge variant="danger">{status}</Badge>
    return <Badge variant="warning">{status}</Badge>
  }

  const getRiskBadge = (riskLevel) => {
    if (riskLevel === 'HIGH_RISK') return <Badge variant="danger">{riskLevel}</Badge>
    if (riskLevel === 'WATCH') return <Badge variant="warning">{riskLevel}</Badge>
    return <Badge variant="success">{riskLevel}</Badge>
  }

  return (
    <AdminLayout>
      <div className="hc-admin-page">
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          <Link to="/admin/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = 'var(--primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >Admin</Link>
          <span>/</span>
          <Link to="/admin/batches" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = 'var(--primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >Batches</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-medium)' }}>{batchId}</span>
        </nav>

        {/* Batch Overview Header */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <Badge variant="warning" style={{ display: 'inline-block', marginBottom: 'var(--space-2)', fontFamily: 'monospace' }}>
                Honey Batch Audit
              </Badge>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', fontFamily: 'monospace', color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }}>
                {batch.batchId}
              </h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
                Harvested on {batch.harvestDate} • Quantity:{' '}
                <strong style={{ color: 'var(--primary)', fontWeight: 'var(--font-bold)' }}>
                  {batch.quantityKg?.toFixed(1)} kg
                </strong>
              </p>
            </div>
            {getBatchStatusBadge(batch.status)}
          </div>
        </Card>

        {/* 4 Pillars of HoneyChain Audit */}
        <div className="hc-admin-analytics-grid">
          {/* 1. Apiary & Beekeeper */}
          <Card>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-3) 0' }}>
              🧑‍🌾 Apiary & Beekeeper
            </h3>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
              {[
                { label: 'Beekeeper:', value: <strong style={{ color: 'var(--text-primary)' }}>{batch.beekeeperName || 'N/A'}</strong> },
                { label: 'Village:', value: batch.beekeeperVillage || 'N/A' },
                { label: 'KVIC ID:', value: <code style={{ color: 'var(--text-primary)' }}>{batch.beekeeperKvicId || 'N/A'}</code> },
                { label: 'Hive Source:', value: `${batch.hiveCode || `Hive #${batch.hiveId}`} (${batch.clusterName || 'Apiary'})` },
              ].map(({ label, value }, idx, arr) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: idx < arr.length - 1 ? 'var(--space-2)' : 0, borderBottom: idx < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
                </div>
              ))}
            </dl>
          </Card>

          {/* 2. Lab Testing & Purity */}
          <Card>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-3) 0' }}>
              🔬 Laboratory Analysis
            </h3>
            {batch.labTested ? (
              <dl style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Purity Score:</span>
                  <strong style={{ color: 'var(--success)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)' }}>{batch.purityScore}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Test Outcome:</span>
                  <Badge variant={batch.labResult === 'PURE' ? 'success' : 'danger'}>{batch.labResult}</Badge>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Facility:</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{batch.labName}</span>
                </div>
                {batch.testDate && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tested On:</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{new Date(batch.testDate).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
              </dl>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', padding: 'var(--space-4) 0', textAlign: 'center', margin: 0 }}>
                Laboratory analysis not yet conducted for this batch.
              </p>
            )}
          </Card>

          {/* 3. Blockchain Ledger */}
          <Card>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-3) 0' }}>
              ⛓️ Blockchain Immutable Ledger
            </h3>
            {batch.blockchainRecorded ? (
              <dl style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Ledger Status:</span>
                  <Badge variant="info">Anchored on Chain</Badge>
                </div>
                <div style={{ paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>Transaction Hash:</span>
                  <code style={{ fontSize: '11px', wordBreak: 'break-all', color: 'var(--primary)', fontFamily: 'monospace' }}>{batch.transactionHash}</code>
                </div>
                <div style={{ paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>Data Hash (SHA-256):</span>
                  <code style={{ fontSize: '11px', wordBreak: 'break-all', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{batch.dataHash}</code>
                </div>
                {batch.blockNumber && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Block Number:</span>
                    <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>#{batch.blockNumber}</span>
                  </div>
                )}
              </dl>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', padding: 'var(--space-4) 0', textAlign: 'center', margin: 0 }}>
                Pending blockchain transaction seal.
              </p>
            )}
          </Card>

          {/* 4. QR & Verification Activity */}
          <Card>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-3) 0' }}>
              🛡️ Anti-Counterfeit & Scans
            </h3>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Public Scans:</span>
                <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{batch.totalScans} times</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Risk Level:</span>
                {getRiskBadge(batch.riskLevel)}
              </div>
              {batch.publicVerificationUrl && (
                <div style={{ paddingTop: 'var(--space-2)' }}>
                  <a
                    href={batch.publicVerificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hc-button hc-button--secondary hc-button--sm"
                    style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}
                  >
                    🔗 Inspect Public Verification Portal ↗
                  </a>
                </div>
              )}
            </dl>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminBatchDetailsPage
