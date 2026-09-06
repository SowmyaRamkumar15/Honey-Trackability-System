import React, { useState, useEffect } from 'react'
import CustomerLayout from '../../../layouts/CustomerLayout'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import Badge from '../../../components/ui/Badge'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import customerApi from '../api/customerApi'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/customer.css'

export const CustomerProfilePage = () => {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileExists, setProfileExists] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await customerApi.getProfile()
      const data = res.data?.data
      if (data && data.fullName) {
        setProfileExists(true)
        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
        })
      }
    } catch (err) {
      setError(err.response?.data?.message || t('common.errorLoading', 'Failed to load profile'))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccessMsg('')
    try {
      if (profileExists) {
        await customerApi.updateProfile(formData)
        setSuccessMsg(t('profile.updateSuccess', 'Profile updated successfully!'))
      } else {
        await customerApi.createProfile(formData)
        setProfileExists(true)
        setSuccessMsg(t('profile.createSuccess', 'Profile created successfully!'))
      }
    } catch (err) {
      setError(err.response?.data?.message || t('common.errorSaving', 'Failed to save profile details.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <CustomerLayout>
      <div className="hc-cust-page">
        {/* Page Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
            {t('profile.customerTitle', 'Customer Account Profile')}
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
            {t('profile.customerSubtitle', 'Manage your personal buyer credentials and primary honey delivery address.')}
          </p>
        </div>

        {successMsg && (
          <Alert type="success" title="Profile Saved" onClose={() => setSuccessMsg('')}>
            {successMsg}
          </Alert>
        )}

        {error && (
          <Alert type="error" title="Error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <LoadingSpinner message={t('loading.profile', 'Loading customer profile...')} />
        ) : (
          <div className="hc-cust-profile-layout">
            {/* Sidebar Account Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="hc-cust-avatar-card">
                <div className="hc-cust-avatar-frame">
                  {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : '👤'}
                </div>
                <div>
                  <h3 className="hc-cust-avatar-name">
                    {formData.fullName || 'Verified Buyer'}
                  </h3>
                  <p className="hc-cust-avatar-email">
                    {formData.email || 'customer@honeychain.io'}
                  </p>
                  <div style={{ marginTop: 'var(--space-2)' }}>
                    <Badge variant="success">Verified Consumer</Badge>
                  </div>
                </div>

                <div className="hc-cust-stats-box">
                  <div className="hc-cust-stat-item">
                    <span className="hc-cust-stat-val">100%</span>
                    <span className="hc-cust-stat-label">Purity Check</span>
                  </div>
                  <div className="hc-cust-stat-item">
                    <span className="hc-cust-stat-val">Active</span>
                    <span className="hc-cust-stat-label">Status</span>
                  </div>
                </div>
              </div>

              <div className="hc-cust-banner">
                <div className="hc-cust-banner__title">
                  <span>🚚</span> Fast Doorstep Delivery
                </div>
                <div className="hc-cust-banner__desc">
                  Keeping your address updated ensures smooth, temperature-controlled delivery directly from regional beekeepers.
                </div>
              </div>
            </div>

            {/* Main Profile Form */}
            <div className="hc-cust-form-card">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {/* Section 1: Personal Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <h2 className="hc-cust-section-title">
                    <span>👤</span> Personal Information
                  </h2>

                  <div className="hc-cust-form-grid">
                    <div className="hc-cust-form-group">
                      <label htmlFor="fullName" className="hc-cust-label">
                        {t('profile.fullName', 'Full Name *')}
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Ananya Sharma"
                        className="hc-cust-input"
                      />
                    </div>

                    <div className="hc-cust-form-group">
                      <label htmlFor="email" className="hc-cust-label">
                        {t('profile.email', 'Email Address *')}
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. ananya@example.com"
                        className="hc-cust-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Delivery Address */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <h2 className="hc-cust-section-title">
                    <span>📍</span> Default Delivery Destination
                  </h2>

                  <div className="hc-cust-form-grid">
                    <div className="hc-cust-form-full hc-cust-form-group">
                      <label htmlFor="address" className="hc-cust-label">
                        {t('profile.address', 'Street Address / Apartment *')}
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        className="hc-cust-input"
                        placeholder="Door No, Street Name, Landmark..."
                        style={{ resize: 'vertical' }}
                        required
                      />
                    </div>

                    <div className="hc-cust-form-group">
                      <label htmlFor="city" className="hc-cust-label">
                        {t('profile.city', 'City / District *')}
                      </label>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Chennai"
                        className="hc-cust-input"
                      />
                    </div>

                    <div className="hc-cust-form-group">
                      <label htmlFor="state" className="hc-cust-label">
                        {t('profile.state', 'State *')}
                      </label>
                      <input
                        id="state"
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="e.g. Tamil Nadu"
                        className="hc-cust-input"
                      />
                    </div>

                    <div className="hc-cust-form-group">
                      <label htmlFor="pincode" className="hc-cust-label">
                        {t('profile.pincode', 'Postal Pincode *')}
                      </label>
                      <input
                        id="pincode"
                        type="text"
                        name="pincode"
                        required
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="e.g. 600001"
                        className="hc-cust-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="hc-cust-form-actions">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={saving}
                    style={{ fontWeight: 'var(--font-bold)', paddingInline: 'var(--space-6)' }}
                  >
                    {saving
                      ? t('common.saving', 'Saving Changes...')
                      : profileExists
                      ? t('common.update', 'Update Profile Details')
                      : t('common.create', 'Save Profile Details')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}

export default CustomerProfilePage
