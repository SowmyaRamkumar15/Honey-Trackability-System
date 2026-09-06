import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import HiveCard from '../components/HiveCard'
import HiveForm from '../components/HiveForm'
import PageHeader from '../../../components/layout/PageHeader'
import Alert from '../../../components/feedback/Alert'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import EmptyState from '../../../components/ui/EmptyState'
import Button from '../../../components/ui/Button'
import VoiceButton from '../../../components/common/VoiceButton'
import { useHives } from '../hooks/useHives'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/hive.css'

export const HiveListPage = () => {
  const { hives, loading, error, fetchHives, createHive, updateHiveStatus, clearError } = useHives()
  const { t } = useLanguage()
  const [showAddForm, setShowAddForm] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const navigate = useNavigate()

  useEffect(() => {
    fetchHives()
  }, [])

  const handleCreate = async (formData) => {
    const result = await createHive(formData)
    if (!result.error) {
      setShowAddForm(false)
      setSuccessMsg(t('success.hiveCreated', 'Hive registered successfully!'))
      setTimeout(() => setSuccessMsg(null), 4000)
    }
  }

  const handleDeactivate = async (id) => {
    await updateHiveStatus(id, 'INACTIVE')
  }

  const handleActivate = async (id) => {
    await updateHiveStatus(id, 'ACTIVE')
  }

  const activeCount = hives.filter((h) => h.status === 'ACTIVE').length
  const alertCount = hives.filter((h) => h.status === 'ALERT').length
  const inactiveCount = hives.filter((h) => h.status === 'INACTIVE').length

  const filteredHives = hives.filter((h) => {
    if (filterStatus === 'ACTIVE') return h.status === 'ACTIVE'
    if (filterStatus === 'ALERT') return h.status === 'ALERT'
    if (filterStatus === 'INACTIVE') return h.status === 'INACTIVE'
    return true
  })

  return (
    <BeekeeperLayout>
      <div className="hc-hive-page">
        {/* Page Header */}
        <PageHeader
          title={t('navigation.myHives', 'My Hives')}
          subtitle={
            <span>
              {hives.length} {hives.length === 1 ? 'hive registered' : 'hives registered'} · {activeCount} active colonies
              {alertCount > 0 && (
                <span style={{ color: 'var(--danger)', fontWeight: 'bold', marginLeft: '6px' }}>
                  · {alertCount} require attention
                </span>
              )}
            </span>
          }
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <VoiceButton translationKey="hive.myHivesSub" fallbackText="Manage registered apiary colonies, inspect IoT telemetry, and register new hives." size="sm" />
              <Button
                id="add-hive-btn"
                variant="primary"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <span>{showAddForm ? '✕ Cancel' : '+ Register New Hive'}</span>
              </Button>
            </div>
          }
        />

        {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg(null)} />}
        {error && <Alert type="error" message={error} onClose={clearError} />}

        {/* Quick Stats Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setFilterStatus('ALL')}
            className={`hc-stat-pill ${filterStatus === 'ALL' ? 'hc-stat-pill--active' : ''}`}
          >
            <span className="hc-stat-pill__label">Total Apiary Units</span>
            <div className="hc-stat-pill__val">{hives.length}</div>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('ACTIVE')}
            className={`hc-stat-pill ${filterStatus === 'ACTIVE' ? 'hc-stat-pill--active' : ''}`}
          >
            <span className="hc-stat-pill__label" style={{ color: 'var(--success)' }}>🟢 Active Producing</span>
            <div className="hc-stat-pill__val">{activeCount}</div>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('ALERT')}
            className={`hc-stat-pill ${filterStatus === 'ALERT' ? 'hc-stat-pill--active' : ''}`}
          >
            <span className="hc-stat-pill__label" style={{ color: 'var(--primary)' }}>⚠️ Attention Required</span>
            <div className="hc-stat-pill__val">{alertCount}</div>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('INACTIVE')}
            className={`hc-stat-pill ${filterStatus === 'INACTIVE' ? 'hc-stat-pill--active' : ''}`}
          >
            <span className="hc-stat-pill__label" style={{ color: 'var(--text-muted)' }}>⏸️ Paused</span>
            <div className="hc-stat-pill__val">{inactiveCount}</div>
          </button>
        </div>

        {/* Register Hive Inline Form */}
        {showAddForm && (
          <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
              Register New Hive Node
            </h3>
            <HiveForm onSubmit={handleCreate} onCancel={() => setShowAddForm(false)} loading={loading} />
          </div>
        )}

        {/* Hive List / Grid */}
        {loading && hives.length === 0 ? (
          <LoadingSpinner text="Loading apiary colony data..." />
        ) : filteredHives.length === 0 ? (
          <EmptyState
            icon="🐝"
            title="No hives match the selected filter"
            description="Register a new hive or adjust your status filter above."
            action={
              <Button variant="primary" onClick={() => setShowAddForm(true)}>
                + Register First Hive
              </Button>
            }
          />
        ) : (
          <div className="hc-hive-grid">
            {filteredHives.map((hive) => (
              <HiveCard
                key={hive.id}
                hive={hive}
                onDeactivate={handleDeactivate}
                onActivate={handleActivate}
              />
            ))}
          </div>
        )}
      </div>
    </BeekeeperLayout>
  )
}

export default HiveListPage
