import React, { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import batchApi from '../api/batchApi'
import '../styles/batch.css'

export const BlockchainStatusCard = ({ batchId }) => {
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)
  const [copiedKey, setCopiedKey] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!batchId) return
    const fetchRecord = async () => {
      try {
        setLoading(true)
        const res = await batchApi.getBlockchainRecord(batchId)
        setRecord(res.data.data)
      } catch (err) {
        setError('Blockchain record not yet available.')
      } finally {
        setLoading(false)
      }
    }
    fetchRecord()
  }, [batchId])

  const handleVerify = async () => {
    try {
      setVerifying(true)
      setVerificationResult(null)
      const res = await batchApi.verifyBlockchainRecord(batchId)
      setVerificationResult(res.data.data)
    } catch (err) {
      setVerificationResult({
        verified: false,
        message: err.response?.data?.message || 'Verification request failed',
      })
    } finally {
      setVerifying(false)
    }
  }

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const shortenHash = (hash, prefixLen = 10, suffixLen = 10) => {
    if (!hash || hash.length <= prefixLen + suffixLen) return hash
    return `${hash.substring(0, prefixLen)}...${hash.substring(hash.length - suffixLen)}`
  }

  if (loading) {
    return (
      <Card style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          <span>🔗</span> Loading blockchain record...
        </div>
      </Card>
    )
  }

  if (error || !record || !record.recorded) {
    return (
      <Card style={{ padding: 'var(--space-6)', border: '1px dashed var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: '1.5rem' }}>🔗</span>
            <div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', margin: 0 }}>
                Blockchain Record
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                {error || 'No blockchain record found for this batch.'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-light)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div className="hc-batch-icon">
            🔗
          </div>
          <div>
            <h3 style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)', margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              Blockchain Ledger
              <Badge variant="primary">Immutable Proof</Badge>
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Network: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-dark)', fontWeight: 'var(--font-bold)' }}>{record.network}</span> · Block #{record.blockNumber}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          loading={verifying}
          onClick={handleVerify}
          style={{ fontWeight: 'var(--font-bold)' }}
        >
          {verifying ? 'Recalculating SHA-256...' : '🛡️ Verify Record'}
        </Button>
      </div>

      {/* Verification Result Banner */}
      {verificationResult && (
        <div
          style={{
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-xl)',
            border: `1px solid ${verificationResult.verified ? 'var(--success-border)' : 'var(--danger-border)'}`,
            backgroundColor: verificationResult.verified ? 'var(--success-soft)' : 'var(--danger-soft)',
            color: verificationResult.verified ? 'var(--success)' : 'var(--danger)',
            fontSize: 'var(--text-xs)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)' }}>
            <span>{verificationResult.verified ? '✅' : '❌'}</span>
            <span>{verificationResult.verified ? 'Blockchain Hash Match Confirmed' : 'Tamper Detected!'}</span>
          </div>
          <p style={{ color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>{verificationResult.message}</p>
          {verificationResult.calculatedHash && (
            <div style={{ paddingTop: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <p style={{ margin: 0 }}>Stored Hash: <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-bold)' }}>{verificationResult.storedHash}</span></p>
              <p style={{ margin: 0 }}>Computed Hash: <span style={{ color: verificationResult.verified ? 'var(--success)' : 'var(--danger)', fontWeight: 'var(--font-bold)' }}>{verificationResult.calculatedHash}</span></p>
            </div>
          )}
        </div>
      )}

      {/* Crypto Details Grid */}
      <div className="hc-crypto-hash-grid">
        {/* Data Hash */}
        <div className="hc-hash-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SHA-256 Data Hash</span>
            <button
              onClick={() => handleCopy(record.dataHash, 'dataHash')}
              style={{ color: 'var(--primary)', fontWeight: 'var(--font-semibold)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xs)' }}
            >
              {copiedKey === 'dataHash' ? '✓ Copied' : 'Copy Full'}
            </button>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)', wordBreak: 'break-all', fontWeight: 'var(--font-semibold)', margin: 0 }}>
            {shortenHash(record.dataHash, 14, 14)}
          </p>
        </div>

        {/* Transaction Hash */}
        <div className="hc-hash-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transaction Hash</span>
            <button
              onClick={() => handleCopy(record.transactionHash, 'txHash')}
              style={{ color: 'var(--primary)', fontWeight: 'var(--font-semibold)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xs)' }}
            >
              {copiedKey === 'txHash' ? '✓ Copied' : 'Copy Full'}
            </button>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)', wordBreak: 'break-all', fontWeight: 'var(--font-semibold)', margin: 0 }}>
            {shortenHash(record.transactionHash, 14, 14)}
          </p>
        </div>
      </div>

      {/* Bottom Metadata */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', paddingTop: 'var(--space-1)' }}>
        <span>Recorded: {record.recordedAt ? new Date(record.recordedAt).toLocaleString('en-IN') : '—'}</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>Record Type: {record.recordType}</span>
      </div>
    </Card>
  )
}

export default BlockchainStatusCard
