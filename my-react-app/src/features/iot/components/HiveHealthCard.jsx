import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import HealthStatusBadge from './HealthStatusBadge'
import VoiceButton from '../../../components/common/VoiceButton'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/iot.css'

export const HiveHealthCard = ({ health }) => {
  const { t } = useLanguage()

  if (!health) return null

  const { hiveId, hiveCode, clusterName, status, message, checkedAt } = health

  const getStatusClass = () => {
    if (status === 'ALERT') return 'hc-hive-card--alert'
    if (status === 'WATCH') return 'hc-hive-card--watch'
    return 'hc-hive-card--healthy'
  }

  const getVoiceAlertText = () => {
    let alertMsg = ''
    if (status === 'HEALTHY') alertMsg = t('iot.voiceAlertHealthy', 'Hive is healthy. Temperature and colony activity are normal.')
    else if (status === 'WATCH') alertMsg = t('iot.voiceAlertWatch', 'Hive requires monitoring. Environmental indicators require attention.')
    else if (status === 'ALERT') alertMsg = t('iot.voiceAlertAlert', 'Hive alert triggered! Immediate apiary inspection recommended.')
    return `${hiveCode || `Hive #${hiveId}`}. ${alertMsg} ${message || ''}`
  }

  return (
    <div className={`hc-hive-card ${getStatusClass()}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Header */}
        <div className="hc-hive-card__header">
          <div className="hc-hive-card__brand">
            <div className="hc-hive-card__icon">
              🐝
            </div>
            <div>
              <h3 className="hc-hive-card__title">
                {hiveCode || `Hive #${hiveId}`}
              </h3>
              <p className="hc-hive-card__sub">
                {clusterName ? `Apiary: ${clusterName}` : 'Registered Colony'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HealthStatusBadge status={status} size="sm" />
            <VoiceButton textToSpeak={getVoiceAlertText()} size="xs" />
          </div>
        </div>

        {/* Diagnostic Assessment */}
        <div className="hc-hive-card__assessment">
          <span className="hc-hive-card__assessment-tag">
            Diagnostic Telemetry Assessment
          </span>
          <p className="hc-hive-card__assessment-msg">
            {message}
          </p>
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="hc-hive-card__footer">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>
          {checkedAt
            ? `Updated ${new Date(checkedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
            : 'Live monitoring'}
        </span>
        <Link to={`/hives/${hiveId}/health`}>
          <Button variant="secondary" size="sm">
            {t('common.viewDetails', 'Inspect Sensors')} →
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default HiveHealthCard
