import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../common/Navbar'
import RoleSidebar from '../common/RoleSidebar'

export const AppShell = ({ children, stripLabel, stripVariant = 'default' }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth)
  const [mobileOpen, setMobileOpen] = useState(false)

  const showSidebar = isAuthenticated && role

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter']">
      {/* Top Navbar */}
      <Navbar onMobileToggle={() => setMobileOpen(!mobileOpen)} />

      {/* Optional Strip Header */}
      {stripLabel && (
        <div className={`layout__strip strip--${stripVariant}`}>
          <div className="layout__strip-inner max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
            <div className="layout__strip-bar w-1 h-5 rounded-full bg-primary" />
            <span className="layout__strip-label text-xs font-bold uppercase tracking-wider text-primary-dark">
              {stripLabel}
            </span>
          </div>
        </div>
      )}

      {/* Main Body Shell: Sidebar + Main Content */}
      <div className="flex-1 flex w-full max-w-[1440px] mx-auto">
        {showSidebar && (
          <RoleSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        )}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppShell
