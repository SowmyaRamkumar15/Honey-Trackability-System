import React, { useState, useEffect } from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import AdminSidebar from '../components/AdminSidebar'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'
import { useLanguage } from '../../../i18n/LanguageContext'

export const AdminHivesPage = () => {
  const { t } = useLanguage()
  const [hives, setHives] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const loadHives = async (p = 0) => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminApi.getHives({
        status: statusFilter || undefined,
        search: searchQuery || undefined,
        page: p,
        size: 20,
      })
      const data = res.data?.data
      setHives(data?.content || [])
      setTotalPages(data?.totalPages || 0)
      setPage(p)
    } catch (err) {
      setError(err?.response?.data?.message || t('errors.generic', 'Failed to load hives'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHives(0)
  }, [statusFilter])

  const handleSearch = (e) => {
    e.preventDefault()
    loadHives(0)
  }

  const getHealthBadge = (health) => {
    switch (health) {
      case 'HEALTHY':
        return <span className="badge badge--success">{t('iot.healthy', 'HEALTHY')}</span>
      case 'WATCH':
        return <span className="badge badge--warning">{t('iot.watch', 'WATCH')}</span>
      case 'ALERT':
        return <span className="badge badge--danger">{t('iot.alert', 'ALERT')}</span>
      default:
        return <span className="badge badge--dark">UNKNOWN</span>
    }
  }

  return (
    <AdminLayout>
      <div className="container section">
        <div className="dashboard__header mb-6">
          <div>
            <h1 className="dashboard__title">🐝 {t('admin.hivesTitle', 'Apiary Hives & IoT Telemetry')}</h1>
            <p className="dashboard__subtitle">{t('admin.hivesSub', 'Monitor hive status, IoT temperature, humidity, bee activity, and colony health')}</p>
          </div>
        </div>

        <AdminSidebar />

        {/* Filter Card */}
        <div className="card mb-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[240px]">
              <input
                type="text"
                className="form-input"
                placeholder={t('admin.searchHivePlaceholder', 'Search by Hive Code (e.g. HIV-2026-001) or Cluster...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="w-48">
              <select
                className="form-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">{t('admin.allStatuses', 'All Statuses')}</option>
                <option value="ACTIVE">{t('hive.active', 'ACTIVE')}</option>
                <option value="ALERT">{t('hive.alert', 'ALERT')}</option>
                <option value="INACTIVE">{t('hive.inactive', 'INACTIVE')}</option>
              </select>
            </div>

            <button type="submit" className="btn btn--primary btn--sm">
              {t('common.submit', 'Search')}
            </button>
          </form>
        </div>

        {error && <Alert type="danger" message={error} />}

        {loading ? (
          <div className="py-12 text-center">
            <LoadingSpinner text={t('loading.loading', 'Loading hives and IoT telemetry...')} />
          </div>
        ) : (
          <div className="overflow-x-auto card p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('hive.hiveCode', 'Hive Code')}</th>
                  <th>{t('auth.beekeeperRole', 'Beekeeper')}</th>
                  <th>{t('hive.clusterName', 'Cluster')}</th>
                  <th>{t('common.status', 'Status')}</th>
                  <th>{t('admin.iotHealth', 'IoT Health')}</th>
                  <th>{t('iot.temp', 'Temperature')}</th>
                  <th>{t('iot.humidity', 'Humidity')}</th>
                  <th>{t('iot.activity', 'Bee Activity')}</th>
                </tr>
              </thead>
              <tbody>
                {hives.map((h) => (
                  <tr key={h.id}>
                    <td><code>{h.hiveCode}</code></td>
                    <td>
                      <strong className="block">{h.beekeeperName || 'N/A'}</strong>
                      <span className="text-secondary text-xs">{h.village}</span>
                    </td>
                    <td>{h.clusterName || 'N/A'}</td>
                    <td>
                      <span className={`badge badge--${h.status === 'ACTIVE' ? 'success' : 'warning'}`}>
                        {h.status}
                      </span>
                    </td>
                    <td>{getHealthBadge(h.healthStatus)}</td>
                    <td>{h.lastTemperature != null ? `${h.lastTemperature.toFixed(1)}°C` : 'N/A'}</td>
                    <td>{h.lastHumidity != null ? `${h.lastHumidity.toFixed(0)}%` : 'N/A'}</td>
                    <td>{h.lastBeeActivity != null ? `${h.lastBeeActivity} / 100` : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminHivesPage
