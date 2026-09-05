import React, { useState, useEffect } from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import AdminSidebar from '../components/AdminSidebar'
import LoadingSpinner from '../../../components/feedback/LoadingSpinner'
import Alert from '../../../components/feedback/Alert'
import adminApi from '../api/adminApi'
import { useLanguage } from '../../../i18n/LanguageContext'

export const AdminAnalyticsPage = () => {
  const { t } = useLanguage()
  const [regionalData, setRegionalData] = useState([])
  const [productionTrend, setProductionTrend] = useState([])
  const [salesData, setSalesData] = useState([])
  const [purityData, setPurityData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      adminApi.getRegionalAnalytics(),
      adminApi.getProductionTrend(),
      adminApi.getSalesAnalytics(),
      adminApi.getPurityAnalytics(),
    ])
      .then(([regRes, prodRes, salesRes, purityRes]) => {
        setRegionalData(regRes.data?.data || [])
        setProductionTrend(prodRes.data?.data || [])
        setSalesData(salesRes.data?.data || [])
        setPurityData(purityRes.data?.data)
      })
      .catch((err) => setError(err?.response?.data?.message || t('errors.generic', 'Failed to load analytics')))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout>
      <div className="container section">
        <div className="dashboard__header mb-6">
          <div>
            <h1 className="dashboard__title">📈 {t('navigation.analytics', 'Platform Analytics & Intelligence')}</h1>
            <p className="dashboard__subtitle">{t('admin.analyticsSub', 'Regional yield distribution, monthly honey harvests, sales trends, and certified purity metrics')}</p>
          </div>
        </div>

        <AdminSidebar />

        {error && <Alert type="danger" message={error} />}

        {loading ? (
          <div className="py-12 text-center">
            <LoadingSpinner text={t('loading.loading', 'Crunching platform analytics...')} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Regional Production Table */}
            <div className="card">
              <h3 className="card__title mb-4">📍 {t('admin.regionalProduction', 'Regional Production & Purity Breakdown')}</h3>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('onboarding.village', 'Region / Village')}</th>
                      <th>{t('admin.navBeekeepers', 'Beekeepers')}</th>
                      <th>{t('dashboard.registeredHives', 'Active Hives')}</th>
                      <th>{t('navigation.batches', 'Batches')}</th>
                      <th>{t('admin.honeyHarvested', 'Honey Produced (kg)')}</th>
                      <th>{t('lab.purityScore', 'Avg Purity')}</th>
                      <th>{t('admin.activeProducts', 'Marketplace Products')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalData.map((r) => (
                      <tr key={r.region}>
                        <td><strong>{r.region}</strong></td>
                        <td>{r.beekeepers}</td>
                        <td>{r.activeHives}</td>
                        <td>{r.batches}</td>
                        <td><strong className="text-gold">{r.honeyProducedKg} kg</strong></td>
                        <td>
                          <span className="badge badge--success">{r.averagePurity}%</span>
                        </td>
                        <td>{r.products}</td>
                      </tr>
                    ))}
                    {regionalData.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-secondary">
                          {t('empty.noData', 'No regional harvest data available yet.')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Production & Sales Trends Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Monthly Production Trend */}
              <div className="card">
                <h3 className="card__title mb-4">🍯 {t('admin.monthlyHarvest', 'Monthly Honey Harvest Volume')}</h3>
                <div className="overflow-x-auto">
                  <table className="data-table">
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
                          <td><code>{p.month}</code></td>
                          <td><strong className="text-gold">{p.quantityKg} kg</strong></td>
                          <td>{p.batchCount} batches</td>
                        </tr>
                      ))}
                      {productionTrend.length === 0 && (
                        <tr>
                          <td colSpan="3" className="text-center text-secondary py-4">
                            {t('empty.noData', 'No harvest trend logged.')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly Orders & Revenue */}
              <div className="card">
                <h3 className="card__title mb-4">🛒 {t('admin.marketplaceSales', 'Marketplace Sales & Volume')}</h3>
                <div className="overflow-x-auto">
                  <table className="data-table">
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
                          <td><code>{s.month}</code></td>
                          <td>{s.totalOrders}</td>
                          <td><span className="text-success">{s.completedOrders}</span></td>
                          <td><strong className="text-gold">₹{s.totalRevenue.toFixed(2)}</strong></td>
                        </tr>
                      ))}
                      {salesData.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center text-secondary py-4">
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
