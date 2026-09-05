import React from 'react'

export const PredictionConfidence = ({ confidence = 50 }) => {
  const isLow = confidence < 60

  return (
    <div className="flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-secondary font-medium">Prediction Confidence</span>
        <span className={`font-mono text-xs font-bold ${isLow ? 'text-alert' : 'text-gold'}`}>
          {confidence}%
        </span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: '#E2E8F0',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.min(100, Math.max(0, confidence))}%`,
            height: '100%',
            backgroundColor: isLow ? '#1D4ED8' : '#D97706',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {isLow && (
        <div
          className="alert alert--warning mt-1"
          style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', marginBottom: 0 }}
        >
          ⚠️ Low Confidence: More harvest history is needed for a more reliable estimate.
        </div>
      )}
    </div>
  )
}

export default PredictionConfidence
