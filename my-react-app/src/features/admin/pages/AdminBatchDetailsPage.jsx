import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import AdminLayout from '../../../layouts/AdminLayout'
import AdminSidebar from '../components/AdminSidebar'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'

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
        <div className="container section text-center py-12">
          <LoadingSpinner text="Loading batch audit details..." />
        </div>
      </AdminLayout>
    )
  }

  if (error || !batch) {
    return (
      <AdminLayout>
        <div className="container section">
          <Alert type="danger" message={error || 'Batch not found'} />
          <Link to="/admin/batches" className="btn btn--secondary mt-4">
            ← Back to Batches List
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="container section w-full">
        <nav className="breadcrumb mb-6">
          <Link to="/admin/dashboard">Admin</Link> / <Link to="/admin/batches">Batches</Link> /{' '}
          <span className="text-secondary">{batchId}</span>
        </nav>

        <AdminSidebar />

        {/* Batch Overview Header */}
        <div className="card mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <span className="badge badge--dark mb-2">Honey Batch Audit</span>
              <h1 className="text-2xl font-bold font-mono">{batch.batchId}</h1>
              <p className="text-secondary text-sm mt-1">
                Harvested on {batch.harvestDate} • Quantity: <strong className="text-gold">{batch.quantityKg?.toFixed(1)} kg</strong>
              </p>
            </div>
            <div>
              <span className={`badge badge--${batch.status === 'PURE' ? 'success' : batch.status === 'FAILED' ? 'danger' : 'warning'} badge--lg`}>
                {batch.status}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pillars of HoneyChain Audit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 1. Apiary & Beekeeper */}
          <div className="card">
            <h3 className="card__title mb-3">🧑‍🌾 Apiary & Beekeeper</h3>
            <div className="text-sm space-y-2">
              <p className="flex justify-between">
                <span className="text-secondary">Beekeeper:</span>
                <strong>{batch.beekeeperName || 'N/A'}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-secondary">Village:</span>
                <span>{batch.beekeeperVillage || 'N/A'}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-secondary">KVIC ID:</span>
                <code>{batch.beekeeperKvicId || 'N/A'}</code>
              </p>
              <p className="flex justify-between">
                <span className="text-secondary">Hive Source:</span>
                <span>{batch.hiveCode || `Hive #${batch.hiveId}`} ({batch.clusterName || 'Apiary'})</span>
              </p>
            </div>
          </div>

          {/* 2. Lab Testing & Purity */}
          <div className="card">
            <h3 className="card__title mb-3">🔬 Laboratory Analysis</h3>
            {batch.labTested ? (
              <div className="text-sm space-y-2">
                <p className="flex justify-between">
                  <span className="text-secondary">Purity Score:</span>
                  <strong className="text-success font-bold text-lg">{batch.purityScore}%</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-secondary">Test Outcome:</span>
                  <span className={`badge badge--${batch.labResult === 'PURE' ? 'success' : 'danger'}`}>
                    {batch.labResult}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-secondary">Facility:</span>
                  <span>{batch.labName}</span>
                </p>
                {batch.testDate && (
                  <p className="flex justify-between">
                    <span className="text-secondary">Tested On:</span>
                    <span>{new Date(batch.testDate).toLocaleDateString('en-IN')}</span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-secondary text-sm">Laboratory analysis not yet conducted for this batch.</p>
            )}
          </div>

          {/* 3. Blockchain Ledger */}
          <div className="card">
            <h3 className="card__title mb-3">⛓️ Blockchain Immutable Ledger</h3>
            {batch.blockchainRecorded ? (
              <div className="text-sm space-y-2">
                <p className="flex justify-between">
                  <span className="text-secondary">Ledger Status:</span>
                  <span className="badge badge--success">Anchored on Chain</span>
                </p>
                <div>
                  <span className="text-secondary block text-xs">Transaction Hash:</span>
                  <code className="text-xs break-all text-gold">{batch.transactionHash}</code>
                </div>
                <div>
                  <span className="text-secondary block text-xs">Data Hash (SHA-256):</span>
                  <code className="text-xs break-all">{batch.dataHash}</code>
                </div>
                {batch.blockNumber && (
                  <p className="flex justify-between text-xs">
                    <span className="text-secondary">Block Number:</span>
                    <span>#{batch.blockNumber}</span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-secondary text-sm">Pending blockchain transaction seal.</p>
            )}
          </div>

          {/* 4. QR & Verification Activity */}
          <div className="card">
            <h3 className="card__title mb-3">🛡️ Anti-Counterfeit & Scans</h3>
            <div className="text-sm space-y-2">
              <p className="flex justify-between">
                <span className="text-secondary">Public Scans:</span>
                <strong>{batch.totalScans} times</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-secondary">Risk Level:</span>
                <span className={`badge badge--${batch.riskLevel === 'HIGH_RISK' ? 'danger' : batch.riskLevel === 'WATCH' ? 'warning' : 'success'}`}>
                  {batch.riskLevel}
                </span>
              </p>
              {batch.publicVerificationUrl && (
                <div className="pt-2">
                  <a
                    href={batch.publicVerificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--outline btn--xs btn--full"
                  >
                    🔗 Inspect Public Verification Portal ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminBatchDetailsPage
