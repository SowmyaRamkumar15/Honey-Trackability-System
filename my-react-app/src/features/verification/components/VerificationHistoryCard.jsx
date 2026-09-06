import React, { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import VerificationRiskBadge from './VerificationRiskBadge'
import RecentVerificationList from './RecentVerificationList'
import verificationApi from '../api/verificationApi'
import '../styles/verification.css'

export const VerificationHistoryCard = ({ batchId, initialSummary }) => {
  const [history, setHistory] = useState(null)
  const [showRecent, setShowRecent] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (batchId) {
      setLoading(true)
      verificationApi.getPublicHistory(batchId)
        .then((res) => setHistory(res.data.data))
        .catch(() => setHistory(null))
        .finally(() => setLoading(false))
    }
  }, [batchId])

  const total = history?.totalVerifications ?? initialSummary?.totalVerifications ?? 1
  const riskLevel = history?.riskLevel ?? initialSummary?.riskLevel ?? 'NORMAL'
  const riskMessage = history?.riskMessage ?? initialSummary?.riskMessage ?? 'Verification activity appears normal.'
  const lastVerified = history?.lastVerifiedAt ?? initialSummary?.lastVerifiedAt

  return (
    <Card
      header={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)' }}>
            🛡️ Verification History & Anti-Counterfeit
          </h3>
          <VerificationRiskBadge riskLevel={riskLevel} size="lg" />
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Metric Readout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--background)', border: '1px solid var(--border)' }}>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600, fontSize: '11px' }}>Total Scans</p>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--primary-dark)', fontFamily: 'var(--font-mono)' }}>
              ✓ {total} {total === 1 ? 'time' : 'times'}
            </p>
          </div>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--background)', border: '1px solid var(--border)' }}>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600, fontSize: '11px' }}>Last Verified</p>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {lastVerified
                ? new Date(lastVerified).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Just now'}
            </p>
          </div>
        </div>

        {/* Risk Explanation */}
        <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--background)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5 }}>{riskMessage}</p>
          <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)' }}>
            ℹ️ Verification activity is a risk heuristic. A high scan count does not by itself prove that a product is counterfeit.
          </p>
        </div>

        {/* Expandable Recent Scans */}
        {history?.recentEvents && history.recentEvents.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowRecent(!showRecent)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 600, padding: 0 }}
            >
              <span>{showRecent ? '▲ Hide' : '▼ View'} Recent Verification Activity</span>
            </button>

            {showRecent && (
              <div style={{ marginTop: 'var(--space-2)' }}>
                <RecentVerificationList events={history.recentEvents} />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

export default VerificationHistoryCard
