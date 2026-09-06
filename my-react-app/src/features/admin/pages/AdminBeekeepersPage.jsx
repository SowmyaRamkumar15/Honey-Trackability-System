import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import AdminLayout from '../../../layouts/AdminLayout'
import BeekeeperTable from '../components/BeekeeperTable'
import PageHeader from '../../../components/layout/PageHeader'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/admin.css'

export const AdminBeekeepersPage = () => {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialStatus = searchParams.get('status') || ''

  const [beekeepers, setBeekeepers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [updatingId, setUpdatingId] = useState(null)

  const loadBeekeepers = async (p = 0) => {
    setLoading(true)
    setError(null)
    try {
      const params = { page: p, size: 10 }
      if (statusFilter) params.status = statusFilter
      if (searchQuery.trim()) params.query = searchQuery.trim()
      const res = await adminApi.getBeekeepers(params)
      const data = res.data?.data
      setBeekeepers(data?.content || data || [])
      setTotalPages(data?.totalPages || 1)
      setPage(p)
    } catch (err) {
      setError(err?.response?.data?.message || t('errors.generic', 'Failed to load beekeepers list'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBeekeepers(0)
  }, [statusFilter])

  const handleSearch = (e) => {
    e.preventDefault()
    loadBeekeepers(0)
  }

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await adminApi.updateBeekeeperStatus(id, newStatus)
      await loadBeekeepers(page)
    } catch (err) {
      alert(err?.response?.data?.message || t('errors.generic', 'Failed to update status'))
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="hc-admin-page">
        <PageHeader
          title={t('admin.beekeeperGovernance', 'Beekeeper Governance')}
          subtitle={t('admin.beekeeperGovernanceSub', 'Review KVIC credentials, approve onboarding, and inspect honey apiaries.')}
        />

        {/* Filters */}
        <div className="hc-admin-filter-bar">
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', width: '100%' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <input
                type="text"
                className="hc-input"
                placeholder={t('admin.searchBeekeeperPlaceholder', 'Search by Beekeeper Name, KVIC ID, or Village...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', fontSize: 'var(--text-xs)' }}
              />
            </div>

            <div style={{ minWidth: '180px' }}>
              <select
                className="hc-input"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setSearchParams(e.target.value ? { status: e.target.value } : {})
                }}
                style={{ width: '100%', padding: '8px 12px', fontSize: 'var(--text-xs)' }}
              >
                <option value="">{t('common.allStatuses', 'All Statuses')}</option>
                <option value="PENDING">{t('profile.statusPending', 'PENDING Review')}</option>
                <option value="APPROVED">{t('profile.statusApproved', 'APPROVED')}</option>
                <option value="REJECTED">{t('profile.statusRejected', 'REJECTED')}</option>
              </select>
            </div>

            <button type="submit" className="hc-btn hc-btn--primary hc-btn--sm">
              🔍 {t('common.search', 'Filter')}
            </button>
          </form>
        </div>

        {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <LoadingSpinner text={t('loading.loading', 'Loading beekeepers...')} />
          </div>
        ) : (
          <>
            <BeekeeperTable
              beekeepers={beekeepers}
              onStatusUpdate={handleStatusUpdate}
              updatingId={updatingId}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={page === 0}
                    onClick={() => loadBeekeepers(page - 1)}
                    className="hc-btn hc-btn--secondary hc-btn--xs"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages - 1}
                    onClick={() => loadBeekeepers(page + 1)}
                    className="hc-btn hc-btn--secondary hc-btn--xs"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminBeekeepersPage
