import React, { useState, useEffect } from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import AdminSidebar from '../components/AdminSidebar'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'
import { useLanguage } from '../../../i18n/LanguageContext'

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
      <div className="container section">
        <div className="dashboard__header mb-6">
          <div>
            <h1 className="dashboard__title">🔬 {t('admin.navLabTests', 'Laboratory Testing Records')}</h1>
            <p className="dashboard__subtitle">{t('admin.labRecordsSub', 'Audited purity evaluations, chemical parameters, and certified honey pass rates')}</p>
          </div>
        </div>

        <AdminSidebar />

        {/* Top Purity Cards */}
        {purityStats && (
          <div className="kpi-grid mb-6">
            <div className="kpi-card">
              <div className="kpi-card__icon">🧪</div>
              <div className="kpi-card__content">
                <p className="kpi-card__label">{t('admin.totalTests', 'Total Tests')}</p>
                <h3 className="kpi-card__value">{purityStats.totalTests}</h3>
                <p className="kpi-card__subtext text-secondary text-xs">{t('admin.certifiedTestsLogged', 'Certified tests logged')}</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__icon">✅</div>
              <div className="kpi-card__content">
                <p className="kpi-card__label">{t('admin.passRate', 'Pass Rate')}</p>
                <h3 className="kpi-card__value text-success">{purityStats.passRate}%</h3>
                <p className="kpi-card__subtext text-secondary text-xs">{purityStats.pureCount} {t('lab.pure', 'Pure')} {t('navigation.batches', 'batches')}</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__icon">⭐</div>
              <div className="kpi-card__content">
                <p className="kpi-card__label">{t('admin.avgPurityScore', 'Average Purity Score')}</p>
                <h3 className="kpi-card__value text-gold">{purityStats.averagePurityScore}%</h3>
                <p className="kpi-card__subtext text-secondary text-xs">{t('admin.acrossAllBatches', 'Across all lab tested batches')}</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__icon">⚠️</div>
              <div className="kpi-card__content">
                <p className="kpi-card__label">{t('admin.failedUnderReview', 'Failed / Under Review')}</p>
                <h3 className="kpi-card__value text-danger">{purityStats.failedCount + purityStats.underReviewCount}</h3>
                <p className="kpi-card__subtext text-secondary text-xs">{purityStats.failedCount} {t('lab.failed', 'Failed')} • {purityStats.underReviewCount} {t('lab.underReview', 'Review')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="card mb-6">
          <div className="flex gap-4 items-center">
            <label className="text-sm font-semibold">{t('admin.filterByResult', 'Filter by Result:')}</label>
            <select
              className="form-input w-48"
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
            >
              <option value="">{t('admin.allResults', 'All Results')}</option>
              <option value="PURE">{t('lab.pure', 'PURE')}</option>
              <option value="UNDER_REVIEW">{t('lab.underReview', 'UNDER_REVIEW')}</option>
              <option value="FAILED">{t('lab.failed', 'FAILED')}</option>
            </select>
          </div>
        </div>

        {error && <Alert type="danger" message={error} />}

        {loading ? (
          <div className="py-12 text-center">
            <LoadingSpinner text={t('loading.loading', 'Loading laboratory tests...')} />
          </div>
        ) : (
          <div className="overflow-x-auto card p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('batch.batchId', 'Batch ID')}</th>
                  <th>{t('auth.beekeeperRole', 'Beekeeper')}</th>
                  <th>{t('lab.testingFacility', 'Testing Facility')}</th>
                  <th>{t('lab.purityScore', 'Purity Score')}</th>
                  <th>{t('lab.testResult', 'Test Outcome')}</th>
                  <th>{t('lab.testedAt', 'Date Tested')}</th>
                </tr>
              </thead>
              <tbody>
                {labTests.map((t) => (
                  <tr key={t.id || t.batchId}>
                    <td><code>{t.batchId}</code></td>
                    <td>{t.beekeeperName || 'N/A'}</td>
                    <td>{t.labName}</td>
                    <td>
                      <strong className={t.purityScore >= 80 ? 'text-success' : 'text-danger'}>
                        {t.purityScore}%
                      </strong>
                    </td>
                    <td>
                      <span className={`badge badge--${t.result === 'PURE' ? 'success' : t.result === 'FAILED' ? 'danger' : 'warning'}`}>
                        {t.result}
                      </span>
                    </td>
                    <td>
                      <span className="text-secondary text-xs">
                        {t.testDate ? new Date(t.testDate).toLocaleDateString('en-IN') : 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminLabPage
