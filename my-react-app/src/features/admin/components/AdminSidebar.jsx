import React from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../../i18n/LanguageContext'

export const AdminSidebar = () => {
  const { t } = useLanguage()

  const links = [
    { to: '/admin/dashboard', icon: '📊', label: t('admin.navOverview', 'Overview') },
    { to: '/admin/beekeepers', icon: '🧑‍🌾', label: t('admin.navBeekeepers', 'Beekeepers') },
    { to: '/admin/hives', icon: '🐝', label: t('admin.navHives', 'Hives & IoT') },
    { to: '/admin/batches', icon: '🍯', label: t('admin.navBatches', 'Batches') },
    { to: '/admin/orders', icon: '📦', label: t('admin.navOrders', 'Orders') },
    { to: '/admin/lab', icon: '🔬', label: t('admin.navLabTests', 'Lab Tests') },
    { to: '/admin/verification-risk', icon: '🛡️', label: t('admin.navVerificationRisk', 'Verification Risk') },
    { to: '/admin/analytics', icon: '📈', label: t('admin.navAnalytics', 'Analytics') },
    { to: '/admin/disputes', icon: '⚖️', label: t('admin.navDisputes', 'Disputes') },
  ]

  return (
    <aside className="admin-sidebar card mb-6">
      <div className="admin-sidebar__nav flex flex-wrap gap-2">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin/dashboard'}
            className={({ isActive }) =>
              `btn btn--sm ${isActive ? 'btn--primary' : 'btn--ghost'}`
            }
          >
            <span>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  )
}

export default AdminSidebar
