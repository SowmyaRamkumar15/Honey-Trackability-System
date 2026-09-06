import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import ProfileForm from '../components/ProfileForm'
import VoiceButton from '../../../components/common/VoiceButton'
import { useBeekeeperProfile } from '../hooks/useBeekeeperProfile'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/beekeeper.css'

export const BeekeeperProfilePage = () => {
  const { profile, loading, fetched, error, updateProfile, clearError } = useBeekeeperProfile(true)
  const { t, formatDate } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const handleUpdate = async (formData) => {
    const result = await updateProfile(formData)
    if (!result.error) {
      setIsEditing(false)
      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 4000)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 700, border: '1px solid var(--success-border)', backgroundColor: 'var(--success-soft)', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
            {t('profile.statusApproved', 'KVIC APPROVED')}
          </span>
        )
      case 'REJECTED':
        return (
          <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 700, border: '1px solid var(--danger-border)', backgroundColor: 'var(--danger-soft)', color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} />
            {t('profile.statusRejected', 'REJECTED')}
          </span>
        )
      default:
        return (
          <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 700, border: '1px solid var(--primary-light)', backgroundColor: 'var(--primary-soft)', color: 'var(--primary-dark)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
            {t('profile.statusPending', 'VERIFICATION PENDING')}
          </span>
        )
    }
  }

  return (
    <BeekeeperLayout>
      <div className="hc-bk-dashboard">
        {/* Page Header */}
        <PageHeader
          title={t('profile.title', 'Profile & KVIC Credentials')}
          subtitle={t('profile.sub', 'Manage your registered apiary details, KVIC verification credentials, and language preferences.')}
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <VoiceButton translationKey="profile.sub" fallbackText="Manage your registered apiary details, KVIC verification, and language preferences." size="sm" />
              {!isEditing && profile && (
                <Button
                  id="edit-profile-btn"
                  variant="primary"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <span>✏️ Edit Profile</span>
                </Button>
              )}
            </div>
          }
        />

        {error && <Alert type="danger" message={error} onClose={clearError} />}
        {updateSuccess && (
          <Alert type="success" message={t('profile.updateSuccess', 'Profile updated successfully!')} />
        )}

        {/* Loading State */}
        {loading && !fetched ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <LoadingSpinner text={t('loading.loading', 'Loading your beekeeper profile...')} />
          </div>
        ) : !profile ? (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📜</div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
              No Profile Found
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 20px auto' }}>
              Complete the KVIC Beekeeper Onboarding to register your apiary identity and start recording honey harvests.
            </p>
            <Link to="/beekeeper/onboarding">
              <Button variant="primary">
                {t('onboarding.completeSetup', 'Complete Setup →')}
              </Button>
            </Link>
          </div>
        ) : isEditing ? (
          <div className="hc-bk-form-card">
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
              {t('profile.editHeading', 'Update Profile Details')}
            </h2>
            <ProfileForm
              initialData={profile}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              loading={loading}
            />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Left Card: Apiary & Identity */}
            <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="hc-bk-action-icon" style={{ fontSize: '1.5rem' }}>
                    👤
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                      {profile.name}
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {profile.phoneNumber}
                    </p>
                  </div>
                </div>
                {getStatusBadge(profile.verificationStatus)}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: 'var(--text-xs)' }}>
                <div className="hc-hive-item-row">
                  <span className="hc-hive-item-label">Apiary Name</span>
                  <span className="hc-hive-item-value">{profile.apiaryName || '—'}</span>
                </div>
                <div className="hc-hive-item-row">
                  <span className="hc-hive-item-label">State / Region</span>
                  <span className="hc-hive-item-value">{profile.state || '—'}</span>
                </div>
                <div className="hc-hive-item-row">
                  <span className="hc-hive-item-label">District</span>
                  <span className="hc-hive-item-value">{profile.district || '—'}</span>
                </div>
                <div className="hc-hive-item-row">
                  <span className="hc-hive-item-label">Primary Flora</span>
                  <span className="hc-hive-item-value">{profile.flora || 'Multiflora'}</span>
                </div>
                <div className="hc-hive-item-row">
                  <span className="hc-hive-item-label">Experience</span>
                  <span className="hc-hive-item-value">{profile.experienceYears ? `${profile.experienceYears} Years` : '—'}</span>
                </div>
              </div>
            </div>

            {/* Right Card: KVIC & Blockchain Identity */}
            <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  📜 KVIC & National Registry
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Official credentials issued by the Khadi & Village Industries Commission.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: 'var(--text-xs)' }}>
                <div className="hc-hive-item-row">
                  <span className="hc-hive-item-label">KVIC Identification ID</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary-dark)', backgroundColor: 'var(--primary-soft)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary-light)' }}>
                    {profile.kvicId || 'PENDING'}
                  </span>
                </div>
                <div className="hc-hive-item-row">
                  <span className="hc-hive-item-label">Aadhaar (Last 4)</span>
                  <span className="hc-hive-item-value font-mono">
                    {profile.aadhaarLastFour ? `XXXX-XXXX-${profile.aadhaarLastFour}` : '—'}
                  </span>
                </div>
                <div className="hc-hive-item-row">
                  <span className="hc-hive-item-label">Registered On</span>
                  <span className="hc-hive-item-value">
                    {profile.createdAt ? formatDate(profile.createdAt) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BeekeeperLayout>
  )
}

export default BeekeeperProfilePage
