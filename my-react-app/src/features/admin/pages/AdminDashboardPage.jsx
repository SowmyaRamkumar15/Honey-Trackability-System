import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../../layouts/AdminLayout'
import MetricCard from '../../../components/ui/MetricCard'
import PageHeader from '../../../components/layout/PageHeader'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import Button from '../../../components/ui/Button'
import adminApi from '../api/adminApi'
import { useAuth } from '../../auth/hooks/useAuth'
import { useLanguage } from '../../../i18n/LanguageContext'
import VoiceButton from '../../../components/common/VoiceButton'
import '../styles/admin.css'

export const AdminDashboardPage = () => {
  const { t } = useLanguage()
  const { phoneNumber, role } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminApi.getDashboard()
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(err?.response?.data?.message || t('errors.generic', 'Failed to load dashboard statistics')))
      .finally(() => setLoading(false))
  }, [])

  const voiceSummary = `${t('admin.controlCenter', 'Admin & KVIC Control Center')}. ${t('admin.totalBeekeepers', 'Total Beekeepers')}: ${stats?.totalBeekeepers ?? 0}. ${t('admin.totalBatches', 'Honey Batches')}: ${stats?.totalBatches ?? 0}.`

  return (
    <AdminLayout>
      <div className="hc-admin-page">
        <PageHeader
          title={t('admin.controlCenter', 'KVIC Officer & Admin Control Center')}
          subtitle={
            <span>
              {t('admin.loggedInAs', 'Logged in as')}: <strong style={{ color: 'var(--primary)' }}>{phoneNumber}</strong> ({role})
            </span>
          }
          actions={<VoiceButton textToSpeak={voiceSummary} size="sm" />}
        />

        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <LoadingSpinner text={t('loading.loading', 'Loading real-time platform statistics...')} />
          </div>
        ) : error ? (
          <Alert type="danger" message={error} />
        ) : (
          <>
            {/* Top KPI Cards Grid */}
            <div className="hc-admin-stats-grid">
              <MetricCard
                icon="🧑‍🌾"
                label={t('admin.totalBeekeepers', 'Total Beekeepers')}
                value={stats?.totalBeekeepers ?? 0}
                subtext={`${stats?.pendingBeekeepers ?? 0} Pending · ${stats?.approvedBeekeepers ?? 0} Approved`}
              />
              <MetricCard
                icon="🐝"
                label={t('admin.registeredHives', 'Registered Hives')}
                value={stats?.totalHives ?? 0}
                subtext={`${stats?.activeHives ?? 0} Active producing`}
              />
              <MetricCard
                icon="🍯"
                label={t('admin.totalBatches', 'Honey Batches')}
                value={stats?.totalBatches ?? 0}
                subtext={`${stats?.pureBatches ?? 0} Pure · ${stats?.underReviewBatches ?? 0} Review`}
              />
              <MetricCard
                icon="⚖️"
                label={t('admin.honeyHarvested', 'Honey Harvested')}
                value={`${(stats?.totalHoneyProducedKg ?? 0).toFixed(1)} kg`}
                subtext={`${stats?.activeProducts ?? 0} Listed Products`}
              />
              <MetricCard
                icon="🛒"
                label={t('admin.ordersPlaced', 'Orders Placed')}
                value={stats?.totalOrders ?? 0}
                subtext={`${stats?.completedOrders ?? 0} Delivered`}
              />
              <MetricCard
                icon="🛡️"
                label={t('admin.verificationRisks', 'Verification Risks')}
                value={stats?.highRiskVerificationBatches ?? 0}
                subtext={`${stats?.pendingLabTests ?? 0} Awaiting Testing`}
              />
            </div>

            {/* Quick Management Shortcuts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div className="hc-admin-shortcut-card">
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
                    🧑‍🌾 {t('admin.beekeeperVerification', 'Beekeeper Verification')}
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {stats?.pendingBeekeepers > 0 ? (
                      <strong style={{ color: 'var(--primary)' }}>
                        {stats.pendingBeekeepers} beekeepers awaiting KVIC ID review and approval.
                      </strong>
                    ) : (
                      'All beekeeper applications are up to date and verified.'
                    )}
                  </p>
                </div>
                <Link to="/admin/beekeepers">
                  <Button variant="primary" size="sm" style={{ width: '100%' }}>
                    {t('admin.reviewBeekeepers', 'Review Applications →')}
                  </Button>
                </Link>
              </div>

              <div className="hc-admin-shortcut-card">
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
                    🔬 {t('admin.labTestQueue', 'Lab Quality Approvals')}
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {stats?.pendingLabTests > 0 ? (
                      <strong style={{ color: 'var(--primary)' }}>
                        {stats.pendingLabTests} laboratory test reports pending quality sign-off.
                      </strong>
                    ) : (
                      'All submitted samples processed by partner laboratories.'
                    )}
                  </p>
                </div>
                <Link to="/admin/lab">
                  <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                    {t('admin.inspectLabQueue', 'Inspect Lab Queue →')}
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboardPage
