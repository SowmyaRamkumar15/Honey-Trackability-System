import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import Button from '../../../components/ui/Button'
import PageHeader from '../../../components/layout/PageHeader'
import MetricCard from '../../../components/ui/MetricCard'
import Card from '../../../components/ui/Card'
import VoiceButton from '../../../components/common/VoiceButton'
import { useAuth } from '../../auth/hooks/useAuth'
import { useBeekeeperProfile } from '../hooks/useBeekeeperProfile'
import { useLanguage } from '../../../i18n/LanguageContext'
import hiveApi from '../../hive/api/hiveApi'
import batchApi from '../../batch/api/batchApi'
import iotApi from '../../iot/api/iotApi'
import yieldPredictionApi from '../../ai/api/yieldPredictionApi'

export const BeekeeperDashboard = () => {
  const { phoneNumber } = useAuth()
  const { profile, status, fetchStatus, fetchProfile } = useBeekeeperProfile()
  const { t } = useLanguage()
  const [hiveCount, setHiveCount] = useState('0')
  const [batchStats, setBatchStats] = useState({ total: 0, created: 0, sentForTesting: 0 })
  const [healthStats, setHealthStats] = useState({ healthy: 0, watch: 0, alert: 0, total: 0 })
  const [predictions, setPredictions] = useState([])

  useEffect(() => {
    fetchStatus()
    fetchProfile()

    hiveApi.getHiveCount()
      .then((res) => setHiveCount(res.data?.data?.total ?? 0))
      .catch(() => setHiveCount(0))

    batchApi.getBatchStats()
      .then((res) => setBatchStats(res.data?.data || { total: 0, created: 0, sentForTesting: 0 }))
      .catch(() => setBatchStats({ total: 0, created: 0, sentForTesting: 0 }))

    iotApi.getAllHivesHealth()
      .then((res) => {
        const list = res.data?.data || []
        const healthy = list.filter((h) => h.status === 'HEALTHY').length
        const watch = list.filter((h) => h.status === 'WATCH').length
        const alert = list.filter((h) => h.status === 'ALERT').length
        setHealthStats({ healthy, watch, alert, total: list.length })
      })
      .catch(() => setHealthStats({ healthy: 0, watch: 0, alert: 0, total: 0 }))

    yieldPredictionApi.getAllYieldPredictions()
      .then((res) => setPredictions(res.data?.data || []))
      .catch(() => setPredictions([]))
  }, [])

  const hasCompletedProfile = status?.completed || !!profile
  const displayName = profile?.name || phoneNumber || t('auth.beekeeperRole', 'Beekeeper')
  const primaryPrediction = predictions.length > 0 ? predictions[0] : null

  const voiceInstructions = `${t('navigation.beekeepers', 'Beekeeper Dashboard')}. ${t('dashboard.registeredHives', 'Registered Hives')}: ${hiveCount}. ${t('dashboard.totalBatches', 'Total Batches')}: ${batchStats.total}.`

  return (
    <BeekeeperLayout>
      <div className="space-y-6">
        {/* Profile Warning Banner */}
        {!hasCompletedProfile && (
          <div className="p-4 rounded-xl bg-amber-50 border-l-4 border-amber-500 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl shrink-0">⚠️</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t('onboarding.warningTitle', 'Profile Setup Incomplete')}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{t('onboarding.warningSub', 'Please complete your KVIC beekeeper profile to enable harvest logging and certificates.')}</p>
              </div>
            </div>
            <Link to="/beekeeper/onboarding" className="shrink-0 w-full sm:w-auto">
              <Button variant="primary" size="sm" className="w-full sm:w-auto">
                {t('onboarding.completeSetup', 'Complete Setup →')}
              </Button>
            </Link>
          </div>
        )}

        {/* Dashboard Header */}
        <PageHeader
          title={
            <span>
              {t('navigation.beekeepers', 'Beekeeper')}{' '}
              <span className="text-primary font-extrabold">{t('navigation.dashboard', 'Dashboard')}</span>
            </span>
          }
          subtitle={
            <span>
              {t('dashboard.welcome', 'Welcome back,')} <strong className="text-slate-900 font-bold">{displayName}</strong>
              {profile?.kvicId && (
                <span className="font-mono text-xs px-2.5 py-0.5 ml-2 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-semibold inline-block">
                  {profile.kvicId}
                </span>
              )}
            </span>
          }
          actions={
            <div className="flex items-center gap-2.5 flex-wrap">
              <VoiceButton textToSpeak={voiceInstructions} size="sm" />
              <Link to="/beekeeper/batches/new">
                <Button variant="primary" size="sm">
                  <span>+</span> {t('dashboard.newBatch', 'New Batch')}
                </Button>
              </Link>
              <Link to="/beekeeper/profile">
                <Button variant="secondary" size="sm">
                  <span>👤</span> {t('navigation.portalLabel', 'Profile')}
                </Button>
              </Link>
            </div>
          }
        />

        {/* 4 Live KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 align-stretch">
          <Link to="/beekeeper/hives" className="block h-full no-underline">
            <MetricCard
              icon="🐝"
              label={t('dashboard.registeredHives', 'Registered Hives')}
              value={`${hiveCount} ${t('units.hives', 'Hives')}`}
              subtext="Active apiary units"
            />
          </Link>
          <Link to="/beekeeper/batches" className="block h-full no-underline">
            <MetricCard
              icon="🍯"
              label={t('dashboard.totalBatches', 'Total Batches')}
              value={`${batchStats.total} ${t('navigation.batches', 'Batches')}`}
              subtext="Logged harvests"
            />
          </Link>
          <Link to="/beekeeper/batches" className="block h-full no-underline">
            <MetricCard
              icon="🧪"
              label={t('dashboard.testingProgress', 'Testing in Progress')}
              value={`${batchStats.sentForTesting} ${t('navigation.batches', 'Batches')}`}
              subtext="Under lab analysis"
            />
          </Link>
          <Link to="/beekeeper/profile" className="block h-full no-underline">
            <MetricCard
              icon="📜"
              label={t('dashboard.kvicVerification', 'KVIC Verification')}
              value={
                profile?.verificationStatus
                  ? t(`profile.status${profile.verificationStatus === 'APPROVED' ? 'Approved' : profile.verificationStatus === 'REJECTED' ? 'Rejected' : 'Pending'}`, profile.verificationStatus)
                  : hasCompletedProfile
                  ? t('profile.statusApproved', 'APPROVED')
                  : t('profile.statusPending', 'PENDING')
              }
              subtext={hasCompletedProfile ? 'Certified beekeeper' : 'Action required'}
            />
          </Link>
        </div>

        {/* 2-Column Responsive Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: AI Forecast & IoT Health */}
          <div className="space-y-6">
            {/* AI Yield Prediction Card */}
            <Card className="p-6 space-y-4 hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-lg">🤖</span>
                  <div>
                    <h2 className="font-bold text-base text-slate-900 font-['Outfit']">
                      {t('dashboard.aiPredictionHeading', 'Expected Harvest Prediction')}
                    </h2>
                    <p className="text-xs text-slate-500">AI-assisted yield forecast & optimal harvest timing</p>
                  </div>
                </div>
                <Link to="/beekeeper/hive-health">
                  <Button variant="ghost" size="xs">
                    {t('dashboard.viewPredictions', 'Details →')}
                  </Button>
                </Link>
              </div>

              {primaryPrediction ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t('dashboard.aiPredictionText', {
                      code: primaryPrediction.hiveCode,
                      min: primaryPrediction.minimumKg,
                      max: primaryPrediction.maximumKg,
                      days: primaryPrediction.daysUntilHarvest,
                      confidence: primaryPrediction.confidence,
                    })}
                  </p>
                  <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-800 font-bold">~{primaryPrediction.daysUntilHarvest} days to harvest</span>
                    <span className="text-slate-700 font-semibold">{primaryPrediction.minimumKg}–{primaryPrediction.maximumKg} kg</span>
                    <span className="text-primary font-bold">{primaryPrediction.confidence}% confidence</span>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-slate-500 text-xs">
                  <p>AI harvest predictions will generate automatically as hive telemetry streams in.</p>
                </div>
              )}
            </Card>

            {/* IoT Hive Health Live Summary */}
            <Card className="p-6 space-y-4 hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-lg">📡</span>
                  <div>
                    <h2 className="font-bold text-base text-slate-900 font-['Outfit']">
                      {t('dashboard.iotHeading', 'IoT Hive Health Telemetry')}
                    </h2>
                    <p className="text-xs text-slate-500">Temperature, humidity & acoustics</p>
                  </div>
                </div>
                <Link to="/beekeeper/hive-health">
                  <Button variant="ghost" size="xs">
                    {t('dashboard.viewHiveHealth', 'Inspect →')}
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold">
                    <span className="health-dot health-dot--healthy"></span>
                    {t('iot.healthy', 'Healthy')}: {healthStats.healthy}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                    <span className="health-dot health-dot--watch"></span>
                    {t('iot.watch', 'Watch')}: {healthStats.watch}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 text-xs font-semibold">
                    <span className="health-dot health-dot--alert"></span>
                    {t('iot.alert', 'Alert')}: {healthStats.alert}
                  </span>
                </div>
                <Link to="/beekeeper/hive-health">
                  <Button variant="secondary" size="sm">
                    View Health Map →
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Right Column: Quick Management & Batch Actions */}
          <div className="space-y-6">
            {/* Hive Management Card */}
            <Card className="p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-xl">🐝</span>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 font-['Outfit']">
                      {t('dashboard.quickHiveTitle', 'Hive Management')}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t('dashboard.quickHiveDesc', 'Manage apiary locations, monitor active/inactive statuses, and register new hives.')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-500 font-mono font-medium">{hiveCount} Total Hives</span>
                <Link to="/beekeeper/hives">
                  <Button variant="secondary" size="sm">
                    {t('dashboard.manageHives', 'Manage Hives →')}
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Honey Batches Card */}
            <Card className="p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-xl">🍯</span>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 font-['Outfit']">
                      {t('dashboard.quickBatchTitle', 'Honey Batches & Harvests')}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t('dashboard.quickBatchDesc', 'Log harvest yields from hives, capture batch photos, and submit for lab testing.')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 flex-wrap">
                <Link to="/beekeeper/batches">
                  <Button variant="secondary" size="sm">
                    {t('dashboard.viewBatches', 'View Batches')}
                  </Button>
                </Link>
                <Link to="/beekeeper/batches/new">
                  <Button variant="primary" size="sm">
                    {t('dashboard.newHarvest', '+ New Harvest')}
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </BeekeeperLayout>
  )
}

export default BeekeeperDashboard
