import React from 'react'

const VerifiedBadge = ({ verified, batchId }) => {
  if (!verified) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '2px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-semibold)',
          backgroundColor: 'var(--warning-soft)',
          color: 'var(--warning)',
          border: '1px solid var(--warning-border)',
          boxShadow: 'var(--shadow-xs)',
        }}
        title="Blockchain verification pending"
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--warning)', display: 'inline-block' }} />
        Unverified
      </span>
    )
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '2px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-bold)',
        backgroundColor: 'var(--success-soft)',
        color: 'var(--success)',
        border: '1px solid var(--success-border)',
        boxShadow: 'var(--shadow-xs)',
      }}
      title={`Cryptographically verified on Blockchain (Batch: ${batchId || 'Verified'})`}
    >
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)', display: 'inline-block' }} />
      Verified
    </span>
  )
}

export default VerifiedBadge
