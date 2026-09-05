import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { ROLE_NAVIGATION } from '../../config/roleNavigation'
import { ROLE_LABELS } from '../../constants/roles'
import { useLanguage } from '../../i18n/LanguageContext'

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
    if (route === '/beekeeper/dashboard' || route === '/customer/dashboard' || route === '/lab/dashboard' || route === '/admin/dashboard') {
      return location.pathname === route
    }
    return location.pathname.startsWith(route)
  }

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar & Mobile Drawer Container */}
      <aside
        className={`bg-white border-r border-slate-200 shrink-0 flex flex-col transition-all duration-200 ease-in-out z-40 ${
          // Desktop sizing
          collapsed ? 'md:w-16' : 'md:w-64'
        } ${
          // Mobile Drawer Sizing & Position
          mobileOpen
            ? 'fixed inset-y-0 left-0 w-72 shadow-2xl translate-x-0'
            : 'fixed inset-y-0 left-0 w-72 -translate-x-full md:relative md:translate-x-0 md:shadow-none'
        }`}
      >
        {/* Sidebar Header / Role Context */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2 min-h-[4rem]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary-soft border border-primary-light flex items-center justify-center text-primary text-base font-bold shrink-0">
              🍯
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                  Portal Menu
                </div>
                <div className="text-sm font-extrabold text-slate-900 font-['Outfit'] truncate">
                  {roleLabel}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? '→' : '←'}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Navigation Section Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {roleNavGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {group.group}
                </div>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActiveRoute(item.route)
                  return (
                    <Link
                      key={item.route}
                      to={item.route}
                      onClick={() => setMobileOpen && setMobileOpen(false)}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'bg-primary text-white font-semibold shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span className="text-base leading-none shrink-0">{item.icon}</span>
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer / User Profile & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          {!collapsed && user && (
            <div className="px-3 py-2 mb-2 rounded-lg bg-white border border-slate-200/80 space-y-0.5">
              <div className="text-xs font-bold text-slate-900 truncate">
                {user.fullName || user.username || user.phoneNumber || 'Authenticated User'}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Role: <span className="font-semibold text-primary">{roleLabel}</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors ${
              collapsed ? 'px-0' : ''
            }`}
            title="Log out"
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
