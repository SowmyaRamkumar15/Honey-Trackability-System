import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { ROLE_NAVIGATION } from '../../config/roleNavigation'
import { ROLE_LABELS } from '../../constants/roles'
import { useLanguage } from '../../i18n/LanguageContext'
import './RoleSidebar.css'

export const RoleSidebar = ({ mobileOpen, setMobileOpen }) => {
  const { role, user } = useSelector((state) => state.auth)
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useLanguage()

  const handleLogout = () => {
    dispatch(logout())
    if (setMobileOpen) setMobileOpen(false)
    navigate('/login')
  }

  const roleNavGroups = ROLE_NAVIGATION[role] || []
  const roleLabel = ROLE_LABELS[role] || role || 'Guest'

  const isActiveRoute = (route) => {
    if (!route) return false
    if (location.pathname === route) return true
    const hasMoreSpecificRoute = roleNavGroups.some((grp) =>
      grp.items.some((it) => it.route === location.pathname)
    )
    if (hasMoreSpecificRoute) return false
    return location.pathname.startsWith(`${route}/`)
  }

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          className="hc-sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar & Mobile Drawer Container */}
      <aside
        aria-label="Role Navigation Sidebar"
        className={`hc-sidebar ${collapsed ? 'hc-sidebar--collapsed' : ''} ${
          mobileOpen ? 'hc-sidebar--open' : ''
        }`.trim()}
      >
        {/* Sidebar Header / Role Context */}
        <div className="hc-sidebar__header">
          <div className="hc-sidebar__brand-box">
            <div className="hc-sidebar__brand-icon">
              🍯
            </div>
            {!collapsed && (
              <div className="hc-sidebar__brand-meta">
                <div className="hc-sidebar__brand-sub">
                  Portal Menu
                </div>
                <div className="hc-sidebar__brand-title">
                  {roleLabel}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hc-sidebar__btn-icon hc-sidebar__toggle-desktop"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? '→' : '←'}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="hc-sidebar__btn-icon hc-sidebar__toggle-mobile"
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        {/* Navigation Section Items */}
        <div className="hc-sidebar__body">
          {roleNavGroups.map((group, idx) => (
            <div key={idx} className="hc-sidebar__group">
              {!collapsed && (
                <div className="hc-sidebar__group-title">
                  {group.group}
                </div>
              )}
              {group.items.map((item) => {
                const active = isActiveRoute(item.route)
                return (
                  <Link
                    key={item.route}
                    to={item.route}
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    aria-current={active ? 'page' : undefined}
                    className={`hc-sidebar__item ${
                      active ? 'hc-sidebar__item--active' : ''
                    } ${collapsed ? 'hc-sidebar__item--collapsed' : ''}`.trim()}
                  >
                    <span className="hc-sidebar__item-icon">{item.icon}</span>
                    {!collapsed && <span className="hc-sidebar__item-label">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer / User Profile & Logout */}
        <div className="hc-sidebar__footer">
          {!collapsed && user && (
            <div className="hc-sidebar__user-box">
              <div className="hc-sidebar__user-name">
                {user.fullName || user.username || user.phoneNumber || 'Authenticated User'}
              </div>
              <div className="hc-sidebar__user-role">
                Role: <strong>{roleLabel}</strong>
              </div>
            </div>
          )}

          {collapsed && user && (
            <div
              className="hc-sidebar__user-avatar"
              title={`${user.fullName || user.username || user.phoneNumber || 'User'} (${roleLabel})`}
            >
              <div className="hc-sidebar__avatar-circle">
                {(user.fullName || user.username || role || 'U')[0].toUpperCase()}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="hc-sidebar__logout-btn"
            title="Log out"
            aria-label="Log out"
          >
            <span>🚪</span>
            {!collapsed && <span>{t('navigation.logout', 'Logout')}</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

export default RoleSidebar
