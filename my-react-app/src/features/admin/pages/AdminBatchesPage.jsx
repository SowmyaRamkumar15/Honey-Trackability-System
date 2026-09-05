import React, { useState, useEffect } from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import AdminSidebar from '../components/AdminSidebar'
import BatchTable from '../components/BatchTable'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'
import { useLanguage } from '../../../i18n/LanguageContext'

export const AdminBatchesPage = () => {
  const { t } = useLanguage()
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const loadBatches = async (p = 0) => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminApi.getBatches({
        status: statusFilter || undefined,
        search: searchQuery || undefined,
        page: p,
        size: 20,
      })
      const data = res.data?.data
      setBatches(data?.content || [])
      setTotalPages(data?.totalPages || 0)
      setPage(p)
    } catch (err) {
      setError(err?.response?.data?.message || t('errors.generic', 'Failed to load batches'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBatches(0)
  }, [statusFilter])

  const handleSearch = (e) => {
    e.preventDefault()
    loadBatches(0)
  }

  return (
    <AdminLayout>
      <div className="container section">
        <div className="dashboard__header mb-6">
          <div>
            <h1 className="dashboard__title">🍯 {t('admin.batchMonitoring', 'Honey Batch Monitoring')}</h1>
            <p className="dashboard__subtitle">{t('admin.batchMonitoringSub', 'Monitor lab testing, blockchain certification, QR generation, and anti-counterfeit logs')}</p>
          </div>
        </div>

        <AdminSidebar />

        {/* Filter Card */}
        <div className="card mb-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-0 sm:min-w-60 w-full sm:w-auto">
              <input
                type="text"
                className="form-input"
                placeholder={t('admin.searchBatchPlaceholder', 'Search by Batch ID (e.g. HC-2026-AB12CD34)...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-52">
              <select
                className="form-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">{t('admin.allStatuses', 'All Statuses')}</option>
                <option value="PURE">{t('lab.pure', 'PURE')}</option>
                <option value="UNDER_REVIEW">{t('lab.underReview', 'UNDER_REVIEW')}</option>
                <option value="FAILED">{t('lab.failed', 'FAILED')}</option>
                <option value="SENT_FOR_TESTING">{t('batch.statusSentForTesting', 'SENT_FOR_TESTING')}</option>
                <option value="QR_GENERATED">{t('batch.statusQrGenerated', 'QR_GENERATED')}</option>
                <option value="IN_STOCK">IN_STOCK</option>
                <option value="SOLD">SOLD</option>
              </select>
            </div>

            <button type="submit" className="btn btn--primary btn--sm w-full sm:w-auto">
              {t('common.submit', 'Search')}
            </button>
            {(searchQuery || statusFilter) && (
              <button
                type="button"
                className="btn btn--ghost btn--sm w-full sm:w-auto"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('')
                }}
              >
                {t('common.cancel', 'Reset')}
              </button>
            )}
          </form>
        </div>

        {error && <Alert type="danger" message={error} />}

        {loading ? (
          <div className="py-12 text-center">
            <LoadingSpinner text={t('loading.loading', 'Loading batches...')} />
          </div>
        ) : (
          <>
            <BatchTable batches={batches} />

            {totalPages > 1 && (
              <div className="flex gap-2 justify-center mt-6">
                <button
                  className="btn btn--ghost btn--sm"
                  disabled={page === 0}
                  onClick={() => loadBatches(page - 1)}
                >
                  ← {t('common.back', 'Prev')}
                </button>
                <span className="text-secondary self-center text-sm">
                  {t('common.page', 'Page')} {page + 1} / {totalPages}
                </span>
                <button
                  className="btn btn--ghost btn--sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => loadBatches(page + 1)}
                >
                  {t('common.next', 'Next')} →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminBatchesPage
