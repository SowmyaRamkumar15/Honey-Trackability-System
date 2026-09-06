import React, { useState } from 'react'
import '../styles/verification.css'

export const VerificationHeader = ({ verification, batchId }) => {
  const [copied, setCopied] = useState(false)
  const isGenuine = verification?.verificationStatus === 'GENUINE' && verification?.verified
  const isUnderReview = verification?.verificationStatus === 'UNDER_REVIEW'
  const isFailed = verification?.verificationStatus === 'FAILED'
  const isNotFound = verification?.verificationStatus === 'NOT_FOUND'

  const handleCopy = () => {
    navigator.clipboard.writeText(batchId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusBadge = () => {
    if (isGenuine) {
      return {
        variantClass: 'hc-verify-hero--genuine',
        icon: '🔗',
        title: 'GENUINE / VERIFIED HONEY',
        subtitle: 'Cryptographically verified & traceable from hive to consumer',
      }
    }
    if (isUnderReview) {
      return {
        variantClass: 'hc-verify-hero--genuine',
        icon: '🍯',
        title: 'UNDER LABORATORY REVIEW',
        subtitle: 'Sample is currently undergoing secondary laboratory testing',
      }
    }
    if (isFailed) {
      return {
        variantClass: 'hc-verify-hero--failed',
        icon: '🛡️',
        title: 'VERIFICATION FAILED',
        subtitle: 'This batch did not pass authenticity or blockchain integrity checks',
      }
    }
    return {
      variantClass: 'hc-verify-hero--genuine',
      icon: '🔍',
      title: 'BATCH NOT FOUND',
      subtitle: 'This batch identifier is not registered on the HoneyChain network',
    }
  }

  const badge = getStatusBadge()

  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
      {/* Brand Header */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-full)', background: 'var(--primary-soft)', border: '1px solid var(--primary-light)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary-dark)' }}>
        <span>🍯</span> HONEYCHAIN PUBLIC PASSPORT
      </div>

      {/* Main Verification Status Card */}
      <div className={`hc-verify-hero ${badge.variantClass}`} style={{ width: '100%' }}>
        <div className="hc-verify-hero__icon">{badge.icon}</div>
        <h1 className="hc-verify-hero__title">
          {badge.title}
        </h1>
        <p className="hc-verify-hero__subtitle">
          {badge.subtitle}
        </p>

        {/* Batch ID Banner */}
        <div className="hc-verify-batch-pill">
          <span style={{ color: 'var(--text-secondary)' }}>Batch ID:</span>
          <span className="hc-verify-batch-val">{batchId}</span>
          <button
            type="button"
            onClick={handleCopy}
            title="Copy Batch ID"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}
          >
            {copied ? '✓' : '📋'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerificationHeader
