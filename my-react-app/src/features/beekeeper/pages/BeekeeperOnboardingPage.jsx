import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import { useBeekeeperProfile } from '../hooks/useBeekeeperProfile'
import { useLanguage } from '../../../i18n/LanguageContext'
import LocationSelector from '../components/LocationSelector'
import GlobalLanguageSelector from '../../../components/common/LanguageSelector'
import VoiceButton from '../../../components/common/VoiceButton'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import Alert from '../../../components/feedback/Alert'
import '../styles/beekeeper.css'

const TOTAL_STEPS = 6

export const BeekeeperOnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    kvicId: '',
    name: '',
    village: '',
    photoUrl: '',
    latitude: null,
    longitude: null,
    preferredLanguage: 'TAMIL',
  })
  const [stepErrors, setStepErrors] = useState({})
  const [successComplete, setSuccessComplete] = useState(false)

  const { createProfile, loading, error, clearError } = useBeekeeperProfile()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const validateCurrentStep = () => {
    const errs = {}
    if (currentStep === 1) {
      if (!formData.kvicId.trim()) errs.kvicId = t('validation.required', 'KVIC ID is required')
    } else if (currentStep === 2) {
      if (!formData.name.trim()) errs.name = t('validation.required', 'Full name is required')
      if (!formData.village.trim()) errs.village = t('validation.required', 'Village/Town name is required')
    } else if (currentStep === 3) {
      if (!formData.village.trim()) errs.village = t('validation.required', 'Village name is required')
    }
    setStepErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (clearError) clearError()
    if (!validateCurrentStep()) return
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return
    const result = await createProfile(formData)
    if (!result.error) {
      setSuccessComplete(true)
      setTimeout(() => {
        navigate('/beekeeper/dashboard')
      }, 1500)
    }
  }

  const progressPct = (currentStep / TOTAL_STEPS) * 100

  return (
    <BeekeeperLayout>
      <div style={{ width: '100%', paddingTop: 'var(--space-4)', position: 'relative' }}>

        {/* Top Header */}
        <header style={{ maxWidth: 768, margin: '0 auto var(--space-6)', width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-2xl)' }}>🍯</span>
              <span style={{ fontWeight: 'var(--font-extrabold)', fontSize: 'var(--text-xl)', color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                {t('common.appName', 'HoneyChain')}
              </span>
            </div>
            <GlobalLanguageSelector />
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0', fontFamily: 'var(--font-display)' }}>
            {t('onboarding.title', 'Beekeeper Setup')}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', margin: 0 }}>
            {t('onboarding.sub', 'Complete your identity and apiary verification')}
          </p>

          {/* Progress Bar */}
          <div style={{ marginTop: 'var(--space-6)', maxWidth: 512, margin: 'var(--space-6) auto 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--primary)', marginBottom: 'var(--space-2)' }}>
              <span>Step {currentStep} of {TOTAL_STEPS}</span>
              <span>{Math.round(progressPct)}% Completed</span>
            </div>
            <div style={{ width: '100%', height: 10, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-muted)', overflow: 'hidden' }}>
              <div style={{ height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.3s ease', borderRadius: 'var(--radius-full)', width: `${progressPct}%` }} />
            </div>
          </div>
        </header>

        {/* Main Step Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', alignItems: 'start', maxWidth: 1024, margin: '0 auto' }}>
          {/* Main Form Step Area */}
          <main>
            <Card style={{ padding: 'var(--space-8)', boxShadow: 'var(--shadow-xl)', borderRadius: 'var(--radius-3xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
                <VoiceButton translationKey="onboarding.sub" />
              </div>

              {error && <Alert type="error" message={error} onClose={clearError} style={{ marginBottom: 'var(--space-6)' }} />}

              {successComplete ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-10) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div style={{ fontSize: 'var(--text-5xl)' }}>🎉</div>
                  <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: 0 }}>
                    {t('success.profileSaved', 'Profile Created Successfully!')}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', margin: 0 }}>
                    {t('loading.loading', 'Redirecting to your Beekeeper Dashboard...')}
                  </p>
                </div>
              ) : (
                <div>
                  {/* Step 1: KVIC ID */}
                  {currentStep === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{ fontSize: 'var(--text-4xl)' }}>📜</span>
                        <div>
                          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }}>
                            {t('onboarding.kvicId', 'Enter your KVIC ID')}
                          </h2>
                          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', margin: 0 }}>Assigned by Khadi & Village Industries Commission</p>
                        </div>
                      </div>
                      <Input
                        id="onboarding-kvic-id"
                        label={t('onboarding.kvicId', 'KVIC ID Number *')}
                        value={formData.kvicId}
                        onChange={(e) => setFormData({ ...formData, kvicId: e.target.value.toUpperCase() })}
                        placeholder={t('onboarding.kvicPlaceholder', 'e.g. KVIC-BH-88421')}
                        error={stepErrors.kvicId}
                        required
                      />
                    </div>
                  )}

                  {/* Step 2: Name & Village */}
                  {currentStep === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{ fontSize: 'var(--text-4xl)' }}>👤</span>
                        <div>
                          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }}>
                            {t('onboarding.fullName', 'Personal Information')}
                          </h2>
                          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', margin: 0 }}>Appears on public honey batch certificates</p>
                        </div>
                      </div>
                      <Input id="onboarding-name" label={t('onboarding.fullName', 'Full Name *')} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={t('onboarding.namePlaceholder', 'e.g. Ramesh Kumar')} error={stepErrors.name} required />
                      <Input id="onboarding-village" label={t('onboarding.village', 'Village / Base Town *')} value={formData.village} onChange={(e) => setFormData({ ...formData, village: e.target.value })} placeholder={t('onboarding.villagePlaceholder', 'e.g. Rampur, Bihar')} error={stepErrors.village} required />
                    </div>
                  )}

                  {/* Step 3: Location */}
                  {currentStep === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{ fontSize: 'var(--text-4xl)' }}>📍</span>
                        <div>
                          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }}>
                            {t('verification.beekeeperInfo', 'Apiary Location')}
                          </h2>
                          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', margin: 0 }}>Provides honey origin proof for consumers</p>
                        </div>
                      </div>
                      <LocationSelector
                        village={formData.village}
                        latitude={formData.latitude}
                        longitude={formData.longitude}
                        onVillageChange={(v) => setFormData({ ...formData, village: v })}
                        onLocationChange={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
                        errors={stepErrors}
                      />
                    </div>
                  )}

                  {/* Step 4: Language */}
                  {currentStep === 4 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{ fontSize: 'var(--text-4xl)' }}>🗣️</span>
                        <div>
                          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }}>
                            {t('onboarding.language', 'Preferred Language')}
                          </h2>
                          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', margin: 0 }}>Select your preferred app and SMS notification language</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Optional Photo */}
                  {currentStep === 5 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{ fontSize: 'var(--text-4xl)' }}>📸</span>
                        <div>
                          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }}>
                            {t('profile.uploadPhoto', 'Profile Photo (Optional)')}
                          </h2>
                          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', margin: 0 }}>Builds trust with marketplace buyers</p>
                        </div>
                      </div>
                      <Input id="onboarding-photo" label="Photo URL" value={formData.photoUrl} onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })} placeholder="https://..." />
                    </div>
                  )}

                  {/* Step 6: Review & Submit */}
                  {currentStep === 6 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{ fontSize: 'var(--text-4xl)' }}>🔍</span>
                        <div>
                          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }}>Review Details</h2>
                          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', margin: 0 }}>Confirm your information before submission</p>
                        </div>
                      </div>

                      <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-2xl)', backgroundColor: 'var(--primary-soft)', border: '1px solid var(--primary-light)', fontSize: 'var(--text-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {[
                          { label: t('onboarding.kvicId', 'KVIC ID'), value: formData.kvicId, mono: true },
                          { label: t('onboarding.fullName', 'Name'), value: formData.name },
                          { label: t('onboarding.village', 'Village'), value: formData.village },
                        ].map(({ label, value, mono }, idx, arr) => (
                          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: idx < arr.length - 1 ? 'var(--space-2)' : 0, borderBottom: idx < arr.length - 1 ? `1px solid var(--primary-light)` : 'none' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{label}:</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: mono ? 'var(--font-bold)' : 'var(--font-semibold)', fontFamily: mono ? 'monospace' : undefined }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-8)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
                    {currentStep > 1 && (
                      <Button type="button" variant="secondary" onClick={handlePrev}>
                        {t('common.back', '← Back')}
                      </Button>
                    )}

                    {currentStep < TOTAL_STEPS ? (
                      <Button id="onboarding-continue-btn" type="button" variant="primary" onClick={handleNext} style={{ flex: 1, fontWeight: 'var(--font-bold)' }}>
                        {t('common.continue', 'Continue →')}
                      </Button>
                    ) : (
                      <Button id="onboarding-submit-btn" type="button" variant="primary" onClick={handleSubmit} loading={loading} style={{ flex: 1, fontWeight: 'var(--font-bold)' }}>
                        {t('onboarding.submitOnboarding', 'Create Profile ✨')}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </main>

          {/* Sidebar Guidance Column */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Card style={{ border: '1px solid var(--primary-light)', background: 'linear-gradient(135deg, rgba(253,230,138,0.2) 0%, var(--surface) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-xl)' }}>🌟</span>
                <h3 style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', margin: 0 }}>Why Onboarding Matters</h3>
              </div>
              <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.7, listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {[
                  { bold: 'Direct Payouts:', text: 'Sell pure honey directly to consumers at guaranteed fair floor prices.' },
                  { bold: 'Cryptographic Trust:', text: 'Every jar is tied to your verified apiary coordinates.' },
                  { bold: 'Free IoT Telemetry:', text: 'Connect smart hive sensors to monitor weight, moisture, and colony health.' },
                ].map(({ bold, text }) => (
                  <li key={bold} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-1)' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'var(--font-bold)', flexShrink: 0 }}>✓</span>
                    <span><strong>{bold}</strong> {text}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>

        {/* Footer */}
        <footer style={{ maxWidth: 512, margin: 'var(--space-8) auto 0', width: '100%', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)' }}>
          HoneyChain • National Honey Traceability Platform
        </footer>
      </div>
    </BeekeeperLayout>
  )
}

export default BeekeeperOnboardingPage
