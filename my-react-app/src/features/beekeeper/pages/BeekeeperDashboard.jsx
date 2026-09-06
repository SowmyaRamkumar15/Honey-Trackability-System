import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import Button from '../../../components/ui/Button'
import PageHeader from '../../../components/layout/PageHeader'
import VoiceButton from '../../../components/common/VoiceButton'
import { useAuth } from '../../auth/hooks/useAuth'
import { useBeekeeperProfile } from '../hooks/useBeekeeperProfile'
import { useLanguage } from '../../../i18n/LanguageContext'
import hiveApi from '../../hive/api/hiveApi'
import batchApi from '../../batch/api/batchApi'
import iotApi from '../../iot/api/iotApi'
import yieldPredictionApi from '../../ai/api/yieldPredictionApi'
import '../styles/beekeeper.css'

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

    hiveApi
      .getHiveCount()
      .then((res) => setHiveCount(res.data?.data?.total ?? 0))
      .catch(() => setHiveCount(0))

    batchApi
      .getBatchStats()
      .then((res) => setBatchStats(res.data?.data || { total: 0, created: 0, sentForTesting: 0 }))
      .catch(() => setBatchStats({ total: 0, created: 0, sentForTesting: 0 }))

    iotApi
      .getAllHivesHealth()
      .then((res) => {
        const list = res.data?.data || []
        const healthy = list.filter((h) => h.status === 'HEALTHY').length
        const watch = list.filter((h) => h.status === 'WATCH').length
        const alert = list.filter((h) => h.status === 'ALERT').length
        setHealthStats({ healthy, watch, alert, total: list.length })
      })
      .catch(() => setHealthStats({ healthy: 0, watch: 0, alert: 0, total: 0 }))

    yieldPredictionApi
      .getAllYieldPredictions()
      .then((res) => setPredictions(res.data?.data || []))
      .catch(() => setPredictions([]))
  }, [])

  const hasCompletedProfile = status?.completed || !!profile
  const displayName = profile?.name || phoneNumber || t('auth.beekeeperRole', 'Beekeeper')
  const primaryPrediction = predictions.length > 0 ? predictions[0] : null

  const voiceInstructions = `${t('navigation.beekeepers', 'Beekeeper Dashboard')}. ${t('dashboard.registeredHives', 'Registered Hives')}: ${hiveCount}. ${t('dashboard.totalBatches', 'Total Batches')}: ${batchStats.total}.`

  return (
    <BeekeeperLayout>
      <div className="hc-bk-dashboard">
        {/* Profile Warning Banner */}
        {!hasCompletedProfile && (
          <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-2xl)', backgroundColor: 'var(--primary-soft)', border: '1px solid var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <div>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--primary-dark)' }}>
                  {t('onboarding.warningTitle', 'KVIC Beekeeper Setup Incomplete')}
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {t('onboarding.warningSub', 'Please complete your KVIC beekeeper profile to enable harvest logging and purity certificates.')}
                </p>
              </div>
            </div>
            <Link to="/beekeeper/onboarding">
              <Button variant="primary" size="sm">
                {t('onboarding.completeSetup', 'Complete Setup →')}
              </Button>
            </Link>
          </div>
        )}

        {/* Dashboard Header */}
        <PageHeader
          title={t('navigation.dashboard', 'Beekeeper Dashboard')}
          subtitle={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span>{t('dashboard.welcome', 'Welcome back,')}</span>
              <strong>{displayName}</strong>
              {profile?.kvicId && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary-soft)', color: 'var(--primary-dark)', border: '1px solid var(--primary-light)', fontWeight: 700 }}>
                  📜 {profile.kvicId}
                </span>
              )}
            </span>
          }
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <VoiceButton textToSpeak={voiceInstructions} size="sm" />
              <Link to="/beekeeper/batches/new">
                <Button variant="primary" size="sm">
                  <span>+ New Batch</span>
                </Button>
              </Link>
              <Link to="/beekeeper/earnings">
                <Button variant="secondary" size="sm">
                  <span>💰 Earnings</span>
                </Button>
              </Link>
              <Link to="/beekeeper/profile">
                <Button variant="secondary" size="sm">
                  <span>👤 Profile</span>
                </Button>
              </Link>
            </div>
          }
        />

        {/* 4 Live KPI Metric Cards */}
        <div className="hc-bk-stats-grid">
          <Link to="/beekeeper/hives" style={{ textDecoration: 'none' }}>
            <div className="hc-metric-card">
              <div className="hc-metric-header">
                <span className="hc-metric-label">{t('dashboard.registeredHives', 'Registered Hives')}</span>
                <span className="hc-metric-icon">🐝</span>
              </div>
              <div className="hc-metric-value">{hiveCount}</div>
              <div className="hc-metric-footer">
                <span className="hc-metric-subtext">Active colonies</span>
                <span className="hc-metric-trend">Manage →</span>
              </div>
            </div>
          </Link>

          <Link to="/beekeeper/batches" style={{ textDecoration: 'none' }}>
            <div className="hc-metric-card">
              <div className="hc-metric-header">
                <span className="hc-metric-label">{t('dashboard.totalBatches', 'Total Batches')}</span>
                <span className="hc-metric-icon">🍯</span>
              </div>
              <div className="hc-metric-value">{batchStats.total}</div>
              <div className="hc-metric-footer">
                <span className="hc-metric-subtext">Pure honey logs</span>
                <span className="hc-metric-trend">View all →</span>
              </div>
            </div>
          </Link>

          <Link to="/beekeeper/batches" style={{ textDecoration: 'none' }}>
            <div className="hc-metric-card">
              <div className="hc-metric-header">
                <span className="hc-metric-label">{t('dashboard.testingProgress', 'Testing in Progress')}</span>
                <span className="hc-metric-icon">🧪</span>
              </div>
              <div className="hc-metric-value" style={{ color: 'var(--primary-dark)' }}>{batchStats.sentForTesting}</div>
              <div className="hc-metric-footer">
                <span className="hc-metric-subtext">Under lab review</span>
                <span className="hc-metric-trend">Inspect →</span>
              </div>
            </div>
          </Link>

          <Link to="/beekeeper/profile" style={{ textDecoration: 'none' }}>
            <div className="hc-metric-card">
              <div className="hc-metric-header">
                <span className="hc-metric-label">{t('dashboard.kvicVerification', 'KVIC Verification')}</span>
                <span className="hc-metric-icon">📜</span>
              </div>
              <div className="hc-metric-value" style={{ fontSize: '1.25rem' }}>
                {profile?.verificationStatus || (hasCompletedProfile ? 'APPROVED' : 'PENDING')}
              </div>
              <div className="hc-metric-footer">
                <span className="hc-metric-subtext">{hasCompletedProfile ? 'Certified artisan' : 'Action needed'}</span>
                <span className="hc-metric-trend">Profile →</span>
              </div>
            </div>
          </Link>
        </div>

        {/* 2-Column Responsive Dashboard Grid: Telemetry & Quick Action Hub */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Column 1: IoT Telemetry Summary */}
          <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  📡 IoT Hive Telemetry Assessment
                </h3>
                <span className="hc-iot-badge--live">Live Nodes: {healthStats.total}</span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Automated acoustic and thermal sensors continuously monitor brood nest temperatures and colony vitality.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '16px' }}>
                <div style={{ padding: '10px', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--success-soft)', border: '1px solid var(--success-border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--success)' }}>HEALTHY</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>{healthStats.healthy}</div>
                </div>
                <div style={{ padding: '10px', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--warning-soft)', border: '1px solid var(--primary-light)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--primary)' }}>WATCH</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>{healthStats.watch}</div>
                </div>
                <div style={{ padding: '10px', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--danger-soft)', border: '1px solid var(--danger-border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--danger)' }}>ALERT</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>{healthStats.alert}</div>
                </div>
              </div>
            </div>

            <Link to="/hives/health">
              <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                Open IoT Telemetry Feed →
              </Button>
            </Link>
          </div>

          {/* Column 2: Quick Workflow Shortcuts */}
          <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>
                ⚡ Quick Apiary Operations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/batches/new" className="hc-bk-action-card" style={{ padding: '12px 16px', flexDirection: 'row', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem' }}>🍯</span>
                  <div>
                    <div className="hc-bk-action-title" style={{ fontSize: 'var(--text-sm)' }}>Log New Harvest</div>
                    <div className="hc-bk-action-desc">Record yield weight, floral source & batch passport</div>
                  </div>
                </Link>
                <Link to="/hives" className="hc-bk-action-card" style={{ padding: '12px 16px', flexDirection: 'row', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem' }}>🐝</span>
                  <div>
                    <div className="hc-bk-action-title" style={{ fontSize: 'var(--text-sm)' }}>Inspect Apiary Colonies</div>
                    <div className="hc-bk-action-desc">Manage installed smart hives and GPS coordinates</div>
                  </div>
                </Link>
                <Link to="/my-products" className="hc-bk-action-card" style={{ padding: '12px 16px', flexDirection: 'row', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem' }}>🛒</span>
                  <div>
                    <div className="hc-bk-action-title" style={{ fontSize: 'var(--text-sm)' }}>Marketplace Catalog</div>
                    <div className="hc-bk-action-desc">Publish lab-certified honey directly to consumers</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BeekeeperLayout>
  )
}

export default BeekeeperDashboard
