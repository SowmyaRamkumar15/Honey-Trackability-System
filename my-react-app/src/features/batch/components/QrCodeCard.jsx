import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import apiClient from '../../../services/axios'
import '../styles/batch.css'

export const QrCodeCard = ({ batch, onQrGenerated }) => {
  const [qrData, setQrData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [showPrintModal, setShowPrintModal] = useState(false)

  const isEligible = batch?.status === 'PURE' || batch?.status === 'QR_GENERATED'

  useEffect(() => {
    if (batch?.batchId && (batch.status === 'QR_GENERATED' || batch.status === 'PURE')) {
      setLoading(true)
      apiClient.get(`/beekeepers/batches/${batch.batchId}/qr`)
        .then((res) => setQrData(res.data.data))
        .catch(() => setQrData(null))
        .finally(() => setLoading(false))
    }
  }, [batch])

  const handleGenerateQr = async () => {
    try {
      setGenerating(true)
      setError(null)
      const res = await apiClient.post(`/beekeepers/batches/${batch.batchId}/generate-qr`)
      setQrData(res.data.data)
      if (onQrGenerated) onQrGenerated(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate QR code')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!qrData?.qrImageUrl) return
    const link = document.createElement('a')
    link.href = qrData.qrImageUrl
    link.download = `HONEYCHAIN-QR-${batch.batchId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Card style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span>📱</span> Smart QR Code Traceability Passport
        </h2>
        {qrData ? (
          <Badge variant="success">● QR Active</Badge>
        ) : (
          <Badge variant={isEligible ? 'primary' : 'neutral'}>
            {isEligible ? 'Ready to Generate' : 'Locked'}
          </Badge>
        )}
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {qrData ? (
        <div className="hc-qr-preview-row">
          {/* QR Image */}
          <div className="hc-qr-img-frame">
            <img
              src={qrData.qrImageUrl}
              alt={`QR for ${batch.batchId}`}
              style={{ width: '160px', height: '160px', objectFit: 'contain', borderRadius: 'var(--radius-lg)' }}
            />
          </div>

          {/* Details & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1, minWidth: 0 }}>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                <span>✅</span> Ready for Customer Verification
              </p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', margin: '2px 0 0 0' }}>
                {qrData.qrValue}
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)', paddingTop: 'var(--space-1)' }}>
              <Button size="sm" variant="primary" onClick={handleDownload} style={{ fontWeight: 'var(--font-bold)' }}>
                📥 Download PNG
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setShowPrintModal(true)}>
                🖨️ Print Label
              </Button>
              <Link to={`/verify/${batch.batchId}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <Button size="sm" variant="ghost" style={{ color: 'var(--primary)', fontWeight: 'var(--font-semibold)' }}>
                  View Public Page ↗
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : isEligible ? (
        <div style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-2xl)', border: '2px dashed var(--primary-light)', backgroundColor: 'var(--primary-soft)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
          <span style={{ fontSize: '2.5rem' }}>✨</span>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: 0 }}>
            Purity Verified — Generate QR Passport
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', maxWidth: '440px', margin: 0, lineHeight: 1.5 }}>
            This honey batch passed laboratory quality verification. Generate its permanent, cryptographic QR passport for consumers to verify on their smartphones.
          </p>
          <Button
            variant="primary"
            loading={generating}
            onClick={handleGenerateQr}
            style={{ marginTop: 'var(--space-2)', fontWeight: 'var(--font-bold)' }}
          >
            {generating ? 'Generating QR Code...' : '📱 Generate Smart QR Code'}
          </Button>
        </div>
      ) : (
        <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span>QR code generation unlocks once laboratory testing confirms PURE status.</span>
          <Badge variant="neutral">Current: {batch?.status}</Badge>
        </div>
      )}

      {/* Print Jar Label Modal */}
      {showPrintModal && qrData && (
        <Modal
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          title="Printable Honey Jar Label"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Printable Area */}
            <div id="honeychain-jar-label" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-2xl)', backgroundColor: '#ffffff', color: '#111827', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', border: '2px solid #111827', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)', letterSpacing: '0.05em' }}>
                <span>🍯</span> HONEYCHAIN VERIFIED
              </div>
              <p style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)', color: '#374151', margin: 0 }}>
                Batch: {batch.batchId}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBlock: 'var(--space-2)' }}>
                <img
                  src={qrData.qrImageUrl}
                  alt="QR Code"
                  style={{ width: '140px', height: '140px', objectFit: 'contain' }}
                />
              </div>
              <div style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--success-soft)', border: '1px solid var(--success-border)', color: 'var(--success)', fontSize: '0.625rem', fontWeight: 'var(--font-bold)' }}>
                ✅ 100% Pure · Blockchain Certified
              </div>
              <p style={{ fontSize: '0.5625rem', color: '#6b7280', fontWeight: 'var(--font-medium)', margin: 0 }}>
                Scan with smartphone camera to verify authenticity & hive origin
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', paddingTop: 'var(--space-2)' }}>
              <Button variant="primary" style={{ flex: 1, fontWeight: 'var(--font-bold)' }} onClick={handlePrint}>
                🖨️ Print Label Now
              </Button>
              <Button variant="secondary" style={{ flex: 1 }} onClick={() => setShowPrintModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  )
}

export default QrCodeCard
