import React, { useState, useEffect } from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import BatchTable from '../components/BatchTable'
import Button from '../../../components/ui/Button'
import PageHeader from '../../../components/layout/PageHeader'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/admin.css'

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
      <div className="hc-admin-page">
        <PageHeader
          title={t('admin.batchMonitoring', 'Honey Batch Monitoring')}
          subtitle={t('admin.batchMonitoringSub', 'Monitor lab testing, blockchain certification, QR generation, and anti-counterfeit logs')}
        />

        {/* Filter Toolbar */}
        <div className="hc-admin-filter-bar">
          <form onSubmit={handleSearch} className="hc-admin-filter-group">
            <div className="hc-admin-search-wrap">
              <span className="hc-admin-search-icon">🔍</span>
              <input
                type="text"
                className="hc-admin-input"
                placeholder={t('admin.searchBatchPlaceholder', 'Search by Batch ID (e.g. HC-2026-AB12CD34)...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="hc-admin-select"
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

            <Button type="submit" variant="primary" size="sm">
              {t('common.submit', 'Filter')}
            </Button>

            {(searchQuery || statusFilter) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('')
                  loadBatches(0)
                }}
              >
                ✕ Reset
              </Button>
            )}
          </form>
        </div>

        {error && <Alert type="danger" title="Error">{error}</Alert>}

        {loading ? (
          <LoadingSpinner message={t('loading.batches', 'Loading honey batches...')} />
        ) : (
          <div className="hc-admin-table-container">
            <div className="hc-admin-table-header">
              <h3 className="hc-admin-table-title">
                🍯 Tracked Honey Batches
              </h3>
              <span className="hc-admin-table-count">
                {batches.length} batches logged
              </span>
            </div>

            <BatchTable batches={batches} />

            {totalPages > 1 && (
              <div className="hc-admin-pagination">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => loadBatches(page - 1)}
                >
                  ← {t('common.prev', 'Previous')}
                </Button>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => loadBatches(page + 1)}
                >
                  {t('common.next', 'Next')} →
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminBatchesPage
