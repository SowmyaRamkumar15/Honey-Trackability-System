import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import LabLayout from '../../../layouts/LabLayout'
import LabTestForm from '../components/LabTestForm'
import LabResultBadge from '../components/LabResultBadge'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Alert from '../../../components/feedback/Alert'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import PageHeader from '../../../components/layout/PageHeader'
import { useLabTests } from '../hooks/useLabTests'
import batchApi from '../../batch/api/batchApi'
import labApi from '../api/labApi'
import adminApi from '../../admin/api/adminApi'
import '../styles/lab.css'

export const LabTestDetailsPage = () => {
  const { batchId } = useParams()
  const navigate = useNavigate()
  const { pendingBatches, fetchPendingTests, submitLabTest, loading, error, clearError } = useLabTests()

  const [batch, setBatch] = useState(null)
  const [existingTest, setExistingTest] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [submissionSuccess, setSubmissionSuccess] = useState(null)

  const loadBatchAndTest = async () => {
    try {
      setLoadingDetails(true)
      setLoadError(null)

      let foundBatch = null
      let foundTest = null

      // 1. Attempt to fetch existing test record
      try {
        const testRes = await labApi.getLabTest(batchId)
        if (testRes?.data?.data) {
          foundTest = testRes.data.data
          if (foundTest.batch) {
            foundBatch = foundTest.batch
          }
        }
      } catch (e) {
        // No existing test record yet
      }

      // 2. Fallback resolution: fetch batch details from batch/admin/pending API
      if (!foundBatch) {
        try {
          const batchRes = await batchApi.getBatch(batchId)
          if (batchRes?.data?.data) {
            foundBatch = batchRes.data.data
          }
        } catch (e1) {
          try {
            const adminRes = await adminApi.getBatchDetails(batchId)
            if (adminRes?.data?.data) {
              foundBatch = adminRes.data.data
            }
          } catch (e2) {
            try {
              const pendingRes = await labApi.getPendingTests()
              const list = pendingRes?.data?.data || []
              const match = list.find((b) => b.batchId === batchId || String(b.id) === String(batchId))
              if (match) {
                foundBatch = match
              }
            } catch (e3) {
              const localMatch = pendingBatches?.find(
                (b) => b.batchId === batchId || String(b.id) === String(batchId)
              )
              if (localMatch) {
                foundBatch = localMatch
              }
            }
          }
        }
      }

      if (foundBatch) {
        setBatch(foundBatch)
        setExistingTest(foundTest)
      } else {
        setBatch(null)
        setLoadError('Batch not found.')
      }
    } catch (err) {
      setLoadError('Unable to load this batch.')
    } finally {
      setLoadingDetails(false)
    }
  }

  useEffect(() => {
    loadBatchAndTest()
  }, [batchId])

  const handleSubmitTest = async (formData) => {
    const actionResult = await submitLabTest(batchId, formData)
    if (!actionResult.error) {
      const payload = actionResult.payload
      setExistingTest(payload)
      setSubmissionSuccess(payload)
      // Refresh pending tests queue so submitted batch disappears from queue
      fetchPendingTests()
    }
  }

  return (
    <LabLayout>
      <div className="hc-lab-page">
        {/* Page Header */}
        <PageHeader
          title={`🔬 Lab Inspection — ${batchId}`}
          subtitle="Record analytical purity parameters and submit laboratory results to the backend database."
        />

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <Link to="/lab/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
            Lab Dashboard
          </Link>
          <span>/</span>
          <Link to="/lab/tests/pending" style={{ color: 'inherit', textDecoration: 'none' }}>
            Pending Tests
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{batchId}</span>
        </nav>

        {error && <Alert type="danger" title="Submission Error" onClose={clearError}>{error}</Alert>}

        {submissionSuccess && (
          <Alert type="success" title="Laboratory Result Saved Successfully">
            Result <strong>{submissionSuccess.result || 'RECORDED'}</strong> ({submissionSuccess.purityScore || 0}% purity) has been saved to database for batch <span style={{ fontFamily: 'var(--font-mono)' }}>{batchId}</span>.
            <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)' }}>
              <Button variant="primary" size="sm" onClick={() => navigate('/lab/tests/pending')}>
                ← Return to Pending Queue
              </Button>
            </div>
          </Alert>
        )}

        {loadingDetails ? (
          <LoadingSpinner message="Loading batch details from laboratory backend..." />
        ) : loadError === 'Unable to load this batch.' ? (
          <Card padding style={{ maxWidth: '540px', margin: 'var(--space-8) auto', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>⚠️</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', margin: 0 }}>Unable to load this batch.</h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 'var(--space-3) 0' }}>
              The server encountered an error while fetching batch details for <span style={{ fontFamily: 'var(--font-mono)' }}>{batchId}</span>.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
              <Button variant="primary" size="sm" onClick={loadBatchAndTest}>
                🔄 Try Again
              </Button>
              <Link to="/lab/tests/pending" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="sm">
                  ← Back to Pending Tests
                </Button>
              </Link>
            </div>
          </Card>
        ) : !batch ? (
          <Card padding style={{ maxWidth: '540px', margin: 'var(--space-8) auto', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🧪</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', margin: 0 }}>Batch not found.</h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 'var(--space-2) 0' }}>
              Could not find honey batch with ID <span style={{ fontFamily: 'var(--font-mono)' }}>{batchId}</span>.
            </p>
            <Link to="/lab/tests/pending" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="sm">
                ← Back to Pending Tests
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="hc-lab-details-layout">
            {/* Main Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {/* Read-Only Batch Info Header */}
              <Card padding>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-xl)', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', border: '1.5px solid var(--primary-light)', flexShrink: 0 }}>
                      🍯
                    </div>
                    <div>
                      <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--primary-dark)' }}>
                        {batch.batchId || batchId}
                      </p>
                      <p style={{ margin: '2px 0 0', fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>
                        Beekeeper: <strong style={{ color: 'var(--text-primary)' }}>{batch.beekeeperName || 'Registered Apiary'}</strong> ({batch.village || 'Region'})
                      </p>
                    </div>
                  </div>

                  <Badge variant={batch.status === 'PURE' ? 'success' : batch.status === 'FAILED' ? 'danger' : 'warning'} size="md">
                    Status: {batch.status || 'PENDING'}
                  </Badge>
                </div>

                {/* Batch Summary Info */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)', fontSize: 'var(--text-xs)' }}>
                  <div>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Quantity</p>
                    <p style={{ margin: '2px 0 0', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{batch.quantityKg ? `${batch.quantityKg} KG` : '—'}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Source Hive</p>
                    <p style={{ margin: '2px 0 0', color: 'var(--text-primary)', fontWeight: 600 }}>{batch.hiveCode || 'Active Hive'}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Harvest Date</p>
                    <p style={{ margin: '2px 0 0', color: 'var(--text-primary)', fontWeight: 600 }}>{batch.harvestDate || '—'}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Floral Origin</p>
                    <p style={{ margin: '2px 0 0', color: 'var(--text-primary)', fontWeight: 600 }}>{batch.floralSource || 'Multifloral'}</p>
                  </div>
                </div>
              </Card>

              {/* Test Form or Completed Test Display */}
              {existingTest ? (
                /* Already Tested Result Card */
                <Card padding>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-4)' }}>
                    <div>
                      <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
                        🧪 Laboratory Analysis Completed
                      </h3>
                      <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                        Tested on {existingTest.testedAt ? new Date(existingTest.testedAt).toLocaleString('en-IN') : 'Recently'}
                      </p>
                    </div>
                    <LabResultBadge result={existingTest.result} size="lg" />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
                      <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', background: 'var(--primary-soft)', border: '1px solid var(--primary-light)', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--primary-dark)', fontWeight: 800, textTransform: 'uppercase' }}>Purity Score</p>
                        <p style={{ margin: '4px 0 0', fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--primary-dark)', fontFamily: 'var(--font-mono)' }}>
                          {existingTest.purityScore}%
                        </p>
                      </div>
                      <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Certification Status</p>
                        <div style={{ marginTop: '6px' }}>
                          <LabResultBadge result={existingTest.result} />
                        </div>
                      </div>
                    </div>

                    {existingTest.remarks && (
                      <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-muted)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Laboratory Remarks: </span>
                        <span style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>{existingTest.remarks}</span>
                      </div>
                    )}

                    <div style={{ paddingTop: 'var(--space-2)' }}>
                      <Link to="/lab/tests/pending" style={{ textDecoration: 'none' }}>
                        <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                          ← Back to Pending Tests
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ) : (
                /* Active Lab Form */
                <Card padding>
                  <h3 style={{ margin: '0 0 var(--space-4) 0', fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
                    🧪 Laboratory Purity Analysis Form
                  </h3>
                  <LabTestForm
                    onSubmit={handleSubmitTest}
                    loading={loading}
                    batchId={batchId}
                    initialResult={batch?.status && ['PURE', 'UNDER_REVIEW', 'FAILED'].includes(batch.status) ? batch.status : null}
                  />
                </Card>
              )}
            </div>

            {/* Side Column: Laboratory Standards Reference */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="hc-lab-standards-box">
                <h3 className="hc-lab-standards-title">
                  <span>🔬</span> FSSAI Honey Purity Standards
                </h3>
                <ul className="hc-lab-standards-list">
                  <li className="hc-lab-standards-item">
                    <span>Moisture Content</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>≤ 20.0%</strong>
                  </li>
                  <li className="hc-lab-standards-item">
                    <span>Reducing Sugars</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>≥ 65.0%</strong>
                  </li>
                  <li className="hc-lab-standards-item">
                    <span>Sucrose By Mass</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>≤ 5.0%</strong>
                  </li>
                  <li className="hc-lab-standards-item">
                    <span>HMF (Hydroxymethylfurfural)</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>≤ 80 mg/kg</strong>
                  </li>
                  <li className="hc-lab-standards-item">
                    <span>C4 Sugar Ratio (NMR/Isotope)</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>≤ 7.0%</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </LabLayout>
  )
}

export default LabTestDetailsPage
