import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import ProfileForm from '../components/ProfileForm'
import VoiceButton from '../../../components/common/VoiceButton'
import { useBeekeeperProfile } from '../hooks/useBeekeeperProfile'
import { useLanguage } from '../../../i18n/LanguageContext'

export const BeekeeperProfilePage = () => {
  const { profile, loading, error, updateProfile, clearError } = useBeekeeperProfile(true)
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
          <span className="px-3 py-1 rounded-full text-xs font-bold border border-blue-200 bg-blue-50 text-blue-700 flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            {t('profile.statusApproved', 'APPROVED')}
          </span>
        )
      case 'REJECTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold border border-slate-300 bg-slate-100 text-slate-800 flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            {t('profile.statusRejected', 'REJECTED')}
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold border border-amber-200 bg-amber-50 text-amber-800 flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
            {t('profile.statusPending', 'PENDING')}
          </span>
        )
    }
  }

  return (
    <BeekeeperLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 font-['Outfit']">
              {t('navigation.beekeepers', 'Beekeeper')} <span className="text-blue-600">{t('profile.title', 'Profile')}</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">{t('profile.sub', 'Manage your registered apiary details and language preferences')}</p>
          </div>

          <div className="flex items-center gap-2">
            <VoiceButton translationKey="profile.sub" />
            {!isEditing && profile && (
              <Button
                id="edit-profile-btn"
                variant="primary"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 border-blue-600 text-white font-bold"
              >
                <span>✏️</span> {t('common.edit', 'Edit Profile')}
              </Button>
            )}
          </div>
        </div>

        {error && <Alert type="error" message={error} onClose={clearError} />}
        {updateSuccess && <Alert type="success" message={t('profile.updateSuccess', 'Profile updated successfully!')} />}

        {loading && !profile ? (
          <LoadingSpinner text={t('loading.loading', 'Loading your beekeeper profile...')} />
        ) : !profile ? (
          /* Profile Not Found -> Prompt Onboarding */
          <Card className="text-center py-12 space-y-4">
            <div className="text-6xl">🌿</div>
            <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">{t('empty.noData', 'No Profile Found')}</h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              {t('onboarding.warningSub', 'Please complete your KVIC beekeeper profile to enable harvest logging and certificates.')}
            </p>
            <Link to="/beekeeper/onboarding">
              <Button variant="primary" size="lg" className="mt-4 bg-blue-600 hover:bg-blue-700 border-blue-600 text-white font-bold">
                {t('onboarding.completeSetup', 'Start Onboarding →')}
              </Button>
            </Link>
          </Card>
        ) : isEditing ? (
          /* Edit Mode */
          <Card className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">{t('common.edit', 'Edit Profile Details')}</h2>
              <span className="text-xs text-slate-500 font-medium">KVIC ID is permanent</span>
            </div>
            <ProfileForm
              initialValues={profile}
              onSubmit={handleUpdate}
              loading={loading}
              onCancel={() => setIsEditing(false)}
            />
          </Card>
        ) : (
          /* View Mode */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Identity Card */}
            <Card className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="relative">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-amber-200 shadow-xl"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-amber-100 border-4 border-amber-200 flex items-center justify-center text-5xl shadow-xl">
                    👨‍🌾
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">{profile.name}</h2>
                <p className="text-slate-500 text-sm">{profile.village}</p>
                <p className="text-slate-400 text-xs mt-0.5">{profile.phoneNumber}</p>
              </div>

              <div className="pt-2">
                {getStatusBadge(profile.verificationStatus)}
              </div>
            </Card>

            {/* Details Card */}
            <Card className="md:col-span-2 p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2 border-b border-slate-100 pb-3">
                <span>📋</span> {t('profile.verificationStatus', 'Verification Status')} & Apiary Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-sm">
                  <p className="text-xs text-slate-500">{t('onboarding.kvicId', 'KVIC Registration ID')}</p>
                  <p className="text-lg font-bold text-amber-800 font-mono mt-1">{profile.kvicId}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500">{t('onboarding.language', 'Preferred Language')}</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">{profile.preferredLanguage}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500">Apiary Location Coordinates</p>
                  <p className="text-sm font-semibold text-slate-900 font-mono mt-1">
                    {profile.latitude && profile.longitude
                      ? `${profile.latitude}° N, ${profile.longitude}° E`
                      : 'Coordinates not specified'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500">{t('common.date', 'Member Since')}</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {profile.createdAt ? formatDate(profile.createdAt) : '—'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </BeekeeperLayout>
  )
}

export default BeekeeperProfilePage
