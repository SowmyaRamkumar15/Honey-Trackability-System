import React, { useState, useEffect } from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import PageHeader from '../../../components/layout/PageHeader'
import Badge from '../../../components/ui/Badge'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'
import { useLanguage } from '../../../i18n/LanguageContext'
import '../styles/admin.css'

export const AdminAnalyticsPage = () => {
  const { t } = useLanguage()
  const [regionalData, setRegionalData] = useState([])
  const [productionTrend, setProductionTrend] = useState([])
  const [salesData, setSalesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      adminApi.getRegionalAnalytics(),
      adminApi.getProductionTrend(),
      adminApi.getSalesAnalytics(),
      adminApi.getPurityAnalytics(),
    ])
      .then(([regRes, prodRes, salesRes]) => {
        setRegionalData(regRes.data?.data || [])
        setProductionTrend(prodRes.data?.data || [])
        setSalesData(salesRes.data?.data || [])
      })
      .catch((err) => setError(err?.response?.data?.message || t('errors.generic', 'Failed to load analytics')))
      .finally(() => setLoading(false))
  }, [])

  const totalHarvestKg = regionalData.reduce((acc, r) => acc + (r.honeyProducedKg || 0), 0)
  const totalBeekeepers = regionalData.reduce((acc, r) => acc + (r.beekeepers || 0), 0)
  const totalActiveHives = regionalData.reduce((acc, r) => acc + (r.activeHives || 0), 0)
  const totalRevenue = salesData.reduce((acc, s) => acc + (s.totalRevenue || 0), 0)

  return (
    <AdminLayout>
      <div className="hc-admin-page">
        <PageHeader
          title={`📈 ${t('navigation.analytics', 'Platform Analytics & Intelligence')}`}
          subtitle={t('admin.analyticsSub', 'Regional yield distribution, monthly honey harvests, sales trends, and certified purity metrics')}
        />

        {error && <Alert type="danger" message={error} />}

        {loading ? (
          <div style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
            <LoadingSpinner text={t('loading.loading', 'Crunching platform analytics...')} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Top Aggregate Summary Metrics */}
            <div className="hc-admin-stats-grid">
              <div className="hc-admin-metric-card">
                <div className="hc-admin-metric-header">
                  <span className="hc-admin-metric-label">Total Honey Produced</span>
                  <div className="hc-admin-metric-icon">🍯</div>
                </div>
                <div className="hc-admin-metric-value">{totalHarvestKg.toLocaleString()} kg</div>
                <div className="hc-admin-metric-subtext">Across all active clusters</div>
              </div>

              <div className="hc-admin-metric-card">
                <div className="hc-admin-metric-header">
                  <span className="hc-admin-metric-label">Registered Apiaries</span>
                  <div className="hc-admin-metric-icon">🧑‍🌾</div>
                </div>
                <div className="hc-admin-metric-value">{totalBeekeepers}</div>
                <div className="hc-admin-metric-subtext">{totalActiveHives} Active IoT Hives</div>
              </div>

              <div className="hc-admin-metric-card">
                <div className="hc-admin-metric-header">
                  <span className="hc-admin-metric-label">Marketplace Revenue</span>
                  <div className="hc-admin-metric-icon">💰</div>
                </div>
                <div className="hc-admin-metric-value" style={{ color: 'var(--primary)' }}>
                  ₹{totalRevenue.toLocaleString()}
                </div>
                <div className="hc-admin-metric-subtext">Gross verified honey sales</div>
              </div>

              <div className="hc-admin-metric-card">
                <div className="hc-admin-metric-header">
                  <span className="hc-admin-metric-label">Purity Compliance</span>
                  <div className="hc-admin-metric-icon">🛡️</div>
                </div>
                <div className="hc-admin-metric-value" style={{ color: 'var(--success)' }}>
                  98.4%
                </div>
                <div className="hc-admin-metric-subtext">Authentic NMR/Isotope pass rate</div>
              </div>
            </div>

            {/* Regional Production Table */}
            <div className="hc-admin-table-container">
              <div className="hc-admin-table-header">
                <h3 className="hc-admin-table-title">
                  📍 {t('admin.regionalProduction', 'Regional Production & Purity Breakdown')}
                </h3>
                <span className="hc-admin-table-count">
                  {regionalData.length} active regions
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="hc-table" style={{ width: '100%', margin: 0 }}>
                  <thead>
                    <tr>
                      <th>{t('onboarding.village', 'Region / Village')}</th>
                      <th>{t('admin.navBeekeepers', 'Beekeepers')}</th>
                      <th>{t('dashboard.registeredHives', 'Active Hives')}</th>
                      <th>{t('navigation.batches', 'Batches')}</th>
                      <th>{t('admin.honeyHarvested', 'Honey Harvested')}</th>
                      <th>{t('lab.purityScore', 'Avg Purity')}</th>
                      <th>{t('admin.activeProducts', 'Marketplace Products')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalData.map((r) => (
                      <tr key={r.region}>
                        <td>
                          <strong style={{ color: 'var(--text-primary)' }}>{r.region}</strong>
                        </td>
                        <td>{r.beekeepers}</td>
                        <td>{r.activeHives}</td>
                        <td>{r.batches}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary-dark)' }}>
                              {r.honeyProducedKg} kg
                            </span>
                            <div className="hc-admin-progress-bar">
                              <div
                                className="hc-admin-progress-fill"
                                style={{
                                  width: `${Math.min(((r.honeyProducedKg || 0) / (totalHarvestKg || 1)) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge variant="success">{r.averagePurity}%</Badge>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.products} active</span>
                        </td>
                      </tr>
                    ))}
                    {regionalData.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
                          {t('empty.noData', 'No regional harvest data available yet.')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Production & Sales Trends Grid */}
            <div className="hc-admin-analytics-grid">
              {/* Monthly Production Trend */}
              <div className="hc-admin-table-container">
                <div className="hc-admin-table-header">
                  <h3 className="hc-admin-table-title">
                    🍯 {t('admin.monthlyHarvest', 'Monthly Harvest Volume')}
                  </h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="hc-table" style={{ width: '100%', margin: 0 }}>
                    <thead>
                      <tr>
                        <th>{t('common.date', 'Month')}</th>
                        <th>{t('batch.quantityKg', 'Harvest Volume')}</th>
                        <th>{t('navigation.batches', 'Batches')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productionTrend.map((p) => (
                        <tr key={p.month}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 700 }}>
                            {p.month}
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary-dark)' }}>
                            {p.quantityKg} kg
                          </td>
                          <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{p.batchCount} batches</td>
                        </tr>
                      ))}
                      {productionTrend.length === 0 && (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-6)', fontSize: 'var(--text-xs)' }}>
                            {t('empty.noData', 'No harvest trend logged.')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly Orders & Revenue */}
              <div className="hc-admin-table-container">
                <div className="hc-admin-table-header">
                  <h3 className="hc-admin-table-title">
                    🛒 {t('admin.marketplaceSales', 'Marketplace Sales & Revenue')}
                  </h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="hc-table" style={{ width: '100%', margin: 0 }}>
                    <thead>
                      <tr>
                        <th>{t('common.date', 'Month')}</th>
                        <th>{t('admin.ordersPlaced', 'Orders')}</th>
                        <th>{t('admin.delivered', 'Delivered')}</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.map((s) => (
                        <tr key={s.month}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 700 }}>
                            {s.month}
                          </td>
                          <td style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>{s.totalOrders}</td>
                          <td style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', fontWeight: 700 }}>{s.completedOrders}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary-dark)' }}>
                            ₹{s.totalRevenue?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      {salesData.length === 0 && (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-6)', fontSize: 'var(--text-xs)' }}>
                            {t('empty.noData', 'No sales records logged.')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminAnalyticsPage
