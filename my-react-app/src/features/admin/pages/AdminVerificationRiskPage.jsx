import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../../layouts/AdminLayout'
import AdminSidebar from '../components/AdminSidebar'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'
import { useLanguage } from '../../../i18n/LanguageContext'

export const AdminVerificationRiskPage = () => {
  const { t } = useLanguage()
  const [riskData, setRiskData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminApi.getVerificationRiskAnalytics()
      .then((res) => setRiskData(res.data?.data))
      .catch((err) => setError(err?.response?.data?.message || t('errors.generic', 'Failed to load risk analytics')))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout>
      <div className="container section">
        <div className="dashboard__header mb-6">
          <div>
            <h1 className="dashboard__title">🛡️ {t('admin.antiCounterfeitRisk', 'Anti-Counterfeit Verification Risk')}</h1>
            <p className="dashboard__subtitle">{t('admin.antiCounterfeitRiskSub', 'Scan velocity anomaly detection, counterfeit alerts, and high-risk batch auditing')}</p>
          </div>
        </div>

        <AdminSidebar />

        {error && <Alert type="danger" message={error} />}

        {loading ? (
          <div className="py-12 text-center">
            <LoadingSpinner text={t('loading.verifying', 'Analyzing verification scan logs...')} />
          </div>
        ) : (
          <>
            {/* Risk Distribution Cards */}
            <div className="kpi-grid mb-6">
              <div className="kpi-card">
                <div className="kpi-card__icon">✅</div>
                <div className="kpi-card__content">
                  <p className="kpi-card__label">{t('verification.riskNormal', 'NORMAL Scans')}</p>
                  <h3 className="kpi-card__value text-success">{riskData?.normalCount ?? 0}</h3>
                  <p className="kpi-card__subtext text-secondary text-xs">{t('admin.normalScansSub', 'Standard consumer verifications')}</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-card__icon">⚠️</div>
                <div className="kpi-card__content">
                  <p className="kpi-card__label">{t('verification.riskWatch', 'WATCH Scans')}</p>
                  <h3 className="kpi-card__value text-warning">{riskData?.watchCount ?? 0}</h3>
                  <p className="kpi-card__subtext text-secondary text-xs">{t('admin.watchScansSub', 'Elevated scan velocity detected')}</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-card__icon">🚨</div>
                <div className="kpi-card__content">
                  <p className="kpi-card__label">{t('verification.riskHigh', 'HIGH RISK Scans')}</p>
                  <h3 className="kpi-card__value text-danger">{riskData?.highRiskCount ?? 0}</h3>
                  <p className="kpi-card__subtext text-secondary text-xs">{t('admin.highRiskScansSub', 'Potential duplicate QR cloning activity')}</p>
                </div>
              </div>
            </div>

            {/* High-Risk Flagged Batches Table */}
            <div className="card">
              <h3 className="card__title mb-4">🚨 {t('admin.flaggedBatches', 'Flagged Batches Requiring Audit')}</h3>
              {riskData?.highRiskBatches?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{t('batch.batchId', 'Batch ID')}</th>
                        <th>{t('auth.beekeeperRole', 'Beekeeper')}</th>
                        <th>{t('onboarding.village', 'Village')}</th>
                        <th>{t('verification.historyTitle', 'Total Scans')}</th>
                        <th>{t('verification.riskLevel', 'Risk Level')}</th>
                        <th>{t('common.actions', 'Action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskData.highRiskBatches.map((b) => (
                        <tr key={b.batchId}>
                          <td><code>{b.batchId}</code></td>
                          <td><strong>{b.beekeeperName || 'N/A'}</strong></td>
                          <td>{b.village || 'N/A'}</td>
                          <td><strong>{b.verificationCount} scans</strong></td>
                          <td>
                            <span className={`badge badge--${b.riskLevel === 'HIGH_RISK' ? 'danger' : 'warning'}`}>
                              {b.riskLevel}
                            </span>
                          </td>
                          <td>
                            <Link to={`/admin/batches/${b.batchId}`} className="btn btn--outline btn--xs">
                              {t('common.viewDetails', 'Inspect Audit Record')}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-secondary text-sm">{t('admin.noFlaggedBatches', 'No batches currently flagged as high risk.')}</p>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminVerificationRiskPage
