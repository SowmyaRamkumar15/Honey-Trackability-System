import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import BatchStatusBadge from '../components/BatchStatusBadge'
import BatchForm from '../components/BatchForm'
import BlockchainStatusCard from '../components/BlockchainStatusCard'
import LabResultBadge from '../../lab/components/LabResultBadge'
import QrCodeCard from '../components/QrCodeCard'
import VerificationHistoryCard from '../../verification/components/VerificationHistoryCard'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import EmptyState from '../../../components/ui/EmptyState'
import Badge from '../../../components/ui/Badge'
import { useBatches } from '../hooks/useBatches'
import labApi from '../../lab/api/labApi'
import '../styles/batch.css'

export const BatchDetailsPage = () => {
  const { batchId } = useParams()
  const {
    selectedBatch: batch,
    loading,
    error,
    fetchBatch,
    updateBatch,
    sendForTesting,
    clearError,
  } = useBatches()

  const [isEditing, setIsEditing] = useState(false)
  const [showConfirmTesting, setShowConfirmTesting] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)
  const [labResult, setLabResult] = useState(null)
  const [loadingLabResult, setLoadingLabResult] = useState(false)

  useEffect(() => {
    fetchBatch(batchId)
  }, [batchId, fetchBatch])

  useEffect(() => {
    if (batch && ['PURE', 'UNDER_REVIEW', 'FAILED'].includes(batch.status)) {
      setLoadingLabResult(true)
      labApi.getBeekeeperLabResult(batchId)
        .then((res) => setLabResult(res.data.data))
        .catch(() => setLabResult(null))
        .finally(() => setLoadingLabResult(false))
    }
  }, [batch, batchId])

  const handleUpdate = async (formData) => {
    const result = await updateBatch(batchId, formData)
    if (!result.error) {
      setIsEditing(false)
      setSuccessMsg('Batch details updated successfully!')
      setTimeout(() => setSuccessMsg(null), 3000)
    }
  }

  const handleSendForTesting = async () => {
    const result = await sendForTesting(batchId)
    if (!result.error) {
      setShowConfirmTesting(false)
      setSuccessMsg('Batch has been sent for laboratory testing!')
      setTimeout(() => setSuccessMsg(null), 4000)
    }
  }

  const isCreated = batch?.status === 'CREATED'

  return (
    <BeekeeperLayout>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          <Link to="/beekeeper/batches" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 'var(--font-medium)' }}>
            My Honey Batches
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 'var(--font-medium)' }}>{batchId}</span>
        </nav>

        {error && <Alert type="error" message={error} onClose={clearError} />}
        {successMsg && <Alert type="success" message={successMsg} />}

        {loading && !batch ? (
          <LoadingSpinner text="Loading batch details..." />
        ) : !batch ? (
          <EmptyState
            icon="🍯"
            title="Batch Not Found"
            description="This batch does not exist or does not belong to your account."
            action={
              <Link to="/beekeeper/batches">
                <Button variant="secondary">← Back to Batches</Button>
              </Link>
            }
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Batch Main Header Card */}
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    {batch.photoUrl && (batch.photoUrl.startsWith('http') || batch.photoUrl.startsWith('data:') || batch.photoUrl.startsWith('/')) ? (
                      <img
                        src={batch.photoUrl}
                        alt={batch.batchId}
                        style={{ width: 64, height: 64, borderRadius: 'var(--radius-xl)', objectFit: 'cover', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}
                      />
                    ) : (
                      <div className="hc-batch-icon">🍯</div>
                    )}
                    <div>
                      <p style={{ color: 'var(--primary)', fontFamily: 'monospace', fontWeight: 'var(--font-black)', fontSize: 'var(--text-xl)', letterSpacing: '-0.02em', margin: 0 }}>
                        {batch.batchId}
                      </p>
                      <p style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', margin: '2px 0 0 0' }}>
                        Hive: {batch.hiveCode || 'Active Hive'}{batch.clusterName ? ` · ${batch.clusterName}` : ''}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <BatchStatusBadge status={batch.status} size="lg" />
                    {isCreated && !isEditing && (
                      <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
                        ✏️ Edit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Editing Form */}
            {isEditing && (
              <Card>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-4) 0' }}>
                  Edit Batch Details
                </h2>
                <BatchForm
                  initialValues={batch}
                  onSubmit={handleUpdate}
                  loading={loading}
                  isEdit={true}
                  onCancel={() => setIsEditing(false)}
                  submitLabel="Save Batch Changes"
                />
              </Card>
            )}

            {/* Two-Column Responsive Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', alignItems: 'start' }}>
              {/* Left Column: Attributes, Blockchain, Analytics */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {!isEditing && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 'var(--space-4)' }}>
                    {[
                      { label: 'Batch ID', value: batch.batchId, mono: true },
                      { label: 'Status', value: <BatchStatusBadge status={batch.status} /> },
                      { label: 'Harvest Quantity', value: `${batch.quantityKg} KG`, highlight: true },
                      { label: 'Harvest Date', value: batch.harvestDate ? new Date(batch.harvestDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—' },
                      { label: 'Source Hive', value: `${batch.hiveCode || 'Hive'} (${batch.clusterName || 'Apiary'})` },
                      { label: 'Registered On', value: batch.createdAt ? new Date(batch.createdAt).toLocaleDateString('en-IN') : '—' },
                    ].map(({ label, value, mono, highlight }) => (
                      <div key={label} style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-2xl)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', transition: 'box-shadow var(--transition-fast)' }}>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)', fontWeight: 'var(--font-medium)' }}>{label}</p>
                        <div style={{ color: highlight ? 'var(--primary)' : 'var(--text-primary)', fontWeight: highlight ? 'var(--font-black)' : 'var(--font-semibold)', fontFamily: (mono || highlight) ? 'monospace' : undefined, fontSize: highlight ? 'var(--text-lg)' : undefined }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Blockchain */}
                <div>
                  <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-2) 0' }}>
                    🛡️ Blockchain Integrity & Proof
                  </h2>
                  <BlockchainStatusCard batchId={batch.batchId} />
                </div>

                {/* Verification Activity */}
                {batch?.status === 'QR_GENERATED' && (
                  <div>
                    <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-2) 0' }}>
                      📊 Verification Activity & Anti-Counterfeit Signals
                    </h2>
                    <VerificationHistoryCard batchId={batch.batchId} />
                  </div>
                )}

                {/* Marketplace Placeholder */}
                <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-5)', border: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>🛍️ Decentralized Honey Marketplace</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-muted)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>Available in Phase 10</span>
                </div>
              </div>

              {/* Right Column: QR Code Passport & Lab Testing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <QrCodeCard
                  batch={batch}
                  onQrGenerated={() => fetchBatch(batchId)}
                />

                {/* Lab Testing Section */}
                <div>
                  <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-2) 0' }}>
                    🧪 Laboratory Purity Analysis
                  </h2>

                  {loadingLabResult ? (
                    <Card>
                      <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Loading laboratory purity report...</p>
                    </Card>
                  ) : labResult ? (
                    <Card style={{ border: '1px solid var(--primary-light)', background: 'linear-gradient(135deg, rgba(253,230,138,0.1) 0%, var(--surface) 100%)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                        <div>
                          <p style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)', margin: 0 }}>Purity Quality Certificate</p>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                            Tested on {labResult.testedAt ? new Date(labResult.testedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
                          </p>
                        </div>
                        <LabResultBadge result={labResult.result} size="lg" />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', paddingTop: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
                        <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)' }}>Purity Score</p>
                          <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', color: 'var(--primary)', fontFamily: 'monospace', margin: '2px 0 0 0' }}>{labResult.purityScore}%</p>
                        </div>
                        <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)' }}>Test Result</p>
                          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>{labResult.result}</p>
                        </div>
                      </div>

                      {labResult.remarks && (
                        <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Lab Notes: </span>
                          <span style={{ color: 'var(--text-primary)' }}>{labResult.remarks}</span>
                        </div>
                      )}

                      {labResult.certificateUrl && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-soft)', border: '1px solid var(--primary-light)', fontSize: 'var(--text-xs)' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>📄 Official Lab Certificate</span>
                          <a href={labResult.certificateUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'var(--font-bold)' }}>View Document ↗</a>
                        </div>
                      )}
                    </Card>
                  ) : batch.status === 'SENT_FOR_TESTING' ? (
                    <Card style={{ border: '1px solid var(--primary-light)', background: 'rgba(253,230,138,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{ fontSize: 'var(--text-3xl)' }}>⏳</span>
                        <div>
                          <p style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', margin: 0 }}>Testing in Progress</p>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>This batch is queued at the government laboratory for purity analysis.</p>
                        </div>
                      </div>
                      <Badge variant="warning">Awaiting Lab</Badge>
                    </Card>
                  ) : (
                    <Card style={{ border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Honey batch has not yet been submitted to the laboratory.</span>
                      <span style={{ fontSize: '11px', backgroundColor: 'var(--bg-muted)', padding: '4px 12px', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)' }}>Status: {batch.status}</span>
                    </Card>
                  )}
                </div>

                {/* Testing Workflow Action Card */}
                {isCreated && !isEditing && (
                  <Card style={{ border: '1px solid var(--primary-light)', background: 'rgba(253,230,138,0.08)' }}>
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)', margin: '0 0 var(--space-2) 0' }}>
                      🧪 Send to Laboratory
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
                      Once submitted for testing, this batch will be queued for lab purity analysis and cannot be edited further.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => setShowConfirmTesting(true)}
                      style={{ width: '100%', fontWeight: 'var(--font-bold)' }}
                    >
                      Send for Testing →
                    </Button>
                  </Card>
                )}
              </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmTesting && (
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)', zIndex: 50 }}>
                <Card style={{ maxWidth: 440, width: '100%', boxShadow: 'var(--shadow-xl)', borderRadius: 'var(--radius-3xl)' }}>
                  <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                    <div style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>🧪</div>
                    <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-2) 0' }}>
                      Confirm Lab Submission
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                      Send batch <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 'var(--font-bold)' }}>{batch.batchId}</span> ({batch.quantityKg} KG) to the laboratory for purity testing?
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', paddingTop: 'var(--space-2)' }}>
                    <Button variant="primary" loading={loading} onClick={handleSendForTesting} style={{ flex: 1, fontWeight: 'var(--font-bold)' }}>
                      Yes, Send Batch
                    </Button>
                    <Button variant="secondary" onClick={() => setShowConfirmTesting(false)} style={{ flex: 1 }}>
                      Cancel
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </BeekeeperLayout>
  )
}

export default BatchDetailsPage
