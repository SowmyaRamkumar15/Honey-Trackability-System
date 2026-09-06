import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import HiveHealthGrid from '../components/HiveHealthGrid'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import { useHiveHealth } from '../hooks/useHiveHealth'
import { useLanguage } from '../../../i18n/LanguageContext'
import VoiceButton from '../../../components/common/VoiceButton'
import '../styles/iot.css'

export const HiveHealthOverviewPage = () => {
  const { t } = useLanguage()
  const { data: hivesHealth, loading, error, refresh } = useHiveHealth(null, 45000) // 45s auto-refresh
  const [statusFilter, setStatusFilter] = useState('ALL')

  const healthyCount = hivesHealth?.filter((h) => h.status === 'HEALTHY').length || 0
  const watchCount = hivesHealth?.filter((h) => h.status === 'WATCH').length || 0
  const alertCount = hivesHealth?.filter((h) => h.status === 'ALERT').length || 0

  const filteredHives = hivesHealth?.filter((h) => {
    if (statusFilter === 'HEALTHY') return h.status === 'HEALTHY'
    if (statusFilter === 'WATCH') return h.status === 'WATCH'
    if (statusFilter === 'ALERT') return h.status === 'ALERT'
    return true
  })

  const voiceInstructions = `${t('iot.dashboardTitle', 'IoT Sensor Telemetry')}. ${t('iot.msgHealthy', 'Hive telemetry is within optimal parameters.')} ${healthyCount} ${t('iot.healthy', 'Healthy')}, ${watchCount} ${t('iot.watch', 'Watch')}, ${alertCount} ${t('iot.alert', 'Alert')}.`

  return (
    <BeekeeperLayout>
      <div className="hc-iot-page">
        {/* Page Header */}
        <div className="hc-iot-header">
          <div>
            <div className="hc-iot-header__tags">
              <span className="hc-iot-badge--live">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                Live Telemetry Feed
              </span>
              <span className="hc-iot-badge--sim">
                ⚡ Simulation Engine
              </span>
            </div>
            <h1 className="hc-iot-title">
              <span>📡</span> {t('iot.dashboardTitle', 'IoT Hive Health Telemetry')}
            </h1>
            <p className="hc-iot-subtitle">
              {t('dashboard.iotSub', 'Real-time telemetry and explainable acoustic & thermal analysis for all your registered colonies.')}
            </p>
          </div>

          <div className="hc-iot-header__actions">
            <VoiceButton textToSpeak={voiceInstructions} size="sm" />
            <Button variant="secondary" size="sm" onClick={refresh} loading={loading}>
              ↻ {t('common.refresh', 'Refresh')}
            </Button>
            <Link to="/beekeeper/hives">
              <Button variant="primary" size="sm">
                + {t('dashboard.manageHives', 'Manage Hives')}
              </Button>
            </Link>
          </div>
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Health Summary Stat Cards / Filter Pills */}
        <div className="hc-iot-stats-grid">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`hc-iot-stat-card ${statusFilter === 'ALL' ? 'hc-iot-stat-card--active' : ''}`}
          >
            <span className="hc-iot-stat-card__label">All Connected Nodes</span>
            <div className="hc-iot-stat-card__value">{hivesHealth?.length || 0}</div>
          </button>

          {/* Healthy Card */}
          <button
            type="button"
            onClick={() => setStatusFilter('HEALTHY')}
            className={`hc-iot-stat-card ${statusFilter === 'HEALTHY' ? 'hc-iot-stat-card--active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p className="hc-iot-stat-card__label" style={{ color: 'var(--success)' }}>
                  🟢 Healthy Hives
                </p>
                <p className="hc-iot-stat-card__value">{healthyCount}</p>
              </div>
              <span className="hc-iot-stat-card__icon">🌿</span>
            </div>
          </button>

          {/* Watch Card */}
          <button
            type="button"
            onClick={() => setStatusFilter('WATCH')}
            className={`hc-iot-stat-card ${statusFilter === 'WATCH' ? 'hc-iot-stat-card--active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p className="hc-iot-stat-card__label" style={{ color: 'var(--primary)' }}>
                  🟡 Watch Attention
                </p>
                <p className="hc-iot-stat-card__value">{watchCount}</p>
              </div>
              <span className="hc-iot-stat-card__icon">⚠️</span>
            </div>
          </button>

          {/* Alert Card */}
          <button
            type="button"
            onClick={() => setStatusFilter('ALERT')}
            className={`hc-iot-stat-card ${statusFilter === 'ALERT' ? 'hc-iot-stat-card--active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p className="hc-iot-stat-card__label" style={{ color: 'var(--danger)' }}>
                  🔴 Alert Required
                </p>
                <p className="hc-iot-stat-card__value">{alertCount}</p>
              </div>
              <span className="hc-iot-stat-card__icon">🚨</span>
            </div>
          </button>
        </div>

        {/* Content Body */}
        {loading && !hivesHealth ? (
          <LoadingSpinner text="Reading real-time IoT node telemetry..." />
        ) : (
          <HiveHealthGrid hivesHealth={filteredHives} />
        )}
      </div>
    </BeekeeperLayout>
  )
}

export default HiveHealthOverviewPage
