import React, { useEffect, useState } from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import { useAuth } from '../../auth/hooks/useAuth'
import apiClient from '../../../services/axios'

export const AdminDashboard = () => {
  const { phoneNumber, role } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/admin/stats')
      .then((res) => setStats(res.data.data))
      .catch(() => setStats({ totalUsers: 0, totalBeekeepers: 0, totalHives: 0, totalBatches: 0, totalLabTests: 0 }))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout>
      <div className="dashboard">
        <div className="dashboard__header">
          <div>
            <h1 className="dashboard__title">
              Admin <span className="text-gradient">Control Center</span>
            </h1>
            <p className="dashboard__subtitle">
              Logged in as: <span className="text-gold font-semibold">{phoneNumber}</span> ({role})
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <LoadingSpinner text="Loading real-time platform statistics from database..." />
          </div>
        ) : (
          <div className="kpi-grid">
            {[
              { icon: '👤', label: 'Registered Users', value: stats?.totalUsers ?? 0, iconClass: 'kpi-card__icon--red' },
              { icon: '🌿', label: 'Beekeeper Profiles', value: stats?.totalBeekeepers ?? 0, iconClass: 'kpi-card__icon--amber' },
              { icon: '🐝', label: 'Registered Hives', value: stats?.totalHives ?? 0, iconClass: 'kpi-card__icon--orange' },
              { icon: '🍯', label: 'Honey Batches', value: stats?.totalBatches ?? 0, iconClass: 'kpi-card__icon--green' },
            ].map(({ icon, label, value, iconClass }) => (
              <div key={label} className="kpi-card">
                <div className={`kpi-card__icon ${iconClass}`}>
                  {icon}
                </div>
                <div>
                  <p className="kpi-card__label">{label}</p>
                  <p className="kpi-card__value">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="admin-links-panel">
          <h2 className="admin-links-panel__title">🔌 System Endpoints &amp; Documentation</h2>
          <div className="admin-links-panel__row">
            <a
              href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/health`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-endpoint-link"
            >
              GET /api/health ↗
            </a>
            <a
              href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/swagger-ui.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-endpoint-link"
            >
              Swagger OpenAPI Docs ↗
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
