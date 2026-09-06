import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LabLayout from '../../../layouts/LabLayout'
import PendingTestCard from '../components/PendingTestCard'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import PageHeader from '../../../components/layout/PageHeader'
import VoiceButton from '../../../components/common/VoiceButton'
import { useLabTests } from '../hooks/useLabTests'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/lab.css'

export const PendingTestsPage = () => {
  const { pendingBatches, loading, error, fetchPendingTests, clearError } = useLabTests()
  const { t } = useLanguage()
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchPendingTests()
  }, [fetchPendingTests])

  const filtered = pendingBatches.filter(
    (b) =>
      b.batchId?.toLowerCase().includes(search.toLowerCase()) ||
      b.beekeeperName?.toLowerCase().includes(search.toLowerCase()) ||
      b.village?.toLowerCase().includes(search.toLowerCase()) ||
      b.hiveCode?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <LabLayout>
      <div className="hc-lab-page">
        {/* Header */}
        <PageHeader
          title={t('lab.pendingTitle', 'Pending Laboratory Queue')}
          subtitle={t('lab.pendingSub', 'Honey batches submitted by beekeepers awaiting lab certificate verification')}
          actions={<VoiceButton translationKey="lab.pendingSub" size="sm" />}
        />

        {/* Filter Toolbar */}
        <div className="hc-lab-filter-bar">
          <div className="hc-lab-search-input-wrap">
            <span className="hc-lab-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by Batch ID, Beekeeper, or Hive..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSearch('')}
              >
                ✕ Clear
              </Button>
            )}
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Showing <strong>{filtered.length}</strong> of <strong>{pendingBatches.length}</strong> pending tests
            </span>
          </div>
        </div>

        {error && <Alert type="danger" title="Error" onClose={clearError}>{error}</Alert>}

        {loading && pendingBatches.length === 0 ? (
          <LoadingSpinner message={t('loading.loading', 'Loading pending lab tests...')} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🍯"
            title={t('empty.noTests', 'No Batches Awaiting Testing')}
            description={t('empty.noData', 'All submitted batches have been analyzed and certified.')}
          />
        ) : (
          <div className="hc-lab-queue-grid">
            {filtered.map((batch) => (
              <PendingTestCard key={batch.batchId} batch={batch} />
            ))}
          </div>
        )}
      </div>
    </LabLayout>
  )
}

export default PendingTestsPage
