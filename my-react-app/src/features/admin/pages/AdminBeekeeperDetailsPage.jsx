import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import AdminLayout from '../../../layouts/AdminLayout'
import AdminSidebar from '../components/AdminSidebar'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'

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
        <div className="container section text-center py-12">
          <LoadingSpinner text="Loading beekeeper audit record..." />
        </div>
      </AdminLayout>
    )
  }

  if (error || !beekeeper) {
    return (
      <AdminLayout>
        <div className="container section">
          <Alert type="danger" message={error || 'Beekeeper not found'} />
          <Link to="/admin/beekeepers" className="btn btn--secondary mt-4">
            ← Back to Beekeepers List
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="container section" style={{ maxWidth: '850px' }}>
        <nav className="breadcrumb mb-6">
          <Link to="/admin/dashboard">Admin</Link> / <Link to="/admin/beekeepers">Beekeepers</Link> /{' '}
          <span className="text-secondary">{beekeeper.name}</span>
        </nav>

        <AdminSidebar />

        <div className="card mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {beekeeper.photoUrl ? (
                <img
                  src={beekeeper.photoUrl}
                  alt={beekeeper.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gold"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-2xl border-2 border-gold">
                  🐝
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{beekeeper.name}</h1>
                <p className="text-secondary text-sm">📍 {beekeeper.village || 'Region Unspecified'}</p>
                <div className="mt-2 flex gap-2">
                  <span className="badge badge--dark">KVIC ID: {beekeeper.kvicId || 'Pending'}</span>
                  <span className={`badge badge--${beekeeper.verificationStatus === 'APPROVED' ? 'success' : beekeeper.verificationStatus === 'REJECTED' ? 'danger' : 'warning'}`}>
                    {beekeeper.verificationStatus}
                  </span>
                </div>
              </div>
            </div>

            {beekeeper.verificationStatus === 'PENDING' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  disabled={updating}
                  onClick={() => handleStatusUpdate('APPROVED')}
                >
                  {updating ? 'Updating...' : '✅ Approve Beekeeper'}
                </button>
                <button
                  type="button"
                  className="btn btn--danger-outline btn--sm"
                  disabled={updating}
                  onClick={() => handleStatusUpdate('REJECTED')}
                >
                  {updating ? 'Updating...' : '❌ Reject'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Apiary & Production Audit Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h3 className="card__title mb-3">🐝 Apiary & Hives</h3>
            <p className="text-2xl font-bold text-gold">{beekeeper.hiveCount}</p>
            <p className="text-secondary text-sm">Registered hives managed</p>
          </div>

          <div className="card">
            <h3 className="card__title mb-3">🍯 Batches Harvested</h3>
            <p className="text-2xl font-bold text-success">{beekeeper.batchCount}</p>
            <p className="text-secondary text-sm">Traceable honey batches produced</p>
          </div>

          <div className="card">
            <h3 className="card__title mb-3">🛒 Marketplace Listings</h3>
            <p className="text-2xl font-bold text-blue-400">{beekeeper.productCount}</p>
            <p className="text-secondary text-sm">Listed honey products</p>
          </div>

          <div className="card">
            <h3 className="card__title mb-3">⭐ Consumer Reputation</h3>
            <p className="text-2xl font-bold text-gold">
              {beekeeper.averageRating > 0 ? `★ ${beekeeper.averageRating.toFixed(1)}` : 'No Reviews'}
            </p>
            <p className="text-secondary text-sm">Average consumer rating</p>
          </div>
        </div>

        <div className="card">
          <h3 className="card__title mb-3">📋 KVIC Verification Guidelines</h3>
          <ul className="text-secondary text-sm space-y-2">
            <li>• Ensure the Beekeeper identity card and KVIC ID number match state honey registry.</li>
            <li>• Verify village GPS coordinates match registered apiary location.</li>
            <li>• Once approved, beekeeper can submit honey batches for lab testing and blockchain tokenization.</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminBeekeeperDetailsPage
