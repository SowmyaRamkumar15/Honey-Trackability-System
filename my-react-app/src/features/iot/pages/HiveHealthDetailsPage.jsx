import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import Badge from '../../../components/ui/Badge'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import HealthStatusBadge from '../components/HealthStatusBadge'
import SensorSummary from '../components/SensorSummary'
import SensorHistoryChart from '../components/SensorHistoryChart'
import YieldPredictionCard from '../../ai/components/YieldPredictionCard'
import useYieldPrediction from '../../ai/hooks/useYieldPrediction'
import iotApi from '../api/iotApi'
import '../styles/iot.css'

export const HiveHealthDetailsPage = () => {
  const { hiveId } = useParams()
  const [health, setHealth] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  const {
    prediction,
    loading: predictionLoading,
    refreshing: predictionRefreshing,
    refreshPrediction,
  } = useYieldPrediction(hiveId)

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      setError(null)

      const [healthRes, historyRes] = await Promise.all([
        iotApi.getHiveHealth(hiveId),
        iotApi.getSensorHistory(hiveId, 0, 20),
      ])

      setHealth(healthRes.data.data)
      setHistory(historyRes.data.data?.readings || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hive health telemetry.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [hiveId])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <BeekeeperLayout>
      <div className="hc-iot-page">
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          <Link to="/beekeeper/hives" style={{ color: 'var(--primary)', fontWeight: 'var(--font-semibold)', textDecoration: 'none' }}>
            My Hives
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)' }}>{health?.hiveCode || `Hive #${hiveId}`}</span>
        </nav>

        {error && <Alert type="error" message={error} />}

        {loading && !health ? (
          <div style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
            <LoadingSpinner text="Reading IoT sensor stream and calculating health state..." />
          </div>
        ) : !health ? (
          <Card style={{ padding: 'var(--space-12)', textAlign: 'center', maxWidth: '520px', marginInline: 'auto' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🐝</p>
            <p style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-bold)' }}>Hive Telemetry Not Available</p>
            <Link to="/beekeeper/hives" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="sm" style={{ marginTop: 'var(--space-4)' }}>
                ← Back to Hives
              </Button>
            </Link>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Main Health Status Overview Card */}
            <Card
              style={{
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
                border: `1px solid ${health.status === 'ALERT' ? 'var(--danger-border)' : health.status === 'WATCH' ? 'var(--warning-border)' : 'var(--border)'}`,
                backgroundColor: health.status === 'ALERT' ? 'var(--danger-soft)' : health.status === 'WATCH' ? 'var(--warning-soft)' : 'var(--surface)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div className="hc-iot-badge-icon">
                    🐝
                  </div>
                  <div>
                    <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', color: 'var(--text-primary)', margin: 0 }}>
                      {health.hiveCode || `Hive #${hiveId}`}
                    </h1>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: '2px', margin: '2px 0 0 0' }}>
                      <span>{health.clusterName ? `Cluster: ${health.clusterName}` : 'Registered Apiary'}</span>
                      <Badge variant="warning">Simulated IoT Stream</Badge>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <HealthStatusBadge status={health.status} size="lg" />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadData(true)}
                    loading={refreshing}
                  >
                    ↻ Live Telemetry
                  </Button>
                </div>
              </div>

              {/* Explainable Health Message */}
              <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                  Health Analysis & Diagnostic Insight
                </p>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                  {health.message}
                </p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', paddingTop: 'var(--space-1)', margin: 0 }}>
                  * Based on deterministic environmental thresholds for temperature, humidity, and acoustic bee activity.
                </p>
              </div>
            </Card>

            {/* Live Sensor Telemetry Readout */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span>📊</span> Live Sensor Telemetry
              </h2>
              <SensorSummary
                temperature={health.temperature}
                humidity={health.humidity}
                beeActivity={health.beeActivity}
                checkedAt={health.checkedAt}
              />
            </div>

            {/* Multi-Column Section: Historical Chart & AI Prediction */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', alignItems: 'start' }}>
              {/* Historical Sensor Chart */}
              <div>
                <Card style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span>📈</span> Sensor Trends & Historical Telemetry
                    </h2>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {history.length} data points
                    </span>
                  </div>
                  <SensorHistoryChart readings={history} />
                </Card>
              </div>

              {/* AI Yield Prediction Section */}
              <div>
                <YieldPredictionCard
                  prediction={prediction}
                  loading={predictionLoading}
                  refreshing={predictionRefreshing}
                  onRefresh={refreshPrediction}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </BeekeeperLayout>
  )
}

export default HiveHealthDetailsPage
