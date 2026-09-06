import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LabLayout from '../../../layouts/LabLayout'
import labApi from '../api/labApi'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import PageHeader from '../../../components/layout/PageHeader'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/lab.css'

export const LabTestHistoryPage = () => {
  const { t } = useLanguage()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await labApi.getLabStats()
      setStats(res.data?.data || null)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load laboratory history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  return (
    <LabLayout>
      <div className="hc-lab-page">
        {/* Page Header */}
        <PageHeader
          title="Laboratory Test History & Certificates"
          subtitle="Audit log of completed honey batch analysis, quality purity ratings, and issued certificates."
          actions={
            <Link to="/lab/tests/pending" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="sm">
                🧪 Pending Queue →
              </Button>
            </Link>
          }
        />

        {error && <Alert type="danger" title="Error" onClose={() => setError(null)}>{error}</Alert>}

        {loading ? (
          <LoadingSpinner message="Loading laboratory test history..." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Overview Summary Cards */}
            <div className="hc-lab-stats-grid">
              <div className="hc-lab-metric-card">
                <div className="hc-lab-metric-header">
                  <span className="hc-lab-metric-label">Total Tested</span>
                  <div className="hc-lab-metric-icon">📊</div>
                </div>
                <div className="hc-lab-metric-value">{stats?.totalCompleted || stats?.totalTested || 0}</div>
                <div className="hc-lab-metric-subtext">Completed batches</div>
              </div>

              <div className="hc-lab-metric-card">
                <div className="hc-lab-metric-header">
                  <span className="hc-lab-metric-label">Certified Pure</span>
                  <div className="hc-lab-metric-icon">✅</div>
                </div>
                <div className="hc-lab-metric-value" style={{ color: 'var(--success)' }}>
                  {stats?.pureCount || stats?.pureBatches || 0}
                </div>
                <div className="hc-lab-metric-subtext">Purity verified</div>
              </div>

              <div className="hc-lab-metric-card">
                <div className="hc-lab-metric-header">
                  <span className="hc-lab-metric-label">Under Review</span>
                  <div className="hc-lab-metric-icon">⚠️</div>
                </div>
                <div className="hc-lab-metric-value" style={{ color: 'var(--warning)' }}>
                  {stats?.underReviewCount || 0}
                </div>
                <div className="hc-lab-metric-subtext">Secondary audit</div>
              </div>

              <div className="hc-lab-metric-card">
                <div className="hc-lab-metric-header">
                  <span className="hc-lab-metric-label">Failed Tests</span>
                  <div className="hc-lab-metric-icon">❌</div>
                </div>
                <div className="hc-lab-metric-value" style={{ color: 'var(--danger)' }}>
                  {stats?.failedCount || 0}
                </div>
                <div className="hc-lab-metric-subtext">Rejected batches</div>
              </div>

              <div className="hc-lab-metric-card">
                <div className="hc-lab-metric-header">
                  <span className="hc-lab-metric-label">Certificates Issued</span>
                  <div className="hc-lab-metric-icon">📜</div>
                </div>
                <div className="hc-lab-metric-value" style={{ color: 'var(--primary)' }}>
                  {stats?.certificatesIssued || stats?.pureCount || 0}
                </div>
                <div className="hc-lab-metric-subtext">Issued & signed</div>
              </div>
            </div>

            {/* Info Card */}
            <Card padding>
              <h3 style={{ margin: '0 0 var(--space-3) 0', fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
                Laboratory Ledger & Verification Record
              </h3>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <p style={{ margin: 0 }}>
                  Every laboratory analysis performed in this portal is signed and immutably written to the HoneyChain blockchain. Consumers and retailers can independently verify the test results using public QR codes on honey jars.
                </p>
                <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  <Link to="/lab/tests/pending" style={{ textDecoration: 'none' }}>
                    <Button variant="primary" size="sm">
                      Inspect Pending Batches
                    </Button>
                  </Link>
                  <Link to="/lab/dashboard" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary" size="sm">
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </LabLayout>
  )
}

export default LabTestHistoryPage
