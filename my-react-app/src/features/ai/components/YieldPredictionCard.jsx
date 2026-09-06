import React from 'react'
import PredictionConfidence from './PredictionConfidence'
import PredictionExplanation from './PredictionExplanation'
import VoiceButton from '../../../components/common/VoiceButton'
import Button from '../../../components/ui/Button'
import { useLanguage } from '../../../i18n/LanguageContext'

export const YieldPredictionCard = ({
  prediction,
  loading = false,
  refreshing = false,
  onRefresh,
}) => {
  const { t } = useLanguage()

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-5)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          <div style={{ width: '16px', height: '16px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span>{t('common.loading', 'Generating AI yield prediction...')}</span>
        </div>
      </div>
    )
  }

  if (!prediction) return null

  const isAlert = prediction.healthStatus === 'ALERT'

  const getVoicePredictionText = () => {
    const expectedLabel = t('yield.expectedHarvest', 'Expected Harvest Date')
    const yieldLabel = t('yield.estimatedYield', 'Estimated Yield')
    return `${expectedLabel}: ${prediction.daysUntilHarvest} days (${prediction.predictedHarvestDate}). ${yieldLabel}: ${prediction.minimumKg} to ${prediction.maximumKg} kg. ${prediction.explanation || ''}`
  }

  return (
    <div style={{
      padding: 'var(--space-5)',
      borderRadius: 'var(--radius-2xl)',
      backgroundColor: 'var(--surface)',
      border: `1px solid ${isAlert ? 'var(--danger-border)' : 'var(--primary-light)'}`,
      boxShadow: 'var(--shadow-xs)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '1.25rem' }}>🤖</span>
            <h3 style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)', color: 'var(--text-primary)', margin: 0 }}>
              {t('nav.yieldPrediction', 'AI Yield Prediction')}
            </h3>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px', margin: '4px 0 0 0' }}>
            Hive {prediction.hiveCode} • Generated {new Date(prediction.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <VoiceButton text={getVoicePredictionText()} size="xs" />
          {onRefresh && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onRefresh}
              loading={refreshing}
            >
              🔄 Refresh
            </Button>
          )}
        </div>
      </div>

      {/* ALERT Banner if hive is in ALERT status */}
      {isAlert && (
        <div style={{ padding: 'var(--space-3)', marginBottom: 'var(--space-4)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--danger-soft)', border: '1px solid var(--danger-border)', color: 'var(--danger)', fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span>🔴</span>
          <span><strong>Hive Alert:</strong> Your hive needs attention. Yield prediction is less reliable until hive conditions improve.</span>
        </div>
      )}

      {/* Core Prediction Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', backgroundColor: 'var(--bg-muted)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
        <div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)', margin: 0 }}>{t('yield.expectedHarvest', 'Expected Harvest')}</p>
          <p style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)', color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
            ~{prediction.daysUntilHarvest} days
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
            {new Date(prediction.predictedHarvestDate).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>

        <div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)', margin: 0 }}>{t('yield.estimatedYield', 'Estimated Yield')}</p>
          <p style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)', color: 'var(--primary-dark)', fontFamily: 'var(--font-mono)', margin: '4px 0 0 0' }}>
            {prediction.minimumKg} – {prediction.maximumKg} kg
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Predicted harvest range</p>
        </div>
      </div>

      {/* Confidence Indicator */}
      <PredictionConfidence confidence={prediction.confidence} />

      {/* Collapsible Explanation */}
      <PredictionExplanation
        explanation={prediction.explanation}
        details={prediction.explanationDetails}
      />
    </div>
  )
}

export default YieldPredictionCard
