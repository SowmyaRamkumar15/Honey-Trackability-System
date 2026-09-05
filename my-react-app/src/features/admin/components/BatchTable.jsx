import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../../i18n/LanguageContext'

export const BatchTable = ({ batches = [] }) => {
  const { t } = useLanguage()

  if (batches.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-secondary">{t('empty.noBatches', 'No honey batches found.')}</p>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PURE':
      case 'IN_STOCK':
      case 'QR_GENERATED':
        return <span className="badge badge--success">{t(`batch.status${status}`, status)}</span>
      case 'FAILED':
        return <span className="badge badge--danger">{t('lab.failed', 'FAILED')}</span>
      case 'UNDER_REVIEW':
      case 'SENT_FOR_TESTING':
        return <span className="badge badge--warning">{t(`batch.status${status}`, status)}</span>
      default:
        return <span className="badge badge--dark">{status}</span>
    }
  }

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'HIGH_RISK':
        return <span className="badge badge--danger">{t('verification.riskHigh', 'HIGH RISK')}</span>
      case 'WATCH':
        return <span className="badge badge--warning">{t('verification.riskWatch', 'WATCH')}</span>
      case 'NORMAL':
      default:
        return <span className="badge badge--success">{t('verification.riskNormal', 'NORMAL')}</span>
    }
  }

  return (
    <div className="overflow-x-auto card p-0">
      <table className="data-table">
        <thead>
          <tr>
            <th>{t('batch.batchId', 'Batch ID')}</th>
            <th>{t('auth.beekeeperRole', 'Beekeeper')}</th>
            <th>{t('hive.hiveCode', 'Hive')}</th>
            <th>{t('batch.quantityKg', 'Quantity')}</th>
            <th>{t('common.status', 'Status')}</th>
            <th>{t('lab.purityScore', 'Purity')}</th>
            <th>{t('blockchain.network', 'Blockchain')}</th>
            <th>{t('verification.riskLevel', 'Risk')}</th>
            <th>{t('common.actions', 'Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((b) => (
            <tr key={b.id || b.batchId}>
              <td><code>{b.batchId}</code></td>
              <td>
                <strong className="block">{b.beekeeperName || 'N/A'}</strong>
                <span className="text-secondary text-xs">{b.village}</span>
              </td>
              <td>{b.hiveCode || 'Hive #' + b.hiveId}</td>
              <td>{b.quantityKg != null ? `${b.quantityKg.toFixed(1)} kg` : 'N/A'}</td>
              <td>{getStatusBadge(b.status)}</td>
              <td>
                {b.purityScore != null ? (
                  <span className="font-bold text-success">{b.purityScore}%</span>
                ) : (
                  <span className="text-secondary text-xs">{t('lab.untested', 'Untested')}</span>
                )}
              </td>
              <td>
                {b.blockchainTxHash ? (
                  <span className="badge badge--secondary badge--xs" title={b.blockchainTxHash}>
                    🔗 {t('blockchain.integrityVerified', 'Verified')}
                  </span>
                ) : (
                  <span className="text-secondary text-xs">{t('profile.statusPending', 'Pending')}</span>
                )}
              </td>
              <td>{getRiskBadge(b.riskLevel)}</td>
              <td>
                <Link to={`/admin/batches/${b.batchId}`} className="btn btn--outline btn--xs">
                  {t('common.viewDetails', 'Inspect')}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BatchTable
