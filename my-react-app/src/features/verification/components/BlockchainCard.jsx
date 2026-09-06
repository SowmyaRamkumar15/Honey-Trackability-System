import React, { useState } from 'react'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import '../styles/verification.css'

export const BlockchainCard = ({ blockchain }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [copiedTx, setCopiedTx] = useState(false)

  if (!blockchain) return null

  const handleCopyTx = () => {
    if (blockchain.transactionHash) {
      navigator.clipboard.writeText(blockchain.transactionHash)
      setCopiedTx(true)
      setTimeout(() => setCopiedTx(false), 2000)
    }
  }

  const shortTx = blockchain.transactionHash
    ? `${blockchain.transactionHash.substring(0, 10)}...${blockchain.transactionHash.substring(
      blockchain.transactionHash.length - 8
    )}`
    : '—'

  return (
    <Card
      header={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)' }}>
            🔗 Blockchain Immutable Proof
          </h3>
          <Badge variant="info" size="sm">
            Tamper-Proof
          </Badge>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--background)', border: '1px solid var(--border)' }}>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600, fontSize: '11px' }}>Blockchain Network</p>
            <p style={{ margin: '2px 0 0', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{blockchain.network}</p>
          </div>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--background)', border: '1px solid var(--border)' }}>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600, fontSize: '11px' }}>Block Height</p>
            <p style={{ margin: '2px 0 0', color: 'var(--primary-dark)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>#{blockchain.blockNumber}</p>
          </div>
        </div>

        {/* Transaction Hash */}
        <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--background)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Transaction Hash</p>
            <p style={{ margin: '2px 0 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shortTx}</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopyTx}
          >
            {copiedTx ? 'Copied' : 'Copy'}
          </Button>
        </div>

        {/* Expandable Technical Proof Details */}
        <div>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 600, padding: 0 }}
          >
            <span>{showDetails ? '▲ Hide' : '▼ View'} Cryptographic SHA-256 Digest</span>
          </button>

          {showDetails && (
            <div style={{ marginTop: 'var(--space-2)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', wordBreak: 'break-all', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Data Hash (SHA-256):</span>
                <span style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>{blockchain.dataHash}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Timestamp:</span>
                <span>{blockchain.recordedAt ? new Date(blockchain.recordedAt).toISOString() : '—'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default BlockchainCard
