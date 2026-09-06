import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../../../i18n/LanguageContext'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import LanguageSelector from '../../../components/common/LanguageSelector'
import { ROLES, ROLE_ROUTES } from '../../../constants/roles'
import '../styles/auth.css'

export const OtpLoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [selectedRole, setSelectedRole] = useState(ROLES.BEEKEEPER)

  const {
    sendOtp,
    verifyOtp,
    loading,
    error,
    otpSent,
    isAuthenticated,
    role,
    clearError,
    resetOtpState,
  } = useAuth()

  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && role) {
      const target = ROLE_ROUTES[role] || '/'
      navigate(target, { replace: true })
    }
  }, [isAuthenticated, role, navigate])

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!phoneNumber) return
    await sendOtp({ phoneNumber, role: selectedRole })
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp) return
    await verifyOtp({ phoneNumber, otp, role: selectedRole })
  }

  const handleQuickBeekeeper = () => {
    setPhoneNumber('9876543213')
    setSelectedRole(ROLES.BEEKEEPER)
    if (error) clearError()
  }

  const handleQuickCustomer = () => {
    setPhoneNumber('9876543214')
    setSelectedRole(ROLES.CUSTOMER)
    if (error) clearError()
  }

  return (
    <div className="hc-auth-page">
      {/* Language Switcher */}
      <div className="hc-auth-page__lang">
        <LanguageSelector />
      </div>

      <div className="hc-auth-card">
        {/* Header */}
        <div className="hc-auth-header">
          <Link to="/" className="hc-auth-brand">
            <div className="hc-auth-brand-logo">
              🍯
            </div>
            <span className="hc-auth-brand-name">
              HoneyChain
            </span>
          </Link>
          <h1 className="hc-auth-title">
            {t('auth.otpLoginTitle', 'OTP Login')}
          </h1>
          <p className="hc-auth-subtitle">
            {t('auth.otpLoginSub', 'Instant passwordless access via SMS')}
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={clearError} style={{ marginBottom: '16px' }} />}

        {!otpSent ? (
          /* Step 1: Phone + Role */
          <form id="send-otp-form" onSubmit={handleSendOtp} className="hc-auth-form">
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', marginBottom: '8px', color: 'var(--text-primary)' }}>
                {t('auth.selectRole', 'Select Your Role')}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedRole(ROLES.BEEKEEPER)}
                  className={`hc-btn ${selectedRole === ROLES.BEEKEEPER ? 'hc-btn--primary' : 'hc-btn--secondary'}`}
                  style={{ width: '100%', padding: '10px' }}
                >
                  🌿 {t('auth.beekeeperRole', 'Beekeeper')}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole(ROLES.CUSTOMER)}
                  className={`hc-btn ${selectedRole === ROLES.CUSTOMER ? 'hc-btn--primary' : 'hc-btn--secondary'}`}
                  style={{ width: '100%', padding: '10px' }}
                >
                  🛒 {t('auth.customerRole', 'Customer')}
                </button>
              </div>
            </div>

            <Input
              id="otp-phone-input"
              label={t('auth.phoneLabel', 'Mobile Phone Number')}
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value)
                if (error) clearError()
              }}
              placeholder={t('auth.phonePlaceholder', '10-digit mobile number')}
              required
            />

            <Button
              id="send-otp-btn"
              type="submit"
              variant="primary"
              loading={loading}
              style={{ width: '100%', marginTop: '8px' }}
            >
              {t('auth.sendOtp', 'Send OTP →')}
            </Button>
          </form>
        ) : (
          /* Step 2: Verify OTP */
          <form id="verify-otp-form" onSubmit={handleVerifyOtp} className="hc-auth-form">
            <div style={{ padding: '12px', backgroundColor: 'var(--success-soft)', border: '1px solid var(--success-border)', color: 'var(--success)', borderRadius: 'var(--radius-xl)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
              {t('auth.otpSentBanner', { phone: phoneNumber, code: '123456' }) || `OTP sent to ${phoneNumber} (Demo code: 123456)`}
            </div>

            <Input
              id="otp-code-input"
              label={t('auth.enterOtp', 'Enter 6-Digit OTP')}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value)
                if (error) clearError()
              }}
              placeholder="123456"
              maxLength={6}
              style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}
              required
            />

            <Button
              id="verify-otp-btn"
              type="submit"
              variant="primary"
              loading={loading}
              style={{ width: '100%' }}
            >
              {t('auth.verifyOtp', 'Verify & Login')}
            </Button>

            <button
              type="button"
              onClick={resetOtpState}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', padding: '4px' }}
            >
              {t('auth.changePhone', '← Change Phone Number')}
            </button>
          </form>
        )}

        {/* Switch to Password */}
        <div className="hc-auth-footer">
          <Link
            to="/login"
            id="switch-to-password-btn"
            style={{ display: 'block', padding: '10px', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-primary)' }}
          >
            {t('auth.switchToPassword', '🛡️ Admin / Lab? Login with Password')}
          </Link>
        </div>

        {/* Quick Fills */}
        <div className="hc-auth-quick-fill">
          <div className="hc-auth-quick-fill-title">
            <span>{t('auth.quickFill', 'Demo Quick-Access Presets:')}</span>
          </div>
          <div className="hc-auth-quick-fill-buttons">
            <button
              type="button"
              onClick={handleQuickBeekeeper}
              className="hc-auth-quick-fill-btn"
            >
              🌿 {t('auth.beekeeperRole', 'Beekeeper')}
            </button>
            <button
              type="button"
              onClick={handleQuickCustomer}
              className="hc-auth-quick-fill-btn"
            >
              🛒 {t('auth.customerRole', 'Customer')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OtpLoginPage
