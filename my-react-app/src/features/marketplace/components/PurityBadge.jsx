import React from 'react'
import { getPurityTier } from '../constants/marketplaceConstants'

const PurityBadge = ({ score, size = 'md' }) => {
  if (score == null) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
        Not Tested
      </span>
    )
  }

  const tier = getPurityTier(score)
  const isHigh = score >= 95
  const isMedium = score >= 85

  const paddingStyle = size === 'sm' ? '2px 8px' : size === 'lg' ? '6px 14px' : '4px 10px'
  const fontSizeStyle = size === 'lg' ? 'var(--text-sm)' : 'var(--text-xs)'

  const bgStyle = isHigh ? 'var(--success-soft)' : isMedium ? 'var(--warning-soft)' : 'var(--danger-soft)'
  const borderStyle = isHigh ? 'var(--success-border)' : isMedium ? 'var(--warning-border)' : 'var(--danger-border)'
  const colorStyle = isHigh ? 'var(--success)' : isMedium ? 'var(--warning)' : 'var(--danger)'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontWeight: 'var(--font-bold)',
        borderRadius: 'var(--radius-full)',
        border: `1px solid ${borderStyle}`,
        backgroundColor: bgStyle,
        color: colorStyle,
        padding: paddingStyle,
        fontSize: fontSizeStyle,
        boxShadow: 'var(--shadow-xs)',
      }}
      title={`Lab-tested purity: ${score}% (${tier?.label || 'Verified'})`}
    >
      <span>🧪</span>
      <span style={{ fontFamily: 'var(--font-mono)' }}>{score.toFixed(1)}%</span>
      {size !== 'sm' && (
        <span style={{ opacity: 0.8, fontSize: '0.6875rem', fontWeight: 'var(--font-normal)' }}>({tier?.label || 'Purity'})</span>
      )}
    </span>
  )
}

export default PurityBadge
