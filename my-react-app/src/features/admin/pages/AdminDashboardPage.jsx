import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../../layouts/AdminLayout'
import AdminSidebar from '../components/AdminSidebar'
import MetricCard from '../../../components/ui/MetricCard'
import PageHeader from '../../../components/layout/PageHeader'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'
import { useAuth } from '../../auth/hooks/useAuth'
import { useLanguage } from '../../../i18n/LanguageContext'
import VoiceButton from '../../../components/common/VoiceButton'

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
      <div className="space-y-6">
        <PageHeader
          title={t('admin.controlCenter', 'KVIC Officer & Admin Control Center')}
          subtitle={
            <span>
              {t('admin.loggedInAs', 'Logged in as')}: <strong className="text-blue-700 font-bold">{phoneNumber}</strong> ({role})
            </span>
          }
          actions={<VoiceButton textToSpeak={voiceSummary} size="sm" />}
        />

        <AdminSidebar />

        {loading ? (
          <div className="py-12 text-center">
            <LoadingSpinner text={t('loading.loading', 'Loading real-time platform statistics...')} />
          </div>
        ) : error ? (
          <Alert type="danger" message={error} />
        ) : (
          <>
            {/* Top KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 align-stretch">
              <MetricCard
                icon="🧑‍🌾"
                label={t('admin.totalBeekeepers', 'Total Beekeepers')}
                value={stats?.totalBeekeepers ?? 0}
                subtext={`${stats?.pendingBeekeepers ?? 0} ${t('profile.statusPending', 'Pending')} • ${stats?.approvedBeekeepers ?? 0} ${t('profile.statusApproved', 'Approved')}`}
              />
              <MetricCard
                icon="🐝"
                label={t('admin.registeredHives', 'Registered Hives')}
                value={stats?.totalHives ?? 0}
                subtext={`${stats?.activeHives ?? 0} ${t('hive.active', 'Active')}`}
              />
              <MetricCard
                icon="🍯"
                label={t('admin.totalBatches', 'Honey Batches')}
                value={stats?.totalBatches ?? 0}
                subtext={`${stats?.pureBatches ?? 0} ${t('lab.pure', 'Pure')} • ${stats?.underReviewBatches ?? 0} ${t('lab.underReview', 'Under Review')}`}
              />
              <MetricCard
                icon="⚖️"
                label={t('admin.honeyHarvested', 'Honey Harvested')}
                value={`${(stats?.totalHoneyProducedKg ?? 0).toFixed(1)} kg`}
                subtext={`${stats?.activeProducts ?? 0} ${t('admin.activeProducts', 'Listed Products')}`}
              />
              <MetricCard
                icon="🛒"
                label={t('admin.ordersPlaced', 'Orders Placed')}
                value={stats?.totalOrders ?? 0}
                subtext={`${stats?.completedOrders ?? 0} ${t('admin.delivered', 'Delivered')}`}
              />
              <MetricCard
                icon="🛡️"
                label={t('admin.verificationRisks', 'Verification Risks')}
                value={stats?.highRiskVerificationBatches ?? 0}
                subtext={`${stats?.pendingLabTests ?? 0} ${t('admin.awaitingTesting', 'Awaiting Testing')}`}
              />
            </div>

            {/* Quick Management Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-900 font-['Outfit']">🧑‍🌾 {t('admin.beekeeperVerification', 'Beekeeper Verification')}</h3>
                  <p className="text-slate-600 text-xs">
                    {stats?.pendingBeekeepers > 0 ? (
                      <strong className="text-amber-800 font-semibold">
                        ⚠️ {stats.pendingBeekeepers} {t('admin.beekeepersAwaiting', 'beekeeper registration(s) currently awaiting audit.')}
                      </strong>
                    ) : (
                      t('admin.allBeekeepersAudited', 'All registered beekeepers have been audited.')
                    )}
                  </p>
                </div>
                <div className="pt-2">
                  <Link to="/admin/beekeepers?status=PENDING">
                    <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors">
                      {t('admin.reviewPending', 'Review Pending Applications →')}
                    </button>
                  </Link>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-900 font-['Outfit']">🛡️ {t('admin.antiCounterfeit', 'Anti-Counterfeit Monitoring')}</h3>
                  <p className="text-slate-600 text-xs">
                    {stats?.highRiskVerificationBatches > 0 ? (
                      <strong className="text-blue-900 font-semibold">
                        🚨 {stats.highRiskVerificationBatches} {t('admin.highRiskFlagged', 'batch scan(s) flagged with HIGH RISK indicators.')}
                      </strong>
                    ) : (
                      t('admin.allScansNormal', 'All public QR verification activity within normal thresholds.')
                    )}
                  </p>
                </div>
                <div className="pt-2">
                  <Link to="/admin/verification-risk">
                    <button className="px-4 py-2 rounded-lg bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors">
                      {t('admin.inspectFlagged', 'Inspect Flagged Scans →')}
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* System Endpoints Panel */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-base text-slate-900 font-['Outfit']">🔌 {t('admin.systemIntegrations', 'System Integrations & Audit APIs')}</h3>
              <div className="flex flex-wrap gap-3">
                <Link to="/admin/analytics">
                  <button className="px-3.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-medium text-xs">
                    📊 {t('navigation.analytics', 'Analytics')}
                  </button>
                </Link>
                <Link to="/admin/lab">
                  <button className="px-3.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-medium text-xs">
                    🔬 {t('admin.navLabTests', 'Laboratory Records')}
                  </button>
                </Link>
                <Link to="/admin/disputes">
                  <button className="px-3.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-medium text-xs">
                    ⚖️ {t('admin.navDisputes', 'Consumer Disputes')}
                  </button>
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
