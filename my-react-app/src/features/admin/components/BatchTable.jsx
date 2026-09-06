import React from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import { useLanguage } from '../../../i18n/LanguageContext'

export const BatchTable = ({ batches = [] }) => {
  const { t } = useLanguage()

  if (batches.length === 0) {
    return (
      <EmptyState
        icon="🍯"
        title={t('empty.noBatches', 'No honey batches found.')}
        description="No batches match your current filter parameters."
      />
    )
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'PURE':
      case 'IN_STOCK':
      case 'QR_GENERATED':
        return 'success'
      case 'FAILED':
        return 'danger'
      case 'UNDER_REVIEW':
      case 'SENT_FOR_TESTING':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'HIGH_RISK':
        return <Badge variant="danger" size="sm">🚨 HIGH RISK</Badge>
      case 'WATCH':
        return <Badge variant="warning" size="sm">⚠️ WATCH</Badge>
      case 'NORMAL':
      default:
        return <Badge variant="success" size="sm">✅ NORMAL</Badge>
    }
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="hc-table" style={{ width: '100%', margin: 0 }}>
        <thead>
          <tr>
            <th>{t('batch.batchId', 'Batch ID')}</th>
            <th>{t('auth.beekeeperRole', 'Beekeeper')}</th>
            <th>{t('hive.hiveCode', 'Hive')}</th>
            <th>{t('batch.quantityKg', 'Quantity')}</th>
            <th>{t('common.status', 'Status')}</th>
            <th>{t('lab.purityScore', 'Purity')}</th>
            <th>{t('blockchain.network', 'Blockchain Proof')}</th>
            <th>{t('verification.riskLevel', 'Risk Assessment')}</th>
            <th style={{ textAlign: 'right' }}>{t('common.actions', 'Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((b) => (
            <tr key={b.id || b.batchId}>
              <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-dark)', fontSize: 'var(--text-xs)' }}>
                {b.batchId}
              </td>
              <td>
                <strong style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 600 }}>{b.beekeeperName || 'N/A'}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{b.village || 'Apiary'}</span>
              </td>
              <td style={{ fontSize: 'var(--text-xs)' }}>{b.hiveCode || (b.hiveId ? `Hive #${b.hiveId}` : '—')}</td>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                {b.quantityKg != null ? `${b.quantityKg.toFixed(1)} kg` : '—'}
              </td>
              <td>
                <Badge variant={getStatusVariant(b.status)} size="sm">
                  {t(`batch.status${b.status}`, b.status)}
                </Badge>
              </td>
              <td>
                {b.purityScore != null ? (
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: b.purityScore >= 90 ? 'var(--success)' : 'var(--warning)' }}>
                    {b.purityScore}%
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{t('lab.untested', 'Pending Lab')}</span>
                )}
              </td>
              <td>
                {b.blockchainTxHash ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--info)',
                      background: 'rgba(37, 99, 235, 0.08)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(37, 99, 235, 0.2)',
                    }}
                    title={b.blockchainTxHash}
                  >
                    ⛓️ On-Chain
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>Pending Hash</span>
                )}
              </td>
              <td>{getRiskBadge(b.riskLevel)}</td>
              <td style={{ textAlign: 'right' }}>
                <Link to={`/admin/batches/${b.batchId}`} style={{ textDecoration: 'none' }}>
                  <Button variant="ghost" size="sm">
                    Inspect ↗
                  </Button>
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
