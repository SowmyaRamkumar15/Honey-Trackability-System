import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../../../i18n/LanguageContext'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import LanguageSelector from '../../../components/common/LanguageSelector'
import { ROLE_ROUTES } from '../../../constants/roles'
import '../styles/auth.css'

export const LoginPage = ({ initialRole }) => {
  const [formData, setFormData] = useState({ phoneNumber: '', password: '' })
  const [activeRoleTab, setActiveRoleTab] = useState(initialRole || 'ALL')
  const { loginWithPassword, loading, error, isAuthenticated, role, clearError } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && role) {
      const targetRoute = ROLE_ROUTES[role] || '/'
      navigate(targetRoute, { replace: true })
    }
  }, [isAuthenticated, role, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await loginWithPassword(formData)
  }

  const handleQuickFill = (phone, pass, selectedRole) => {
    setFormData({ phoneNumber: phone, password: pass })
    if (selectedRole) setActiveRoleTab(selectedRole)
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
            {t('auth.loginTitle', 'Sign In to HoneyChain')}
          </h1>
          <p className="hc-auth-subtitle">
            {t('auth.loginSub', 'Secure Role-Based Portal Access')}
          </p>
        </div>

        {/* Role Portal Tabs */}
        <div className="hc-auth-tabs">
          <Link
            to="/login/customer"
            className={`hc-auth-tab ${activeRoleTab === 'CUSTOMER' ? 'hc-auth-tab--active' : ''}`}
          >
            🛒 Customer
          </Link>
          <Link
            to="/login/beekeeper"
            className={`hc-auth-tab ${activeRoleTab === 'BEEKEEPER' ? 'hc-auth-tab--active' : ''}`}
          >
            🐝 Beekeeper
          </Link>
          <Link
            to="/login/lab"
            className={`hc-auth-tab ${activeRoleTab === 'LAB' ? 'hc-auth-tab--active' : ''}`}
          >
            🔬 Lab
          </Link>
          <Link
            to="/login/admin"
            className={`hc-auth-tab ${activeRoleTab === 'ADMIN' ? 'hc-auth-tab--active' : ''}`}
          >
            🛡️ Admin
          </Link>
        </div>

        {error && <Alert type="error" message={error} onClose={clearError} style={{ marginBottom: '16px' }} />}

        {/* Form */}
        <form id="login-form" onSubmit={handleSubmit} className="hc-auth-form">
          <Input
            id="login-phone"
            name="phoneNumber"
            label={t('auth.phoneLabel', 'Phone Number or Username')}
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder={t('auth.phonePlaceholder', 'e.g. 9876543210')}
            required
          />

          <Input
            id="login-password"
            name="password"
            type="password"
            label={t('auth.passwordLabel', 'Password')}
            value={formData.password}
            onChange={handleChange}
            placeholder={t('auth.passwordPlaceholder', '••••••••')}
            required
          />

          <Button
            id="login-submit-btn"
            type="submit"
            variant="primary"
            loading={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {t('navigation.login', 'Sign In')}
          </Button>
        </form>

        {/* Switch to OTP */}
        <div className="hc-auth-footer">
          <Link
            to="/otp-login"
            id="switch-to-otp-btn"
            style={{ display: 'block', padding: '10px', backgroundColor: 'var(--primary-soft)', border: '1px solid var(--primary-light)', borderRadius: 'var(--radius-xl)' }}
          >
            {t('auth.switchToOtp', '📲 Beekeeper / Customer? Login with OTP')}
          </Link>
        </div>

        {/* Quick test credentials */}
        <div className="hc-auth-quick-fill">
          <div className="hc-auth-quick-fill-title">
            <span>{t('auth.quickFill', 'Demo Quick-Access Credentials:')}</span>
          </div>
          <div className="hc-auth-quick-fill-buttons">
            <button
              type="button"
              onClick={() => handleQuickFill('9876543210', 'Admin@123', 'ADMIN')}
              className="hc-auth-quick-fill-btn"
            >
              🛡️ {t('auth.adminRole', 'Admin')}
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('9876543212', 'Lab@123', 'LAB')}
              className="hc-auth-quick-fill-btn"
            >
              🔬 {t('auth.labRole', 'Lab')}
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('9876543211', 'Kvic@123', 'KVIC_OFFICER')}
              className="hc-auth-quick-fill-btn"
            >
              ⚖️ {t('auth.kvicRole', 'KVIC')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
