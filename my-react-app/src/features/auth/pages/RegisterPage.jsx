import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import LanguageSelector from '../../../components/common/LanguageSelector'
import { ROLES } from '../../../constants/roles'
import '../styles/auth.css'

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    role: ROLES.BEEKEEPER,
  })

  const { sendOtp, loading, error, clearError } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await sendOtp(formData)
    if (!result.error) {
      navigate('/otp-login')
    }
  }

  return (
    <div className="hc-auth-page">
      {/* Language Switcher */}
      <div className="hc-auth-page__lang">
        <LanguageSelector />
      </div>

      <div className="hc-auth-card">
        <div className="hc-auth-header">
          <Link to="/" className="hc-auth-brand">
            <div className="hc-auth-brand-logo">
              🍯
            </div>
            <span className="hc-auth-brand-name">
              HoneyChain
            </span>
          </Link>
          <h1 className="hc-auth-title">Create Account</h1>
          <p className="hc-auth-subtitle">Register as a Beekeeper or Customer</p>
        </div>

        {error && <Alert type="error" message={error} onClose={clearError} style={{ marginBottom: '16px' }} />}

        <form id="register-form" onSubmit={handleSubmit} className="hc-auth-form">
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', marginBottom: '8px', color: 'var(--text-primary)' }}>
              I want to register as...
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: ROLES.BEEKEEPER })}
                className={`hc-btn ${formData.role === ROLES.BEEKEEPER ? 'hc-btn--primary' : 'hc-btn--secondary'}`}
                style={{ width: '100%', padding: '10px' }}
              >
                🌿 Beekeeper
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: ROLES.CUSTOMER })}
                className={`hc-btn ${formData.role === ROLES.CUSTOMER ? 'hc-btn--primary' : 'hc-btn--secondary'}`}
                style={{ width: '100%', padding: '10px' }}
              >
                🛒 Customer
              </button>
            </div>
          </div>

          <Input
            id="register-phone"
            name="phoneNumber"
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => {
              setFormData({ ...formData, phoneNumber: e.target.value })
              if (error) clearError()
            }}
            placeholder="10-digit mobile number"
            required
          />

          <Button
            id="register-submit-btn"
            type="submit"
            variant="primary"
            loading={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            Get OTP & Register →
          </Button>
        </form>

        <p className="hc-auth-footer">
          Already registered?{' '}
          <Link to="/otp-login">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
