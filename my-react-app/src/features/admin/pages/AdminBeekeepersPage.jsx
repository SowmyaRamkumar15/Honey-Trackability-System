import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import AdminLayout from '../../../layouts/AdminLayout'
import AdminSidebar from '../components/AdminSidebar'
import BeekeeperTable from '../components/BeekeeperTable'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'
import { useLanguage } from '../../../i18n/LanguageContext'

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
      const res = await adminApi.getBeekeepers({
        status: statusFilter || undefined,
        search: searchQuery || undefined,
        page: p,
        size: 20,
      })
      const data = res.data?.data
      setBeekeepers(data?.content || [])
      setTotalPages(data?.totalPages || 0)
      setPage(p)
    } catch (err) {
      setError(err?.response?.data?.message || t('errors.generic', 'Failed to load beekeepers'))
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
    if (!window.confirm(t('dialog.confirmTitle', 'Are you sure?'))) return

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
      <div className="container section">
        <div className="dashboard__header mb-6">
          <div>
            <h1 className="dashboard__title">🧑‍🌾 {t('admin.beekeeperGovernance', 'Beekeeper Governance')}</h1>
            <p className="dashboard__subtitle">{t('admin.beekeeperGovernanceSub', 'Review KVIC credentials, approve onboarding, and inspect honey apiaries')}</p>
          </div>
        </div>

        <AdminSidebar />

        {/* Filters */}
        <div className="card mb-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[240px]">
              <input
                type="text"
                className="form-input"
                placeholder={t('admin.searchBeekeeperPlaceholder', 'Search by Beekeeper Name, KVIC ID, or Village...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="w-48">
              <select
                className="form-input"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setSearchParams(e.target.value ? { status: e.target.value } : {})
                }}
              >
                <option value="">{t('admin.allStatuses', 'All Statuses')}</option>
                <option value="PENDING">{t('profile.statusPending', 'PENDING')}</option>
                <option value="APPROVED">{t('profile.statusApproved', 'APPROVED')}</option>
                <option value="REJECTED">{t('profile.statusRejected', 'REJECTED')}</option>
              </select>
            </div>

            <button type="submit" className="btn btn--primary btn--sm">
              {t('common.submit', 'Search')}
            </button>
            {(searchQuery || statusFilter) && (
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('')
                  setSearchParams({})
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
            <LoadingSpinner text={t('loading.loading', 'Loading beekeepers...')} />
          </div>
        ) : (
          <>
            <BeekeeperTable
              beekeepers={beekeepers}
              onStatusUpdate={handleStatusUpdate}
              updatingId={updatingId}
            />

            {totalPages > 1 && (
              <div className="flex gap-2 justify-center mt-6">
                <button
                  className="btn btn--ghost btn--sm"
                  disabled={page === 0}
                  onClick={() => loadBeekeepers(page - 1)}
                >
                  ← {t('common.back', 'Prev')}
                </button>
                <span className="text-secondary" style={{ alignSelf: 'center' }}>
                  {t('common.page', 'Page')} {page + 1} / {totalPages}
                </span>
                <button
                  className="btn btn--ghost btn--sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => loadBeekeepers(page + 1)}
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

export default AdminBeekeepersPage
