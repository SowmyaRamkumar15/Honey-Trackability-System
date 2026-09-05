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

export const PublicVerificationPage = () => {
  const { batchId } = useParams()
  const { verification, loading, error, refetch } = useVerification(batchId)
  const { t } = useLanguage()
  const [activeCertificateUrl, setActiveCertificateUrl] = useState(null)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 py-3.5 px-4 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍯</span>
            <span className="font-bold text-lg text-blue-600 font-['Outfit'] tracking-tight">
              HoneyChain
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold hidden sm:inline-block">
              ● PUBLIC SCAN
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <LoadingSpinner text={t('loading.verifying', 'Verifying honey batch cryptography & laboratory records on HoneyChain...')} />
            <p className="text-xs text-[#64748B]">Reconstructing canonical batch proof...</p>
          </div>
        ) : error ? (
          <Card className="text-center py-16 space-y-4 border border-[#E2E8F0] bg-white">
            <div className="text-5xl">⚠️</div>
            <h2 className="text-xl font-bold text-[#1E293B] font-['Inter']">{t('errors.generic', 'Verification Service Unavailable')}</h2>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">{error}</p>
            <Button variant="primary" size="sm" onClick={refetch} className="mt-2">
              ↻ {t('common.retry', 'Try Again')}
            </Button>
          </Card>
        ) : !verification ? (
          <Card className="text-center py-16 space-y-4 bg-white border border-[#E2E8F0]">
            <div className="text-5xl">🔍</div>
            <h2 className="text-xl font-bold text-[#1E293B] font-['Inter']">{t('errors.batchNotFound', 'Batch Not Found')}</h2>
            <p className="text-xs text-[#64748B]">No record found for batch ID {batchId}.</p>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-[#D97706]">{t('verification.pageTitle', 'Public Honey Origin & Purity Verification')}</span>
              <VoiceButton translationKey="verification.pageTitle" size="xs" />
            </div>

            {/* Header & Main Trust Status */}
            <VerificationHeader verification={verification} batchId={batchId} />

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

            {/* Blockchain Proof */}
            <BlockchainCard blockchain={verification.blockchain} />

            {/* Milestone Timeline */}
            <VerificationTimeline timeline={verification.timeline} />

            {/* Verification History & Anti-Counterfeit Risk Detection */}
            <VerificationHistoryCard
              batchId={batchId}
              initialSummary={verification.verificationHistory}
            />

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
      <footer className="border-t border-[#E2E8F0] bg-white py-6 px-4 text-center text-xs text-[#64748B] space-y-1">
        <p className="text-[#64748B]">
          Powered by <strong className="text-[#1E293B] font-['Inter']">HoneyChain Traceability Protocol</strong>
        </p>
        <p className="text-[11px]">Direct-from-source honey verification with tamper-proof blockchain integrity.</p>
      </footer>
    </div>
  )
}

export default PublicVerificationPage
