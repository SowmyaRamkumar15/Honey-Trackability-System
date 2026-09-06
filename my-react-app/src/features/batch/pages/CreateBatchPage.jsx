import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import BatchForm from '../components/BatchForm'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import BatchStatusBadge from '../components/BatchStatusBadge'
import SyncStatusBadge from '../components/SyncStatusBadge'
import OfflineBatchIndicator from '../components/OfflineBatchIndicator'
import VoiceButton from '../../../components/common/VoiceButton'
import { useBatches } from '../hooks/useBatches'
import useNetworkStatus from '../hooks/useNetworkStatus'
import { useLanguage } from '../../../i18n/LanguageContext'
import hiveApi from '../../hive/api/hiveApi'
import { cacheHives, getCachedHives } from '../services/offlineBatchStore'
import '../styles/batch.css'

export const CreateBatchPage = () => {
  const { createBatchOfflineAware, loading, error, clearError } = useBatches()
  const { isOnline } = useNetworkStatus()
  const { t } = useLanguage()

  const [hives, setHives] = useState([])
  const [loadingHives, setLoadingHives] = useState(true)
  const [hiveFetchError, setHiveFetchError] = useState(null)
  const [createdResult, setCreatedResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadHives = async () => {
      setLoadingHives(true)
      setHiveFetchError(null)

      try {
        if (navigator.onLine) {
          const res = await hiveApi.getHives()
          const liveHives = res.data.data || []
          setHives(liveHives)
          await cacheHives(liveHives)
        } else {
          const cached = await getCachedHives()
          setHives(cached.map((h) => ({ id: h.hiveId, hiveCode: h.hiveCode, clusterName: h.clusterName, status: h.status })))
        }
      } catch (err) {
        try {
          const cached = await getCachedHives()
          if (cached.length > 0) {
            setHives(cached.map((h) => ({ id: h.hiveId, hiveCode: h.hiveCode, clusterName: h.clusterName, status: h.status })))
          } else {
            setHiveFetchError('Offline: No cached hive data found. Please connect to internet once.')
          }
        } catch {
          setHiveFetchError('Failed to load hives.')
        }
      } finally {
        setLoadingHives(false)
      }
    }

    loadHives()
  }, [])

  const handleCreate = async (formData) => {
    setSubmitting(true)

    let selectedHiveId = null
    if (formData instanceof FormData) {
      selectedHiveId = Number(formData.get('hiveId'))
    } else {
      selectedHiveId = Number(formData.hiveId)
    }

    const hiveObj = hives.find((h) => h.id === selectedHiveId)
    const hiveInfo = {
      hiveCode: hiveObj?.hiveCode || `Hive #${selectedHiveId}`,
      clusterName: hiveObj?.clusterName || 'Apiary',
    }

    const result = await createBatchOfflineAware(formData, hiveInfo)
    setSubmitting(false)

    if (result.success) {
      setCreatedResult({
        offline: result.offline,
        payload: result.payload,
        localId: result.localId,
      })
    }
  }

  return (
    <BeekeeperLayout>
      <div className="hc-batch-page">
        {/* Header & Network Indicator */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            <Link to="/beekeeper/batches" style={{ color: 'var(--primary)', fontWeight: 'var(--font-semibold)', textDecoration: 'none' }}>
              {t('navigation.myBatches', 'My Honey Batches')}
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-bold)' }}>{t('dashboard.newBatch', 'New Batch')}</span>
          </nav>
          <OfflineBatchIndicator />
        </div>

        {/* Title + Read Aloud Voice Button */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span>🐝</span> {t('batch.createTitle', 'Log New Honey Harvest')}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px', margin: 0 }}>
              {t('batch.createSub', 'Register a fresh harvest from one of your active hives.')}
            </p>
          </div>
          <VoiceButton translationKey="batch.createSub" size="sm" />
        </div>

        {error && <Alert type="error" message={error} onClose={clearError} />}
        {hiveFetchError && <Alert type="error" message={hiveFetchError} />}

        {/* Success Confirmation Card (Online vs Offline) */}
        {createdResult ? (
          createdResult.offline ? (
            /* 🟡 OFFLINE SUCCESS CARD */
            <Card className="hc-result-card" style={{ border: '1px solid var(--warning-border)', backgroundColor: 'var(--warning-soft)' }}>
              <div className="hc-result-icon hc-result-icon--offline">
                💾
              </div>

              <div>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: 0 }}>
                  ✅ {t('success.batchCreated', 'Saved Offline')}
                </h2>
                <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'center' }}>
                  <VoiceButton translationKey="success.batchCreated" size="xs" />
                </div>
              </div>

              <div className="hc-result-meta-box">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)' }}>Local Reference:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)', color: 'var(--primary-dark)' }}>
                    {createdResult.localId || createdResult.payload.batchId}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)' }}>{t('common.status', 'Status')}:</span>
                  <SyncStatusBadge status="PENDING" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)' }}>{t('batch.quantityKg', 'Quantity')}:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)' }}>
                    {createdResult.payload.quantityKg} {t('units.kg', 'kg')}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)' }}>{t('hive.hiveCode', 'Hive')}:</span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                    {createdResult.payload.hiveCode}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', paddingTop: 'var(--space-2)' }}>
                <Link to="/beekeeper/batches" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" style={{ fontWeight: 'var(--font-bold)' }}>
                    {t('dashboard.viewBatches', 'View My Batches')} →
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setCreatedResult(null)}
                >
                  + {t('dashboard.newHarvest', 'Create Another Batch')}
                </Button>
              </div>
            </Card>
          ) : (
            /* 🟢 ONLINE SUCCESS CARD */
            <Card className="hc-result-card" style={{ border: '1px solid var(--success-border)', backgroundColor: 'var(--success-soft)' }}>
              <div className="hc-result-icon hc-result-icon--success">
                ✓
              </div>

              <div>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: 0 }}>
                  {t('success.batchCreated', 'Batch Created Successfully!')}
                </h2>
                <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'center' }}>
                  <VoiceButton translationKey="success.batchCreated" size="xs" />
                </div>
              </div>

              <div className="hc-result-meta-box">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)' }}>{t('batch.batchId', 'Batch ID')}:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)', color: 'var(--primary-dark)' }}>
                    {createdResult.payload.batchId}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)' }}>{t('common.status', 'Status')}:</span>
                  <BatchStatusBadge status={createdResult.payload.status} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)' }}>{t('batch.quantityKg', 'Quantity')}:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)' }}>
                    {createdResult.payload.quantityKg} {t('units.kg', 'kg')}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', paddingTop: 'var(--space-2)' }}>
                <Link
                  to={`/beekeeper/batches/${createdResult.payload.batchId}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="primary" style={{ fontWeight: 'var(--font-bold)' }}>
                    {t('common.viewDetails', 'View Details')} →
                  </Button>
                </Link>
                <Link to="/beekeeper/batches" style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" style={{ fontWeight: 'var(--font-semibold)' }}>
                    {t('navigation.myBatches', 'Back to My Batches')}
                  </Button>
                </Link>
              </div>
            </Card>
          )
        ) : loadingHives ? (
          <LoadingSpinner text={t('loading.loading', 'Loading your active hives...')} />
        ) : hives.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: 'var(--space-8)', maxWidth: '520px', marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'center' }}>
            <div style={{ fontSize: '3rem' }}>🐝</div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: 0 }}>{t('hive.noHives', 'No Hives Registered')}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', maxWidth: '380px', margin: 0 }}>
              {t('validation.selectHive', 'You must register at least one hive before creating a honey batch.')}
            </p>
            <Link to="/hives" style={{ textDecoration: 'none', marginTop: 'var(--space-2)' }}>
              <Button variant="primary" style={{ fontWeight: 'var(--font-bold)' }}>{t('navigation.myHives', 'Go to My Hives')}</Button>
            </Link>
          </Card>
        ) : (
          <div className="hc-batch-layout-grid">
            {/* Main Form Column */}
            <div>
              <Card style={{ padding: 'var(--space-6)' }}>
                {!isOnline && (
                  <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--warning-soft)', border: '1px solid var(--warning-border)', color: 'var(--warning)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)' }}>
                    <span>🔴 <strong>Offline Mode:</strong> Form submissions will be saved locally and synced automatically when internet returns.</span>
                  </div>
                )}
                <BatchForm
                  hives={hives}
                  onSubmit={handleCreate}
                  loading={loading || submitting}
                  onCancel={() => navigate('/beekeeper/batches')}
                  submitLabel={isOnline ? t('batch.submitBatch', 'Create Harvest Batch →') : t('batch.submitBatch', 'Save Batch Offline 💾')}
                />
              </Card>
            </div>

            {/* Sidebar Guidance & Standards Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <Card style={{ padding: 'var(--space-5)', border: '1px solid var(--primary-light)', backgroundColor: 'var(--primary-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontSize: '1.25rem' }}>📋</span>
                  <h3 style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', margin: 0 }}>Harvest Protocol Guidelines</h3>
                </div>
                <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: 'var(--space-4)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <li>Ensure honeycomb frames are at least 75% capped for optimal moisture content.</li>
                  <li>Record accurate harvest weights directly from apiary scales.</li>
                  <li>After creation, your batch will generate a unique cryptographic ID on HoneyChain.</li>
                  <li>Submit the batch for Laboratory Purity Testing to receive KVIC authenticity certification.</li>
                </ul>
              </Card>

              <Card style={{ padding: 'var(--space-5)', border: '1px solid var(--info-border)', backgroundColor: 'var(--info-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: '1.25rem' }}>🛡️</span>
                  <h3 style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', margin: 0 }}>Blockchain Verification</h3>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Every batch log is signed and stamped on-chain. Customers will scan your QR code to verify floral origin and apiary coordinates.
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </BeekeeperLayout>
  )
}

export default CreateBatchPage
