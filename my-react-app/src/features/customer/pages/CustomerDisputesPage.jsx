import React, { useState, useEffect } from 'react'
import CustomerLayout from '../../../layouts/CustomerLayout'
import Card from '../../../components/ui/Card'
import PageHeader from '../../../components/layout/PageHeader'
import disputeApi from '../api/disputeApi'
import { useLanguage } from '../../../i18n/LanguageContext'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import EmptyState from '../../../components/ui/EmptyState'
import Modal from '../../../components/ui/Modal'
import DataTable from '../../../components/ui/DataTable'
import Alert from '../../../components/feedback/Alert'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import '../styles/customer.css'

export const CustomerDisputesPage = () => {
  const { t } = useLanguage()
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDispute, setSelectedDispute] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [newDispute, setNewDispute] = useState({
    batchId: '',
    orderNumber: '',
    reason: '',
    description: '',
  })

  useEffect(() => {
    fetchDisputes()
  }, [])

  const fetchDisputes = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await disputeApi.getMyDisputes()
      const data = res.data?.data?.content || res.data?.data || res.data || []
      setDisputes(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.response?.data?.message || t('common.errorLoading', 'Failed to load disputes.'))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewDispute((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccessMsg('')
    try {
      await disputeApi.createDispute(newDispute)
      setSuccessMsg(t('disputes.createSuccess', 'Dispute submitted successfully.'))
      setShowCreateModal(false)
      setNewDispute({ batchId: '', orderNumber: '', reason: '', description: '' })
      fetchDisputes()
    } catch (err) {
      setError(err.response?.data?.message || t('common.errorSaving', 'Failed to submit dispute.'))
    } finally {
      setSubmitting(false)
    }
  }

  const filteredDisputes = statusFilter
    ? disputes.filter((d) => d.status === statusFilter)
    : disputes

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="warning">OPEN</Badge>
      case 'INVESTIGATING':
        return <Badge variant="info">INVESTIGATING</Badge>
      case 'RESOLVED':
        return <Badge variant="success">RESOLVED</Badge>
      case 'REJECTED':
      default:
        return <Badge variant="danger">{status}</Badge>
    }
  }

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (row) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>#{row.id}</span>,
    },
    {
      key: 'batchId',
      header: 'Batch ID',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>
          {row.batchId}
        </span>
      ),
    },
    {
      key: 'orderNumber',
      header: 'Order #',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          {row.orderNumber || 'N/A'}
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row) => <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.reason}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: 'date',
      header: 'Submitted',
      render: (row) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (row) => (
        <Button onClick={() => setSelectedDispute(row)} variant="ghost" size="sm">
          {t('common.viewDetails', 'View')}
        </Button>
      ),
    },
  ]

  return (
    <CustomerLayout>
      <div className="hc-cust-page">
        <PageHeader
          title={t('disputes.title', 'My Authenticity Disputes')}
          subtitle={t('disputes.subtitle', 'Track and file authenticity or quality concerns for your honey orders.')}
          actions={
            <Button onClick={() => setShowCreateModal(true)} variant="primary" size="sm">
              + {t('disputes.newDispute', 'File New Dispute')}
            </Button>
          }
        />

        {successMsg && (
          <Alert type="success" title="Success" onClose={() => setSuccessMsg('')}>
            {successMsg}
          </Alert>
        )}

        {error && (
          <Alert type="danger" title="Error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Filter bar */}
        <div
          style={{
            background: 'var(--surface)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {t('disputes.filterStatus', 'Filter Status:')}
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="hc-input__field"
              style={{ width: 'auto', padding: 'var(--space-1) var(--space-3)', fontSize: 'var(--text-xs)' }}
            >
              <option value="">{t('disputes.allStatuses', 'All Statuses')}</option>
              <option value="OPEN">OPEN</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {filteredDisputes.length} {t('disputes.recordsFound', 'record(s)')}
          </span>
        </div>

        {/* Disputes List / Table */}
        <Card>
          {loading ? (
            <LoadingSpinner message={t('loading.disputes', 'Loading disputes...')} />
          ) : filteredDisputes.length === 0 ? (
            <EmptyState
              icon="⚖️"
              title={t('disputes.emptyTitle', 'No disputes found')}
              description={t('disputes.emptyDesc', 'You have not submitted any disputes. Click "File New Dispute" if you suspect honey tampering or quality issues.')}
              action={
                <Button onClick={() => setShowCreateModal(true)} variant="primary" size="sm">
                  + {t('disputes.newDispute', 'File New Dispute')}
                </Button>
              }
            />
          ) : (
            <DataTable columns={columns} data={filteredDisputes} keyField="id" />
          )}
        </Card>

        {/* Modal: Dispute Details */}
        <Modal
          isOpen={!!selectedDispute}
          onClose={() => setSelectedDispute(null)}
          title={`⚖️ Dispute #${selectedDispute?.id || ''}`}
          footer={
            <Button onClick={() => setSelectedDispute(null)} variant="secondary" size="sm">
              {t('common.close', 'Close')}
            </Button>
          }
        >
          {selectedDispute && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ background: 'var(--background)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Batch ID
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>
                  {selectedDispute.batchId}
                </span>
              </div>

              <div style={{ background: 'var(--background)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Order Number
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700 }}>
                  {selectedDispute.orderNumber || 'N/A'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Reason
                </span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedDispute.reason}</span>
              </div>

              {selectedDispute.description && (
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Description
                  </span>
                  <p style={{ margin: 0, background: 'var(--background)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {selectedDispute.description}
                  </p>
                </div>
              )}

              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Status
                </span>
                <div style={{ marginTop: '4px' }}>{getStatusBadge(selectedDispute.status)}</div>
              </div>

              {selectedDispute.resolutionNotes && (
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--primary-dark)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Official Resolution Notes
                  </span>
                  <p style={{ margin: 0, background: 'var(--primary-soft)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-light)', fontSize: 'var(--text-xs)', color: 'var(--primary-dark)', lineHeight: 1.6, fontWeight: 500 }}>
                    {selectedDispute.resolutionNotes}
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Modal: File New Dispute */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title={`⚖️ ${t('disputes.fileTitle', 'File Authenticity Dispute')}`}
        >
          <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label className="hc-input__label">
                {t('disputes.batchIdLabel', 'Batch ID')} <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                name="batchId"
                required
                value={newDispute.batchId}
                onChange={handleInputChange}
                placeholder="e.g. HC-2026-AB12CD34"
                className="hc-input__field"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div>
              <label className="hc-input__label">{t('disputes.orderNumberLabel', 'Order Number (Optional)')}</label>
              <input
                type="text"
                name="orderNumber"
                value={newDispute.orderNumber}
                onChange={handleInputChange}
                placeholder="e.g. ORD-20260904-XXXX"
                className="hc-input__field"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div>
              <label className="hc-input__label">
                {t('disputes.reasonLabel', 'Reason / Category')} <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <select
                name="reason"
                required
                value={newDispute.reason}
                onChange={handleInputChange}
                className="hc-input__field"
              >
                <option value="">{t('disputes.selectReason', 'Select a reason...')}</option>
                <option value="Suspected Sugar Syrup Adulteration">Suspected Sugar Syrup Adulteration</option>
                <option value="QR Code Scan Verification Failed">QR Code Scan Verification Failed</option>
                <option value="Damaged or Tampered Seal">Damaged or Tampered Seal</option>
                <option value="Incorrect Batch / Labeling Mismatch">Incorrect Batch / Labeling Mismatch</option>
                <option value="Other Authenticity Concern">Other Authenticity Concern</option>
              </select>
            </div>

            <div>
              <label className="hc-input__label">{t('disputes.descLabel', 'Detailed Description')}</label>
              <textarea
                name="description"
                rows={3}
                value={newDispute.description}
                onChange={handleInputChange}
                placeholder="Describe your observations, purchase details, or QR scan result..."
                className="hc-input__field"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)' }}>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="submit" variant="primary" size="sm" loading={submitting}>
                {t('common.submit', 'Submit Dispute')}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </CustomerLayout>
  )
}

export default CustomerDisputesPage
