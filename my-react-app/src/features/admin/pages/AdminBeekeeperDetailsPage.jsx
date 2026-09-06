import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import AdminLayout from '../../../layouts/AdminLayout'
import Badge from '../../../components/ui/Badge'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import MetricCard from '../../../components/ui/MetricCard'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'
import '../styles/admin.css'

export const AdminBeekeeperDetailsPage = () => {
  const { id } = useParams()
  const [beekeeper, setBeekeeper] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)

  const loadDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminApi.getBeekeeperDetails(id)
      setBeekeeper(res.data?.data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load beekeeper profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDetails()
  }, [id])

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this beekeeper as ${newStatus}?`)) return
    setUpdating(true)
    try {
      await adminApi.updateBeekeeperStatus(id, newStatus)
      await loadDetails()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: 'var(--space-16) 0', textAlign: 'center' }}>
          <LoadingSpinner text="Loading beekeeper audit record..." />
        </div>
      </AdminLayout>
    )
  }

  if (error || !beekeeper) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Alert type="danger" message={error || 'Beekeeper not found'} />
          <Link to="/admin/beekeepers" className="hc-button hc-button--secondary hc-button--sm" style={{ display: 'inline-flex', width: 'fit-content', textDecoration: 'none' }}>
            ← Back to Beekeepers List
          </Link>
        </div>
      </AdminLayout>
    )
  }

  const getStatusBadge = (status) => {
    if (status === 'APPROVED') return <Badge variant="success">{status}</Badge>
    if (status === 'REJECTED') return <Badge variant="danger">{status}</Badge>
    return <Badge variant="warning">{status}</Badge>
  }

  return (
    <AdminLayout>
      <div className="hc-admin-page">
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          <Link to="/admin/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Admin</Link>
          <span>/</span>
          <Link to="/admin/beekeepers" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Beekeepers</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-medium)' }}>{beekeeper.name}</span>
        </nav>

        {/* Profile Header Card */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              {beekeeper.photoUrl ? (
                <img
                  src={beekeeper.photoUrl}
                  alt={beekeeper.name}
                  style={{ width: 64, height: 64, borderRadius: 'var(--radius-xl)', objectFit: 'cover', border: '2px solid var(--primary)', boxShadow: 'var(--shadow-sm)' }}
                />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-xl)', backgroundColor: 'rgba(217,119,6,0.1)', border: '2px solid var(--primary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', boxShadow: 'var(--shadow-sm)' }}>
                  🐝
                </div>
              )}
              <div>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', color: 'var(--text-primary)', margin: 0 }}>{beekeeper.name}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', margin: '2px 0 var(--space-2) 0' }}>
                  📍 {beekeeper.village || 'Region Unspecified'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ padding: '2px 10px', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-xs)', fontFamily: 'monospace', fontWeight: 'var(--font-bold)', backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    KVIC ID: {beekeeper.kvicId || 'Pending'}
                  </span>
                  {getStatusBadge(beekeeper.verificationStatus)}
                </div>
              </div>
            </div>

            {beekeeper.verificationStatus === 'PENDING' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={updating}
                  onClick={() => handleStatusUpdate('APPROVED')}
                >
                  {updating ? 'Updating...' : '✅ Approve Beekeeper'}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={updating}
                  onClick={() => handleStatusUpdate('REJECTED')}
                >
                  {updating ? 'Updating...' : '❌ Reject'}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Apiary & Production Audit Grid */}
        <div className="hc-admin-stats-grid">
          <MetricCard
            icon="🐝"
            label="Apiary & Hives"
            value={beekeeper.hiveCount}
            subtext="Registered hives managed"
          />
          <MetricCard
            icon="🍯"
            label="Batches Harvested"
            value={beekeeper.batchCount}
            subtext="Traceable honey batches"
          />
          <MetricCard
            icon="🛒"
            label="Marketplace Listings"
            value={beekeeper.productCount}
            subtext="Listed honey products"
          />
          <MetricCard
            icon="⭐"
            label="Consumer Reputation"
            value={beekeeper.averageRating > 0 ? `★ ${beekeeper.averageRating.toFixed(1)}` : 'No Reviews'}
            subtext="Average consumer rating"
          />
        </div>

        {/* KVIC Guidelines Card */}
        <Card>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-3) 0' }}>
            📋 KVIC Verification Guidelines
          </h3>
          <ul style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', lineHeight: 1.7, listStyle: 'none', padding: 0, margin: 0 }}>
            <li>• Ensure the Beekeeper identity card and KVIC ID number match state honey registry.</li>
            <li>• Verify village GPS coordinates match registered apiary location.</li>
            <li>• Once approved, beekeeper can submit honey batches for lab testing and blockchain tokenization.</li>
          </ul>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default AdminBeekeeperDetailsPage
