import React, { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import BeekeeperLayout from '../../../layouts/BeekeeperLayout'
import HiveStatusBadge from '../components/HiveStatusBadge'
import HiveForm from '../components/HiveForm'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/feedback/Alert'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import EmptyState from '../../../components/ui/EmptyState'
import { useHives } from '../hooks/useHives'
import '../../hive/styles/hive.css'

export const HiveDetailsPage = () => {
  const { id } = useParams()
  const location = useLocation()
  const [isEditing, setIsEditing] = useState(location.state?.edit === true)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const { selectedHive: hive, loading, error, fetchHive, updateHive, updateHiveStatus, clearError } = useHives()

  useEffect(() => {
    fetchHive(id)
  }, [id])

  const handleUpdate = async (formData) => {
    const result = await updateHive(id, formData)
    if (!result.error) {
      setIsEditing(false)
      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 3000)
    }
  }

  const handleStatusToggle = async () => {
    if (!hive) return
    const newStatus = hive.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    await updateHiveStatus(id, newStatus)
  }

  return (
    <BeekeeperLayout>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          <Link to="/beekeeper/hives" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 'var(--font-medium)' }}>My Hives</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 'var(--font-semibold)' }}>{hive?.hiveCode || 'Loading...'}</span>
        </nav>

        {error && <Alert type="error" message={error} onClose={clearError} />}
        {updateSuccess && <Alert type="success" message="Hive updated successfully!" />}

        {loading && !hive ? (
          <LoadingSpinner text="Loading hive details..." />
        ) : !hive ? (
          <EmptyState
            icon="🐝"
            title="Hive Not Found"
            description="This hive doesn't exist or you don't have access."
            action={
              <Link to="/beekeeper/hives">
                <Button variant="secondary">← Back to Hives</Button>
              </Link>
            }
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Hive Header Card */}
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div className="hc-hive-icon">🐝</div>
                    <div>
                      <p style={{ color: 'var(--primary-dark)', fontFamily: 'monospace', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)', margin: 0 }}>
                        {hive.hiveCode}
                      </p>
                      <p style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-xl)', margin: 0 }}>
                        {hive.clusterName}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <HiveStatusBadge status={hive.status} size="lg" />
                    {!isEditing && (
                      <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
                        ✏️ Edit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }}>
              {/* Main Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {isEditing ? (
                  <Card>
                    <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-5) 0' }}>
                      Edit Hive Details
                    </h2>
                    <HiveForm
                      initialValues={hive}
                      onSubmit={handleUpdate}
                      loading={loading}
                      onCancel={() => setIsEditing(false)}
                      submitLabel="Save Changes"
                    />
                  </Card>
                ) : (
                  <>
                    {/* Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                      {[
                        { label: 'Hive Code', value: hive.hiveCode, mono: true },
                        { label: 'Status', value: <HiveStatusBadge status={hive.status} /> },
                        { label: 'Installation Date', value: hive.installedDate ? new Date(hive.installedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—' },
                        { label: 'Coordinates', value: hive.latitude ? `${hive.latitude}°N, ${hive.longitude}°E` : 'Not specified', mono: !!hive.latitude },
                        { label: 'Registered', value: hive.createdAt ? new Date(hive.createdAt).toLocaleDateString('en-IN') : '—' },
                        { label: 'Last Updated', value: hive.updatedAt ? new Date(hive.updatedAt).toLocaleDateString('en-IN') : '—' },
                      ].map(({ label, value, mono }) => (
                        <div key={label} style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)', fontWeight: 'var(--font-medium)' }}>{label}</p>
                          <p style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)', fontFamily: mono ? 'monospace' : undefined, fontSize: mono ? 'var(--text-sm)' : undefined, margin: 0 }}>
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Module Links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      {['🌡️ Hive Health & Sensor Data', '📊 Yield Prediction', '🍯 Honey Batches'].map((section) => (
                        <div key={section} style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-5)', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-xs)' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>{section}</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-muted)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontWeight: 'var(--font-medium)' }}>
                            Live in telemetry tab
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Health Link + Status Control */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
              {/* Health Link Card */}
              <Card style={{ background: 'linear-gradient(135deg, rgba(253,230,138,0.2) 0%, var(--surface) 100%)', border: '1px solid var(--primary-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--text-xl)' }}>📡</span>
                  <h3 style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', margin: 0 }}>IoT Telemetry & Health</h3>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>
                  View real-time acoustic frequency, temperature, humidity, and colony weight telemetry.
                </p>
                <Link to={`/beekeeper/hives/${hive.id}/health`} style={{ textDecoration: 'none', display: 'block' }}>
                  <Button variant="primary" size="sm" style={{ width: '100%' }}>
                    View Hive Health →
                  </Button>
                </Link>
              </Card>

              {/* Status Control */}
              {!isEditing && hive.status !== 'ALERT' && (
                <Card>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', margin: '0 0 var(--space-1) 0' }}>Hive Status Control</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', margin: '0 0 var(--space-3) 0', lineHeight: 1.5 }}>
                    {hive.status === 'ACTIVE'
                      ? 'Deactivate this hive to mark it as not in operational use.'
                      : 'Activate this hive to mark it as operational.'}
                  </p>
                  <button
                    onClick={handleStatusToggle}
                    disabled={loading}
                    className="hc-button hc-button--secondary"
                    style={{ width: '100%' }}
                  >
                    {hive.status === 'ACTIVE' ? 'Deactivate Hive' : 'Activate Hive'}
                  </button>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </BeekeeperLayout>
  )
}

export default HiveDetailsPage
