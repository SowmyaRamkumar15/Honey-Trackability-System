import React, { useState, useEffect } from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import PageHeader from '../../../components/layout/PageHeader'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import EmptyState from '../../../components/ui/EmptyState'
import adminApi from '../api/adminApi'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/admin.css'

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
        return <Badge variant="success" size="sm">🟢 {t('iot.healthy', 'HEALTHY')}</Badge>
      case 'WATCH':
        return <Badge variant="warning" size="sm">🟡 {t('iot.watch', 'WATCH')}</Badge>
      case 'ALERT':
        return <Badge variant="danger" size="sm">🔴 {t('iot.alert', 'ALERT')}</Badge>
      default:
        return <Badge variant="default" size="sm">⚪ UNKNOWN</Badge>
    }
  }

  return (
    <AdminLayout>
      <div className="hc-admin-page">
        <PageHeader
          title={t('admin.hivesTitle', 'Apiary Hives & IoT Telemetry')}
          subtitle={t('admin.hivesSub', 'Monitor hive status, IoT temperature, humidity, bee activity, and colony health')}
        />

        {/* Filter Toolbar */}
        <div className="hc-admin-filter-bar">
          <form onSubmit={handleSearch} className="hc-admin-filter-group">
            <div className="hc-admin-search-wrap">
              <span className="hc-admin-search-icon">🔍</span>
              <input
                type="text"
                className="hc-admin-input"
                placeholder={t('admin.searchHivePlaceholder', 'Search hive code, cluster, or beekeeper...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="hc-admin-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">{t('admin.allStatuses', 'All Statuses')}</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ALERT">ALERT</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            <Button type="submit" variant="primary" size="sm">
              {t('common.submit', 'Filter')}
            </Button>

            {(searchQuery || statusFilter) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('')
                  loadHives(0)
                }}
              >
                ✕ Reset
              </Button>
            )}
          </form>
        </div>

        {error && <Alert type="danger" title="Error">{error}</Alert>}

        {loading ? (
          <LoadingSpinner message={t('loading.loading', 'Loading hives and IoT telemetry...')} />
        ) : hives.length === 0 ? (
          <EmptyState
            icon="🐝"
            title="No Hives Found"
            description="No apiary hives match your current search query."
          />
        ) : (
          <div className="hc-admin-table-container">
            <div className="hc-admin-table-header">
              <h3 className="hc-admin-table-title">
                🐝 Real-Time Apiary Telemetry
              </h3>
              <span className="hc-admin-table-count">
                {hives.length} hives listed
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="hc-table" style={{ width: '100%', margin: 0 }}>
                <thead>
                  <tr>
                    <th>{t('hive.hiveCode', 'Hive Code')}</th>
                    <th>{t('auth.beekeeperRole', 'Beekeeper')}</th>
                    <th>{t('hive.clusterName', 'Cluster')}</th>
                    <th>{t('common.status', 'Status')}</th>
                    <th>{t('admin.iotHealth', 'Colony Health')}</th>
                    <th>{t('iot.temp', 'Temperature')}</th>
                    <th>{t('iot.humidity', 'Humidity')}</th>
                    <th>{t('iot.activity', 'Bee Activity')}</th>
                  </tr>
                </thead>
                <tbody>
                  {hives.map((h) => (
                    <tr key={h.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-dark)', fontSize: 'var(--text-xs)' }}>
                        {h.hiveCode}
                      </td>
                      <td>
                        <strong style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 600 }}>{h.beekeeperName || 'N/A'}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{h.village || 'Regional Cluster'}</span>
                      </td>
                      <td style={{ fontSize: 'var(--text-xs)' }}>{h.clusterName || '—'}</td>
                      <td>
                        <Badge variant={h.status === 'ACTIVE' ? 'success' : 'warning'} size="sm">
                          {h.status}
                        </Badge>
                      </td>
                      <td>{getHealthBadge(h.healthStatus)}</td>
                      <td>
                        {h.lastTemperature != null ? (
                          <span className="hc-iot-pill hc-iot-pill--temp">
                            🌡️ {h.lastTemperature.toFixed(1)}°C
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>—</span>
                        )}
                      </td>
                      <td>
                        {h.lastHumidity != null ? (
                          <span className="hc-iot-pill hc-iot-pill--humidity">
                            💧 {h.lastHumidity.toFixed(0)}%
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>—</span>
                        )}
                      </td>
                      <td>
                        {h.lastBeeActivity != null ? (
                          <span className="hc-iot-pill hc-iot-pill--activity">
                            🐝 {h.lastBeeActivity} / 100
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="hc-admin-pagination">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => loadHives(page - 1)}
                >
                  ← {t('common.prev', 'Previous')}
                </Button>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => loadHives(page + 1)}
                >
                  {t('common.next', 'Next')} →
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminHivesPage
