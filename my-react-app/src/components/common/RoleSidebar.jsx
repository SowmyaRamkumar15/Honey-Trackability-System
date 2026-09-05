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
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar & Mobile Drawer Container */}
      <aside
        aria-label="Role Navigation Sidebar"
        className={`bg-white border-r border-slate-200/80 shrink-0 flex flex-col transition-all duration-200 ease-in-out z-40 ${
          // Desktop sizing
          collapsed ? 'md:w-20' : 'md:w-64'
        } ${
          // Mobile Drawer Sizing & Position
          mobileOpen
            ? 'fixed inset-y-0 left-0 w-72 shadow-2xl translate-x-0'
            : 'fixed inset-y-0 left-0 w-72 -translate-x-full md:relative md:translate-x-0 md:shadow-none'
        }`}
      >
        {/* Sidebar Header / Role Context */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2 min-h-16">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-100 to-amber-200 border border-amber-300 flex items-center justify-center text-amber-900 text-base font-bold shrink-0 shadow-2xs">
              🍯
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
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
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? '→' : '←'}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        {/* Navigation Section Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {roleNavGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {group.group}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActiveRoute(item.route)
                  return (
                    <Link
                      key={item.route}
                      to={item.route}
                      onClick={() => setMobileOpen && setMobileOpen(false)}
                      title={collapsed ? item.label : undefined}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center gap-3 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        collapsed ? 'justify-center px-0' : ''
                      } ${
                        active
                          ? 'bg-blue-600 text-white font-bold shadow-xs shadow-blue-500/30'
                          : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
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
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          {!collapsed && user && (
            <div className="px-3 py-2 mb-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-0.5">
              <div className="text-xs font-bold text-slate-900 truncate">
                {user.fullName || user.username || user.phoneNumber || 'Authenticated User'}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Role: <span className="font-bold text-blue-600">{roleLabel}</span>
              </div>
            </div>
          )}

          {collapsed && user && (
            <div
              className="flex justify-center mb-2"
              title={`${user.fullName || user.username || user.phoneNumber || 'User'} (${roleLabel})`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-600">
                {(user.fullName || user.username || role || 'U')[0].toUpperCase()}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors ${
              collapsed ? 'px-0' : ''
            }`}
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
