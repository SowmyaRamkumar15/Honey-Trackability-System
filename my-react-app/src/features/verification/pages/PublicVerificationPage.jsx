import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import VerificationHeader from '../components/VerificationHeader'
import BeekeeperCard from '../components/BeekeeperCard'
import PurityCard from '../components/PurityCard'
import BlockchainCard from '../components/BlockchainCard'
import VerificationTimeline from '../components/VerificationTimeline'
import VerificationHistoryCard from '../components/VerificationHistoryCard'
import CertificateViewer from '../components/CertificateViewer'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import LanguageSelector from '../../../components/common/LanguageSelector'
import VoiceButton from '../../../components/common/VoiceButton'
import { useVerification } from '../hooks/useVerification'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/verification.css'

export const PublicVerificationPage = () => {
  const { batchId } = useParams()
  const { verification, loading, error, refetch } = useVerification(batchId)
  const { t } = useLanguage()
  const [activeCertificateUrl, setActiveCertificateUrl] = useState(null)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Top Navbar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: 'var(--space-3) var(--space-4)', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem' }}>🍯</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--primary-dark)' }}>
              HoneyChain
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <LanguageSelector />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--primary-soft)', border: '1px solid var(--primary-light)', color: 'var(--primary-dark)' }}>
              ● PUBLIC SCAN
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', padding: 'var(--space-6) var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {loading ? (
          <div style={{ padding: 'var(--space-10) 0', textAlign: 'center' }}>
            <LoadingSpinner message={t('loading.verifying', 'Verifying honey batch cryptography & laboratory records on HoneyChain...')} />
          </div>
        ) : error ? (
          <Card style={{ maxWidth: '540px', margin: 'var(--space-8) auto', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>⚠️</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', margin: 0 }}>{t('errors.generic', 'Verification Service Unavailable')}</h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 'var(--space-2) 0' }}>{error}</p>
            <Button variant="primary" size="sm" onClick={refetch}>
              ↻ {t('common.retry', 'Try Again')}
            </Button>
          </Card>
        ) : !verification ? (
          <Card style={{ maxWidth: '540px', margin: 'var(--space-8) auto', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🔍</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', margin: 0 }}>{t('errors.batchNotFound', 'Batch Not Found')}</h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 'var(--space-2) 0' }}>No record found for batch ID {batchId}.</p>
          </Card>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary-dark)' }}>
                {t('verification.pageTitle', 'Public Honey Origin & Purity Verification')}
              </span>
              <VoiceButton translationKey="verification.pageTitle" size="sm" />
            </div>

            {/* Header & Main Trust Status */}
            <VerificationHeader verification={verification} batchId={batchId} />

            {/* Responsive 2-Column Grid on Desktop */}
            <div className="hc-verify-grid">
              {/* Left Column: Origin, Purity Analysis, Label */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {/* Beekeeper & Origin Info */}
                <BeekeeperCard
                  beekeeper={verification.beekeeper}
                  harvestDate={verification.harvestDate}
                  hiveCode={verification.hiveCode}
                  clusterName={verification.clusterName}
                  quantityKg={verification.quantityKg}
                  batchPhotoUrl={verification.batchPhotoUrl}
                />

                {/* Purity Analysis */}
                <PurityCard
                  purity={verification.purity}
                  onOpenCertificate={setActiveCertificateUrl}
                />

                {/* Printable Physical Honey Jar Authenticity Label */}
                <Card className="print-hide">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                    <div>
                      <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                        🏷️ Official Physical Jar Authenticity Label
                      </h3>
                      <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                        Print-ready tamper-proof label for physical honey containers and retail packaging.
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => window.print()}>
                      🖨️ Print Label
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Right Column: Blockchain, Timeline, Anti-Counterfeit */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {/* Blockchain Proof */}
                <BlockchainCard blockchain={verification.blockchain} />

                {/* Milestone Timeline */}
                <VerificationTimeline timeline={verification.timeline} />

                {/* Verification History & Anti-Counterfeit Risk Detection */}
                <VerificationHistoryCard
                  batchId={batchId}
                  initialSummary={verification.verificationHistory}
                />
              </div>
            </div>

            {/* Dedicated Print Only Label Node */}
            <div className="printable-qr-label" style={{ display: 'none' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D97706' }}>🍯 HoneyChain</div>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                National Honey Traceability Protocol
              </div>
              <div style={{ margin: '8px 0', padding: '6px', border: '1px solid #e2e8f0', display: 'inline-block', borderRadius: '4px' }}>
                <div style={{ fontSize: '24px' }}>📱</div>
                <div style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 700 }}>Scan to Verify Authenticity</div>
              </div>
              <div style={{ fontFamily: 'monospace', fontWeight: 800 }}>{batchId}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', marginTop: '4px' }}>
                ✓ Certified Pure ({verification?.purity?.score || 98}%)
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                Beekeeper: <strong>{verification?.beekeeper?.fullName || 'Certified Apiary'}</strong>
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                Origin: {verification?.beekeeper?.village || 'India'}
              </div>
            </div>

            {/* Certificate Modal */}
            {activeCertificateUrl && (
              <CertificateViewer
                url={activeCertificateUrl}
                onClose={() => setActiveCertificateUrl(null)}
              />
            )}
          </>
        )}
      </main>

      {/* Trust Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', padding: 'var(--space-5) var(--space-4)', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
        <p style={{ margin: 0 }}>
          Powered by <strong style={{ color: 'var(--text-primary)' }}>HoneyChain Traceability Protocol</strong>
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>Direct-from-source honey verification with tamper-proof blockchain integrity.</p>
      </footer>
    </div>
  )
}

export default PublicVerificationPage
