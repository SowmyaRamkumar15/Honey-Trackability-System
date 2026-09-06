import React, { useState, useEffect } from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import DisputeTable from '../components/DisputeTable'
import PageHeader from '../../../components/layout/PageHeader'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import adminApi from '../api/adminApi'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/admin.css'

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
      <div className="hc-admin-page">
        <PageHeader
          title={`⚖️ ${t('admin.disputesTitle', 'Consumer Authenticity Disputes')}`}
          subtitle={t('admin.disputesSub', 'Investigate and resolve customer authenticity concerns and compromised product reports')}
          actions={
            <Button variant="secondary" size="sm" onClick={() => loadDisputes(page)} disabled={loading}>
              🔄 {t('common.refresh', 'Refresh')}
            </Button>
          }
        />

        {/* Filter Bar */}
        <div className="hc-admin-filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)' }}>
              {t('admin.filterDisputeStatus', 'Filter by Dispute Status:')}
            </label>
            <select
              className="hc-input__field"
              style={{ width: 'auto', minWidth: 200 }}
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
          <div style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => loadDisputes(page - 1)}
                >
                  ← {t('common.back', 'Prev')}
                </Button>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)' }}>
                  {t('common.page', 'Page')} {page + 1} / {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => loadDisputes(page + 1)}
                >
                  {t('common.next', 'Next')} →
                </Button>
              </div>
            )}
          </>
        )}

        {/* Dispute Resolution Card */}
        {selectedDispute && (
          <Card style={{ border: '2px solid var(--primary)', marginTop: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: 0 }}>
                {t('admin.manageDispute', 'Manage Dispute')} #{selectedDispute.id} ({t('batch.batchId', 'Batch')} <code style={{ color: 'var(--primary)' }}>{selectedDispute.batchId}</code>)
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDispute(null)}
              >
                ✕ {t('common.close', 'Close')}
              </Button>
            </div>

            <div className="hc-admin-audit-box" style={{ marginBottom: 'var(--space-4)' }}>
              <p style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--text-xs)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Reason:</strong> <span style={{ color: 'var(--text-secondary)' }}>{selectedDispute.reason}</span>
              </p>
              {selectedDispute.description && (
                <p style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--text-xs)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Description:</strong> <span style={{ color: 'var(--text-secondary)' }}>{selectedDispute.description}</span>
                </p>
              )}
              <p style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--text-xs)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Order Number:</strong> <code style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{selectedDispute.orderNumber || 'N/A'}</code>
              </p>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Current Status:</strong> <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--primary)' }}>{selectedDispute.status}</span>
              </p>
            </div>

            <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="hc-input">
                <label className="hc-input__label">
                  Set New Status
                </label>
                <select
                  className="hc-input__field"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="INVESTIGATING">INVESTIGATING</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div className="hc-input">
                <label className="hc-input__label">
                  Resolution / Investigation Notes
                </label>
                <textarea
                  className="hc-input__field"
                  rows={3}
                  placeholder="Describe resolution or investigation findings..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={updating}
                >
                  {updating ? t('loading.submitting', 'Saving...') : t('common.save', 'Update Dispute Status')}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedDispute(null)}
                >
                  {t('common.cancel', 'Cancel')}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDisputesPage
