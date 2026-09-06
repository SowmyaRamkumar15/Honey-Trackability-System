import React, { useState, useEffect } from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import PageHeader from '../../../components/layout/PageHeader'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/admin.css'

export const AdminLabPage = () => {
  const { t } = useLanguage()
  const [labTests, setLabTests] = useState([])
  const [purityStats, setPurityStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [resultFilter, setResultFilter] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const loadData = async (p = 0) => {
    setLoading(true)
    setError(null)
    try {
      const [testsRes, purityRes] = await Promise.all([
        adminApi.getLabTests({ result: resultFilter || undefined, page: p, size: 20 }),
        adminApi.getPurityAnalytics(),
      ])
      const data = testsRes.data?.data
      setLabTests(data?.content || [])
      setTotalPages(data?.totalPages || 0)
      setPurityStats(purityRes.data?.data)
      setPage(p)
    } catch (err) {
      setError(err?.response?.data?.message || t('errors.generic', 'Failed to load laboratory records'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(0)
  }, [resultFilter])

  return (
    <AdminLayout>
      <div className="hc-admin-page">
        <PageHeader
          title={t('admin.navLabTests', 'Laboratory Testing Records')}
          subtitle={t('admin.labRecordsSub', 'Audited purity evaluations, chemical parameters, and certified honey pass rates')}
        />

        {/* Top Purity Metrics */}
        {purityStats && (
          <div className="hc-admin-stats-grid">
            <div className="hc-admin-metric-card">
              <div className="hc-admin-metric-header">
                <span className="hc-admin-metric-label">{t('admin.totalTests', 'Total Tests')}</span>
                <div className="hc-admin-metric-icon">🧪</div>
              </div>
              <div className="hc-admin-metric-value">{purityStats.totalTests}</div>
              <div className="hc-admin-metric-subtext">{t('admin.certifiedTestsLogged', 'Certified lab tests logged')}</div>
            </div>

            <div className="hc-admin-metric-card">
              <div className="hc-admin-metric-header">
                <span className="hc-admin-metric-label">{t('admin.passRate', 'Pass Rate')}</span>
                <div className="hc-admin-metric-icon">✅</div>
              </div>
              <div className="hc-admin-metric-value" style={{ color: 'var(--success)' }}>
                {purityStats.passRate}%
              </div>
              <div className="hc-admin-metric-subtext">{purityStats.pureCount} Pure batches verified</div>
            </div>

            <div className="hc-admin-metric-card">
              <div className="hc-admin-metric-header">
                <span className="hc-admin-metric-label">{t('admin.avgPurityScore', 'Avg Purity')}</span>
                <div className="hc-admin-metric-icon">⭐</div>
              </div>
              <div className="hc-admin-metric-value" style={{ color: 'var(--primary)' }}>
                {purityStats.averagePurityScore}%
              </div>
              <div className="hc-admin-metric-subtext">{t('admin.acrossAllBatches', 'Across all certified batches')}</div>
            </div>

            <div className="hc-admin-metric-card">
              <div className="hc-admin-metric-header">
                <span className="hc-admin-metric-label">{t('admin.failedUnderReview', 'Under Review / Flagged')}</span>
                <div className="hc-admin-metric-icon">⚠️</div>
              </div>
              <div className="hc-admin-metric-value" style={{ color: purityStats.failedCount > 0 ? 'var(--danger)' : 'var(--warning)' }}>
                {purityStats.failedCount + purityStats.underReviewCount}
              </div>
              <div className="hc-admin-metric-subtext">{purityStats.failedCount} Failed • {purityStats.underReviewCount} Review</div>
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="hc-admin-filter-bar">
          <div className="hc-admin-filter-group">
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Filter by Lab Status:
            </span>
            <div className="hc-admin-filter-pills">
              {['', 'PURE', 'UNDER_REVIEW', 'FAILED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setResultFilter(st)}
                  className={`hc-admin-filter-pill ${resultFilter === st ? 'hc-admin-filter-pill--active' : ''}`}
                >
                  {st === '' ? 'All Results' : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <Alert type="danger" title="Error">{error}</Alert>}

        {loading ? (
          <LoadingSpinner message={t('loading.loading', 'Loading laboratory testing records...')} />
        ) : (
          <div className="hc-admin-table-container">
            <div className="hc-admin-table-header">
              <h3 className="hc-admin-table-title">
                🔬 Audited Lab Test Certificates
              </h3>
              <span className="hc-admin-table-count">
                {labTests.length} tests displayed
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="hc-table" style={{ width: '100%', margin: 0 }}>
                <thead>
                  <tr>
                    <th>Batch ID</th>
                    <th>Lab Analyst / Facility</th>
                    <th>Purity Score</th>
                    <th>Result Status</th>
                    <th>Certificate</th>
                    <th>Tested On</th>
                  </tr>
                </thead>
                <tbody>
                  {labTests.map((test) => (
                    <tr key={test.id || test.batchId}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-dark)', fontSize: 'var(--text-xs)' }}>
                        {test.batchId}
                      </td>
                      <td>
                        <strong style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 600 }}>{test.analystName || 'Accredited Lab'}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{test.labLocation || 'State Honey Testing Lab'}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 'var(--text-sm)' }}>
                            {test.purityScore}%
                          </span>
                          <div style={{ width: '60px', height: '6px', background: 'var(--bg-muted)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${Math.min(test.purityScore || 0, 100)}%`,
                                height: '100%',
                                background: test.purityScore >= 90 ? 'var(--success)' : test.purityScore >= 75 ? 'var(--warning)' : 'var(--danger)',
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge
                          variant={test.result === 'PURE' ? 'success' : test.result === 'FAILED' ? 'danger' : 'warning'}
                          size="sm"
                        >
                          {test.result}
                        </Badge>
                      </td>
                      <td>
                        {test.certificateUrl ? (
                          <a
                            href={test.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: 'var(--primary)',
                              fontWeight: 700,
                              fontSize: 'var(--text-xs)',
                              textDecoration: 'none',
                              padding: '4px 8px',
                              background: 'var(--primary-soft)',
                              borderRadius: 'var(--radius-md)',
                            }}
                          >
                            📄 View PDF
                          </a>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>—</span>
                        )}
                      </td>
                      <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                        {test.testedAt ? new Date(test.testedAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                    </tr>
                  ))}
                  {labTests.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
                        No lab testing records match this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="hc-admin-pagination">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => loadData(page - 1)}
                >
                  ← Previous
                </Button>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => loadData(page + 1)}
                >
                  Next →
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminLabPage
