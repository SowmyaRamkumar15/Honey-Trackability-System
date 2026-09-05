import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../../i18n/LanguageContext'

export const BeekeeperTable = ({ beekeepers = [], onStatusUpdate, updatingId }) => {
  const { t } = useLanguage()

  if (beekeepers.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-secondary">{t('empty.noData', 'No beekeeper records found.')}</p>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="badge badge--success">{t('profile.statusApproved', 'APPROVED')}</span>
      case 'REJECTED':
        return <span className="badge badge--danger">{t('profile.statusRejected', 'REJECTED')}</span>
      case 'PENDING':
      default:
        return <span className="badge badge--warning">{t('profile.statusPending', 'PENDING')}</span>
    }
  }

  return (
    <div className="overflow-x-auto card p-0">
      <table className="data-table">
        <thead>
          <tr>
            <th>{t('auth.beekeeperRole', 'Beekeeper')}</th>
            <th>{t('onboarding.kvicId', 'KVIC ID')}</th>
            <th>{t('onboarding.village', 'Village / Region')}</th>
            <th>{t('common.status', 'Status')}</th>
            <th>{t('navigation.myHives', 'Hives')}</th>
            <th>{t('navigation.myBatches', 'Batches')}</th>
            <th>{t('navigation.reviews', 'Rating')}</th>
            <th>{t('common.actions', 'Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {beekeepers.map((b) => (
            <tr key={b.id}>
              <td>
                <div className="flex items-center gap-2">
                  {b.photoUrl ? (
                    <img src={b.photoUrl} alt={b.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-xs">
                      🐝
                    </div>
                  )}
                  <div>
                    <strong className="block">{b.name}</strong>
                    <span className="text-secondary text-xs">{b.phoneNumber}</span>
                  </div>
                </div>
              </td>
              <td><code>{b.kvicId || 'N/A'}</code></td>
              <td>{b.village || 'N/A'}</td>
              <td>{getStatusBadge(b.verificationStatus)}</td>
              <td>{b.hiveCount}</td>
              <td>{b.batchCount}</td>
              <td>
                {b.averageRating > 0 ? (
                  <span className="text-gold font-bold">★ {b.averageRating.toFixed(1)}</span>
                ) : (
                  <span className="text-secondary text-xs">{t('admin.noRatings', 'No ratings')}</span>
                )}
              </td>
              <td>
                <div className="flex gap-2">
                  <Link to={`/admin/beekeepers/${b.id}`} className="btn btn--outline btn--xs">
                    {t('common.viewDetails', 'View')}
                  </Link>
                  {b.verificationStatus === 'PENDING' && (
                    <>
                      <button
                        type="button"
                        className="btn btn--primary btn--xs"
                        disabled={updatingId === b.id}
                        onClick={() => onStatusUpdate?.(b.id, 'APPROVED')}
                      >
                        {t('admin.approve', 'Approve')}
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger-outline btn--xs"
                        disabled={updatingId === b.id}
                        onClick={() => onStatusUpdate?.(b.id, 'REJECTED')}
                      >
                        {t('admin.reject', 'Reject')}
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BeekeeperTable
