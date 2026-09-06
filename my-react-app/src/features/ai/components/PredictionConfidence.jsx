import React from 'react'

export const PredictionConfidence = ({ confidence = 50 }) => {
  const isLow = confidence < 60

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)' }}>Prediction Confidence</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: isLow ? 'var(--danger)' : 'var(--primary-dark)' }}>
          {confidence}%
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            borderRadius: 'var(--radius-full)',
            transition: 'all 0.5s ease',
            backgroundColor: isLow ? 'var(--danger)' : 'var(--primary)',
            width: `${Math.min(100, Math.max(0, confidence))}%`,
          }}
        />
      </div>

      {isLow && (
        <div style={{ marginTop: '4px', padding: '6px 10px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--warning-soft)', border: '1px solid var(--warning-border)', color: 'var(--warning)', fontSize: 'var(--text-xs)' }}>
          ⚠️ Low Confidence: More harvest history is needed for a more reliable estimate.
        </div>
      )}
    </div>
  )
}

export default PredictionConfidence
