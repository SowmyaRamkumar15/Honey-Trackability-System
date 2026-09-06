import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import BatchCard from '../components/BatchCard'
import OfflineBatchIndicator from '../components/OfflineBatchIndicator'
import PageHeader from '../../../components/layout/PageHeader'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import EmptyState from '../../../components/ui/EmptyState'
import Button from '../../../components/ui/Button'
import VoiceButton from '../../../components/common/VoiceButton'
import { useBatches } from '../hooks/useBatches'
import useBatchSync from '../hooks/useBatchSync'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/batch.css'

export const BatchListPage = () => {
  const {
    batches = [],
    stats = { total: 0, created: 0, sentForTesting: 0 },
    pageInfo = { totalPages: 1, isLast: true },
    loading,
    error,
    fetchBatches,
    fetchStats,
    clearError,
  } = useBatches()

  const { localDrafts = [] } = useBatchSync()
  const { t } = useLanguage()
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    fetchBatches({ status: statusFilter || undefined, page: currentPage, size: 12 })
    if (fetchStats) {
      fetchStats()
    }
  }, [statusFilter, currentPage, fetchBatches, fetchStats])

  const safeDrafts = Array.isArray(localDrafts) ? localDrafts : []
  const safeBatches = Array.isArray(batches) ? batches : []
  const combinedBatches = [...safeDrafts, ...safeBatches]

  const totalBatchesCount = (stats?.total || 0) + safeDrafts.length
  const createdCount = stats?.created || 0
  const sentTestingCount = stats?.sentForTesting || 0

  const filterOptions = [
    { label: 'All Batches', value: '' },
    { label: 'Created', value: 'CREATED' },
    { label: 'Sent for Testing', value: 'SENT_FOR_TESTING' },
    { label: 'Certified PURE', value: 'PURE' },
    { label: 'In Stock', value: 'IN_STOCK' },
  ]

  return (
    <BeekeeperLayout>
      <div className="hc-batch-page">
        {/* Page Header */}
        <PageHeader
          title={t('navigation.myBatches', 'My Batches')}
          subtitle={t('batch.myBatchesSub', 'Track raw honey harvests, lab testing certificates, and tamper-proof blockchain passports.')}
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <VoiceButton translationKey="batch.myBatchesSub" fallbackText="Track your raw honey harvests, lab quality verification, and tamper-proof blockchain passports." size="sm" />
              <OfflineBatchIndicator />
              <Link to="/beekeeper/batches/new">
                <Button id="new-batch-btn" variant="primary">
                  <span>+ New Harvest Batch</span>
                </Button>
              </Link>
            </div>
          }
        />

        {/* Stats Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          <div className="hc-stat-pill">
            <span className="hc-stat-pill__label">Total Recorded</span>
            <div className="hc-stat-pill__val">{totalBatchesCount}</div>
          </div>
          <div className="hc-stat-pill">
            <span className="hc-stat-pill__label" style={{ color: 'var(--primary)' }}>Logged in Apiary</span>
            <div className="hc-stat-pill__val">{createdCount}</div>
          </div>
          <div className="hc-stat-pill">
            <span className="hc-stat-pill__label" style={{ color: 'var(--info)' }}>Under Lab Review</span>
            <div className="hc-stat-pill__val">{sentTestingCount}</div>
          </div>
          <div className="hc-stat-pill">
            <span className="hc-stat-pill__label" style={{ color: 'var(--success)' }}>Offline Queued</span>
            <div className="hc-stat-pill__val">{safeDrafts.length}</div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '12px 16px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--text-secondary)' }}>Status:</span>
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={`hc-btn hc-btn--xs ${statusFilter === opt.value ? 'hc-btn--primary' : 'hc-btn--secondary'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Showing {combinedBatches.length} batches
          </span>
        </div>

        {error && <Alert type="error" message={error} onClose={clearError} />}

        {/* Batch Cards Grid */}
        {loading && combinedBatches.length === 0 ? (
          <LoadingSpinner text="Retrieving harvest batches..." />
        ) : combinedBatches.length === 0 ? (
          <EmptyState
            icon="🍯"
            title="No harvest batches found"
            description="Log your first honey harvest batch to generate on-chain verification passports."
            action={
              <Link to="/beekeeper/batches/new">
                <Button variant="primary">+ Log Harvest Batch</Button>
              </Link>
            }
          />
        ) : (
          <div className="hc-batch-grid">
            {combinedBatches.map((batch, index) => (
              <BatchCard key={batch.batchId || batch.localId || index} batch={batch} />
            ))}
          </div>
        )}
      </div>
    </BeekeeperLayout>
  )
}

export default BatchListPage
