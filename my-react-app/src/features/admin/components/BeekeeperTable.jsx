import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../../i18n/LanguageContext'
import DataTable from '../../../components/ui/DataTable'
import EmptyState from '../../../components/ui/EmptyState'
import '../styles/admin.css'

export const BeekeeperTable = ({ beekeepers = [], onStatusUpdate, updatingId }) => {
  const { t } = useLanguage()

  if (beekeepers.length === 0) {
    return (
      <EmptyState
        icon="🧑‍🌾"
        title="No beekeeper records found"
        description="Try adjusting your status filter or search parameters."
      />
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.6875rem', fontWeight: 700, backgroundColor: 'var(--success-soft)', color: 'var(--success)', border: '1px solid var(--success-border)' }}>
            APPROVED
          </span>
        )
      case 'REJECTED':
        return (
          <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.6875rem', fontWeight: 700, backgroundColor: 'var(--danger-soft)', color: 'var(--danger)', border: '1px solid var(--danger-border)' }}>
            REJECTED
          </span>
        )
      case 'PENDING':
      default:
        return (
          <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.6875rem', fontWeight: 700, backgroundColor: 'var(--warning-soft)', color: 'var(--primary-dark)', border: '1px solid var(--primary-light)' }}>
            PENDING
          </span>
        )
    }
  }

  return (
    <DataTable>
      <thead>
        <tr>
          <th>{t('auth.beekeeperRole', 'Beekeeper')}</th>
          <th>{t('onboarding.kvicId', 'KVIC ID')}</th>
          <th>{t('onboarding.village', 'Village / Region')}</th>
          <th>{t('common.status', 'Status')}</th>
          <th>{t('navigation.myHives', 'Hives')}</th>
          <th>{t('navigation.myBatches', 'Batches')}</th>
          <th>{t('navigation.reviews', 'Rating')}</th>
          <th style={{ textAlign: 'right' }}>{t('common.actions', 'Actions')}</th>
        </tr>
      </thead>
      <tbody>
        {beekeepers.map((b) => (
          <tr key={b.id}>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {b.photoUrl ? (
                  <img src={b.photoUrl} alt={b.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
                ) : (
                  <div className="hc-batch-icon" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>
                    🐝
                  </div>
                )}
                <div>
                  <strong style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{b.name}</strong>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{b.phoneNumber}</span>
                </div>
              </div>
            </td>
            <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{b.kvicId || 'N/A'}</td>
            <td style={{ fontSize: 'var(--text-xs)' }}>{b.village || 'N/A'}</td>
            <td>{getStatusBadge(b.verificationStatus)}</td>
            <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>{b.hiveCount}</td>
            <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>{b.batchCount}</td>
            <td>
              {b.averageRating > 0 ? (
                <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 'var(--text-xs)' }}>★ {b.averageRating.toFixed(1)}</span>
              ) : (
                <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>No ratings</span>
              )}
            </td>
            <td style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                <Link
                  to={`/admin/beekeepers/${b.id}`}
                  className="hc-btn hc-btn--secondary hc-btn--xs"
                >
                  {t('common.viewDetails', 'View')}
                </Link>
                {b.verificationStatus === 'PENDING' && (
                  <>
                    <button
                      type="button"
                      className="hc-btn hc-btn--primary hc-btn--xs"
                      disabled={updatingId === b.id}
                      onClick={() => onStatusUpdate?.(b.id, 'APPROVED')}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="hc-btn hc-btn--danger hc-btn--xs"
                      disabled={updatingId === b.id}
                      onClick={() => onStatusUpdate?.(b.id, 'REJECTED')}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  )
}

export default BeekeeperTable
