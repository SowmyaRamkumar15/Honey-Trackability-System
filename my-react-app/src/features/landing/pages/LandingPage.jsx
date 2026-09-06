import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../../components/common/Navbar'
import Footer from '../../../components/common/Footer'
import Button from '../../../components/ui/Button'
import { useLanguage } from '../../../i18n/LanguageContext'
import VoiceButton from '../../../components/common/VoiceButton'
import '../styles/landing.css'

export const LandingPage = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [backendStatus, setBackendStatus] = useState(null)
  const [verifyInput, setVerifyInput] = useState('')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setBackendStatus(data.success ? 'online' : 'error'))
      .catch(() => setBackendStatus('offline'))
  }, [])

  const handleVerifySubmit = (e) => {
    e.preventDefault()
    if (verifyInput.trim()) {
      navigate(`/verify/${encodeURIComponent(verifyInput.trim())}`)
    }
  }

  const voiceText = `${t('common.appName', 'HoneyChain')}. ${t('common.tagline', 'Blockchain-powered honey traceability')}. ${t('landing.heroDesc', 'From hive to table — every drop of honey verified, tested, and recorded on the blockchain.')}`

  return (
    <div className="hc-landing">
      {/* Background Decorative Gradients */}
      <div className="hc-landing__bg-glow-1" />
      <div className="hc-landing__bg-glow-2" />

      <Navbar transparent={true} />

      {/* Hero Section */}
      <section id="hero" className="hc-landing__hero">
        {/* Live Backend Status */}
        {backendStatus && (
          <div className="hc-landing__status-pill">
            <span
              className={`hc-landing__status-dot ${
                backendStatus === 'online' ? 'hc-landing__status-dot--online' : 'hc-landing__status-dot--offline'
              }`}
            />
            <span className="hc-landing__status-text">
              Network Status: {backendStatus === 'online' ? 'Live & Operational' : 'Offline'}
            </span>
          </div>
        )}

        {/* Hero Brand Icon & Audio Assist */}
        <div className="hc-landing__hero-icon-wrap">
          <div className="hc-landing__hero-icon">
            🍯
          </div>
          <VoiceButton textToSpeak={voiceText} size="sm" />
        </div>

        {/* Main Title */}
        <h1 className="hc-landing__hero-title">
          Honey<span className="hc-landing__hero-title-accent">Chain</span>
        </h1>

        {/* Tagline */}
        <p className="hc-landing__hero-tagline">
          {t('common.tagline', 'Blockchain-powered honey traceability & quality assurance')}
        </p>

        {/* Description */}
        <p className="hc-landing__hero-desc">
          {t(
            'landing.heroDesc',
            'From hive to table — every single drop of honey is verified by certified labs, cryptographically logged on-chain, and 100% traceable with instant QR verification.'
          )}
        </p>

        {/* Instant Batch Verification Search Bar */}
        <div className="hc-landing__search-box">
          <form onSubmit={handleVerifySubmit} className="hc-landing__search-form">
            <div className="hc-landing__search-input-wrap">
              <span>🔍</span>
              <input
                type="text"
                value={verifyInput}
                onChange={(e) => setVerifyInput(e.target.value)}
                placeholder="Enter Batch ID or scan QR (e.g. BATCH-2024-001)"
                className="hc-landing__search-input"
              />
            </div>
            <button
              type="submit"
              className="hc-landing__search-btn"
            >
              Verify Purity
            </button>
          </form>
        </div>

        {/* Role CTAs */}
        <div className="hc-landing__ctas">
          <Link to="/marketplace" id="hero-marketplace-btn">
            <Button variant="primary" size="lg">
              <span>🛒</span> Explore Pure Honey
            </Button>
          </Link>
          <Link to="/otp-login" id="hero-beekeeper-btn">
            <Button variant="secondary" size="lg">
              <span>🌿</span> Beekeeper Portal
            </Button>
          </Link>
          <Link to="/login" id="hero-admin-btn">
            <Button variant="secondary" size="lg">
              <span>🛡️</span> Lab & Admin Access
            </Button>
          </Link>
        </div>

        {/* Metric Badges */}
        <div className="hc-landing__metrics">
          {[
            { metric: '100%', label: 'Purity Certified', icon: '✨' },
            { metric: '100% On-Chain', label: 'Immutable Logs', icon: '⛓️' },
            { metric: '< 20%', label: 'Moisture Standard', icon: '💧' },
            { metric: 'Zero Fake', label: 'Anti-Adulteration', icon: '🛡️' },
          ].map((item) => (
            <div key={item.label} className="hc-landing__metric-card">
              <div className="hc-landing__metric-icon">{item.icon}</div>
              <div className="hc-landing__metric-val">{item.metric}</div>
              <div className="hc-landing__metric-label">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ecosystem Workflow */}
      <section className="hc-landing__arch">
        <div className="hc-landing__arch-inner">
          <div className="hc-landing__section-header">
            <h2 className="hc-landing__section-badge">
              Traceability Architecture
            </h2>
            <h3 className="hc-landing__section-title">
              How HoneyChain Protects Every Harvest
            </h3>
          </div>

          <div className="hc-landing__arch-grid">
            {[
              {
                step: '01',
                title: 'IoT Hive Monitoring',
                desc: 'Sensors track humidity, temperature, and harvest acoustics inside smart beehives.',
                icon: '🐝',
              },
              {
                step: '02',
                title: 'Certified Lab Testing',
                desc: 'Government-accredited labs test sucrose, moisture, and HMF for anti-adulteration.',
                icon: '🔬',
              },
              {
                step: '03',
                title: 'Blockchain Verification',
                desc: 'Purity scores and lab certificates are permanently written to the distributed ledger.',
                icon: '⛓️',
              },
              {
                step: '04',
                title: 'Consumer QR Scan',
                desc: 'Buyers scan the jar QR to inspect origin coordinates, floral type, and test results.',
                icon: '📱',
              },
            ].map((step) => (
              <div key={step.step} className="hc-landing__step-card">
                <div className="hc-landing__step-top">
                  <span className="hc-landing__step-icon">{step.icon}</span>
                  <span className="hc-landing__step-num">STEP {step.step}</span>
                </div>
                <h4 className="hc-landing__step-title">{step.title}</h4>
                <p className="hc-landing__step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholders & Features */}
      <section id="features" className="hc-landing__portals">
        <div className="hc-landing__section-header">
          <h2 className="hc-landing__section-badge">
            Multi-Stakeholder Portals
          </h2>
          <h3 className="hc-landing__section-title">
            {t('landing.unifiedEcosystem', 'Unified Ecosystem for All Actors')}
          </h3>
          <p className="hc-landing__hero-desc" style={{ margin: '8px auto 0 auto' }}>
            Tailored dashboards and specialized workflows for every member of the honey supply chain.
          </p>
        </div>

        <div className="hc-landing__portals-grid">
          {[
            {
              icon: '🌿',
              title: t('auth.beekeeperRole', 'Beekeepers'),
              desc: t('landing.beekeeperDesc', 'Register hives, log harvests, monitor IoT telemetry, and generate batches.'),
              link: '/login/beekeeper',
              cta: 'Beekeeper Portal →',
            },
            {
              icon: '🔬',
              title: t('auth.labRole', 'Lab Technicians'),
              desc: t('landing.labDesc', 'Conduct spectral tests, record purity % & HMF, and upload verifiable certificates.'),
              link: '/login/lab',
              cta: 'Lab Portal →',
            },
            {
              icon: '🛒',
              title: t('auth.customerRole', 'Consumers'),
              desc: t('landing.customerDesc', 'Browse direct-from-beekeeper raw honey, scan QR codes, and read verified reviews.'),
              link: '/marketplace',
              cta: 'Browse Honey →',
            },
            {
              icon: '⚖️',
              title: t('auth.kvicRole', 'KVIC / Admin'),
              desc: t('landing.adminDesc', 'Supervise national honey quality, audit compliance, and arbitrate trade disputes.'),
              link: '/login/admin',
              cta: 'Admin Console →',
            },
          ].map(({ icon, title, desc, link, cta }) => (
            <div key={title} className="hc-landing__portal-card">
              <div>
                <div className="hc-landing__portal-icon">
                  {icon}
                </div>
                <h3 className="hc-landing__portal-title">{title}</h3>
                <p className="hc-landing__portal-desc">{desc}</p>
              </div>
              <Link to={link} className="hc-landing__portal-cta">
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
