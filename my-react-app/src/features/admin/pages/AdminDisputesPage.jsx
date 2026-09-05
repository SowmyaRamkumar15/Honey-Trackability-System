import React, { useState, useEffect } from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import AdminSidebar from '../components/AdminSidebar'
import DisputeTable from '../components/DisputeTable'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'
import { useLanguage } from '../../../i18n/LanguageContext'

export const AdminDisputesPage = () => {
  const { t } = useLanguage()
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Dispute Management Modal / Selected dispute
  const [selectedDispute, setSelectedDispute] = useState(null)
  const [newStatus, setNewStatus] = useState('INVESTIGATING')
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [updating, setUpdating] = useState(false)

  const loadDisputes = async (p = 0) => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminApi.getDisputes({
        status: statusFilter || undefined,
        page: p,
        size: 20,
      })
      const data = res.data?.data
      setDisputes(data?.content || [])
      setTotalPages(data?.totalPages || 0)
      setPage(p)
    } catch (err) {
      setError(err?.response?.data?.message || t('errors.generic', 'Failed to load customer disputes'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDisputes(0)
  }, [statusFilter])

  const handleUpdateStatus = async (e) => {
    e.preventDefault()
    if (!selectedDispute) return

    setUpdating(true)
    try {
      await adminApi.updateDisputeStatus(selectedDispute.id, {
        status: newStatus,
        resolutionNotes: resolutionNotes || undefined,
      })
      setSelectedDispute(null)
      setResolutionNotes('')
      await loadDisputes(page)
    } catch (err) {
      alert(err?.response?.data?.message || t('errors.generic', 'Failed to update dispute status'))
    } finally {
      setUpdating(false)
    }
  }

  return (
    <AdminLayout>
      <div className="container section">
        <div className="dashboard__header mb-6">
          <div>
            <h1 className="dashboard__title">⚖️ {t('admin.disputesTitle', 'Consumer Authenticity Disputes')}</h1>
            <p className="dashboard__subtitle">{t('admin.disputesSub', 'Investigate and resolve customer authenticity concerns and compromised product reports')}</p>
          </div>
        </div>

        <AdminSidebar />

        {/* Filter Card */}
        <div className="card mb-6">
          <div className="flex gap-4 items-center">
            <label className="text-sm font-semibold">{t('admin.filterDisputeStatus', 'Filter by Dispute Status:')}</label>
            <select
              className="form-input w-52"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">{t('admin.allDisputes', 'All Disputes')}</option>
              <option value="OPEN">OPEN</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>

        {error && <Alert type="danger" message={error} />}

        {loading ? (
          <div className="py-12 text-center">
            <LoadingSpinner text={t('loading.loading', 'Loading disputes...')} />
          </div>
        ) : (
          <>
            <DisputeTable
              disputes={disputes}
              onSelectDispute={(d) => {
                setSelectedDispute(d)
                setNewStatus(d.status === 'OPEN' ? 'INVESTIGATING' : 'RESOLVED')
                setResolutionNotes(d.resolutionNotes || '')
              }}
            />

            {totalPages > 1 && (
              <div className="flex gap-2 justify-center mt-6">
                <button
                  className="btn btn--ghost btn--sm"
                  disabled={page === 0}
                  onClick={() => loadDisputes(page - 1)}
                >
                  ← {t('common.back', 'Prev')}
                </button>
                <span className="text-secondary" style={{ alignSelf: 'center' }}>
                  {t('common.page', 'Page')} {page + 1} / {totalPages}
                </span>
                <button
                  className="btn btn--ghost btn--sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => loadDisputes(page + 1)}
                >
                  {t('common.next', 'Next')} →
                </button>
              </div>
            )}
          </>
        )}

        {/* Dispute Resolution Modal */}
        {selectedDispute && (
          <div className="card mt-6 border-gold">
            <div className="flex justify-between items-center mb-4">
              <h3 className="card__title">
                {t('admin.manageDispute', 'Manage Dispute')} #{selectedDispute.id} ({t('batch.batchId', 'Batch')} <code>{selectedDispute.batchId}</code>)
              </h3>
              <button
                type="button"
                className="btn btn--ghost btn--xs"
                onClick={() => setSelectedDispute(null)}
              >
                ✕ {t('common.close', 'Close')}
              </button>
            </div>

            <div className="text-sm space-y-2 mb-4 bg-input p-4 rounded-md">
              <p><strong>Reason:</strong> {selectedDispute.reason}</p>
              {selectedDispute.description && <p><strong>Description:</strong> {selectedDispute.description}</p>}
              <p><strong>Order Number:</strong> <code>{selectedDispute.orderNumber || 'N/A'}</code></p>
              <p><strong>Current Status:</strong> <span className="badge">{selectedDispute.status}</span></p>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="form-label">Set New Status</label>
                <select
                  className="form-input"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="INVESTIGATING">INVESTIGATING</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div>
                <label className="form-label">Resolution / Investigation Notes</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Describe resolution or investigation findings..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn--primary btn--sm" disabled={updating}>
                  {updating ? t('loading.submitting', 'Saving...') : t('common.save', 'Update Dispute Status')}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => setSelectedDispute(null)}
                >
                  {t('common.cancel', 'Cancel')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDisputesPage
