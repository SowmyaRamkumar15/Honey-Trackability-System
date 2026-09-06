import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import LabLayout from '../../../layouts/LabLayout'
import PendingTestCard from '../components/PendingTestCard'
import Button from '../../../components/ui/Button'
import PageHeader from '../../../components/layout/PageHeader'
import EmptyState from '../../../components/ui/EmptyState'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import { useLabTests } from '../hooks/useLabTests'
import { useLanguage } from '../../../i18n/LanguageContext'
import VoiceButton from '../../../components/common/VoiceButton'
import '../styles/lab.css'

export const LabDashboardPage = () => {
  const { t } = useLanguage()
  const { pendingBatches, stats, loading, error, fetchPendingTests, fetchLabStats, clearError } =
    useLabTests()

  useEffect(() => {
    fetchPendingTests()
    fetchLabStats()
  }, [fetchPendingTests, fetchLabStats])

  const voiceInstructions = `${t('lab.dashboardTitle', 'Lab Testing Portal')}. ${t('lab.pendingTitle', 'Pending Purity Tests')}: ${stats.pending}. ${t('lab.pure', 'Pure Honey')}: ${stats.pure}.`

  return (
    <LabLayout>
      <div className="hc-lab-page">
        {/* Page Header */}
        <PageHeader
          title={t('lab.dashboardTitle', 'Laboratory Testing Dashboard')}
          subtitle={t('lab.pendingSub', 'Analyze incoming honey harvest batches, issue purity scores, and register immutable test results.')}
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <VoiceButton textToSpeak={voiceInstructions} size="sm" />
              <Link to="/lab/tests/pending">
                <Button variant="primary" size="sm">
                  View All Pending ({stats.pending}) →
                </Button>
              </Link>
            </div>
          }
        />

        {error && <Alert type="danger" message={error} onClose={clearError} />}

        {/* Stats Grid */}
        <div className="hc-lab-stats-grid">
          <div className="hc-lab-metric-card">
            <div className="hc-lab-metric-header">
              <span className="hc-lab-metric-label">Pending Tests</span>
              <div className="hc-lab-metric-icon">⏳</div>
            </div>
            <div className="hc-lab-metric-value" style={{ color: stats.pending > 0 ? 'var(--warning)' : 'var(--text-primary)' }}>
              {stats.pending}
            </div>
            <div className="hc-lab-metric-subtext">Awaiting chemical analysis</div>
          </div>

          <div className="hc-lab-metric-card">
            <div className="hc-lab-metric-header">
              <span className="hc-lab-metric-label">Completed</span>
              <div className="hc-lab-metric-icon">📊</div>
            </div>
            <div className="hc-lab-metric-value">{stats.completed}</div>
            <div className="hc-lab-metric-subtext">Total verified records</div>
          </div>

          <div className="hc-lab-metric-card">
            <div className="hc-lab-metric-header">
              <span className="hc-lab-metric-label">Pure Certified</span>
              <div className="hc-lab-metric-icon">✅</div>
            </div>
            <div className="hc-lab-metric-value" style={{ color: 'var(--success)' }}>
              {stats.pure}
            </div>
            <div className="hc-lab-metric-subtext">100% authentic honey</div>
          </div>

          <div className="hc-lab-metric-card">
            <div className="hc-lab-metric-header">
              <span className="hc-lab-metric-label">Under Review</span>
              <div className="hc-lab-metric-icon">⚠️</div>
            </div>
            <div className="hc-lab-metric-value" style={{ color: 'var(--warning)' }}>
              {stats.underReview}
            </div>
            <div className="hc-lab-metric-subtext">Secondary spectroscopy</div>
          </div>

          <div className="hc-lab-metric-card">
            <div className="hc-lab-metric-header">
              <span className="hc-lab-metric-label">Failed / Adulterated</span>
              <div className="hc-lab-metric-icon">❌</div>
            </div>
            <div className="hc-lab-metric-value" style={{ color: stats.failed > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
              {stats.failed}
            </div>
            <div className="hc-lab-metric-subtext">Rejected non-compliant</div>
          </div>
        </div>

        {/* Pending Batches Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingTop: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-3)' }}>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', margin: 0 }}>
              <span>🧪</span> Incoming Batches Awaiting Purity Analysis
            </h2>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {pendingBatches.length} batch{pendingBatches.length !== 1 ? 'es' : ''} in queue
            </span>
          </div>

          {loading && pendingBatches.length === 0 ? (
            <LoadingSpinner message="Loading pending honey batches..." />
          ) : pendingBatches.length === 0 ? (
            <EmptyState
              icon="✨"
              title="All Caught Up!"
              description="No honey batches are currently waiting for laboratory testing."
            />
          ) : (
            <div className="hc-lab-queue-grid">
              {pendingBatches.slice(0, 6).map((batch) => (
                <PendingTestCard key={batch.batchId} batch={batch} />
              ))}
            </div>
          )}
        </div>
      </div>
    </LabLayout>
  )
}

export default LabDashboardPage
