import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../../layouts/AdminLayout'
import PageHeader from '../../../components/layout/PageHeader'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/admin.css'

export const AdminVerificationRiskPage = () => {
  const { t } = useLanguage()
  const [riskData, setRiskData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminApi
      .getVerificationRiskAnalytics()
      .then((res) => setRiskData(res.data?.data))
      .catch((err) =>
        setError(err?.response?.data?.message || t('errors.generic', 'Failed to load risk analytics'))
      )
      .finally(() => setLoading(false))
  }, [])

  const totalScans =
    (riskData?.normalCount ?? 0) + (riskData?.watchCount ?? 0) + (riskData?.highRiskCount ?? 0)
  const normalPct = totalScans > 0 ? Math.round(((riskData?.normalCount ?? 0) / totalScans) * 100) : 100

  return (
    <AdminLayout>
      <div className="hc-admin-page">
        {/* Standard Admin Header */}
        <PageHeader
          title={`🛡️ ${t('admin.antiCounterfeitRisk', 'Anti-Counterfeit Verification Risk')}`}
          subtitle={t(
            'admin.antiCounterfeitRiskSub',
            'Scan velocity anomaly detection, counterfeit alerts, and high-risk batch auditing'
          )}
          actions={
            <Badge variant="info">
              ● Live Heuristic Engine
            </Badge>
          }
        />

        {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

        {loading ? (
          <div style={{ padding: 'var(--space-16) 0', textAlign: 'center' }}>
            <LoadingSpinner text={t('loading.verifying', 'Analyzing verification scan logs & velocity telemetry...')} />
          </div>
        ) : (
          <>
            {/* Real-time Threat Intelligence Overview Banner */}
            <div style={{
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-2xl)',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-4)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', maxWidth: 640 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <span>⚡ QR Velocity Telemetry</span>
                  <span>•</span>
                  <span>Global Audit Status</span>
                </div>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-black)', margin: 0, color: '#FFFFFF' }}>
                  Anti-Tamper Cryptographic Scanning Grid
                </h2>
                <p style={{ fontSize: 'var(--text-xs)', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
                  Monitoring scan patterns across India. Algorithmic thresholds flag duplicate QR scans from disparate geographical locations or sudden velocity spikes.
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid #334155'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block', textTransform: 'uppercase', fontWeight: 'var(--font-bold)' }}>Total Scans</span>
                  <span style={{ fontSize: 'var(--text-lg)', fontFamily: 'monospace', fontWeight: 'var(--font-bold)', color: '#FFFFFF' }}>{totalScans}</span>
                </div>
                <div style={{ width: 1, height: 32, backgroundColor: '#334155' }} />
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block', textTransform: 'uppercase', fontWeight: 'var(--font-bold)' }}>Integrity Score</span>
                  <span style={{ fontSize: 'var(--text-lg)', fontFamily: 'monospace', fontWeight: 'var(--font-bold)', color: 'var(--primary-light)' }}>{normalPct}%</span>
                </div>
              </div>
            </div>

            {/* Risk Distribution Cards */}
            <div className="hc-admin-stats-grid">
              <Card className="hc-admin-risk-card hc-admin-risk-card--low">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-xl)' }}>✅</span>
                  <Badge variant="success">AUTHENTIC</Badge>
                </div>
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'block', fontWeight: 'var(--font-semibold)' }}>
                    {t('verification.riskNormal', 'NORMAL Scans')}
                  </span>
                  <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', fontFamily: 'monospace', color: 'var(--text-primary)', margin: 'var(--space-1) 0' }}>
                    {riskData?.normalCount ?? 0}
                  </h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                    {t('admin.normalScansSub', 'Standard consumer verifications with valid unique QR tokens.')}
                  </p>
                </div>
              </Card>

              <Card className="hc-admin-risk-card hc-admin-risk-card--medium">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-xl)' }}>⚠️</span>
                  <Badge variant="warning">ELEVATED</Badge>
                </div>
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'block', fontWeight: 'var(--font-semibold)' }}>
                    {t('verification.riskWatch', 'WATCH Scans')}
                  </span>
                  <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', fontFamily: 'monospace', color: 'var(--warning)', margin: 'var(--space-1) 0' }}>
                    {riskData?.watchCount ?? 0}
                  </h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                    {t('admin.watchScansSub', 'Elevated scan velocity detected above baseline retail rate.')}
                  </p>
                </div>
              </Card>

              <Card className="hc-admin-risk-card hc-admin-risk-card--high">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-xl)' }}>🚨</span>
                  <Badge variant="danger">HIGH ALERT</Badge>
                </div>
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'block', fontWeight: 'var(--font-semibold)' }}>
                    {t('verification.riskHigh', 'HIGH RISK Scans')}
                  </span>
                  <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', fontFamily: 'monospace', color: 'var(--danger)', margin: 'var(--space-1) 0' }}>
                    {riskData?.highRiskCount ?? 0}
                  </h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                    {t('admin.highRiskScansSub', 'Potential duplicate QR cloning or counterfeit distribution.')}
                  </p>
                </div>
              </Card>
            </div>

            {/* High-Risk Flagged Batches Table */}
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: 0 }}>
                    🚨 {t('admin.flaggedBatches', 'Flagged Batches Requiring Audit')}
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    Batches exhibiting anomalous verification velocity requiring KVIC officer inspection.
                  </p>
                </div>
                {riskData?.highRiskBatches?.length > 0 && (
                  <Badge variant="danger">
                    {riskData.highRiskBatches.length} Batches Flagged
                  </Badge>
                )}
              </div>

              {riskData?.highRiskBatches?.length > 0 ? (
                <div className="hc-table-container">
                  <table className="hc-table">
                    <thead>
                      <tr>
                        <th>{t('batch.batchId', 'Batch ID')}</th>
                        <th>{t('auth.beekeeperRole', 'Beekeeper')}</th>
                        <th>{t('onboarding.village', 'Village')}</th>
                        <th>{t('verification.historyTitle', 'Total Scans')}</th>
                        <th>{t('verification.riskLevel', 'Risk Level')}</th>
                        <th style={{ textAlign: 'right' }}>{t('common.actions', 'Action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskData.highRiskBatches.map((b) => (
                        <tr key={b.batchId}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 'var(--font-bold)', color: 'var(--primary)' }}>
                            <code>{b.batchId}</code>
                          </td>
                          <td style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>
                            {b.beekeeperName || 'N/A'}
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>
                            {b.village || 'N/A'}
                          </td>
                          <td>
                            <span style={{ fontFamily: 'monospace', backgroundColor: 'var(--bg-muted)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>
                              {b.verificationCount} scans
                            </span>
                          </td>
                          <td>
                            <Badge variant={b.riskLevel === 'HIGH_RISK' ? 'danger' : 'warning'}>
                              {b.riskLevel}
                            </Badge>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <Link
                              to={`/admin/batches/${b.batchId}`}
                              className="hc-button hc-button--primary hc-button--sm"
                            >
                              <span>{t('common.viewDetails', 'Inspect Audit Record')}</span>
                              <span>→</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>
                    ✅
                  </div>
                  <h4 style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', margin: '0 0 var(--space-1) 0' }}>
                    No Counterfeit Risks Detected
                  </h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' }}>
                    {t(
                      'admin.noFlaggedBatches',
                      'All public QR verification logs are within legitimate consumer rate thresholds. No suspicious cloning patterns identified.'
                    )}
                  </p>
                </div>
              )}
            </Card>

            {/* Anti-Counterfeit Safeguards & Protocol Card */}
            <Card>
              <h3 style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)', color: 'var(--text-primary)', margin: '0 0 var(--space-4) 0' }}>
                🛡️ Multi-Layered Anti-Tamper Safeguards
              </h3>
              <div className="hc-admin-stats-grid">
                <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', margin: '0 0 var(--space-1) 0' }}>
                    📡 Velocity Anomaly Engine
                  </h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    Flags jars scanned more than 5 times within a 60-minute window or from multiple distinct GPS coordinates simultaneously.
                  </p>
                </div>
                <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', margin: '0 0 var(--space-1) 0' }}>
                    ⛓️ Cryptographic QR Hash
                  </h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    Each batch QR embeds an SHA-256 batch hash validated against the immutable public blockchain ledger.
                  </p>
                </div>
                <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', margin: '0 0 var(--space-1) 0' }}>
                    ⚖️ Automatic Freeze Mechanism
                  </h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    Batches triggering critical HIGH RISK alerts can be locked instantly by KVIC officers, disabling marketplace checkout.
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminVerificationRiskPage
